import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";

describe("plans routes", () => {
  it("GET /plans/:date without access_token cookie returns 401", async () => {
    const app = await buildApp();
    const res = await app.inject({ method: "GET", url: "/plans/2026-08-16" });

    expect(res.statusCode).toBe(401);
  });

  it("PUT /plans/:date without access_token cookie returns 401", async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: "PUT",
      url: "/plans/2026-08-16",
      payload: { bigThree: ["", "", ""], brainDumpItems: [], blocks: [], gratitude: "" },
    });

    expect(res.statusCode).toBe(401);
  });

  it("GET /plans/:date with a malformed date returns 400 problem+json", async () => {
    const app = await buildApp();
    const token = app.jwt.sign({ sub: 1 });
    const res = await app.inject({
      method: "GET",
      url: "/plans/not-a-date",
      cookies: { access_token: token },
    });

    expect(res.statusCode).toBe(400);
    expect(res.headers["content-type"]).toContain("application/problem+json");
  });
});
