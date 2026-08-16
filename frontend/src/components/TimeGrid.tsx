"use client";

import type { TimeBlock } from "@/types";
import {
  buildHours,
  fullHourOccupancy,
  hourLabel,
  isHalfSlotOccupied,
} from "@/lib/timegrid";
import TimeBlockCard from "@/components/TimeBlockCard";
import { DRAG_MIME } from "@/components/BrainDump";

interface Props {
  startHour: number;
  endHour: number;
  blocks: TimeBlock[];
  onDropItem: (hour: number, half: 0 | 30, itemId: string) => void;
  onBlockContentChange: (id: string, value: string) => void;
  onBlockExpandToFullHour: (id: string) => void;
  onBlockGrowEnd: (id: string) => void;
  onBlockShrinkEnd: (id: string) => void;
  onBlockGrowStart: (id: string) => void;
  onBlockShrinkStart: (id: string) => void;
  onBlockDelete: (id: string) => void;
}

const ROW_HEIGHT = "2.5rem";

export default function TimeGrid({
  startHour,
  endHour,
  blocks,
  onDropItem,
  onBlockContentChange,
  onBlockExpandToFullHour,
  onBlockGrowEnd,
  onBlockShrinkEnd,
  onBlockGrowStart,
  onBlockShrinkStart,
  onBlockDelete,
}: Props) {
  const hours = buildHours(startHour, endHour);
  const fullOccupied = fullHourOccupancy(blocks, hours);

  const handleDrop = (
    e: React.DragEvent,
    hour: number,
    half: 0 | 30
  ) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData(DRAG_MIME);
    if (!itemId) return;
    if (isHalfSlotOccupied(blocks, fullOccupied, hour, half)) return;
    onDropItem(hour, half, itemId);
  };

  return (
    <div className="border-2 border-gray-800 rounded overflow-hidden">
      <div
        className="grid"
        style={{
          gridTemplateColumns: "3rem 1fr 1fr",
          gridTemplateRows: `2.25rem repeat(${hours.length}, ${ROW_HEIGHT})`,
        }}
      >
        <div className="col-start-1 row-start-1 bg-gray-800 text-white text-sm font-semibold px-2 py-1">
          시
        </div>
        <div className="col-start-2 row-start-1 bg-gray-800 text-white text-sm font-semibold text-center py-1">
          :00
        </div>
        <div className="col-start-3 row-start-1 bg-gray-800 text-white text-sm font-semibold text-center py-1">
          :30
        </div>

        {hours.map((h, i) => {
          const row = i + 2;
          return (
            <div
              key={`bg-${i}`}
              className="col-start-1 flex items-center justify-center text-sm font-semibold bg-white/40 border-t border-r border-gray-800"
              style={{ gridRow: row }}
            >
              {hourLabel(h)}
            </div>
          );
        })}
        {hours.map((h, i) => {
          const row = i + 2;
          return (
            <div
              key={`c00-${i}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, h, 0)}
              className="col-start-2 border-t border-r border-gray-800 bg-white/70"
              style={{ gridRow: row }}
            />
          );
        })}
        {hours.map((h, i) => {
          const row = i + 2;
          return (
            <div
              key={`c30-${i}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, h, 30)}
              className="col-start-3 border-t border-gray-800 bg-white/70"
              style={{ gridRow: row }}
            />
          );
        })}

        {blocks.map((block) => {
          const startIdx = hours.indexOf(block.hour);
          if (startIdx === -1) return null;
          const row = startIdx + 2;
          const column = block.isFullHour ? "2 / span 2" : block.half === 0 ? "2" : "3";
          const rowSpan = block.isFullHour ? block.hourSpan : 1;
          return (
            <div
              key={block.id}
              style={{
                gridRow: `${row} / span ${rowSpan}`,
                gridColumn: column,
              }}
              className="p-0.5"
            >
              <TimeBlockCard
                content={block.content}
                isFullHour={block.isFullHour}
                canShrink={block.hourSpan > 1}
                onContentChange={(value) => onBlockContentChange(block.id, value)}
                onExpandToFullHour={() => onBlockExpandToFullHour(block.id)}
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
