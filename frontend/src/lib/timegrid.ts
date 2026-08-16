import type { TimeBlock } from "@/types";

export interface Slot {
  hour: number;
  half: 0 | 30;
}

// Builds the list of hours (in order, possibly wrapping past midnight)
// between startHour (inclusive) and endHour (inclusive).
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

// Flattens the hour range into ordered 30-minute slots, one row per slot.
export function buildSlots(startHour: number, endHour: number): Slot[] {
  const slots: Slot[] = [];
  for (const hour of buildHours(startHour, endHour)) {
    slots.push({ hour, half: 0 });
    slots.push({ hour, half: 30 });
  }
  return slots;
}

export function slotIndex(slots: Slot[], hour: number, half: 0 | 30): number {
  return slots.findIndex((s) => s.hour === hour && s.half === half);
}

export function hourLabel(hour: number): string {
  return String(hour).padStart(2, "0");
}

export function isSlotOccupied(
  blocks: TimeBlock[],
  slots: Slot[],
  hour: number,
  half: 0 | 30
): boolean {
  const idx = slotIndex(slots, hour, half);
  if (idx === -1) return false;
  return blocks.some((b) => {
    const startIdx = slotIndex(slots, b.hour, b.half);
    if (startIdx === -1) return false;
    return idx >= startIdx && idx < startIdx + b.span;
  });
}
