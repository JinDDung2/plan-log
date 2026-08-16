"use client";

import { useThresholdDrag } from "@/lib/useThresholdDrag";

interface Props {
  content: string;
  isFullHour: boolean;
  canShrink: boolean;
  onContentChange: (value: string) => void;
  onExpandToFullHour: () => void;
  onGrowEnd: () => void;
  onShrinkEnd: () => void;
  onGrowStart: () => void;
  onShrinkStart: () => void;
  onDelete: () => void;
}

const HANDLE_THRESHOLD = 12;

export default function TimeBlockCard({
  content,
  isFullHour,
  canShrink,
  onContentChange,
  onExpandToFullHour,
  onGrowEnd,
  onShrinkEnd,
  onGrowStart,
  onShrinkStart,
  onDelete,
}: Props) {
  const onLeftHandle = useThresholdDrag("x", HANDLE_THRESHOLD, () => {
    if (!isFullHour) onExpandToFullHour();
  });
  const onRightHandle = useThresholdDrag("x", HANDLE_THRESHOLD, () => {
    if (!isFullHour) onExpandToFullHour();
  });
  const onTopHandle = useThresholdDrag("y", HANDLE_THRESHOLD, (dir) => {
    if (dir === -1) onGrowStart();
    else if (canShrink) onShrinkStart();
  });
  const onBottomHandle = useThresholdDrag("y", HANDLE_THRESHOLD, (dir) => {
    if (dir === 1) onGrowEnd();
    else if (canShrink) onShrinkEnd();
  });

  return (
    <div className="relative z-10 h-full w-full flex items-center gap-1 rounded-sm border-2 border-amber-700 bg-amber-100 px-2 py-1 text-sm group">
      {isFullHour && (
        <div
          onPointerDown={onTopHandle}
          className="absolute -top-1 left-1 right-1 h-2 cursor-row-resize"
          aria-hidden
        />
      )}
      {!isFullHour && (
        <div
          onPointerDown={onLeftHandle}
          className="absolute top-1 bottom-1 -left-1 w-2 cursor-col-resize"
          aria-hidden
        />
      )}
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
      {!isFullHour && (
        <div
          onPointerDown={onRightHandle}
          className="absolute top-1 bottom-1 -right-1 w-2 cursor-col-resize"
          aria-hidden
        />
      )}
      {isFullHour && (
        <div
          onPointerDown={onBottomHandle}
          className="absolute -bottom-1 left-1 right-1 h-2 cursor-row-resize"
          aria-hidden
        />
      )}
    </div>
  );
}
