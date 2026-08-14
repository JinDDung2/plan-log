"use client";

import { useEffect, useState } from "react";
import type { DailyPlan, PlannerSettings } from "@/types";
import { addDays, todayKey } from "@/lib/date";
import { loadPlan, savePlan, loadSettings, saveSettings } from "@/lib/storage";
import DateNav from "@/components/DateNav";
import BigThree from "@/components/BigThree";
import BrainDump from "@/components/BrainDump";
import TimeGrid from "@/components/TimeGrid";
import SettingsPanel from "@/components/SettingsPanel";
import { Button } from "@/components/ui/button";

export default function PlannerApp() {
  const [date, setDate] = useState<string>(todayKey());
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [settings, setSettings] = useState<PlannerSettings | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // localStorage isn't available during SSR, so state starts empty and is
  // hydrated client-side after mount. This is an intentional exception to
  // react-hooks/set-state-in-effect: there is no way to read browser storage
  // before the client render.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(loadSettings());
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlan(loadPlan(date));
  }, [date]);

  useEffect(() => {
    if (plan) savePlan(plan);
  }, [plan]);

  useEffect(() => {
    if (settings) saveSettings(settings);
  }, [settings]);

  if (!plan || !settings) return null;

  const updateBigThree = (index: number, value: string) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const next = [...prev.bigThree] as [string, string, string];
      next[index] = value;
      return { ...prev, bigThree: next };
    });
  };

  const updateBrainDump = (value: string) => {
    setPlan((prev) => (prev ? { ...prev, brainDump: value } : prev));
  };

  const updateSlot = (key: string, value: string) => {
    setPlan((prev) =>
      prev ? { ...prev, timeSlots: { ...prev.timeSlots, [key]: value } } : prev
    );
  };

  return (
    <div className="min-h-screen bg-[#a9d0c5] text-gray-900 py-6 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Daily Timeboxing Planner
          </h1>
          <div className="flex items-center gap-3">
            <DateNav
              date={date}
              onPrev={() => setDate((d) => addDays(d, -1))}
              onNext={() => setDate((d) => addDays(d, 1))}
              onToday={() => setDate(todayKey())}
            />
            <Button variant="ghost" onClick={() => setShowSettings((s) => !s)}>
              시간 설정
            </Button>
          </div>
        </header>

        {showSettings && (
          <SettingsPanel
            settings={settings}
            onChange={setSettings}
            onClose={() => setShowSettings(false)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <BigThree values={plan.bigThree} onChange={updateBigThree} />
            <BrainDump value={plan.brainDump} onChange={updateBrainDump} />
          </div>
          <TimeGrid
            startHour={settings.startHour}
            endHour={settings.endHour}
            timeSlots={plan.timeSlots}
            onSlotChange={updateSlot}
          />
        </div>
      </div>
    </div>
  );
}
