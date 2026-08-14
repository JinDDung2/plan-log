"use client";

import { Input } from "@/components/ui/input";

interface Props {
  values: [string, string, string];
  onChange: (index: number, value: string) => void;
}

export default function BigThree({ values, onChange }: Props) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Big 3 (오늘의 최우선 순위)</h2>
      <div className="flex flex-col gap-2">
        {values.map((v, i) => (
          <Input
            key={i}
            value={v}
            onChange={(e) => onChange(i, e.target.value)}
            placeholder={`우선순위 ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
