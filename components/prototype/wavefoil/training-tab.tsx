"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { MaskIcon } from "../pieces";
import { CornerTools, cornerPosition, GRIP_WIDTH, type Corner } from "./corner-tools";
import styles from "./training-tab.module.css";

/** The tab's width: the handle and the words, with room for a chapter's name. */
export const TAB_WIDTH = 320;
/** Folded to its icon and handle, while something else has the screen's attention. */
export const COMPACT_WIDTH = 85;
const TAB_HEIGHT = 48;

/** How long the tab keeps its words after it has docked, before it folds to the icon. */
const WORDS_MS = 4000;

/** How long the announcement stands in the middle before it settles into the corner. */
const HOLD_MS = 2200;
/** How long it takes to settle, a little over the transition itself. */
const SETTLE_MS = 800;

/** The corner of the tab that is rounded toward the middle, as the row of tools has it. */
const RADIUS: Record<Corner, string> = {
  "top-left": "6px 0 12px 0",
  "top-right": "0 6px 0 12px",
  "bottom-left": "0 12px 0 6px",
  "bottom-right": "12px 0 6px 0",
};

/**
 * The tab a training mode keeps in the corner of the screen: what mode it is,
 * and a handle to move it to another corner. Pressing it opens the mode's menu.
 */
export function ModeTab({
  corner,
  onCorner,
  layer,
  icon,
  label,
  rest,
  open,
  compact: folded = false,
  width = TAB_WIDTH,
  onFold,
  onToggle,
}: {
  corner: Corner;
  onCorner: (corner: Corner) => void;
  layer: RefObject<HTMLElement | null>;
  icon: string;
  /** The mode, in bold. */
  label: string;
  /** What it is about, after it; a mode that is only its name leaves it out. */
  rest?: string;
  open: boolean;
  /** Only the icon and the handle, with the words left out, whatever the time. */
  compact?: boolean;
  /** Wider than the usual tab, for a longer name. */
  width?: number;
  /** Told when the tab folds to its icon by itself, after its words have been up a few seconds. */
  onFold?: () => void;
  onToggle: () => void;
}) {
  const told = useRef(onFold);
  useEffect(() => {
    told.current = onFold;
  });
  // The words are there for a few seconds, so it is clear what the tab is, and then it folds to the icon.
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const fold = window.setTimeout(() => {
      setTimedOut(true);
      told.current?.();
    }, WORDS_MS);
    return () => window.clearTimeout(fold);
  }, []);
  // Under the pointer it shows its words again, whatever the time.
  const [hovered, setHovered] = useState(false);
  const compact = (folded || timedOut) && !hovered;

  return (
    <CornerTools
      corner={corner}
      onCorner={onCorner}
      width={compact ? COMPACT_WIDTH : width}
      label="Training"
      layer={layer}
    >
      <button
        type="button"
        className={`${styles.tabButton} ${compact ? styles.tabCompact : ""}`}
        aria-expanded={open}
        aria-label="Training menu"
        onClick={onToggle}
        // Only the icon unfolds it, so the handle stays where it is to be grabbed. A finger has no hover, so touch is left out.
        onPointerEnter={(event) => event.pointerType !== "touch" && setHovered(true)}
        onPointerLeave={(event) => event.pointerType !== "touch" && setHovered(false)}
      >
        <MaskIcon name={icon} size={24} />
        <span className={styles.tabLabel}>
          <strong>{label}</strong>
          {rest ? ` ${rest}` : null}
        </span>
      </button>
    </CornerTools>
  );
}

/**
 * A box in the middle of the screen that says what mode has been opened, and
 * then settles into the tab in the corner. It is the tab by the time it gets
 * there, so the real one can take its place without anything moving.
 */
export function ModeIntro({
  corner,
  icon,
  title,
  subtitle,
  label,
  rest,
  width = TAB_WIDTH,
  onSettled,
}: {
  /** The corner it settles into. */
  corner: Corner;
  icon: string;
  title: string;
  /** A second line under the title; a mode that needs none leaves it out. */
  subtitle?: string;
  label: string;
  rest?: string;
  /** The width of the tab it settles into. */
  width?: number;
  onSettled: () => void;
}) {
  const [settling, setSettling] = useState(false);

  useEffect(() => {
    const move = window.setTimeout(() => setSettling(true), HOLD_MS);
    return () => window.clearTimeout(move);
  }, []);

  useEffect(() => {
    if (!settling) return;
    const done = window.setTimeout(onSettled, SETTLE_MS);
    return () => window.clearTimeout(done);
  }, [settling, onSettled]);

  const target = cornerPosition(corner, width);
  const right = corner.endsWith("right");
  // The handle stands on the inner edge, which is the right of a tab in a left corner.
  const inset = right ? GRIP_WIDTH : 0;

  const box = settling
    ? { left: target.left, top: target.top, width, height: TAB_HEIGHT, borderRadius: RADIUS[corner] }
    : { left: 204, top: 231, width: 377, height: 91, borderRadius: 6 };

  return (
    <div className={`${styles.intro} ${settling ? styles.settled : ""}`} style={box} role="status">
      <MaskIcon
        name={icon}
        className={styles.introIcon}
        size={settling ? 24 : 46}
        style={
          settling
            ? { left: inset + 12, top: 12, width: 24, height: 24 }
            : { left: 24, top: 22.5, width: 46, height: 46 }
        }
      />
      <div className={styles.introText} style={subtitle ? undefined : { top: 31 }}>
        <p className={styles.introTitle}>{title}</p>
        {subtitle ? <p className={styles.introSubtitle}>{subtitle}</p> : null}
      </div>
      <span className={styles.introDocked} style={{ left: inset + 44 }}>
        <strong>{label}</strong>
        {rest ? ` ${rest}` : null}
      </span>
      <span
        className={`${styles.introGrip} ${right ? styles.introGripRight : styles.introGripLeft}`}
        style={right ? { left: 0 } : { left: width - GRIP_WIDTH }}
        aria-hidden="true"
      >
        <svg width="12" height="18" viewBox="0 0 12 18">
          {[0, 1, 2].flatMap((row) =>
            [0, 1].map((col) => (
              <circle key={`${row}${col}`} cx={3 + col * 6} cy={3 + row * 6} r="1.6" fill="currentColor" />
            )),
          )}
        </svg>
      </span>
    </div>
  );
}
