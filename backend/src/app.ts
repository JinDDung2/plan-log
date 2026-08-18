import Fastify from "fastify";
import { registerAuthPlugins } from "./auth/plugin.js";
import { registerAuthRoutes } from "./auth/routes.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  app.get("/health", async () => ({ status: "ok" }));

  await registerAuthPlugins(app);
  await registerAuthRoutes(app);

  return app;
}
