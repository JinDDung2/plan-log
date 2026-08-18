import type { DailyPlan } from "@/types";
import { apiFetch } from "./api";

export async function fetchPlan(date: string): Promise<DailyPlan> {
  return apiFetch<DailyPlan>(`/plans/${date}`);
}

export async function savePlanRemote(date: string, plan: Omit<DailyPlan, "date">): Promise<void> {
  await apiFetch(`/plans/${date}`, {
    method: "PUT",
    body: JSON.stringify(plan),
  });
}
