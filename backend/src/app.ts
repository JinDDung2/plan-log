import Fastify, { type FastifyError } from "fastify";
import { registerAuthPlugins } from "./auth/plugin.js";
import { registerAuthRoutes } from "./auth/routes.js";
import { registerPlanRoutes } from "./plans/routes.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  // 스키마 검증 실패를 포함한 모든 에러를 RFC 9457 Problem Details 형식으로 통일한다.
  app.setErrorHandler((err: FastifyError, _req, reply) => {
    const status = err.statusCode ?? 500;
    reply.code(status).type("application/problem+json").send({
      type: "about:blank",
      title: status >= 500 ? "Internal Server Error" : "Bad Request",
      status,
      detail: err.message,
    });
  });

  app.get("/health", async () => ({ status: "ok" }));

  await registerAuthPlugins(app);
  await registerAuthRoutes(app);
  await registerPlanRoutes(app);

  return app;
}
