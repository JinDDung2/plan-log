"use client";

import { useState } from "react";
import type { BrainDumpItem } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const DRAG_MIME = "application/x-brain-dump-item";

interface Props {
  items: BrainDumpItem[];
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
}

export default function BrainDump({ items, onAdd, onRemove }: Props) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    onAdd(text);
    setDraft("");
  };

  return (
    <div className="flex flex-col min-h-0">
      <h2 className="text-lg font-bold mb-2">Brain Dump</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex gap-2 mb-2"
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="머릿속에 있는 할 일을 적고 Enter..."
        />
        <Button type="submit">추가</Button>
      </form>
      <div className="flex-1 min-h-[120px] max-h-[220px] border-2 border-gray-800 rounded bg-white/40 p-2 flex flex-col gap-2 overflow-y-auto">
        {items.length === 0 && (
          <p className="text-sm text-gray-500 p-2">
            할 일을 추가한 뒤, 오른쪽 시간표로 드래그해서 배치하세요.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(DRAG_MIME, item.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            className="group flex items-center justify-between gap-2 border-2 border-gray-800 rounded bg-white/80 px-3 py-2 text-sm cursor-grab active:cursor-grabbing"
          >
            <span className="truncate">{item.text}</span>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label="삭제"
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-900"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
