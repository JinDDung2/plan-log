import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";

describe("auth routes", () => {
  it("POST /auth/refresh without refresh_token cookie returns 401", async () => {
    const app = await buildApp();
    const res = await app.inject({ method: "POST", url: "/auth/refresh" });

    expect(res.statusCode).toBe(401);
    expect(res.headers["content-type"]).toContain("application/problem+json");
  });

  it("GET /me without access_token cookie returns 401", async () => {
    const app = await buildApp();
    const res = await app.inject({ method: "GET", url: "/me" });

    expect(res.statusCode).toBe(401);
  });

  it("POST /auth/logout without refresh_token cookie still succeeds (idempotent)", async () => {
    const app = await buildApp();
    const res = await app.inject({ method: "POST", url: "/auth/logout" });

    expect(res.statusCode).toBe(200);
  });
});
