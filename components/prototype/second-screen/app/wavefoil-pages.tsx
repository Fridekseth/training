"use client";

/**
 * The pages of the Wavefoil flow in the second screen app: the Wavefoil page in
 * Learn, the list of its components, and the Wavefoil window, which is the wave
 * conditions of the interface with the wave height to set.
 */

import { useState } from "react";
import { ObcIconButton } from "@oicl/openbridge-webcomponents-react/components/icon-button/icon-button";
import { ObcSlider } from "@oicl/openbridge-webcomponents-react/components/slider/slider";
import { ObiCloseGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-close-google";
import { IconButtonVariant } from "@oicl/openbridge-webcomponents/dist/components/icon-button/icon-button";
import { MEASURED, WINDOW_HIGH, WINDOW_LOW, WaveChart } from "../../wavefoil/wave-chart";
import { WAVEFOIL_COMPONENTS, WAVEFOIL_PAGES, WAVE_ADVICE } from "./app-data";
import { Card, Mask } from "./app-parts";
import styles from "./second-screen-app.module.css";

/** Where the second screen can be taken from the lists on these pages. */
export type WavefoilTarget = "components" | "window" | "gyro";

export function WavefoilPage({ onOpen }: { onOpen: (target: WavefoilTarget) => void }) {
  return (
    <section className={styles.section}>
      <div className={styles.stack}>
        {WAVEFOIL_PAGES.map((item) => (
          <Card
            key={item.id}
            label={item.label}
            text={item.text}
            icon={<Mask src={item.icon} />}
            onClick={item.id === "components" ? () => onOpen("components") : undefined}
          />
        ))}
      </div>
    </section>
  );
}

export function WavefoilComponentsPage({ onOpen }: { onOpen: (target: WavefoilTarget) => void }) {
  return (
    <section className={styles.section}>
      <p className={styles.label}>Components</p>
      <div className={styles.stack}>
        {WAVEFOIL_COMPONENTS.map((item) => (
          <Card
            key={item.id}
            label={item.label}
            text={item.text}
            icon={<Mask src={item.icon} />}
            onClick={item.page ? () => onOpen(item.page!) : undefined}
          />
        ))}
      </div>
    </section>
  );
}

/** The plot of the chart is 210 by 105 px, for 0 to 8 m, and a band is placed on it by metres. */
const PLOT_HEIGHT = 105;
const PLOT_AT = (metres: number) => 1 + (1 - metres / 8) * PLOT_HEIGHT;

/** The readings of the chart for a wave height: the shape of the last hours, ending at the height that is set. */
const SHAPE = [0.45, 0.6, 0.9, 0.8, 0.95, 1];
const readings = (height: number) =>
  SHAPE.map((share) => Math.min(8, Math.max(0.2, Number((height * share).toFixed(2)))));

/** The state of the waves for a height: below the window the foils slow the ship down, in it they suit, and above it they are too heavy. */
const toneOf = (height: number) => (height < WINDOW_LOW ? "poor" : height > WINDOW_HIGH ? "harmful" : "optimal");

export function WavefoilWindowPage({ onClose }: { onClose: () => void }) {
  const [height, setHeight] = useState(3.8);
  const tone = toneOf(height);
  const advice = WAVE_ADVICE[tone];

  return (
    <div className={styles.window}>
      <ObcIconButton
        className={styles.windowClose}
        variant={IconButtonVariant.flat}
        aria-label="Close"
        onClick={onClose}
      >
        <ObiCloseGoogle />
      </ObcIconButton>

      <section className={styles.windowCard} aria-label="Wave conditions">
        <p className={styles.windowTitle}>Wave conditions</p>
        <div className={styles.chartHolder}>
          <WaveChart palette="day" measured={height === 3.8 ? MEASURED : readings(height)} harmful={tone === "harmful"} />
          {/* The part of the plot the state is about: the window of the foils in blue, or the calm below it in yellow. */}
          {tone === "optimal" ? (
            <span className={`${styles.band} ${styles.bandWindow}`} style={{ top: PLOT_AT(WINDOW_HIGH), height: PLOT_AT(WINDOW_LOW) - PLOT_AT(WINDOW_HIGH) }} />
          ) : null}
          {tone === "poor" ? (
            <span className={`${styles.band} ${styles.bandCalm}`} style={{ top: PLOT_AT(WINDOW_LOW), height: PLOT_HEIGHT - PLOT_AT(WINDOW_LOW) }} />
          ) : null}
        </div>
        <ul className={styles.windowLegend}>
          <li>
            <span className={styles.legendSolid} />
            Actual Hs <strong>{height.toFixed(1).replace(".", ",")}</strong> m
          </li>
          <li>
            <span className={styles.legendDotted} />
            Estimated Hs <strong>3,9</strong> m
          </li>
        </ul>
        <div className={`${styles.advice} ${styles[`advice_${tone}`]}`} role="status">
          <Mask className={styles.adviceIcon} src="/prototype/icons/wf-heavy-seas.svg" />
          <span>
            <strong>{advice.title}</strong>
            <span>{advice.text}</span>
          </span>
        </div>
      </section>

      <section className={styles.windowSet}>
        <p className={styles.setTitle}>
          <Mask className={styles.adviceIcon} src="/prototype/icons/wf-heavy-seas.svg" />
          Set wave height
        </p>
        <div className={styles.setRow}>
          <span>0</span>
          <ObcSlider
            className={styles.slider}
            min={0}
            max={15}
            step={0.1}
            value={height}
            onValue={(event) => setHeight(Number(event.detail))}
            aria-label="Wave height in metres"
          />
          <span>15</span>
        </div>
        <p className={styles.setValue}>{height.toFixed(1)} m</p>
      </section>
    </div>
  );
}
