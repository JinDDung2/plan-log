"use client";

import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function BrainDump({ value, onChange }: Props) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <h2 className="text-lg font-bold mb-2">Brain Dump</h2>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="머릿속에 있는 할 일을 전부 꺼내 적어보세요..."
        className="flex-1 min-h-[220px] resize-none leading-7"
      />
    </div>
  );
}
