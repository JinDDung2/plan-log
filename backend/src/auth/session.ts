import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import type { FastifyInstance, FastifyReply } from "fastify";
import { db } from "../db/client.js";
import { refreshTokens } from "../db/schema.js";
import { env } from "../env.js";

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60; // 1시간
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7일

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function setSessionCookies(
  reply: FastifyReply,
  accessToken: string,
  refreshToken: string
) {
  const secure = env.nodeEnv === "production";

  reply
    .setCookie("access_token", accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_TOKEN_TTL_SECONDS,
    })
    .setCookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/auth",
      maxAge: REFRESH_TOKEN_TTL_MS / 1000,
    });
}

// 로그인 성공 시 access token(JWT)과 refresh token(DB 저장, 해시만)을 발급하고
// 둘 다 httpOnly 쿠키로 심는다.
export async function issueSession(
  app: FastifyInstance,
  reply: FastifyReply,
  userId: number
): Promise<void> {
  const accessToken = app.jwt.sign(
    { sub: userId },
    { expiresIn: `${ACCESS_TOKEN_TTL_SECONDS}s` }
  );

  const refreshToken = randomBytes(32).toString("hex");
  await db.insert(refreshTokens).values({
    userId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });

  setSessionCookies(reply, accessToken, refreshToken);
}

// refresh token을 검증하고, 유효하면 기존 토큰은 폐기(rotate)한 뒤 새 세션을 발급한다.
// 실패 시 null을 반환한다 (프론트는 재로그인을 유도해야 함).
export async function rotateSession(
  app: FastifyInstance,
  reply: FastifyReply,
  oldRefreshToken: string
): Promise<number | null> {
  const now = new Date();
  const [row] = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.tokenHash, hashToken(oldRefreshToken)),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, now)
      )
    )
    .limit(1);

  if (!row) return null;

  await db
    .update(refreshTokens)
    .set({ revokedAt: now })
    .where(eq(refreshTokens.id, row.id));

  await issueSession(app, reply, row.userId);
  return row.userId;
}

// 로그아웃: 해당 refresh token을 즉시 무효화한다.
export async function revokeSession(refreshToken: string): Promise<void> {
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(refreshTokens.tokenHash, hashToken(refreshToken)),
        isNull(refreshTokens.revokedAt)
      )
    );
}

export function clearSessionCookies(reply: FastifyReply): void {
  reply.clearCookie("access_token", { path: "/" });
  reply.clearCookie("refresh_token", { path: "/auth" });
}
