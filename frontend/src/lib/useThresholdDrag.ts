"use client";

import { useCallback, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

/**
 * Fires `onTrigger` at most once per pointer-down gesture, as soon as the
 * pointer moves past `threshold` px along `axis` from the start point.
 * Used for the block resize handles (drag-to-expand instead of live resize).
 */
export function useThresholdDrag(
  axis: "x" | "y",
  threshold: number,
  onTrigger: (direction: 1 | -1) => void
) {
  const startRef = useRef<number | null>(null);
  const firedRef = useRef(false);

  return useCallback(
    (e: ReactPointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      startRef.current = axis === "x" ? e.clientX : e.clientY;
      firedRef.current = false;

      const handleMove = (ev: PointerEvent) => {
        if (startRef.current === null || firedRef.current) return;
        const current = axis === "x" ? ev.clientX : ev.clientY;
        const delta = current - startRef.current;
        if (Math.abs(delta) >= threshold) {
          firedRef.current = true;
          onTrigger(delta > 0 ? 1 : -1);
        }
      };
      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        startRef.current = null;
      };
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [axis, threshold, onTrigger]
  );
}
