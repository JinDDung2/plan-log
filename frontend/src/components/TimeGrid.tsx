"use client";

import type { TimeBlock } from "@/types";
import { buildSlots, hourLabel, isSlotOccupied, slotIndex } from "@/lib/timegrid";
import TimeBlockCard from "@/components/TimeBlockCard";
import { DRAG_MIME } from "@/components/BrainDump";

interface Props {
  startHour: number;
  endHour: number;
  blocks: TimeBlock[];
  onDropItem: (hour: number, half: 0 | 30, itemId: string) => void;
  onBlockContentChange: (id: string, value: string) => void;
  onBlockGrowEnd: (id: string) => void;
  onBlockShrinkEnd: (id: string) => void;
  onBlockGrowStart: (id: string) => void;
  onBlockShrinkStart: (id: string) => void;
  onBlockDelete: (id: string) => void;
}

const ROW_HEIGHT = "1.25rem";

export default function TimeGrid({
  startHour,
  endHour,
  blocks,
  onDropItem,
  onBlockContentChange,
  onBlockGrowEnd,
  onBlockShrinkEnd,
  onBlockGrowStart,
  onBlockShrinkStart,
  onBlockDelete,
}: Props) {
  const slots = buildSlots(startHour, endHour);

  const handleDrop = (e: React.DragEvent, hour: number, half: 0 | 30) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData(DRAG_MIME);
    if (!itemId) return;
    if (isSlotOccupied(blocks, slots, hour, half)) return;
    onDropItem(hour, half, itemId);
  };

  return (
    <div className="border-2 border-gray-800 rounded overflow-hidden">
      <div
        className="grid"
        style={{
          gridTemplateColumns: "3rem 1fr",
          gridTemplateRows: `2.25rem repeat(${slots.length}, ${ROW_HEIGHT})`,
        }}
      >
        <div className="col-start-1 row-start-1 bg-gray-800 text-white text-sm font-semibold px-2 py-1">
          시
        </div>
        <div className="col-start-2 row-start-1 bg-gray-800 text-white text-sm font-semibold text-center py-1">
          분
        </div>

        {slots.map((slot, i) => {
          const row = i + 2;
          return (
            <div
              key={`label-${i}`}
              className={`col-start-1 flex items-center justify-center text-sm font-semibold bg-white/40 border-r border-gray-800 ${
                slot.half === 0 ? "border-t" : ""
              }`}
              style={{ gridRow: row }}
            >
              {slot.half === 0 ? hourLabel(slot.hour) : ""}
            </div>
          );
        })}
        {slots.map((slot, i) => {
          const row = i + 2;
          return (
            <div
              key={`cell-${i}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, slot.hour, slot.half)}
              className={`col-start-2 border-gray-800 bg-white/70 ${
                slot.half === 0 ? "border-t" : "border-t border-dashed border-gray-400"
              }`}
              style={{ gridRow: row }}
            />
          );
        })}

        {blocks.map((block) => {
          const startIdx = slotIndex(slots, block.hour, block.half);
          if (startIdx === -1) return null;
          const row = startIdx + 2;
          return (
            <div
              key={block.id}
              style={{
                gridRow: `${row} / span ${block.span}`,
                gridColumn: 2,
              }}
              className="p-0.5"
            >
              <TimeBlockCard
                content={block.content}
                onContentChange={(value) => onBlockContentChange(block.id, value)}
                onGrowEnd={() => onBlockGrowEnd(block.id)}
                onShrinkEnd={() => onBlockShrinkEnd(block.id)}
                onGrowStart={() => onBlockGrowStart(block.id)}
                onShrinkStart={() => onBlockShrinkStart(block.id)}
                onDelete={() => onBlockDelete(block.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
