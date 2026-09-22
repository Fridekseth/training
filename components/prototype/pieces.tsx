"use client";

/** Small shared pieces for the training prototype. */

import type { CSSProperties, ReactNode } from "react";
import { Status, STATUS_LABEL } from "./training-data";

/**
 * An icon drawn as a mask, so one SVG file serves both the grey and the blue
 * state: the shape comes from the file, the colour from `currentColor`.
 */
export function MaskIcon({
  name,
  size = 24,
  style,
  slot,
}: {
  name: string;
  size?: number;
  style?: CSSProperties;
  /** Lets the icon be placed in a web component's slot. */
  slot?: string;
}) {
  const url = `url(/prototype/icons/${name}.svg)`;
  return (
    <span
      aria-hidden="true"
      slot={slot}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        backgroundColor: "currentColor",
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

/** The teal card the isometric drawings sit in. */
export function SymbolCard({
  children,
  size,
  style,
  slot,
}: {
  children: ReactNode;
  size?: number;
  style?: CSSProperties;
  slot?: string;
}) {
  return (
    <div
      slot={slot}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 6,
        background: "var(--base-teal-050, #e2f2f3)",
        ...(size ? { width: size, height: size, minWidth: size, flexShrink: 0 } : null),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** One piece of an isometric drawing, placed the way the Figma file places it. */
export function Piece({
  src,
  left,
  top,
  width,
  height,
}: {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      src={`/prototype/illustrations/${src}.svg`}
      width={width}
      height={height}
      style={{ position: "absolute", left, top, width, height, display: "block" }}
    />
  );
}

/** Page heading and lead paragraph, shared by every training screen. */
export function PageIntro({
  title,
  children,
  width = 363,
}: {
  title: string;
  children?: ReactNode;
  width?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "16px 0",
        width,
        maxWidth: "100%",
      }}
    >
      <p style={{ font: "var(--font-ui-subtitle, 700 24px/32px 'Noto Sans')", margin: 0 }}>
        {title}
      </p>
      {children ? (
        <p
          style={{
            margin: 0,
            fontSize: 16,
            lineHeight: "24px",
            color: "var(--element-neutral-color, #535353)",
          }}
        >
          {children}
        </p>
      ) : null}
    </div>
  );
}

export const STATUS_TAG_COLOR: Record<Status, string> = {
  completed: "green",
  "in-progress": "yellow",
  "not-started": "blue",
};

export function statusLabel(status: Status): string {
  return STATUS_LABEL[status];
}
