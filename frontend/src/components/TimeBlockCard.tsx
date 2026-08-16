"use client";

import { useThresholdDrag } from "@/lib/useThresholdDrag";

interface Props {
  content: string;
  onContentChange: (value: string) => void;
  onGrowEnd: () => void;
  onShrinkEnd: () => void;
  onGrowStart: () => void;
  onShrinkStart: () => void;
  onDelete: () => void;
}

const HANDLE_STEP = 14;

export default function TimeBlockCard({
  content,
  onContentChange,
  onGrowEnd,
  onShrinkEnd,
  onGrowStart,
  onShrinkStart,
  onDelete,
}: Props) {
  const onTopHandle = useThresholdDrag("y", HANDLE_STEP, (dir) => {
    if (dir === -1) onGrowStart();
    else onShrinkStart();
  });
  const onBottomHandle = useThresholdDrag("y", HANDLE_STEP, (dir) => {
    if (dir === 1) onGrowEnd();
    else onShrinkEnd();
  });

  return (
    <div className="relative z-10 h-full w-full flex items-center gap-1 rounded-sm border-2 border-amber-700 bg-amber-100 px-2 py-1 text-sm group">
      <div
        onPointerDown={onTopHandle}
        className="absolute -top-1 left-1 right-1 h-2 cursor-row-resize"
        aria-hidden
      />
      <input
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent outline-none"
      />
      <button
        type="button"
        onClick={onDelete}
        aria-label="블록 삭제"
        className="text-amber-800 opacity-0 group-hover:opacity-100 hover:text-amber-950"
      >
        ×
      </button>
      <div
        onPointerDown={onBottomHandle}
        className="absolute -bottom-1 left-1 right-1 h-2 cursor-row-resize"
        aria-hidden
      />
    </div>
  );
}
