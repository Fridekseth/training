"use client";

/**
 * Wavefoil overview: the screen that deploys and retracts the bow foils on a
 * ship. Both states of the design are here, and the buttons move between them.
 */

import { useEffect, useRef, useState } from "react";
import "@oicl/openbridge-webcomponents/dist/openbridge.css";
import { ObcIconButton } from "@oicl/openbridge-webcomponents-react/components/icon-button/icon-button";
import { IconButtonVariant } from "@oicl/openbridge-webcomponents/dist/components/icon-button/icon-button";
import { ObiChevronRightGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-chevron-right-google";
import { ObcReadout } from "@oicl/openbridge-webcomponents-react/navigation-instruments/readout/readout";
import {
  ObcTextboxFontWeight,
  ReadoutSize,
  ReadoutValueType,
} from "@oicl/openbridge-webcomponents/dist/navigation-instruments/readout/readout";
import { Priority } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/types";
import { WavefoilMenu } from "./app-menu";
import { DEPLOY_SECONDS, DeployedDialog, DeployingDialog } from "./deploy-dialog";
import { WavefoilTopBar } from "./top-bar";
import { TrainingSection } from "./training-section";
import { WaveChart } from "./wave-chart";
import styles from "./wavefoil.module.css";

/**
 * The control icons take their colour from the button state, so a disabled
 * control reads as disabled. Slotted content cannot inherit the component's
 * own colour, so the shape is drawn as a mask over `currentColor`.
 */
function ControlIcon({ name }: { name: string }) {
  const url = `url(/prototype/wavefoil/${name}.svg)`;
  return (
    <span
      aria-hidden="true"
      style={{
        display: "block",
        width: 24,
        height: 24,
        backgroundColor: "currentColor",
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}

function Art({
  name,
  width,
  height,
  mirrored = false,
}: {
  name: string;
  width: number;
  height: number;
  /** The foils on the two sides are one drawing, flipped. */
  mirrored?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      src={`/prototype/wavefoil/${name}.svg`}
      width={width}
      height={height}
      style={{
        width,
        height,
        display: "block",
        transform: mirrored ? "scaleX(-1)" : undefined,
      }}
    />
  );
}

function Heading({
  label,
  linked = false,
}: {
  label: string;
  linked?: boolean;
}) {
  if (!linked) return <p className={styles.panelHeading}>{label}</p>;
  return (
    <p className={styles.panelHeading}>
      <button type="button" className={styles.panelLink}>
        {label}
        <ObiChevronRightGoogle style={{ width: 16, height: 16 }} />
      </button>
    </p>
  );
}

function FoilButton({
  icon,
  label,
  disabled,
  onClick,
}: {
  icon: string;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <ObcIconButton
      className={`${styles.foilButton} ${disabled ? styles.foilButtonDisabled : ""}`}
      variant={IconButtonVariant.normal}
      hasLabel
      disabled={disabled}
      onClick={onClick}
      style={{
        color: disabled
          ? "var(--on-raised-disabled-color, #bebebe)"
          : "var(--on-normal-active-color, #1f1f1f)",
      }}
    >
      <ControlIcon name={icon} />
      <span slot="label">{label}</span>
    </ObcIconButton>
  );
}

/**
 * The engine load bar, exported from the design file as SVG rather than built
 * from the library. The two states are two drawings, so the card still changes
 * when the foils move.
 */
function PowerBar({ deployed, dark }: { deployed: boolean; dark: string }) {
  return (
    <span className={styles.powerBar}>
      <Art
        name={`bar-${deployed ? "deployed" : "retracted"}${dark}`}
        width={352}
        height={52}
      />
    </span>
  );
}

/** The figures are set bold; the label and unit stay at the default weight. */
const READOUT_VALUE = { weight: ObcTextboxFontWeight.bold };

/**
 * The readout from the library, in the medium size the design asks for. The
 * value is a range rather than a number, so it goes in as text. Deployed, the
 * figure is a live recommendation and takes the enhanced colour; stowed, it is
 * only what the foils could give, so it drops back to regular.
 */
function Readout({
  label,
  range,
  unit,
  dimmed,
}: {
  label: string;
  range: string;
  unit: string;
  dimmed: boolean;
}) {
  return (
    <ObcReadout
      size={ReadoutSize.medium}
      priority={dimmed ? Priority.regular : Priority.enhanced}
      value={range}
      valueType={ReadoutValueType.text}
      valueOptions={READOUT_VALUE}
      label={label}
      unit={unit}
    />
  );
}

/** How long the deploy sequence runs; the dialog counts down the same time. */
const RUN_MS = DEPLOY_SECONDS * 1000;
/** How long the confirmation stays up before the overview comes back. */
const CONFIRM_MS = 4000;

export function WavefoilApp({
  palette,
  onDim,
}: {
  palette: string;
  onDim: () => void;
}) {
  /**
   * The drawings carry their colours, so each one has a dusk version. The sea
   * is a wash of blue over the card and needs neither.
   */
  const dark = palette !== "day" ? "-dusk" : "";
  // The state can be linked to, so either one can be shown straight away.
  const [deployed, setDeployed] = useState(
    () => !globalThis.location?.hash.includes("foils-retracted"),
  );
  const state = deployed ? "deployed" : "retracted";
  /** The overview, or the training section the menu leads to. */
  const [layer, setLayer] = useState<"app" | "training">("app");
  const [menuOpen, setMenuOpen] = useState(false);
  /** idle, the foils travelling out, or the confirmation that they are out. */
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const started = useRef(0);

  useEffect(() => {
    if (phase !== "running") return;
    started.current = Date.now();
    const tick = setInterval(() => {
      const ran = Math.min(1, (Date.now() - started.current) / RUN_MS);
      setProgress(ran);
      if (ran === 1) {
        setDeployed(true);
        setPhase("done");
      }
    }, 100);
    return () => clearInterval(tick);
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;
    const close = setTimeout(() => setPhase("idle"), CONFIRM_MS);
    return () => clearTimeout(close);
  }, [phase]);

  const cancel = () => {
    setPhase("idle");
    setProgress(0);
  };

  return (
    <div className={styles.screen}>
      <WavefoilTopBar
        pageName={layer === "training" ? "Training" : "Overview"}
        training={layer === "training"}
        palette={palette}
        onDim={onDim}
        menuOpen={menuOpen}
        onMenu={() => setMenuOpen((open) => !open)}
      />

      {layer === "training" ? <TrainingSection /> : null}

      {layer === "app" ? (
      <div className={styles.body}>
        <div className={`${styles.column} ${styles.left}`}>
          <section className={`${styles.panel} ${styles.overview}`}>
            <Heading label="Foil overview" />
            <div>
              <div className={styles.vessel}>
                <Art name={`vessel-${state}${dark}`} width={182} height={241} />
              </div>

              <div
                className={`${styles.foils} ${deployed ? "" : styles.foilsRetracted}`}
              >
                {deployed ? (
                  <>
                    <Art name={`foil-left-deployed${dark}`} width={71} height={39} />
                    <Art
                      name={`foil-left-deployed${dark}`}
                      width={71}
                      height={39}
                      mirrored
                    />
                  </>
                ) : (
                  <>
                    <Art name={`foil-left-retracted${dark}`} width={22} height={33} />
                    <Art
                      name={`foil-left-retracted${dark}`}
                      width={22}
                      height={33}
                      mirrored
                    />
                  </>
                )}
              </div>

              {/* Drawn over the vessel, so the hull shows through the water. */}
              <div className={styles.sea}>
                <div
                  className={`${styles.seaLine} ${deployed ? "" : styles.seaLineRetracted}`}
                >
                  <Art name={`sea-${state}`} width={621} height={243.5} />
                </div>
              </div>
            </div>
            <p
              className={`${styles.stateLabel} ${deployed ? styles.stateLabelDeployed : ""}`}
            >
              Wavefoil {state}
            </p>
          </section>

          <section className={`${styles.panel} ${styles.controls}`}>
            <Heading label="Foil controls" />
            <div className={styles.controlRow}>
              <FoilButton
                icon="icon-retract"
                label="Retract foils"
                disabled={!deployed}
                onClick={() => setDeployed(false)}
              />
              <FoilButton
                icon="icon-deploy"
                label="Deploy foils"
                disabled={deployed}
                onClick={() => {
                  setProgress(0);
                  setPhase("running");
                }}
              />
            </div>
          </section>
        </div>

        <div className={`${styles.column} ${styles.right}`}>
          <section className={`${styles.panel} ${styles.chart}`}>
            <Heading label="Wave conditions and operating window" linked />
            <div className={styles.chartArea}>
              <WaveChart inWindow={deployed} palette={palette} />
            </div>
          </section>

          <section className={`${styles.panel} ${styles.power}`}>
            <Heading label="Engine power decision support" linked/>
            <p className={styles.powerLabel}>% MCR</p>
            <PowerBar deployed={deployed} dark={dark}/>
            <div className={styles.readouts}>
              <Readout
                  label="Potential fuel saving"
                  range="12-15"
                  unit="%"
                  dimmed={!deployed}
              />
              <Readout
                  label="Potential motion dampening"
                  range="40-44"
                  unit="%"
                  dimmed={!deployed}
              />
            </div>
          </section>
        </div>
      </div>

      ) : null}

      {menuOpen ? (
        <WavefoilMenu
          inTraining={layer === "training"}
          onOverview={() => {
            setLayer("app");
            setMenuOpen(false);
          }}
          onTraining={() => {
            setLayer("training");
            setMenuOpen(false);
          }}
          onClose={() => setMenuOpen(false)}
        />
      ) : null}

      {phase === "running" ? (
        <DeployingDialog progress={progress} onCancel={cancel} />
      ) : null}
      {phase === "done" ? (
        <DeployedDialog onClose={() => setPhase("idle")} />
      ) : null}
    </div>
  );
}
