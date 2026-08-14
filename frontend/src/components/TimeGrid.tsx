"use client";

import { buildHours, hourLabel, slotKey } from "@/lib/timegrid";

interface Props {
  startHour: number;
  endHour: number;
  timeSlots: Record<string, string>;
  onSlotChange: (key: string, value: string) => void;
}

export default function TimeGrid({
  startHour,
  endHour,
  timeSlots,
  onSlotChange,
}: Props) {
  const hours = buildHours(startHour, endHour);

  return (
    <div className="border-2 border-gray-800 rounded overflow-hidden">
      <div className="grid grid-cols-[3rem_1fr_1fr] bg-gray-800 text-white text-sm font-semibold">
        <div className="px-2 py-1">시</div>
        <div className="px-2 py-1 text-center">:00</div>
        <div className="px-2 py-1 text-center">:30</div>
      </div>
      <div>
        {hours.map((h) => {
          const key00 = slotKey(h, 0);
          const key30 = slotKey(h, 30);
          return (
            <div
              key={h}
              className="grid grid-cols-[3rem_1fr_1fr] border-t border-gray-800"
            >
              <div className="flex items-center justify-center text-sm font-semibold bg-white/40 border-r border-gray-800">
                {hourLabel(h)}
              </div>
              <input
                value={timeSlots[key00] ?? ""}
                onChange={(e) => onSlotChange(key00, e.target.value)}
                className="px-2 py-1 bg-white/70 focus:bg-white outline-none border-r border-gray-800 text-sm"
              />
              <input
                value={timeSlots[key30] ?? ""}
                onChange={(e) => onSlotChange(key30, e.target.value)}
                className="px-2 py-1 bg-white/70 focus:bg-white outline-none text-sm"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
