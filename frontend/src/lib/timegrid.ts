import type { TimeBlock } from "@/types";

// Builds the list of hours (in order, possibly wrapping past midnight)
// between startHour (inclusive) and endHour (inclusive) using 30-min steps.
export function buildHours(startHour: number, endHour: number): number[] {
  const hours: number[] = [];
  let h = startHour;
  const maxSteps = 24;
  let steps = 0;
  hours.push(h);
  while (h !== endHour && steps < maxSteps) {
    h = (h + 1) % 24;
    hours.push(h);
    steps++;
  }
  return hours;
}

export function hourLabel(hour: number): string {
  return String(hour).padStart(2, "0");
}

/** Hours covered by full-hour blocks (as hour-of-day values). */
export function fullHourOccupancy(blocks: TimeBlock[], hours: number[]): Set<number> {
  const occupied = new Set<number>();
  for (const block of blocks) {
    if (!block.isFullHour) continue;
    const startIdx = hours.indexOf(block.hour);
    if (startIdx === -1) continue;
    for (let i = 0; i < block.hourSpan; i++) {
      const idx = startIdx + i;
      if (idx < hours.length) occupied.add(hours[idx]);
    }
  }
  return occupied;
}

export function isHalfSlotOccupied(
  blocks: TimeBlock[],
  fullOccupied: Set<number>,
  hour: number,
  half: 0 | 30
): boolean {
  if (fullOccupied.has(hour)) return true;
  return blocks.some((b) => !b.isFullHour && b.hour === hour && b.half === half);
}
