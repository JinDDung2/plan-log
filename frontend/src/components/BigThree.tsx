"use client";

import { Input } from "@/components/ui/input";
import { DRAG_MIME } from "@/components/BrainDump";

interface Props {
  values: [string, string, string];
  onChange: (index: number, value: string) => void;
  onDropItem: (index: number, itemId: string) => void;
}

export default function BigThree({ values, onChange, onDropItem }: Props) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Big 3 (오늘의 최우선 순위)</h2>
      <div className="flex flex-col gap-2">
        {values.map((v, i) => (
          <Input
            key={i}
            value={v}
            onChange={(e) => onChange(i, e.target.value)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const itemId = e.dataTransfer.getData(DRAG_MIME);
              if (itemId) onDropItem(i, itemId);
            }}
            placeholder={`우선순위 ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
