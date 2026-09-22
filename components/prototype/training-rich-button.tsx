"use client";

import type { ReactNode } from "react";
import { ObiChevronRightGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-chevron-right-google";
import { ObiExclamationMark } from "@oicl/openbridge-webcomponents-react/icons/icon-exclamation-mark";
import styles from "./training-rich-button.module.css";

/**
 * A custom version of the OpenBridge rich button, from the training design:
 * an illustration on a teal plate, a label and description, a chevron, and an
 * optional badge for something that needs attention.
 */
export function TrainingRichButton({
  label,
  description,
  illustration,
  badge = false,
  disabled = false,
  onClick,
}: {
  label: string;
  description?: string;
  /** Drawn inside the 90px plate, positioned the way the design places it. */
  illustration?: ReactNode;
  /** Shows the exclamation badge in the top right corner. */
  badge?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.button}
      disabled={disabled}
      onClick={onClick}
    >
      {illustration ? (
        <span className={styles.illustration}>{illustration}</span>
      ) : null}

      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        {description ? (
          <span className={styles.description}>{description}</span>
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
