"use client";

import type { ReactNode } from "react";
import { ObiChevronRightGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-chevron-right-google";
import { ObiExclamationMark } from "@oicl/openbridge-webcomponents-react/icons/icon-exclamation-mark";
import styles from "./training-rich-button.module.css";

/** The states of the OpenBridge rich button, which this one has too. */
export type RichButtonState = "enabled" | "hover" | "active" | "focused" | "disabled";

/**
 * A custom version of the OpenBridge rich button, from the training design:
 * an illustration on a teal plate, a label and description, a chevron, and an
 * optional badge for something that needs attention. It has the same states as
 * the library's rich button: enabled, hover, active, focused and disabled.
 */
export function TrainingRichButton({
  label,
  description,
  illustration,
  badge = false,
  disabled = false,
  state,
  descriptionSize,
  onClick,
}: {
  label: string;
  description?: string;
  /** Drawn inside the 90px plate, positioned the way the design places it. */
  illustration?: ReactNode;
  /** Shows the exclamation badge in the top right corner. */
  badge?: boolean;
  disabled?: boolean;
  /** Shows a state without the pointer or keyboard, as the documentation does. */
  state?: RichButtonState;
  /** Overrides the description's size, in px, for a smaller screen. */
  descriptionSize?: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.button}
      data-state={state}
      disabled={disabled || state === "disabled"}
      onClick={onClick}
    >
      {illustration ? (
        <span className={styles.illustration}>{illustration}</span>
      ) : null}

      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        {description ? (
          <span
            className={styles.description}
            style={descriptionSize ? { fontSize: descriptionSize } : undefined}
          >
            {description}
          </span>
        ) : null}
      </span>

      <span className={styles.chevron}>
        <ObiChevronRightGoogle />
      </span>

      {badge ? (
        <span className={styles.badge}>
          <ObiExclamationMark />
        </span>
      ) : null}
    </button>
  );
}
