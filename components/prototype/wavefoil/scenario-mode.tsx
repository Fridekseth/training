"use client";

/**
 * A scenario from the Scenarios page, played on the ship screen. The screen is
 * framed in teal like the other training modes, and then something happens on
 * it that the learner has to deal with; the steps they should take are listed in
 * the menu from the tab in the corner. Nothing they do reaches the real system.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ObcButton } from "@oicl/openbridge-webcomponents-react/components/button/button";
import { ObcFloatingItem } from "@oicl/openbridge-webcomponents-react/components/floating-item/floating-item";
import { ObcNavigationItem } from "@oicl/openbridge-webcomponents-react/components/navigation-item/navigation-item";
import { ObcSequenceStep } from "@oicl/openbridge-webcomponents-react/components/sequence-step/sequence-step";
import { ObiCautionColorIec } from "@oicl/openbridge-webcomponents-react/icons/icon-caution-color-iec";
import { ObiCautionGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-caution-google";
import { ObiCloseGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-close-google";
import { ObiListAltCheckGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-list-alt-check-google";
import { ObiSupportGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-support-google";
import { ButtonVariant } from "@oicl/openbridge-webcomponents/dist/components/button/button";
import {
  SequenceOrientation,
  SequenceStyle,
  SequenceType,
  SequenceValue,
} from "@oicl/openbridge-webcomponents/dist/components/sequence-step/sequence-step";
import { MaskIcon } from "../pieces";
import type { Conditions } from "./conditions";
import type { Corner } from "./corner-tools";
import type { AppPage } from "./explore-data";
import type { ScenarioDef, ScenarioStepId } from "./scenario-data";
import { TrainingFrame } from "./training-frame";
import { ModeIntro, ModeTab } from "./training-tab";
import tealStyles from "./teal-scope.module.css";
import guided from "./guided.module.css";
import styles from "./scenario.module.css";

/** A little wider than the learning tab, for the scenario's name. */
const TAB_WIDTH = 328;

/** The frame draws itself first, and a beat after it closes the box that announces the scenario appears. */
const FRAME_MS = 1500;
/** How long the sea is calm after the scenario has started, before it turns. */
const CALM_MS = 5000;

const STEP_ICON: Record<ScenarioStepId, ReactNode> = {
  caution: <ObiCautionGoogle />,
  investigate: <ObiSupportGoogle />,
  retract: <ObiCloseGoogle />,
  ack: <ObiListAltCheckGoogle />,
};

/** The caution that floats over the screen, built from the library's floating message with the caution icon. */
function CautionMessage({
  time,
  onAck,
  onOpen,
  onDismiss,
}: {
  time: string;
  onAck: () => void;
  onOpen: () => void;
  onDismiss: () => void;
}) {
  // The library's floating message draws both its buttons alike; the design raises the second.
  const raise = useCallback((item: HTMLElement | null) => {
    const host = item as (HTMLElement & { updateComplete?: Promise<unknown> }) | null;
    if (!host?.updateComplete) return;
    void host.updateComplete.then(() => {
      const buttons = host.shadowRoot?.querySelectorAll<HTMLElement & { variant?: string }>(
        ".action-container obc-button",
      );
      if (buttons && buttons[1]) buttons[1].variant = ButtonVariant.raised;
    });
  }, []);

  return (
    <div className={styles.message}>
      <ObcFloatingItem
        ref={raise}
        hasTimestamp
        hasDay
        action
        action2
        lineType={"multi-line" as never}
        onActionClick={onAck}
        onAction2Click={onOpen}
        onDismissClick={onDismiss}
      >
        <ObiCautionColorIec slot="primary-icon" useCssColor />
        <span slot="title">Caution</span>
        <span slot="description">Retract foils. Current wave conditions are too heavy for foil use.</span>
        <span slot="day">Today</span>
        <span slot="time">{time}</span>
        <span slot="action">ACK</span>
        <span slot="action2">Open decision support</span>
      </ObcFloatingItem>
    </div>
  );
}

function ScenarioMenu({
  scenario,
  done,
  corner,
  onExit,
}: {
  scenario: ScenarioDef;
  done: boolean[];
  corner: Corner;
  onExit: () => void;
}) {
  const current = done.findIndex((item) => !item);
  const last = scenario.steps.length - 1;

  return (
    <div
      className={`${guided.menu} ${styles.menu} ${corner.endsWith("left") ? guided.menuLeft : guided.menuRight} ${
        corner.startsWith("top") ? guided.menuTop : guided.menuBottom
      }`}
    >
      <ObcNavigationItem label={scenario.title} hasIcon>
        <MaskIcon slot="icon" name={scenario.icon} style={{ color: "var(--teal-500)" }} />
      </ObcNavigationItem>
      <div className={guided.cards}>
        {scenario.steps.map((step, at) => (
          <div className={guided.stepRow} key={step.id}>
            <span className={guided.stepNumber}>{at + 1}</span>
            <span className={guided.track}>
              {at > 0 ? (
                <span className={`${guided.line} ${guided.lineUp} ${done[at - 1] ? guided.lineDone : ""}`} />
              ) : null}
              {at < last ? (
                <span className={`${guided.line} ${guided.lineDown} ${done[at] ? guided.lineDone : ""}`} />
              ) : null}
              <ObcSequenceStep
                className={guided.stepDot}
                orientation={SequenceOrientation.vertical}
                type={SequenceType.small}
                styleType={SequenceStyle.point}
                value={
                  done[at] ? SequenceValue.completed : at === current ? SequenceValue.active : SequenceValue.notStarted
                }
                showStepInputConnector={false}
                showStepOutputConnector={false}
              />
            </span>
            <div className={guided.stepCardWrap}>
              <div className={`${styles.card} ${done[at] ? styles.cardDone : ""}`}>
                {STEP_ICON[step.id]}
                {step.label}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ObcButton className={guided.exit} variant={ButtonVariant.raised} fullWidth showTrailingIcon onClick={onExit}>
        Exit training mode
        <ObiCloseGoogle slot="trailing-icon" />
      </ObcButton>
    </div>
  );
}

const clock = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export function ScenarioMode({
  scenario,
  page,
  deployment,
  moving,
  bellPresses,
  onConditions,
  onAlerts,
  onOpenPage,
  onExit,
  onFinish,
}: {
  scenario: ScenarioDef;
  /** The page the learner is on, which the investigation step watches. */
  page: AppPage;
  /** How far out the foils are, which the retract step watches. */
  deployment: number;
  moving: "deploy" | "retract" | null;
  /** How many times the alert button has been pressed, to bring the caution back after it was dismissed. */
  bellPresses: number;
  /** Sets the sea the decision support page reads while the scenario runs; null gives it back. */
  onConditions: (conditions: Conditions | null) => void;
  /** Tells the top bar how many cautions wait. */
  onAlerts: (count: number) => void;
  onOpenPage: (page: AppPage) => void;
  onExit: () => void;
  /** Leaves the scenario having been through it, with the share of the steps done right. */
  onFinish: (result: number) => void;
}) {
  const [phase, setPhase] = useState<"frame" | "intro" | "running">("frame");
  const [corner, setCorner] = useState<Corner>("bottom-left");
  /** The steps are shown by themselves while the tab has its words, and stay open only if the learner opened them. */
  const [menu, setMenu] = useState<"closed" | "auto" | "open">("closed");
  const layer = useRef<HTMLDivElement>(null);

  // The sea turns after a while, and the caution comes up with it.
  const [turned, setTurned] = useState(false);
  const [time, setTime] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);

  // What the learner has done, and in what order.
  const [investigated, setInvestigated] = useState(false);
  const [retractStart, setRetractStart] = useState<"after" | "before" | null>(null);
  const [retracted, setRetracted] = useState(false);
  const [acked, setAcked] = useState<"after" | "early" | null>(null);

  useEffect(() => {
    const intro = window.setTimeout(() => setPhase((now) => (now === "frame" ? "intro" : now)), FRAME_MS);
    return () => window.clearTimeout(intro);
  }, []);
  const settled = useCallback(() => {
    setPhase("running");
    setMenu("auto");
  }, []);

  useEffect(() => {
    if (phase !== "running") return;
    const turn = window.setTimeout(() => {
      setTime(clock());
      setTurned(true);
      setMessageOpen(true);
    }, CALM_MS);
    return () => window.clearTimeout(turn);
  }, [phase]);

  // The decision support page reads the sea the scenario has, and the top bar the cautions that wait.
  useEffect(() => {
    onConditions(turned ? "harmful" : "ideal");
  }, [turned, onConditions]);
  useEffect(() => () => onConditions(null), [onConditions]);
  const waiting = turned && acked === null ? 1 : 0;
  useEffect(() => {
    onAlerts(waiting);
  }, [waiting, onAlerts]);
  useEffect(() => () => onAlerts(0), [onAlerts]);

  // Pressing the alert button brings the caution back, if it is still waiting.
  const [seenPresses, setSeenPresses] = useState(bellPresses);
  if (bellPresses !== seenPresses) {
    setSeenPresses(bellPresses);
    if (waiting) setMessageOpen(true);
  }

  // Looking into the decision support page is the second step.
  if (turned && page === "decision" && !investigated) setInvestigated(true);

  // The foils going in is the third, and it counts as in order if the learner had been to decision support first.
  if (turned && moving === "retract" && retractStart === null) setRetractStart(investigated ? "after" : "before");
  if (turned && !retracted && deployment <= 0 && moving === null) setRetracted(true);

  const ack = () => {
    setAcked(retracted ? "after" : "early");
    setMessageOpen(false);
  };

  // With the foils in and the caution acknowledged, the scenario is over, and the steps done in the right order are its result.
  const result =
    retracted && acked !== null
      ? Math.round(([true, retractStart === "after", retracted, acked === "after"].filter(Boolean).length / 4) * 100)
      : null;

  const done = [turned, investigated, retracted, acked !== null];
  const started = phase === "running";

  return (
    <>
      <div className={`${tealStyles.teal} ${guided.layer}`} ref={layer}>
        <TrainingFrame />

        {/* The screen takes on the wash while the scenario announces itself, and is clear once it runs. */}
        {phase !== "running" ? <div className={guided.wash} style={{ inset: 0 }} /> : null}

        {phase === "intro" ? (
          <ModeIntro
            corner={corner}
            icon="wf-menu-training"
            title="Practice started"
            subtitle={scenario.title}
            label="Practice"
            rest={scenario.title}
            width={TAB_WIDTH}
            onSettled={settled}
          />
        ) : null}

        {started ? (
          <ModeTab
            corner={corner}
            onCorner={setCorner}
            layer={layer}
            icon="wf-menu-training"
            label="Practice"
            rest={scenario.title}
            width={TAB_WIDTH}
            open={menu !== "closed"}
            // The steps go away with the tab's words, unless the learner has opened them.
            onFold={() => setMenu((now) => (now === "auto" ? "closed" : now))}
            onToggle={() => setMenu((now) => (now === "closed" ? "open" : "closed"))}
          />
        ) : null}

        {menu === "open" ? <div className={guided.menuScrim} onClick={() => setMenu("closed")} aria-hidden="true" /> : null}
        {menu !== "closed" ? <ScenarioMenu scenario={scenario} done={done} corner={corner} onExit={onExit} /> : null}

        {result !== null ? (
          <div className={styles.result} role="status">
            <p className={styles.resultTitle}>Practice completed</p>
            <p className={styles.resultText}>
              {scenario.title}: {result}% of the steps were done in the right order.
            </p>
            <ObcButton className={styles.resultAction} variant={ButtonVariant.raised} onClick={() => onFinish(result)}>
              Back to scenarios
            </ObcButton>
          </div>
        ) : null}
      </div>

      {/* The caution is drawn outside the teal, as the system draws it. */}
      <div className={guided.layer} style={{ zIndex: 29, cursor: "auto" }}>
        {messageOpen && waiting ? (
          <CautionMessage
            time={time}
            onAck={ack}
            onOpen={() => onOpenPage("decision")}
            onDismiss={() => setMessageOpen(false)}
          />
        ) : null}
      </div>
    </>
  );
}
