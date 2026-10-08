"use client";

import { useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { MaskIcon } from "../pieces";
import styles from "./corner-tools.module.css";

export type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

/** The screen the row snaps around. */
export const SCREEN = { width: 786, height: 590 };
const HEIGHT = 48;

/** The row's width is the sum of the handle and its tools. */
export const GRIP_WIDTH = 41;

const position = (corner: Corner, width: number) => ({
  left: corner.endsWith("left") ? 0 : SCREEN.width - width,
  top: corner.startsWith("top") ? 0 : SCREEN.height - HEIGHT,
});

/** The corner nearest the middle of the row, for where it was let go. */
const nearest = (left: number, top: number, width: number): Corner => {
  const x = left + width / 2 < SCREEN.width / 2 ? "left" : "right";
  const y = top + HEIGHT / 2 < SCREEN.height / 2 ? "top" : "bottom";
  return `${y}-${x}`;
};

const CORNER_CLASS: Record<Corner, string> = {
  "top-left": styles.toolsTopLeft,
  "top-right": styles.toolsTopRight,
  "bottom-left": styles.toolsBottomLeft,
  "bottom-right": styles.toolsBottomRight,
};

/**
 * The row of tools that sits in a corner of the screen in training mode. It can
 * be dragged by its handle and snaps to the nearest corner when let go; without
 * a pointer, the arrow keys step it between corners. Where it sits is the
 * caller's to keep, so it can step aside for something else.
 */
export function CornerTools({
  corner,
  onCorner,
  width,
  label,
  layer,
  className = "",
  onCornerChange,
  children,
}: {
  corner: Corner;
  onCorner: (corner: Corner) => void;
  /** The handle plus every tool in the row. */
  width: number;
  label: string;
  /** The layer the row sits in, measured for the screen's scale. */
  layer: RefObject<HTMLElement | null>;
  className?: string;
  /** Told the corner the row is nearest while it is dragged, and null once let go. */
  onCornerChange?: (corner: Corner | null) => void;
  children: ReactNode;
}) {
  const [dragAt, setDragAt] = useState<{ left: number; top: number } | null>(null);
  const grab = useRef<{ x: number; y: number; left: number; top: number; scale: number } | null>(null);

  const at = dragAt ?? position(corner, width);
  const shown = dragAt ? nearest(dragAt.left, dragAt.top, width) : corner;

  const start = (event: React.PointerEvent<HTMLButtonElement>) => {
    const frame = layer.current?.getBoundingClientRect();
    if (!frame) return;
    const from = position(corner, width);
    grab.current = {
      x: event.clientX,
      y: event.clientY,
      left: from.left,
      top: from.top,
      scale: frame.width / SCREEN.width,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragAt(from);
    onCornerChange?.(corner);
  };

  const move = (event: React.PointerEvent<HTMLButtonElement>) => {
    const from = grab.current;
    if (!from) return;
    const clamp = (value: number, max: number) => Math.min(max, Math.max(0, value));
    const next = {
      left: clamp(from.left + (event.clientX - from.x) / from.scale, SCREEN.width - width),
      top: clamp(from.top + (event.clientY - from.y) / from.scale, SCREEN.height - HEIGHT),
    };
    setDragAt(next);
    onCornerChange?.(nearest(next.left, next.top, width));
  };

  /** Letting go snaps the row to the nearest corner. */
  const end = () => {
    grab.current = null;
    if (dragAt) onCorner(nearest(dragAt.left, dragAt.top, width));
    setDragAt(null);
    onCornerChange?.(null);
  };

  const step = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const [y, x] = corner.split("-");
    const next = {
      ArrowLeft: `${y}-left`,
      ArrowRight: `${y}-right`,
      ArrowUp: `top-${x}`,
      ArrowDown: `bottom-${x}`,
    }[event.key];
    if (!next) return;
    event.preventDefault();
    onCorner(next as Corner);
  };

  return (
    <div
      className={`${styles.tools} ${CORNER_CLASS[shown]} ${dragAt ? styles.toolsDragging : ""} ${className}`}
      style={{ left: at.left, top: at.top, width }}
      role="toolbar"
      aria-label={label}
    >
      <button
        type="button"
        className={styles.grip}
        aria-label="Move the tools. Drag, or use the arrow keys."
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onKeyDown={step}
      >
        <svg width="12" height="18" viewBox="0 0 12 18" aria-hidden="true">
          {[0, 1, 2].flatMap((row) =>
            [0, 1].map((col) => (
              <circle key={`${row}${col}`} cx={3 + col * 6} cy={3 + row * 6} r="1.6" fill="currentColor" />
            )),
          )}
        </svg>
      </button>
      {children}
    </div>
  );
}

/** One tool in the row, drawn as an icon. */
export function ToolButton({
  label,
  icon,
  on,
  width,
  onClick,
  onPointerEnter,
  onPointerLeave,
}: {
  label: string;
  icon: string;
  /** Marks the tool that is switched on. Leave out for a button that is only pressed. */
  on?: boolean;
  /** Narrower than the 52px the other tools take, when the design's row is. */
  width?: number;
  onClick?: () => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.tool} ${on ? styles.toolOn : ""}`}
      style={width ? { width } : undefined}
      aria-label={label}
      aria-pressed={on}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <MaskIcon name={icon} />
    </button>
  );
}
