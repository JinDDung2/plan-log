import type { DailyPlan, PlannerSettings } from "@/types";
import { DEFAULT_SETTINGS, emptyPlan } from "@/types";

const PLAN_PREFIX = "timebox-plan:";
const SETTINGS_KEY = "timebox-settings";

export function loadPlan(date: string): DailyPlan {
  try {
    const raw = localStorage.getItem(PLAN_PREFIX + date);
    if (!raw) return emptyPlan(date);
    const parsed = JSON.parse(raw) as Partial<DailyPlan>;
    return {
      date,
      bigThree: parsed.bigThree ?? ["", "", ""],
      brainDumpItems: parsed.brainDumpItems ?? [],
      blocks: parsed.blocks ?? [],
    };
  } catch {
    return emptyPlan(date);
  }
}

export function savePlan(plan: DailyPlan): void {
  localStorage.setItem(PLAN_PREFIX + plan.date, JSON.stringify(plan));
}

export function loadSettings(): PlannerSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as PlannerSettings;
    return {
      startHour: parsed.startHour ?? DEFAULT_SETTINGS.startHour,
      endHour: parsed.endHour ?? DEFAULT_SETTINGS.endHour,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: PlannerSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
