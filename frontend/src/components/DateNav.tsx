"use client";

import { formatDisplay } from "@/lib/date";
import { Button } from "@/components/ui/button";

interface Props {
  date: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function DateNav({ date, onPrev, onNext, onToday }: Props) {
  return (
    <div className="flex items-center gap-3">
      <Button onClick={onPrev} aria-label="이전 날짜" size="icon">
        ‹
      </Button>
      <div className="text-lg font-semibold min-w-[9rem] text-center">
        {formatDisplay(date)}
      </div>
      <Button onClick={onNext} aria-label="다음 날짜" size="icon">
        ›
      </Button>
      <Button onClick={onToday} variant="ghost" className="ml-2">
        오늘
      </Button>
    </div>
  );
}
