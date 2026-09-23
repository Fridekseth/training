"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Shows something built at a fixed size inside a container of any width, by
 * scaling it rather than letting it reflow. The prototype is drawn at the size
 * the design uses, so its layout stays the one that was designed.
 */
export function ScaledFrame({
  width,
  height,
  children,
  className = "",
  /** Scaling past 1 would blow the interface up, so it is the default ceiling. */
  maxScale = 1,
}: {
  width: number;
  height: number;
  children: ReactNode;
  className?: string;
  maxScale?: number;
}) {
  const [scale, setScale] = useState(1);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(maxScale, entry.contentRect.width / width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [width, maxScale]);

  return (
    <div
      ref={frame}
      className={className}
      style={{ height: Math.round(height * scale), overflow: "hidden" }}
    >
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
