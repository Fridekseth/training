/**
 * What a phone draws itself around an app: the status bar at the top, with the
 * time, the signal, the wifi and the battery, and the line at the bottom that a
 * swipe home starts from. A phone shows its own, so these are only drawn where
 * the app is shown in a frame on the demo page.
 */

import styles from "./device-chrome.module.css";

export function StatusBar({
  tone = "teal",
  overlay = false,
}: {
  /** The colour behind it: the teal of the title bar, white, or the light teal of the instrument. */
  tone?: "teal" | "white" | "tint";
  /** Drawn over the top of the page, which then fills the whole screen. */
  overlay?: boolean;
}) {
  return (
    <div
      className={`${styles.status} ${styles[`tone_${tone}`]} ${overlay ? styles.overlay : ""}`}
      aria-hidden="true"
    >
      <span className={styles.time}>9:41</span>
      <span className={styles.icons}>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.8" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
          <rect x="10" y="3" width="3" height="9" rx="0.8" />
          <rect x="15" y="0" width="3" height="12" rx="0.8" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <path d="M8.5 2.4c2.3 0 4.4.9 6 2.4l1.1-1.2A10.4 10.4 0 0 0 8.5.7 10.4 10.4 0 0 0 1.4 3.6l1.1 1.2a8.7 8.7 0 0 1 6-2.4Z" />
          <path d="M8.5 6c1.4 0 2.6.5 3.6 1.4l1.1-1.2A7.2 7.2 0 0 0 8.5 4.3a7.2 7.2 0 0 0-4.7 1.9l1.1 1.2C5.900 6.500 7.100 6 8.500 6Z" />
          <path d="M8.5 9.500c.6 0 1.2.2 1.600.700L8.500 11.800 6.900 10.200c.4-.5 1-.7 1.600-.7Z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="19" height="9" rx="2.2" fill="currentColor" />
          <path d="M24 4.500v4c.8-.3 1.500-1.100 1.500-2s-.7-1.700-1.500-2Z" fill="currentColor" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}

export function HomeIndicator({ overlay = false }: { overlay?: boolean }) {
  return (
    <div className={`${styles.home} ${overlay ? styles.homeOverlay : ""}`} aria-hidden="true">
      <span className={styles.pill} />
    </div>
  );
}
