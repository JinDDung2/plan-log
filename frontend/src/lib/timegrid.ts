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

export function slotKey(hour: number, half: 0 | 30): string {
  return `${String(hour).padStart(2, "0")}:${String(half).padStart(2, "0")}`;
}

export function hourLabel(hour: number): string {
  return String(hour).padStart(2, "0");
}
