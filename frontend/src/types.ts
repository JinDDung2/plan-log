export interface DailyPlan {
  date: string; // YYYY-MM-DD
  bigThree: [string, string, string];
  brainDump: string;
  timeSlots: Record<string, string>; // key: "HH:MM" -> content
}

export interface PlannerSettings {
  startHour: number; // 0-23
  endHour: number; // 0-23, exclusive-ish; if <= startHour, grid wraps past midnight
}

export const DEFAULT_SETTINGS: PlannerSettings = {
  startHour: 5,
  endHour: 23,
};

export function emptyPlan(date: string): DailyPlan {
  return {
    date,
    bigThree: ["", "", ""],
    brainDump: "",
    timeSlots: {},
  };
}
