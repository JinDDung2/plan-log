import "@fastify/jwt";
import type { OAuth2Namespace } from "@fastify/oauth2";
import type { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    googleOAuth2: OAuth2Namespace;
    kakaoOAuth2: OAuth2Namespace;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: number };
    user: { sub: number };
  }
}
