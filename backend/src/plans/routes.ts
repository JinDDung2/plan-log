import type { FastifyInstance } from "fastify";
import { emptyPlan, getPlan, upsertPlan, type PlanInput } from "./repository.js";

const paramsSchema = {
  type: "object",
  required: ["date"],
  properties: {
    date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
  },
} as const;

const planBodySchema = {
  type: "object",
  required: ["bigThree", "brainDumpItems", "blocks", "gratitude"],
  additionalProperties: false,
  properties: {
    bigThree: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 3,
    },
    brainDumpItems: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "text"],
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          text: { type: "string" },
        },
      },
    },
    blocks: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "hour", "half", "span", "content"],
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          hour: { type: "integer", minimum: 0, maximum: 23 },
          half: { type: "integer", enum: [0, 30] },
          span: { type: "integer", minimum: 1 },
          content: { type: "string" },
        },
      },
    },
    gratitude: { type: "string" },
  },
} as const;

export async function registerPlanRoutes(app: FastifyInstance) {
  app.get<{ Params: { date: string } }>(
    "/plans/:date",
    { preHandler: app.authenticate, schema: { params: paramsSchema } },
    async (req, reply) => {
      const plan = await getPlan(req.user.sub, req.params.date);
      return reply.send(plan ?? emptyPlan(req.params.date));
    }
  );

  app.put<{ Params: { date: string }; Body: PlanInput }>(
    "/plans/:date",
    {
      preHandler: app.authenticate,
      schema: { params: paramsSchema, body: planBodySchema },
    },
    async (req, reply) => {
      await upsertPlan(req.user.sub, req.params.date, req.body);
      return reply.send({ ok: true });
    }
  );
}
