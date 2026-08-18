import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { env } from "../env.js";
import { sendProblem } from "../lib/problem.js";
import { findOrCreateUser } from "../users/repository.js";
import { clearSessionCookies, issueSession, revokeSession, rotateSession } from "./session.js";

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

interface KakaoUserInfo {
  id: number;
  kakao_account?: {
    email?: string;
    profile?: { nickname?: string; profile_image_url?: string };
  };
}

export async function registerAuthRoutes(app: FastifyInstance) {
  // /auth/google, /auth/kakao (인가 요청 시작)는 @fastify/oauth2가 자동 등록한다.

  app.get("/auth/google/callback", async (req, reply) => {
    try {
      const { token } = await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });
      if (!res.ok) throw new Error(`Google userinfo failed: ${res.status}`);
      const profile = (await res.json()) as GoogleUserInfo;

      const user = await findOrCreateUser({
        provider: "google",
        providerId: profile.sub,
        email: profile.email,
        name: profile.name,
        picture: profile.picture ?? null,
      });

      await issueSession(app, reply, user.id);
      return reply.redirect(env.frontendOrigin);
    } catch (err) {
      app.log.error(err, "google oauth callback failed");
      return reply.redirect(`${env.frontendOrigin}/?login_error=google`);
    }
  });

  app.get("/auth/kakao/callback", async (req, reply) => {
    try {
      const { token } = await app.kakaoOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
      const res = await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });
      if (!res.ok) throw new Error(`Kakao userinfo failed: ${res.status}`);
      const profile = (await res.json()) as KakaoUserInfo;

      const email = profile.kakao_account?.email;
      if (!email) throw new Error("Kakao account has no email scope");

      const user = await findOrCreateUser({
        provider: "kakao",
        providerId: String(profile.id),
        email,
        name: profile.kakao_account?.profile?.nickname ?? "카카오 사용자",
        picture: profile.kakao_account?.profile?.profile_image_url ?? null,
      });

      await issueSession(app, reply, user.id);
      return reply.redirect(env.frontendOrigin);
    } catch (err) {
      app.log.error(err, "kakao oauth callback failed");
      return reply.redirect(`${env.frontendOrigin}/?login_error=kakao`);
    }
  });

  app.post("/auth/refresh", async (req, reply) => {
    const token = req.cookies.refresh_token;
    if (!token) {
      return sendProblem(reply, 401, "Unauthorized", "refresh_token 쿠키가 없습니다.");
    }

    const userId = await rotateSession(app, reply, token);
    if (!userId) {
      return sendProblem(
        reply,
        401,
        "Unauthorized",
        "refresh_token이 유효하지 않습니다. 다시 로그인해주세요."
      );
    }

    return reply.send({ ok: true });
  });

  app.post("/auth/logout", async (req, reply) => {
    const token = req.cookies.refresh_token;
    if (token) await revokeSession(token);
    clearSessionCookies(reply);
    return reply.send({ ok: true });
  });

  app.get("/me", { preHandler: app.authenticate }, async (req, reply) => {
    const [user] = await db.select().from(users).where(eq(users.id, req.user.sub)).limit(1);
    if (!user) {
      return sendProblem(reply, 401, "Unauthorized", "사용자를 찾을 수 없습니다.");
    }
    return reply.send({
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      startHour: user.startHour,
      endHour: user.endHour,
    });
  });

  app.put<{ Body: { startHour: number; endHour: number } }>(
    "/me/settings",
    {
      preHandler: app.authenticate,
      schema: {
        body: {
          type: "object",
          required: ["startHour", "endHour"],
          additionalProperties: false,
          properties: {
            startHour: { type: "integer", minimum: 0, maximum: 23 },
            endHour: { type: "integer", minimum: 0, maximum: 23 },
          },
        },
      },
    },
    async (req, reply) => {
      const { startHour, endHour } = req.body;
      await db
        .update(users)
        .set({ startHour, endHour })
        .where(eq(users.id, req.user.sub));

      return reply.send({ startHour, endHour });
    }
  );
}
