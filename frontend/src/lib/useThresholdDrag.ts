"use client";

import { useCallback, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

/**
 * Fires `onTrigger` once per `step` px of pointer movement along `axis`,
 * repeatedly for the duration of a single drag gesture (not just once).
 * Used for the block resize handles: dragging further keeps extending or
 * shrinking the block by one 30-minute unit per step.
 */
export function useThresholdDrag(
  axis: "x" | "y",
  step: number,
  onTrigger: (direction: 1 | -1) => void
) {
  const startRef = useRef<number | null>(null);
  const stepsFiredRef = useRef(0);

  return useCallback(
    (e: ReactPointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      startRef.current = axis === "x" ? e.clientX : e.clientY;
      stepsFiredRef.current = 0;

      const handleMove = (ev: PointerEvent) => {
        if (startRef.current === null) return;
        const current = axis === "x" ? ev.clientX : ev.clientY;
        const delta = current - startRef.current;
        const targetSteps = Math.trunc(delta / step);
        while (stepsFiredRef.current < targetSteps) {
          onTrigger(1);
          stepsFiredRef.current++;
        }
        while (stepsFiredRef.current > targetSteps) {
          onTrigger(-1);
          stepsFiredRef.current--;
        }
      };
      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        startRef.current = null;
        stepsFiredRef.current = 0;
      };
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [axis, step, onTrigger]
  );
}
