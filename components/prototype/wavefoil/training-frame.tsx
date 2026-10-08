import styles from "./training-frame.module.css";

/**
 * The teal frame that says the screen is in training mode and not the live
 * system. It is a 6px band just outside the 786 x 590 screen, drawn once around
 * from the bottom right corner, where the tool row starts.
 */
export function TrainingFrame() {
  return (
    <svg className={styles.frame} viewBox="0 0 786 590" aria-hidden="true">
      <path
        className={styles.frameLine}
        pathLength={1}
        d="M789 584 A9 9 0 0 1 780 593 H6 A9 9 0 0 1 -3 584 V6 A9 9 0 0 1 6 -3 H780 A9 9 0 0 1 789 6 Z"
      />
    </svg>
  );
}
