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

  it("PUT /me/settings without access_token cookie returns 401", async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: "PUT",
      url: "/me/settings",
      payload: { startHour: 6, endHour: 22 },
    });

    expect(res.statusCode).toBe(401);
  });

  it("PUT /me/settings with an out-of-range hour returns 400 problem+json", async () => {
    const app = await buildApp();
    const token = app.jwt.sign({ sub: 1 });
    const res = await app.inject({
      method: "PUT",
      url: "/me/settings",
      cookies: { access_token: token },
      payload: { startHour: 24, endHour: 22 },
    });

    expect(res.statusCode).toBe(400);
    expect(res.headers["content-type"]).toContain("application/problem+json");
  });
});
