export interface BrainDumpItem {
  id: string;
  text: string;
}

export interface TimeBlock {
  id: string;
  hour: number; // 0-23, start hour
  half: 0 | 30; // which half-hour slot it starts in
  span: number; // length in 30-minute units (1 = 30min, 2 = 1hr, 3 = 1hr30min, ...)
  content: string;
}

export interface DailyPlan {
  date: string; // YYYY-MM-DD
  bigThree: [string, string, string];
  brainDumpItems: BrainDumpItem[];
  blocks: TimeBlock[];
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
    brainDumpItems: [],
    blocks: [],
  };
}
