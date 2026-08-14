"use client";

import type { PlannerSettings } from "@/types";
import { Button } from "@/components/ui/button";

interface Props {
  settings: PlannerSettings;
  onChange: (settings: PlannerSettings) => void;
  onClose: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function SettingsPanel({ settings, onChange, onClose }: Props) {
  return (
    <div className="border-2 border-gray-800 rounded bg-white/90 p-4 flex flex-wrap items-end gap-4">
      <div>
        <label className="block text-sm font-semibold mb-1">시작 시간</label>
        <select
          value={settings.startHour}
          onChange={(e) =>
            onChange({ ...settings, startHour: Number(e.target.value) })
          }
          className="border-2 border-gray-800 rounded px-2 py-1 bg-white"
        >
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {String(h).padStart(2, "0")}:00
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">종료 시간</label>
        <select
          value={settings.endHour}
          onChange={(e) =>
            onChange({ ...settings, endHour: Number(e.target.value) })
          }
          className="border-2 border-gray-800 rounded px-2 py-1 bg-white"
        >
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {String(h).padStart(2, "0")}:00
            </option>
          ))}
        </select>
      </div>
      <p className="text-xs text-gray-600 max-w-xs">
        종료 시간이 시작 시간보다 빠르면 다음날 새벽까지 표시됩니다.
      </p>
      <Button onClick={onClose} variant="ghost" className="ml-auto">
        닫기
      </Button>
    </div>
  );
}
