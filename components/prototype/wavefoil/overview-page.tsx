"use client";

/**
 * The overview: how far out each foil is, the vessel from above, the main
 * motor and the controls for the foils.
 */

import { ObcBarVertical } from "@oicl/openbridge-webcomponents-react/building-blocks/bar-vertical/bar-vertical";
import { ObcIconButton } from "@oicl/openbridge-webcomponents-react/components/icon-button/icon-button";
import { ObcReadout } from "@oicl/openbridge-webcomponents-react/navigation-instruments/readout/readout";
import { ExternalScaleSide, FillMode } from "@oicl/openbridge-webcomponents/dist/building-blocks/external-scale/external-scale";
import { IconButtonVariant } from "@oicl/openbridge-webcomponents/dist/components/icon-button/icon-button";
import { Priority } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/types";
import { ReadoutSize } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/readout/readout";
import { ObiCloseGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-close-google";
import { VesselTop } from "./vessel-top";
import styles from "./pages.module.css";

export type Moving = "deploy" | "retract" | null;

function ControlIcon({ name }: { name: string }) {
  const url = `url(/prototype/wavefoil/${name}.svg)`;
  return (
    <span
      aria-hidden="true"
      className={styles.controlIcon}
      style={{ maskImage: url, WebkitMaskImage: url }}
    />
  );
}

/** One foil's position, 100 at the top with the foil fully deployed and 0 at the bottom with it retracted. */
function FoilBar({
  side,
  deployment,
  left,
}: {
  side: "port" | "stbd";
  deployment: number;
  left: number;
}) {
  return (
    <ObcBarVertical
      className={styles.at}
      style={{ left, top: 147 }}
      height={210}
      paddingTop={8}
      paddingBottom={8}
      barThickness={20}
      fillMode={FillMode.tint}
      minValue={0}
      maxValue={100}
      value={deployment}
      side={side === "port" ? ExternalScaleSide.left : ExternalScaleSide.right}
      hasBar
      hasScale
      showLabels
      scaleBackground={false}
      primaryTickmarkInterval={50}
      secondaryTickmarkInterval={10}
      // The accent colour is for foils that are out.
      priority={deployment > 0 ? Priority.enhanced : Priority.regular}
    />
  );
}

function MotorReadout({
  label,
  unit,
  value,
  digits = 1,
}: {
  label: string;
  unit?: string;
  value: number;
  digits?: number;
}) {
  return (
    <ObcReadout
      size={ReadoutSize.small}
      priority={Priority.regular}
      label={label}
      unit={unit}
      value={value}
      fractionDigits={digits}
    />
  );
}

export function OverviewPage({
  deployment,
  moving,
  dusk,
  onDeploy,
  onRetract,
  onStop,
}: {
  deployment: number;
  moving: Moving;
  dusk: boolean;
  onDeploy: () => void;
  onRetract: () => void;
  onStop: () => void;
}) {
  const out = deployment >= 100;
  const away = deployment <= 0;

  return (
    <div className={styles.page}>
      <section
        className={styles.card}
        style={{ left: 4, top: 4, width: 593, height: 427 }}
        data-comment="Overview"
      >
        <p className={styles.cardTitle}>Overview</p>

        <p className={styles.sideLabel} style={{ left: 0, top: 83, textAlign: "right" }}>
          PORT
        </p>
        <p className={styles.end} style={{ left: 26, top: 130 }}>Deployed</p>
        <FoilBar side="port" deployment={deployment} left={17} />
        <p className={styles.end} style={{ left: 26, top: 357 }}>Retracted</p>

        <div className={styles.at} style={{ left: 105, top: 98 }}>
          <VesselTop deployment={deployment} dusk={dusk} />
        </div>

        <p className={styles.sideLabel} style={{ left: 477, top: 83 }}>STBD</p>
        <p className={styles.end} style={{ left: 459, top: 130 }}>Deployed</p>
        <FoilBar side="stbd" deployment={deployment} left={477} />
        <p className={styles.end} style={{ left: 459, top: 357 }}>Retracted</p>
      </section>

      <section
        className={styles.card}
        style={{ left: 4, top: 436, width: 593, height: 101 }}
        data-comment="Main motor"
      >
        <p className={styles.cardTitle}>Main motor</p>
        <div className={styles.readoutRow} style={{ left: 134 }}>
          <MotorReadout label="Torque" unit="%" value={0} />
          <MotorReadout label="Speed" unit="rpm" value={0} />
          <MotorReadout label="Delta" value={0} />
          <MotorReadout label="Position" value={36642} digits={0} />
        </div>
      </section>

      <section
        className={styles.card}
        style={{ left: 602, top: 4, width: 181, height: 533 }}
        data-comment="Foil controls"
      >
        <p className={styles.cardTitle}>Foil controls</p>
        <ObcIconButton
          className={`${styles.controls} ${out || moving === "deploy" ? styles.controlsDisabled : ""}`}
          style={{ top: 119 }}
          variant={IconButtonVariant.normal}
          hasLabel
          disabled={out || moving === "deploy"}
          onClick={onDeploy}
        >
          <ControlIcon name="icon-foils-deploy" />
          <span slot="label">Deploy foils</span>
        </ObcIconButton>
        <ObcIconButton
          className={`${styles.controls} ${away || moving === "retract" ? styles.controlsDisabled : ""}`}
          style={{ top: 249 }}
          variant={IconButtonVariant.normal}
          hasLabel
          disabled={away || moving === "retract"}
          onClick={onRetract}
        >
          <ControlIcon name="icon-foils-retract" />
          <span slot="label">Retract foils</span>
        </ObcIconButton>
        <ObcIconButton
          className={styles.controls}
          style={{ top: 379 }}
          variant={IconButtonVariant.normal}
          hasLabel
          onClick={onStop}
        >
          <ObiCloseGoogle />
          <span slot="label">Stop</span>
        </ObcIconButton>
      </section>
    </div>
  );
}
