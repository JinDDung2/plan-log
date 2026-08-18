import type { FastifyReply } from "fastify";

// RFC 9457 Problem Details 형식의 에러 응답.
export function sendProblem(
  reply: FastifyReply,
  status: number,
  title: string,
  detail: string
) {
  return reply
    .code(status)
    .type("application/problem+json")
    .send({ type: "about:blank", title, status, detail });
}
