import { and, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { dailyPlans } from "../db/schema.js";

export interface PlanBlock {
  id: string;
  hour: number;
  half: 0 | 30;
  span: number;
  content: string;
}

export interface PlanInput {
  bigThree: [string, string, string];
  brainDumpItems: { id: string; text: string }[];
  blocks: PlanBlock[];
  gratitude: string;
}

export interface PlanOutput extends PlanInput {
  date: string;
}

export function emptyPlan(date: string): PlanOutput {
  return { date, bigThree: ["", "", ""], brainDumpItems: [], blocks: [], gratitude: "" };
}

export async function getPlan(userId: number, date: string): Promise<PlanOutput> {
  const [row] = await db
    .select()
    .from(dailyPlans)
    .where(and(eq(dailyPlans.userId, userId), eq(dailyPlans.date, date)))
    .limit(1);

  if (!row) return emptyPlan(date);

  return {
    date: row.date,
    bigThree: row.bigThree,
    brainDumpItems: row.brainDumpItems,
    blocks: row.blocks as PlanBlock[],
    gratitude: row.gratitude ?? "",
  };
}

// 날짜당 하나만 존재하도록 (user_id, date) 유니크 제약을 이용한 upsert.
export async function upsertPlan(
  userId: number,
  date: string,
  plan: PlanInput
): Promise<void> {
  await db
    .insert(dailyPlans)
    .values({ userId, date, ...plan })
    .onDuplicateKeyUpdate({ set: plan });
}
