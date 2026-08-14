"use client";

import { useState } from "react";
import { formatDisplay, formatDateKey, parseDateKey } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  date: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onSelectDate: (date: string) => void;
}

export default function DateNav({
  date,
  onPrev,
  onNext,
  onToday,
  onSelectDate,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <Button onClick={onPrev} aria-label="이전 날짜" size="icon">
        ‹
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="text-lg font-semibold min-w-[9rem] text-center rounded px-2 py-1 hover:bg-white/60"
          >
            {formatDisplay(date)}
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            selected={parseDateKey(date)}
            onSelect={(d) => {
              if (!d) return;
              onSelectDate(formatDateKey(d));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      <Button onClick={onNext} aria-label="다음 날짜" size="icon">
        ›
      </Button>
      <Button onClick={onToday} variant="ghost" className="ml-2">
        오늘
      </Button>
    </div>
  );
}
