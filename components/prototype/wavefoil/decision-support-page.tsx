"use client";

/**
 * Decision support: what the sea is doing against the window the foils work
 * in, what the engine could save, and how the vessel is moving.
 */

import type { ReactNode } from "react";
import { ObcBarHorizontal } from "@oicl/openbridge-webcomponents-react/building-blocks/bar-horizontal/bar-horizontal";
import { ObcReadout } from "@oicl/openbridge-webcomponents-react/navigation-instruments/readout/readout";
import { PitchHeave } from "./pitch-heave";
import { ObiWave } from "@oicl/openbridge-webcomponents-react/icons/icon-wave";
import { ObiEnergyFuel } from "@oicl/openbridge-webcomponents-react/icons/icon-energy-fuel";
import { ObiPitch } from "@oicl/openbridge-webcomponents-react/icons/icon-pitch";
import { AdvicePosition, ExternalScaleSide, FillMode } from "@oicl/openbridge-webcomponents/dist/building-blocks/external-scale/external-scale";
import { AdviceType } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/watch/advice";
import {
  ReadoutSize,
  ReadoutValueType,
} from "@oicl/openbridge-webcomponents/dist/navigation-instruments/readout/readout";
import type { VesselImage } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/watch/vessel";
import { Priority } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/types";
import { useWavePalette, WaveChart } from "./wave-chart";
import styles from "./pages.module.css";

/** The highlighted note under an instrument: an icon, a headline and a line of explanation. */
function AdviceBox({
  deployed,
  icon,
  title,
  line,
  style,
}: {
  deployed: boolean;
  icon: ReactNode;
  title: string;
  line: string;
  style: React.CSSProperties;
}) {
  return (
    <div
      className={`${styles.adviceBox} ${deployed ? "" : styles.adviceBoxStowed}`}
      style={style}
    >
      {icon}
      <div className={styles.adviceText}>
        <span className={styles.adviceTitle}>{title}</span>
        <span className={styles.adviceLine}>{line}</span>
      </div>
    </div>
  );
}

function Value({
  label,
  unit,
  value,
  priority = Priority.regular,
  size = ReadoutSize.medium,
}: {
  size?: ReadoutSize;
  label: string;
  unit: string;
  value: string;
  priority?: Priority;
}) {
  return (
    <ObcReadout
      size={size}
      priority={priority}
      valueType={ReadoutValueType.text}
      label={label}
      unit={unit}
      value={value}
    />
  );
}

/** The accent colour is for foils that are out; with them stowed the page reads grey. */
export function DecisionSupportPage({
  palette,
  deployed,
}: {
  palette: string;
  deployed: boolean;
}) {
  const colour = useWavePalette(deployed, palette);

  return (
    <div className={styles.page}>
      <section
        className={styles.card}
        style={{ left: 4, top: 4, width: 403, height: 534 }}
        data-comment="Wave conditions"
      >
        <p className={styles.cardTitle}>Waves condition and operating window</p>
        <WaveChart inWindow={deployed} palette={palette} />

        <ul className={styles.legend} style={{ left: 29, top: 277 }}>
          <li>
            <span className={styles.legendLine} style={{ color: colour.measured }} />
            Actual
          </li>
          <li>
            <span className={styles.legendDots} style={{ color: colour.estimated }} />
            Estimated
          </li>
          <li>
            <span
              className={styles.legendBox}
              style={{ background: colour.chip, borderColor: colour.chipEdge }}
            />
            Foil window
          </li>
        </ul>
        <div className={styles.readoutRow} style={{ left: 155, top: 289 }}>
          <Value label="Actual Hs" unit="m" value="2,8" priority={deployed ? Priority.enhanced : Priority.regular} />
          <Value label="Forecasted Hs" unit="m" value="3,9" />
        </div>

        <AdviceBox
          deployed={deployed}
          icon={<ObiWave />}
          title="Ideal wave conditions"
          line="Wave conditions are within foil operating range"
          style={{ left: 29, top: 373, width: 344, height: 59 }}
        />
      </section>

      <section
        className={styles.card}
        style={{ left: 411, top: 4, width: 370, height: 217 }}
        data-comment="Engine power"
      >
        <p className={styles.cardTitle}>Engine power</p>
        <p className={styles.barLabel} style={{ left: 27, top: 39 }}>% MCR</p>
        <ObcBarHorizontal
          className={styles.at}
          style={{ left: 27, top: 64 }}
          width={320}
          minValue={0}
          maxValue={100}
          value={60}
          fillMode={FillMode.tint}
          advicePosition={AdvicePosition.center}
          barThickness={24}
          hasBar
          hasScale
          scaleBackground={false}
          showLabels
          tickThickness={12}
          labelThickness={20}
          primaryTickmarkInterval={25}
          secondaryTickmarkInterval={5}
          side={ExternalScaleSide.bottom}
          advices={[
            { min: 46, max: 58, type: AdviceType.advice, hinted: false },
            { min: 78, max: 97, type: AdviceType.caution, hinted: true },
          ]}
        />
        <AdviceBox
          deployed={deployed}
          icon={<ObiEnergyFuel />}
          title="12-15%"
          line="Potential fuel saving with Wavefoil."
          style={{ left: 25, top: 137, width: 320, height: 56 }}
        />
      </section>

      <section
        className={styles.card}
        style={{ left: 411, top: 225, width: 370, height: 313 }}
        data-comment="Vessel motion"
      >
        <p className={styles.cardTitle}>Vessel motion</p>
        {/* The design's instrument: pitch and heave, with an unbroken ring. */}
        <div className={styles.dial} style={{ left: 36, top: 41 }}>
          {/* The ring is drawn here, whole, underneath the instrument. */}
          <svg className={styles.dialRing} viewBox="-100 -100 200 200" aria-hidden="true">
            <circle r="92" />
          </svg>
          <PitchHeave
            pitch={1.67}
            roll={0}
            heave={0.73}
            // No vessel drawing: the readouts take its place.
            vesselImageSide={"none" as VesselImage}
            vesselImageFore={"none" as VesselImage}
            style={{ width: 172, height: 172 }}
          />
          <div className={styles.dialReadouts}>
            <Value
              label="Pitch"
              unit="DEG"
              value="1,67"
              priority={deployed ? Priority.enhanced : Priority.regular}
              size={ReadoutSize.small}
            />
            <span className={styles.dialLine} />
            <Value
              label="Heave"
              unit="m"
              value="0,73"
              priority={deployed ? Priority.enhanced : Priority.regular}
              size={ReadoutSize.small}
            />
          </div>
        </div>
        <div className={styles.motionReadouts} style={{ left: 237, top: 41, width: 90 }}>
          <Value label="Draft fwd" unit="m" value="12" />
          <Value label="Draft aft" unit="m" value="10" />
          <Value label="Trim" unit="m" value="10" />
        </div>
        <AdviceBox
          deployed={deployed}
          icon={<ObiPitch />}
          title="40-44%"
          line="Potential motion dampening with Wavefoil."
          style={{ left: 25, top: 231, width: 320, height: 56 }}
        />
      </section>
    </div>
  );
}
