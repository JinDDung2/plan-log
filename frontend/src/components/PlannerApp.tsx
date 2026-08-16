"use client";

import { useEffect, useState } from "react";
import type { DailyPlan, PlannerSettings } from "@/types";
import { addDays, todayKey } from "@/lib/date";
import { loadPlan, savePlan, loadSettings, saveSettings } from "@/lib/storage";
import { buildHours } from "@/lib/timegrid";
import { newId } from "@/lib/id";
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

  const hours = buildHours(settings.startHour, settings.endHour);

  const updateBigThree = (index: number, value: string) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const next = [...prev.bigThree] as [string, string, string];
      next[index] = value;
      return { ...prev, bigThree: next };
    });
  };

  const addBrainDumpItem = (text: string) => {
    setPlan((prev) =>
      prev
        ? {
            ...prev,
            brainDumpItems: [...prev.brainDumpItems, { id: newId(), text }],
          }
        : prev
    );
  };

  const removeBrainDumpItem = (id: string) => {
    setPlan((prev) =>
      prev
        ? {
            ...prev,
            brainDumpItems: prev.brainDumpItems.filter((i) => i.id !== id),
          }
        : prev
    );
  };

  // Dropping a Brain Dump card onto the grid copies its text into a new
  // block; the original card stays in Brain Dump (see BigThree drop below).
  const handleDropItem = (hour: number, half: 0 | 30, itemId: string) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const item = prev.brainDumpItems.find((i) => i.id === itemId);
      if (!item) return prev;
      return {
        ...prev,
        blocks: [
          ...prev.blocks,
          {
            id: newId(),
            hour,
            half,
            isFullHour: false,
            hourSpan: 1,
            content: item.text,
          },
        ],
      };
    });
  };

  // Dropping a Brain Dump card onto a Big3 slot copies its text there too;
  // the card stays in Brain Dump and the slot becomes an independent,
  // freely-editable copy (not a live-synced reference).
  const handleDropToBigThree = (index: number, itemId: string) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const item = prev.brainDumpItems.find((i) => i.id === itemId);
      if (!item) return prev;
      const next = [...prev.bigThree] as [string, string, string];
      next[index] = item.text;
      return { ...prev, bigThree: next };
    });
  };

  const updateBlockContent = (id: string, content: string) => {
    setPlan((prev) =>
      prev
        ? {
            ...prev,
            blocks: prev.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
          }
        : prev
    );
  };

  const deleteBlock = (id: string) => {
    setPlan((prev) =>
      prev ? { ...prev, blocks: prev.blocks.filter((b) => b.id !== id) } : prev
    );
  };

  const expandToFullHour = (id: string) => {
    setPlan((prev) =>
      prev
        ? {
            ...prev,
            blocks: prev.blocks.map((b) =>
              b.id === id ? { ...b, isFullHour: true, hourSpan: 1 } : b
            ),
          }
        : prev
    );
  };

  // Grow/shrink the block's end (bottom edge): moves through `hours` in
  // display order so wrap-around past midnight stays correct.
  const growEnd = (id: string) => {
    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        blocks: prev.blocks.map((b) => {
          if (b.id !== id) return b;
          const startIdx = hours.indexOf(b.hour);
          const maxSpan = hours.length - startIdx;
          return { ...b, hourSpan: Math.min(b.hourSpan + 1, maxSpan) };
        }),
      };
    });
  };

  const shrinkEnd = (id: string) => {
    setPlan((prev) =>
      prev
        ? {
            ...prev,
            blocks: prev.blocks.map((b) =>
              b.id === id ? { ...b, hourSpan: Math.max(1, b.hourSpan - 1) } : b
            ),
          }
        : prev
    );
  };

  // Grow/shrink the block's start (top edge): shifts the start hour earlier
  // or later along `hours`, and adjusts hourSpan to keep the end fixed.
  const growStart = (id: string) => {
    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        blocks: prev.blocks.map((b) => {
          if (b.id !== id) return b;
          const startIdx = hours.indexOf(b.hour);
          if (startIdx <= 0) return b;
          return { ...b, hour: hours[startIdx - 1], hourSpan: b.hourSpan + 1 };
        }),
      };
    });
  };

  const shrinkStart = (id: string) => {
    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        blocks: prev.blocks.map((b) => {
          if (b.id !== id || b.hourSpan <= 1) return b;
          const startIdx = hours.indexOf(b.hour);
          return { ...b, hour: hours[startIdx + 1], hourSpan: b.hourSpan - 1 };
        }),
      };
    });
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
              onSelectDate={setDate}
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
            <BigThree
              values={plan.bigThree}
              onChange={updateBigThree}
              onDropItem={handleDropToBigThree}
            />
            <BrainDump
              items={plan.brainDumpItems}
              onAdd={addBrainDumpItem}
              onRemove={removeBrainDumpItem}
            />
          </div>
          <TimeGrid
            startHour={settings.startHour}
            endHour={settings.endHour}
            blocks={plan.blocks}
            onDropItem={handleDropItem}
            onBlockContentChange={updateBlockContent}
            onBlockExpandToFullHour={expandToFullHour}
            onBlockGrowEnd={growEnd}
            onBlockShrinkEnd={shrinkEnd}
            onBlockGrowStart={growStart}
            onBlockShrinkStart={shrinkStart}
            onBlockDelete={deleteBlock}
          />
        </div>
      </div>
    </div>
  );
}
