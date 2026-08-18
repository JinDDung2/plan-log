import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifyOauth2 from "@fastify/oauth2";
import type { FastifyInstance } from "fastify";
import { env } from "../env.js";
import { sendProblem } from "../lib/problem.js";

// CORS + 쿠키 + JWT + Google/Kakao OAuth2 플러그인을 등록하고,
// 보호된 라우트에서 쓸 `app.authenticate` preHandler를 만든다.
export async function registerAuthPlugins(app: FastifyInstance) {
  await app.register(fastifyCors, {
    origin: env.frontendOrigin,
    credentials: true,
  });

  await app.register(fastifyCookie);

  await app.register(fastifyJwt, {
    secret: env.jwtSecret,
    cookie: { cookieName: "access_token", signed: false },
  });

  await app.register(fastifyOauth2, {
    name: "googleOAuth2",
    scope: ["email", "profile"],
    credentials: {
      client: { id: env.google.clientId, secret: env.google.clientSecret },
      // @fastify/oauth2의 GOOGLE_CONFIGURATION 상수는 런타임엔 존재하지만
      // 현재 버전 타입 선언에 누락되어 있어 직접 명시한다 (카카오와 동일 패턴).
      auth: {
        authorizeHost: "https://accounts.google.com",
        authorizePath: "/o/oauth2/v2/auth",
        tokenHost: "https://www.googleapis.com",
        tokenPath: "/oauth2/v4/token",
      },
    },
    startRedirectPath: "/auth/google",
    callbackUri: env.google.redirectUri,
  });

  await app.register(fastifyOauth2, {
    name: "kakaoOAuth2",
    scope: [],
    credentials: {
      client: { id: env.kakao.clientId, secret: env.kakao.clientSecret },
      auth: {
        authorizeHost: "https://kauth.kakao.com",
        authorizePath: "/oauth/authorize",
        tokenHost: "https://kauth.kakao.com",
        tokenPath: "/oauth/token",
      },
    },
    startRedirectPath: "/auth/kakao",
    callbackUri: env.kakao.redirectUri,
  });

  app.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      sendProblem(reply, 401, "Unauthorized", "access token이 없거나 만료되었습니다.");
    }
  });
}
