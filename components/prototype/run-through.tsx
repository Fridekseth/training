"use client";

/**
 * The Topping run-through: the training layer that sits over the running
 * screen. It frames the screen, washes everything except the component being
 * explained, and walks through the steps. The step menu is only there when the
 * training button is pressed, as in the design.
 */

import { useEffect, useState } from "react";
import { MaskIcon } from "./pieces";
import { TOPPING_STEPS, WRITTEN_STEPS } from "./run-through-data";
import styles from "./run-through.module.css";

type Rect = { top: number; left: number; width: number; height: number };

export function TrainingSplash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 2400);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={styles.splashLayer} onClick={onDone}>
      <div className={styles.splash}>
        <p className={styles.splashHeader}>
          <MaskIcon name="training" />
          Training mode activated
        </p>
        <div className={styles.splashArt}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src="/prototype/illustrations/overview-group8.svg"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 176,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function RunThrough({
  frame,
  onExit,
}: {
  /** The prototype's frame, which the highlight is measured against. */
  frame: React.RefObject<HTMLDivElement | null>;
  onExit: () => void;
}) {
  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);

  const current = TOPPING_STEPS[step];

  // Measuring runs from a ResizeObserver, so the first callback also gives the
  // starting position and later ones keep it in step with the frame's size.
  useEffect(() => {
    const container = frame.current;
    const target = current?.target
      ? container?.querySelector(`[data-step="${current.target}"]`)
      : null;

    if (!container || !target) {
      const clear = window.setTimeout(() => setRect(null), 0);
      return () => window.clearTimeout(clear);
    }

    const measure = () => {
      const box = target.getBoundingClientRect();
      const outer = container.getBoundingClientRect();
      const scale = outer.width / container.offsetWidth || 1;
      setRect({
        top: (box.top - outer.top) / scale,
        left: (box.left - outer.left) / scale,
        width: box.width / scale,
        height: box.height / scale,
      });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(target);
    return () => observer.disconnect();
  }, [current, frame]);

  // Beside the highlighted component, clear of the strip along the top.
  const tipLeft = rect ? Math.min(rect.left + rect.width + 20, 640) : 300;
  const tipTop = rect ? Math.min(Math.max(rect.top, 80), 300) : 120;

  return (
    <div className={styles.layer}>
      <div className={styles.frame} />

      {rect ? (
        <>
          <div
            className={styles.wash}
            style={{ left: 0, top: 0, right: 0, height: rect.top }}
          />
          <div
            className={styles.wash}
            style={{ left: 0, top: rect.top, width: rect.left, height: rect.height }}
          />
          <div
            className={styles.wash}
            style={{
              left: rect.left + rect.width,
              top: rect.top,
              right: 0,
              height: rect.height,
            }}
          />
          <div
            className={styles.wash}
            style={{ left: 0, top: rect.top + rect.height, right: 0, bottom: 0 }}
          />
          <div
            className={styles.highlight}
            style={{
              left: rect.left - 2,
              top: rect.top - 2,
              width: rect.width + 4,
              height: rect.height + 4,
            }}
          />
        </>
      ) : (
        <div className={styles.wash} style={{ inset: 0 }} />
      )}

      <div className={styles.tip} style={{ left: tipLeft, top: tipTop }}>
        <div className={styles.tipArrow} />
        <p className={styles.tipHeader}>
          <MaskIcon name="training" style={{ color: "#fff" }} />
          {current.label}
        </p>
        <div className={styles.tipBody}>
          <p style={{ margin: 0 }}>{current.description}</p>
          <div className={styles.tipActions}>
            <button
              type="button"
              className={styles.tipButton}
              disabled={step === 0}
              onClick={() => setStep((value) => Math.max(0, value - 1))}
            >
              &#8249; Previous
            </button>
            <button
              type="button"
              className={`${styles.tipButton} ${styles.tipPrimary}`}
              disabled={step >= WRITTEN_STEPS - 1}
              onClick={() => setStep((value) => Math.min(WRITTEN_STEPS - 1, value + 1))}
            >
              Next &#8250;
            </button>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div className={styles.stepper}>
          <p className={styles.stepperHeader}>
            <MaskIcon name="topping" />
            Topping
          </p>
          <ul className={styles.stepList}>
            {TOPPING_STEPS.map((item, index) => {
              const written = Boolean(item.description);
              const done = index <= step;
              if (!item.label) {
                return (
                  <li className={styles.stepRow} key={`gap-${index}`}>
                    <span className={styles.stepIndex} />
                    <span className={styles.stepTrack}>
                      <span className={`${styles.stepDot} ${styles.stepDotUpcoming}`} />
                    </span>
                    <span className={styles.stepGap} />
                  </li>
                );
              }
              return (
                <li className={styles.stepRow} key={item.label}>
                  <span className={styles.stepIndex}>{index + 1}</span>
                  <span
                    className={`${styles.stepTrack} ${done ? styles.stepTrackDone : ""}`}
                  >
                    <span
                      className={`${styles.stepDot} ${
                        done ? styles.stepDotDone : styles.stepDotUpcoming
                      }`}
                    />
                  </span>
                  <button
                    type="button"
                    className={`${styles.stepCard} ${
                      index === step ? styles.stepCardCurrent : ""
                    }`}
                    disabled={!written}
                    onClick={() => setStep(index)}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
          <button type="button" className={styles.exit} onClick={onExit}>
            Exit training mode &#10005;
          </button>
        </div>
      ) : null}

      <button
        type="button"
        className={styles.fab}
        aria-label={menuOpen ? "Close the training menu" : "Open the training menu"}
        onClick={() => setMenuOpen((value) => !value)}
      >
        <MaskIcon name="training" size={28} />
      </button>
    </div>
  );
}
