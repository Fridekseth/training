"use client";

import { useScreen } from "./corner-tools";
import styles from "./training-frame.module.css";

/**
 * The teal frame that says the screen is in training mode and not the live
 * system. It is a 6px band just outside the screen (786 x 590 in the prototype,
 * or the size of the screen it is shown on), drawn once around from the bottom
 * right corner, where the tool row starts.
 */
export function TrainingFrame() {
  const { width: w, height: h } = useScreen();
  return (
    <svg className={styles.frame} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <path
        className={styles.frameLine}
        pathLength={1}
        d={`M${w + 3} ${h - 6} A9 9 0 0 1 ${w - 6} ${h + 3} H6 A9 9 0 0 1 -3 ${h - 6} V6 A9 9 0 0 1 6 -3 H${w - 6} A9 9 0 0 1 ${w + 3} 6 Z`}
      />
    </svg>
  );
}
