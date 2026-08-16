"use client";

import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function GratitudeJournal({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-2">감사일기</h2>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="오늘 하루를 돌아보며 감사한 일을 적어보세요."
        rows={4}
      />
    </div>
  );
}
