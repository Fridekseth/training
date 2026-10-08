"use client";

/**
 * Decision support: the sea against the window the foils work in, how the
 * vessel is moving, and what the engine could save, with the controls for the
 * foils underneath and the one the page recommends marked. Each note takes its
 * tone from the state of the sea.
 */

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ObcAdviceFloatingItem } from "@oicl/openbridge-webcomponents-react/components/advice-floating-item/advice-floating-item";
import { ObcReadout } from "@oicl/openbridge-webcomponents-react/navigation-instruments/readout/readout";
import { ObiWave } from "@oicl/openbridge-webcomponents-react/icons/icon-wave";
import { ObiEnergyFuel } from "@oicl/openbridge-webcomponents-react/icons/icon-energy-fuel";
import { ObiPitch } from "@oicl/openbridge-webcomponents-react/icons/icon-pitch";
import {
  ReadoutSize,
  ReadoutValueType,
} from "@oicl/openbridge-webcomponents/dist/navigation-instruments/readout/readout";
import type { VesselImage } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/watch/vessel";
import { Priority } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/types";
import type { Conditions } from "./conditions";
import { EngineGauge } from "./engine-gauge";
import { FoilControls, type Moving } from "./foil-controls";
import { PitchHeave } from "./pitch-heave";
import { MEASURED, MEASURED_HARMFUL, useWavePalette, WaveChart } from "./wave-chart";
import styles from "./pages.module.css";

type Tone = "good" | "warn" | "neutral";

/** What each state of the sea says on the page, as the design words it. */
const SAY: Record<
  Conditions,
  {
    waves: { tone: Tone; title: string; line: string };
    motion: { tone: Tone; title: string; line: string };
    fuel: { tone: Tone; title: string; line: string };
    /** The control the page recommends. */
    recommends: "deploy" | "retract";
    /** The engine load the gauge marks as worth moving to, in per cent of full power. */
    advice: { min: number; max: number }[];
  }
> = {
  ideal: {
    waves: { tone: "good", title: "Optimal waves", line: "Wave conditions are within foil operating range." },
    motion: { tone: "good", title: "40-44%", line: "Potential motion dampening with foils." },
    fuel: { tone: "good", title: "12-15%", line: "Potential fuel saving with foils." },
    recommends: "deploy",
    advice: [{ min: 60, max: 67 }],
  },
  harmful: {
    waves: { tone: "warn", title: "Harmful waves", line: "Current wave conditions are too heavy for foil use." },
    motion: { tone: "good", title: "40-44%", line: "Potential motion dampening with foils." },
    fuel: { tone: "good", title: "12-15%", line: "Potential fuel saving with foils." },
    recommends: "retract",
    advice: [{ min: 60, max: 67 }],
  },
  wicked: {
    waves: { tone: "neutral", title: "Poor wave conditions", line: "Unclear weather waves are in operating range." },
    motion: { tone: "neutral", title: "0-8%", line: "Potential motion dampening with foils." },
    fuel: { tone: "neutral", title: "2-6%", line: "Potential fuel saving with foils." },
    recommends: "deploy",
    advice: [{ min: 60, max: 67 }],
  },
};

const TONE_CLASS: Record<Tone, string> = {
  good: "",
  warn: styles.adviceBoxWarn,
  neutral: styles.adviceBoxNeutral,
};

/** The highlighted note under an instrument: an icon, a headline and a line of explanation. */
function AdviceBox({
  tone,
  icon,
  title,
  line,
  style,
}: {
  tone: Tone;
  icon: ReactNode;
  title: string;
  line: string;
  style: CSSProperties;
}) {
  return (
    <div className={`${styles.adviceBox} ${TONE_CLASS[tone]}`} style={style}>
      {icon}
      <span className={styles.adviceText}>
        <span className={styles.adviceTitle}>{title}</span>
        <span className={styles.adviceLine}>{line}</span>
      </span>
    </div>
  );
}

function Value({
  label,
  unit,
  value,
}: {
  label: string;
  unit: string;
  value: string;
}) {
  return (
    <ObcReadout
      size={ReadoutSize.small}
      priority={Priority.regular}
      valueType={ReadoutValueType.text}
      label={label}
      unit={unit}
      value={value}
    />
  );
}

/** The advice that comes up over the page when the sea leaves the effect of the foils unclear. */
function FloatingAdvice({ onDeploy }: { onDeploy: () => void }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <ObcAdviceFloatingItem
      className={styles.floatingAdvice}
      style={{ ["--instrument-starboard-primary-color" as string]: "var(--instrument-enhanced-secondary-color)" }}
      hasTimestamp
      hasDay
      action
      action2
      lineType={"multi-line" as never}
      onActionClick={() => setOpen(false)}
      onAction2Click={() => {
        onDeploy();
        setOpen(false);
      }}
      onDismissClick={() => setOpen(false)}
    >
      <span slot="title">Decision support</span>
      <span slot="description">
        The effect of wavefoil is unclear. Try the wings for 5 minutes without changing speed and
        monitor consumption and check the pitching.
      </span>
      <span slot="day">Today</span>
      <span slot="time">09:12</span>
      <span slot="action">Decline</span>
      <span slot="action2">Deploy foils</span>
    </ObcAdviceFloatingItem>
  );
}

export function DecisionSupportPage({
  palette,
  conditions,
  deployment,
  moving,
  onDeploy,
  onRetract,
  onStop,
}: {
  palette: string;
  conditions: Conditions;
  /** 0 with the foils in, 100 with them out. */
  deployment: number;
  moving: Moving;
  onDeploy: () => void;
  onRetract: () => void;
  onStop: () => void;
}) {
  const say = SAY[conditions];
  // The window is drawn in the accent colour only while the sea is inside it.
  const colour = useWavePalette(false, palette);

  return (
    <div className={styles.page}>
      <section
        className={styles.card}
        style={{ left: 4, top: 4, width: 297, height: 380 }}
        data-comment="Wave conditions"
      >
        <p className={styles.cardTitle}>Wave conditions</p>
        <WaveChart
          palette={palette}
          measured={conditions === "harmful" ? MEASURED_HARMFUL : MEASURED}
          harmful={conditions === "harmful"}
        />
        <ul className={styles.legend} style={{ left: 30, top: 199 }}>
          <li>
            <span className={styles.legendLine} style={{ color: colour.measured }} />
            Actual Hs <strong>2,8</strong> m
          </li>
          <li>
            <span className={styles.legendDots} style={{ color: colour.estimated }} />
            Estimated Hs <strong>3,9</strong> m
          </li>
        </ul>
        <AdviceBox
          tone={say.waves.tone}
          icon={<ObiWave />}
          title={say.waves.title}
          line={say.waves.line}
          style={{ left: 33, top: 280, width: 228, height: 75 }}
        />
      </section>

      <section
        className={styles.card}
        style={{ left: 305, top: 4, width: 233, height: 380 }}
        data-comment="Vessel motion"
      >
        <p className={styles.cardTitle}>Vessel motion</p>
        {/* The design's instrument: pitch and heave, with an unbroken ring. */}
        <div className={styles.dial} style={{ left: 36, top: 63, ["--dial" as string]: "159px" }}>
          <svg className={styles.dialRing} viewBox="-100 -100 200 200" aria-hidden="true">
            <circle r="92" />
          </svg>
          <PitchHeave
            pitch={1.67}
            roll={0}
            heave={0.73}
            // The tinted stretch around the needle and the heave marker, as in the design.
            minAvgPitch={-15}
            maxAvgPitch={15}
            minTrendHeave={-3}
            maxTrendHeave={3}
            // No vessel drawing: the readouts take its place.
            vesselImageSide={"none" as VesselImage}
            vesselImageFore={"none" as VesselImage}
            style={{ width: 159, height: 159 }}
          />
          {/* The pitch the advice asks for, as a pill on the outer edge of the pitch band. */}
          <svg className={styles.dialRing} viewBox="-100 -100 200 200" aria-hidden="true">
            <path
              className={styles.dialPill}
              d="M 88.9 -14.1 A 90 90 0 0 1 88.9 14.1"
            />
          </svg>
          <div className={styles.dialReadouts}>
            <Value label="Pitch" unit="DEG" value="1,67" />
            <span className={styles.dialLine} />
            <Value label="Heave" unit="m" value="0,73" />
          </div>
        </div>
        <AdviceBox
          tone={say.motion.tone}
          icon={<ObiPitch />}
          title={say.motion.title}
          line={say.motion.line}
          style={{ left: 29, top: 280, width: 182, height: 75 }}
        />
      </section>

      <section
        className={styles.card}
        style={{ left: 542, top: 4, width: 240, height: 380 }}
        data-comment="Engine power"
      >
        <p className={styles.cardTitle}>Engine power</p>
        <div className={styles.gaugeBox} style={{ left: 20, top: 100 }}>
          <EngineGauge value={73} advice={say.advice} label="MCR" unit="%" />
        </div>
        <AdviceBox
          tone={say.fuel.tone}
          icon={<ObiEnergyFuel />}
          title={say.fuel.title}
          line={say.fuel.line}
          style={{ left: 24, top: 280, width: 191, height: 75 }}
        />
      </section>

      <FoilControls
        deployment={deployment}
        moving={moving}
        onDeploy={onDeploy}
        onRetract={onRetract}
        onStop={onStop}
        recommends={say.recommends}
      />

      {conditions === "wicked" ? <FloatingAdvice key={conditions} onDeploy={onDeploy} /> : null}
    </div>
  );
}
