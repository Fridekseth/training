"use client";

/**
 * The second screen for a phone: the vessel's pitch, roll and heave instrument
 * inside the outline of a hull, moved by the phone itself. Tipping the phone
 * forward or back changes the pitch, tipping it side to side changes the roll,
 * and lifting it up and down changes the heave.
 */

import { useRef } from "react";
import "@oicl/openbridge-webcomponents/dist/openbridge.css";
import { ObcButton } from "@oicl/openbridge-webcomponents-react/components/button/button";
import { ObcIconButton } from "@oicl/openbridge-webcomponents-react/components/icon-button/icon-button";
import { ObcPitchRollHeave } from "@oicl/openbridge-webcomponents-react/navigation-instruments/pitch-roll-heave/pitch-roll-heave";
import { ObiCloseGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-close-google";
import { ButtonVariant } from "@oicl/openbridge-webcomponents/dist/components/button/button";
import { IconButtonVariant } from "@oicl/openbridge-webcomponents/dist/components/icon-button/icon-button";
import { useVesselMotion } from "./use-vessel-motion";
import styles from "./second-screen.module.css";

const PITCH_ARC = 25;
const ROLL_ARC = 35;
const HEAVE_RANGE = 2;

/** One reading with its label and unit, set right-aligned as in the design. */
function Readout({ label, unit, value }: { label: string; unit: string; value: number }) {
  // A true minus sign, and no minus on a zero that rounds away.
  const text = (Math.abs(value) < 0.05 ? 0 : value).toFixed(1).replace("-", "−");
  return (
    <div className={styles.readout}>
      <span className={styles.value}>{text}</span>
      <span className={styles.caption}>
        <span className={styles.label}>{label}</span>
        <span className={styles.unit}>{unit}</span>
      </span>
    </div>
  );
}

/**
 * The hull seen from above: a pointed bow, and sides that run off the bottom of the screen.
 * The bow is drawn with room for half a stroke on every side, so its line is as wide as the sides' and meets them.
 */
function Hull() {
  return (
    <div className={styles.hull} aria-hidden="true">
      <svg className={styles.bow} viewBox="-0.575 -0.575 334.15 240.575" preserveAspectRatio="none">
        <path
          d="M0 240V235.445C0.114528 126.773 69.5672 34.3386 166.499 0C263.415 34.3325 332.861 126.741 332.999 235.391V240Z"
          fill="#FCFCFC"
        />
        <path
          d="M0 240V235.445C0.114528 126.773 69.5672 34.3386 166.499 0C263.415 34.3325 332.861 126.741 332.999 235.391V240"
          fill="none"
          stroke="#8E8E8E"
          strokeWidth="1.15"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className={styles.deck} />
    </div>
  );
}

export function SecondScreen() {
  const { motion, source, needsPermission, secure, enable, level, drag, release, lifted } = useVesselMotion();
  const grab = useRef<{ x: number; y: number } | null>(null);
  const dragging = source !== "sensors";

  return (
    <div className={styles.page}>
      <div
        className={styles.phone}
        onPointerDown={(event) => {
          if (!dragging) return;
          grab.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragging || !grab.current) return;
          drag(event.clientX - grab.current.x, event.clientY - grab.current.y);
        }}
        onPointerUp={() => {
          grab.current = null;
          release();
        }}
        onPointerCancel={() => {
          grab.current = null;
          release();
        }}
        onWheel={(event) => lifted(event.deltaY)}
      >
        <Hull />

        <ObcIconButton
          className={styles.close}
          variant={IconButtonVariant.flat}
          aria-label="Close"
          onClick={() => window.history.back()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <ObiCloseGoogle />
        </ObcIconButton>

        <div className={styles.content}>
          <div className={styles.instrument}>
            <ObcPitchRollHeave
              pitch={motion.pitch}
              roll={motion.roll}
              heave={motion.heave}
              minAvgPitch={motion.band.pitch[0]}
              maxAvgPitch={motion.band.pitch[1]}
              minAvgRoll={motion.band.roll[0]}
              maxAvgRoll={motion.band.roll[1]}
              minTrendHeave={motion.band.heave[0]}
              maxTrendHeave={motion.band.heave[1]}
              pitchArcAngle={PITCH_ARC}
              rollArcAngle={ROLL_ARC}
              heaveRange={HEAVE_RANGE}
              zoomToFitArc={false}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div className={styles.readouts}>
            <Readout label="Pitch" unit="DEG" value={motion.pitch} />
            <Readout label="Roll" unit="DEG" value={motion.roll} />
            <Readout label="Heave" unit="m" value={motion.heave} />
          </div>
        </div>

        <div className={styles.footer} onPointerDown={(event) => event.stopPropagation()}>
          {needsPermission ? (
            <ObcButton variant={ButtonVariant.raised} onClick={enable}>
              Use the motion of the phone
            </ObcButton>
          ) : source === "sensors" ? (
            <ObcButton variant={ButtonVariant.flat} onClick={level}>
              Set level
            </ObcButton>
          ) : source === "pointer" ? (
            <p className={styles.hint}>
              {secure ? "No motion sensors found." : "Motion sensors need a secure page."} Drag to tip the vessel, and
              scroll to lift it.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
