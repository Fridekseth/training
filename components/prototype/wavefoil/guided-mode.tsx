"use client";

/**
 * A guided sequence from Getting started, run on the ship screen. The screen is
 * framed in teal and washed, except for the part of it a step explains; the
 * explanation sits beside that part. The steps are listed in a menu that opens
 * from the corner row, and the sequence can be left from there at any time.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ObcButton } from "@oicl/openbridge-webcomponents-react/components/button/button";
import { ObcIconButton } from "@oicl/openbridge-webcomponents-react/components/icon-button/icon-button";
import { ObcNavigationItem } from "@oicl/openbridge-webcomponents-react/components/navigation-item/navigation-item";
import { ObcSequenceStep } from "@oicl/openbridge-webcomponents-react/components/sequence-step/sequence-step";
import { ObcCircularProgress } from "@oicl/openbridge-webcomponents-react/building-blocks/circular-progress/circular-progress";
import { CircularProgressMode } from "@oicl/openbridge-webcomponents/dist/building-blocks/circular-progress/circular-progress";
import { ObcSequenceLoadingSpinner } from "@oicl/openbridge-webcomponents-react/components/sequence-loading-spinner/sequence-loading-spinner";
import { ObiChevronLeftGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-chevron-left-google";
import { ObiChevronRightGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-chevron-right-google";
import { ObiCloseGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-close-google";
import { ButtonVariant } from "@oicl/openbridge-webcomponents/dist/components/button/button";
import { IconButtonVariant } from "@oicl/openbridge-webcomponents/dist/components/icon-button/icon-button";
import {
  SequenceLoadingSpinnerProgressionType,
  SequenceLoadingSpinnerType,
} from "@oicl/openbridge-webcomponents/dist/components/sequence-loading-spinner/sequence-loading-spinner";
import {
  SequenceOrientation,
  SequenceStyle,
  SequenceType,
  SequenceValue,
} from "@oicl/openbridge-webcomponents/dist/components/sequence-step/sequence-step";
import { MaskIcon } from "../pieces";
import { WavefoilMenu } from "./app-menu";
import { CornerTools, SCREEN, ToolButton, type Corner } from "./corner-tools";
import type { GuidedSequence, GuidedStep, TestQuestion, TestResult } from "./guided-data";
import { TestModal } from "./test-modal";
import { TrainingFrame } from "./training-frame";
import tealStyles from "./teal-scope.module.css";
import styles from "./guided.module.css";

const noop = () => {};
const NO_QUESTIONS: TestQuestion[] = [];

/** The frame draws itself first, and a beat after it closes the toast says the sequence is starting. */
const FRAME_MS = 1500;
/** How long the toast stays before the first step. */
const STARTING_MS = 2600;

/** The row in the corner: the handle and the one button that opens the step menu. */
const ROW_WIDTH = 85;

/** The arrow's own size, which the pointer is centred on the part it explains by. */
const ARROW = { long: 20, short: 12 };

function Toast({
  icon,
  title,
  subtitle,
  remaining,
  at,
  onMove,
  layer,
  onCancel,
}: {
  icon?: string;
  title: string;
  /** A second line under the title; a scenario has none. */
  subtitle?: string;
  /** The share of a scenario's time that is left; the ring around the button runs down with it instead of turning. */
  remaining?: number;
  /** Where the toast stands, when it can be moved; a toast with a place has a handle to move it by. */
  at?: { left: number; top: number };
  onMove?: (at: { left: number; top: number }) => void;
  /** The layer it stands in, measured for the screen's scale while it is dragged. */
  layer?: React.RefObject<HTMLDivElement | null>;
  onCancel: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const grab = useRef<{ x: number; y: number; left: number; top: number; scale: number } | null>(null);

  const place = (left: number, top: number) => {
    const width = box.current?.offsetWidth ?? 480;
    const height = box.current?.offsetHeight ?? 64;
    onMove?.({
      left: Math.min(SCREEN.width - width, Math.max(0, left)),
      top: Math.min(SCREEN.height - height, Math.max(0, top)),
    });
  };

  const start = (event: React.PointerEvent<HTMLButtonElement>) => {
    const frame = layer?.current?.getBoundingClientRect();
    if (!frame || !at) return;
    grab.current = {
      x: event.clientX,
      y: event.clientY,
      left: at.left,
      top: at.top,
      scale: frame.width / SCREEN.width,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const move = (event: React.PointerEvent<HTMLButtonElement>) => {
    const from = grab.current;
    if (!from) return;
    place(from.left + (event.clientX - from.x) / from.scale, from.top + (event.clientY - from.y) / from.scale);
  };

  // Without a pointer, the arrow keys move it.
  const nudge = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!at) return;
    const by = { ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16], ArrowDown: [0, 16] }[event.key];
    if (!by) return;
    event.preventDefault();
    place(at.left + by[0], at.top + by[1]);
  };

  return (
    <div className={styles.toast} role="status" ref={box} style={at ? { left: at.left, top: at.top } : undefined}>
      {at ? (
        <>
          <button
            type="button"
            className={styles.toastGrip}
            aria-label="Move the task. Drag, or use the arrow keys."
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={() => (grab.current = null)}
            onPointerCancel={() => (grab.current = null)}
            onKeyDown={nudge}
          >
            <svg width="12" height="18" viewBox="0 0 12 18" aria-hidden="true">
              {[0, 1, 2].flatMap((row) =>
                [0, 1].map((col) => (
                  <circle key={`${row}${col}`} cx={3 + col * 6} cy={3 + row * 6} r="1.6" fill="currentColor" />
                )),
              )}
            </svg>
          </button>
          <span className={styles.toastDivider} aria-hidden="true" />
        </>
      ) : icon ? (
        <MaskIcon name={icon} size={32} style={{ color: "var(--element-neutral-color, #535353)" }} />
      ) : null}
      <div className={styles.toastText}>
        <p className={styles.toastTitle}>{title}</p>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <div className={styles.toastCancel}>
        <ObcIconButton variant={IconButtonVariant.flat} aria-label="Cancel" onClick={onCancel}>
          <ObiCloseGoogle />
        </ObcIconButton>
        {remaining === undefined ? (
          // A ring that turns around the button while the sequence starts.
          <ObcSequenceLoadingSpinner
            className={styles.spinner}
            type={SequenceLoadingSpinnerType.buttonPoint}
            progression={SequenceLoadingSpinnerProgressionType.scanning}
          />
        ) : (
          // The time left to do the task, running down.
          <span className={styles.countdown}>
            <ObcCircularProgress
              mode={CircularProgressMode.determinate}
              value={remaining}
              strokeWidth={3}
              style={{ width: 48, height: 48 }}
            />
          </span>
        )}
      </div>
    </div>
  );
}

function Tip({
  step,
  index,
  last,
  onPrevious,
  onNext,
  onFinish,
}: {
  step: GuidedStep;
  index: number;
  last: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  const { tip, hole, arrow } = step;

  // Explanations hung from the bottom are placed by their top too, so every one
  // moves on the same property and the box glides from one step to the next.
  const box = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    const element = box.current;
    if (!element) return;
    setHeight(element.offsetHeight);
    // The words change with the step, and wrap differently at another width, so the height is followed rather than read once.
    const observer = new ResizeObserver(() => setHeight(element.offsetHeight));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const top = tip.top ?? SCREEN.height - (tip.bottom ?? 0) - height;

  // The pointer is centred on the part being explained, along the side it sits on.
  let pointer: React.CSSProperties | undefined;
  if (hole && arrow) {
    const vertical = arrow === "left" || arrow === "right";
    const at = vertical
      ? hole.top + hole.height / 2 - (tip.top ?? 0) - ARROW.long / 2
      : hole.left + hole.width / 2 - tip.left - ARROW.long / 2;
    pointer = vertical ? { top: at } : { left: at };
  }

  return (
    <div
      ref={box}
      className={`${styles.tip} ${tip.width < 300 ? styles.tipNarrow : ""}`}
      style={{ left: tip.left, top, width: tip.width }}
    >
      <p className={styles.tipHeader} key={`header-${index}`}>
        <MaskIcon name="wf-menu-training" style={{ color: "#fff" }} />
        {step.label}
      </p>
      <div className={styles.tipBody} key={`body-${index}`}>
        <p className={styles.tipText}>{step.text}</p>
        <div className={styles.tipActions}>
          <ObcButton
            className={styles.tipButton}
            variant={ButtonVariant.normal}
            fullWidth
            showLeadingIcon
            disabled={index === 0}
            onClick={onPrevious}
          >
            <ObiChevronLeftGoogle slot="leading-icon" />
            Previous
          </ObcButton>
          <ObcButton
            className={`${styles.tipButton} ${styles.tipNext}`}
            variant={ButtonVariant.raised}
            fullWidth
            showTrailingIcon={!last}
            onClick={last ? onFinish : onNext}
          >
            {last ? "Finish" : "Next"}
            {last ? null : <ObiChevronRightGoogle slot="trailing-icon" />}
          </ObcButton>
        </div>
      </div>
      {arrow ? (
        <span key={`arrow-${index}`} className={`${styles.arrow} ${styles[`arrow_${arrow}`]}`} style={pointer} />
      ) : null}
    </div>
  );
}

/** How many rows the menu has room for under its heading. */
const MENU_ROWS = 7;

/**
 * Which steps the menu draws, and how. Every step from the current one on is
 * always listed. When the whole list does not fit, the steps nearest the end
 * are packed into a stack in front of the last, as the design does; only when
 * the current step is so far on that there is nothing left to pack are the
 * oldest steps left off the top.
 */
function menuLayout(count: number, current: number) {
  const need = Math.max(0, count - MENU_ROWS);
  // The steps after the current one and before the last can be packed.
  const packable = Math.max(0, count - 2 - current);
  const packed = need > 0 && packable >= need + 1 ? need + 1 : packable >= 2 ? packable : 0;
  const dropped = Math.max(0, need - Math.max(0, packed - 1));
  return { first: dropped, packedFrom: packed > 0 ? count - 1 - packed : -1, packed };
}

function StepMenu({
  sequence,
  step,
  corner,
  onStep,
  onExit,
  onPointer,
}: {
  sequence: GuidedSequence;
  step: number;
  corner: Corner;
  onStep: (index: number) => void;
  onExit: () => void;
  onPointer: (inside: boolean) => void;
}) {
  const lastIndex = sequence.steps.length - 1;
  const layout = menuLayout(sequence.steps.length, Math.max(step, 0));

  const value = (index: number) =>
    index < step ? SequenceValue.completed : index === step ? SequenceValue.active : SequenceValue.notStarted;

  /** A step: its number, the dot on the line, and the card to go to it by. */
  const row = (index: number, stacked: boolean, first: boolean, afterStack: boolean) => (
    <div className={styles.stepRow} key={index}>
      <span className={styles.stepNumber}>{index + 1}</span>
      <span className={styles.track}>
        {/* The line runs through the dot: teal as far as the current step, grey beyond it. */}
        {!first && !afterStack ? (
          <span className={`${styles.line} ${styles.lineUp} ${index <= step ? styles.lineDone : ""}`} />
        ) : null}
        {index < lastIndex && !stacked ? (
          <span className={`${styles.line} ${styles.lineDown} ${index < step ? styles.lineDone : ""}`} />
        ) : null}
        <ObcSequenceStep
          className={styles.stepDot}
          orientation={SequenceOrientation.vertical}
          type={SequenceType.small}
          styleType={SequenceStyle.point}
          value={value(index)}
          showStepInputConnector={false}
          showStepOutputConnector={false}
        />
      </span>
      <div className={`${styles.stepCardWrap} ${stacked ? styles.stack : ""}`}>
        <button
          type="button"
          className={`${styles.stepCard} ${index > step ? styles.stepCardAhead : ""}`}
          onClick={() => onStep(index)}
        >
          {sequence.steps[index].label}
        </button>
      </div>
    </div>
  );

  const rows: React.ReactNode[] = [];
  for (let index = layout.first; index <= lastIndex; index += 1) {
    const stacked = index === layout.packedFrom;
    // The steps packed into the stack are drawn as the one card on top of it.
    if (layout.packed > 0 && index > layout.packedFrom && index < lastIndex) continue;
    // A dotted line stands where the packed steps were.
    if (layout.packed > 0 && index === lastIndex) {
      rows.push(
        <div className={styles.gap} key="gap">
          <span className={styles.stepNumber} />
          <span className={styles.track}>
            <span className={styles.dots} />
          </span>
        </div>,
      );
    }
    rows.push(row(index, stacked, index === layout.first, layout.packed > 0 && index === lastIndex));
  }

  return (
    <div
      className={`${styles.menu} ${corner.endsWith("left") ? styles.menuLeft : styles.menuRight} ${
        corner.startsWith("top") ? styles.menuTop : styles.menuBottom
      }`}
      onPointerEnter={() => onPointer(true)}
      onPointerLeave={() => onPointer(false)}
    >
      <ObcNavigationItem label={sequence.title} hasIcon>
        <MaskIcon slot="icon" name={sequence.icon} style={{ color: "var(--teal-400)" }} />
      </ObcNavigationItem>
      <div className={styles.cards}>{rows}</div>
      <ObcButton className={styles.exit} variant={ButtonVariant.raised} fullWidth showTrailingIcon onClick={onExit}>
        Exit training mode
        <ObiCloseGoogle slot="trailing-icon" />
      </ObcButton>
    </div>
  );
}

export function GuidedMode({
  sequence,
  deployment,
  moving,
  onFoils,
  onExit,
  onFinish,
}: {
  sequence: GuidedSequence;
  /** How far out the foils are, which a test scenario watches. */
  deployment: number;
  moving: "deploy" | "retract" | null;
  /** Puts the foils at a position, or with null stops them where they are; with a move, they set off at once. */
  onFoils: (deployment: number | null, move?: "deploy") => void;
  /** Leaves the sequence part way. */
  onExit: () => void;
  /** Leaves it having been through every step, with how the test went. */
  onFinish: (results: TestResult[]) => void;
}) {
  /** The frame is drawn, then the toast shows, then the steps begin. */
  const [phase, setPhase] = useState<"frame" | "toast" | "steps">("frame");
  const started = phase === "steps";
  const [step, setStep] = useState(0);
  const [corner, setCorner] = useState<Corner>("bottom-right");
  const [menuOpen, setMenuOpen] = useState(false);
  const layer = useRef<HTMLDivElement>(null);
  const closing = useRef<number | undefined>(undefined);

  // The test: which question is up, which scenario is open, and how each went.
  const questions = sequence.test ?? NO_QUESTIONS;
  const [testIndex, setTestIndex] = useState(0);
  const [scenario, setScenario] = useState<number | null>(null);
  const [passed, setPassed] = useState<boolean[]>([]);
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);
  /** True once the foils are where the scenario starts, so the goal is not read off where they were. */
  const armed = useRef(false);
  /** How much of the scenario's time is left, in percent. */
  const [remaining, setRemaining] = useState(100);
  const halfway = useRef(false);
  const scripted = useRef(false);
  const ending = useRef<number | undefined>(undefined);
  /** Where the task toast stands, which the learner can move off whatever it covers. */
  const [toastAt, setToastAt] = useState({ left: 162, top: 8 });

  const openScenario = () => {
    const question = questions[testIndex];
    if (!question) return;
    armed.current = question.kind === "watch";
    halfway.current = false;
    scripted.current = false;
    // A scenario to watch begins with the foils coming out on their own.
    if (question.kind === "watch") onFoils(0, "deploy");
    else onFoils(question.start);
    setRemaining(100);
    setScenario(testIndex);
  };

  const endScenario = (at: number, ok: boolean) => {
    window.clearTimeout(ending.current);
    if (ok) setPassed((now) => Object.assign([...now], { [at]: true }));
    setScenario(null);
  };
  useEffect(() => () => window.clearTimeout(ending.current), []);

  // The first question finds the foils in.
  const entered = useRef(false);
  const testing = started && questions.length > 0 && step === sequence.steps.length - 1;
  useEffect(() => {
    if (testing && !entered.current) {
      entered.current = true;
      onFoils(0);
    }
  }, [testing, onFoils]);

  // The toast counts the time down.
  useEffect(() => {
    if (scenario === null) return;
    const question = questions[scenario];
    if (!question) return;
    const began = Date.now();
    const tick = window.setInterval(() => {
      setRemaining(Math.max(0, 100 - ((Date.now() - began) / (question.seconds * 1000)) * 100));
    }, 100);
    return () => window.clearInterval(tick);
  }, [scenario, questions]);

  // A scenario ends by itself after its time.
  useEffect(() => {
    if (scenario === null) return;
    const question = questions[scenario];
    if (!question) return;
    const timer = window.setTimeout(() => {
      onFoils(null);
      endScenario(scenario, question.kind === "watch");
    }, question.seconds * 1000);
    return () => window.clearTimeout(timer);
  }, [scenario, questions, onFoils]);

  // ...or when the foils do what it asked, or what the scenario to watch has to show.
  useEffect(() => {
    if (scenario === null) return;
    const question = questions[scenario];
    if (!question) return;

    if (question.kind === "watch") {
      if (deployment >= 50 && !scripted.current) {
        scripted.current = true;
        if (question.script === "deploying") {
          ending.current = window.setTimeout(() => endScenario(scenario, true), 0);
        } else {
          onFoils(null);
          ending.current = window.setTimeout(() => endScenario(scenario, true), 1500);
        }
      }
      return;
    }

    if (!armed.current) {
      if (deployment === question.start && moving === null) armed.current = true;
      return;
    }
    const idle = moving === null;
    // Stopped before it is fully out counts as stopped half way.
    if (question.goal === "halfway-retract" && idle && deployment > 0 && deployment < 100) halfway.current = true;
    const done =
      (question.goal === "deploy" && deployment >= 100) ||
      (question.goal === "retract" && deployment <= 0) ||
      (question.goal === "halfway-retract" && halfway.current && idle && deployment <= 0);
    if (done) {
      ending.current = window.setTimeout(() => endScenario(scenario, true), 0);
    }
  }, [deployment, moving, scenario, questions, onFoils]);

  const answer = (option: number) => setAnswers((now) => Object.assign([...now], { [testIndex]: option }));

  const finishTest = () =>
    onFinish(
      questions.map((question, at) =>
        question.kind === "scenario"
          ? { question: question.title, answer: "-", correct: Boolean(passed[at]) }
          : {
              question: question.title,
              // The answer is given by its number in the list.
              answer: answers[at] === undefined ? "-" : String(answers[at] + 1),
              correct: answers[at] === question.correct,
            },
      ),
    );

  useEffect(() => {
    const toast = window.setTimeout(() => setPhase((now) => (now === "frame" ? "toast" : now)), FRAME_MS);
    const steps = window.setTimeout(() => setPhase("steps"), FRAME_MS + STARTING_MS);
    return () => {
      window.clearTimeout(toast);
      window.clearTimeout(steps);
    };
  }, []);

  // The menu opens when the training button is hovered, and stays while the
  // pointer is on the button or the menu.
  const hover = (inside: boolean) => {
    window.clearTimeout(closing.current);
    if (inside) setMenuOpen(true);
    else closing.current = window.setTimeout(() => setMenuOpen(false), 160);
  };
  useEffect(() => () => window.clearTimeout(closing.current), []);

  const current = sequence.steps[step];
  const running = scenario !== null;
  const hole = started && !testing ? current.hole : null;
  // With nothing to leave clear the wash closes over the middle, and opens from there to the first step.
  const frame = hole ?? { left: SCREEN.width / 2, top: SCREEN.height / 2, width: 0, height: 0 };

  return (
    <div className={`${tealStyles.teal} ${styles.layer}`} ref={layer}>
      <TrainingFrame />

      {/* The menu is shown folded to icons while the first step points at it, and is gone after, so it does not cover what the later steps explain. */}
      {!running && (!started || step === 0) ? (
        <WavefoilMenu rail page={sequence.page} inTraining={false} onPage={noop} onTraining={noop} onClose={noop} />
      ) : null}

      {running ? null : (
        <>
          <div className={styles.wash} style={{ left: 0, top: 0, width: SCREEN.width, height: frame.top }} />
          <div className={styles.wash} style={{ left: 0, top: frame.top, width: frame.left, height: frame.height }} />
          <div
            className={styles.wash}
            style={{
              left: frame.left + frame.width,
              top: frame.top,
              width: SCREEN.width - frame.left - frame.width,
              height: frame.height,
            }}
          />
          <div
            className={styles.wash}
            style={{
              left: 0,
              top: frame.top + frame.height,
              width: SCREEN.width,
              height: SCREEN.height - frame.top - frame.height,
            }}
          />
          <div
            className={styles.highlight}
            style={{ left: frame.left, top: frame.top, width: frame.width, height: frame.height, opacity: hole ? 1 : 0 }}
          />
        </>
      )}

      {running ? (
        <>
          {/* A scenario to watch plays on its own, so the screen is left alone while it does. */}
          {questions[scenario].kind === "watch" ? <div className={styles.blocker} /> : null}
          <Toast
            title={
              questions[scenario].kind === "scenario"
                ? (questions[scenario].toast ?? questions[scenario].title)
                : questions[scenario].title
            }
            remaining={remaining}
            at={toastAt}
            onMove={setToastAt}
            layer={layer}
            onCancel={() => {
              onFoils(null);
              endScenario(scenario, false);
            }}
          />
        </>
      ) : testing ? (
        <TestModal
          questions={questions}
          index={testIndex}
          passed={passed}
          answers={answers}
          onOpenScenario={openScenario}
          onAnswer={answer}
          onGo={setTestIndex}
          onFinish={finishTest}
        />
      ) : started ? (
        <Tip
          step={current}
          index={step}
          last={step === sequence.steps.length - 1}
          onPrevious={() => setStep((value) => Math.max(0, value - 1))}
          onNext={() => setStep((value) => Math.min(sequence.steps.length - 1, value + 1))}
          onFinish={() => onFinish([])}
        />
      ) : phase === "toast" ? (
        <Toast icon={sequence.icon} title={sequence.title} subtitle="Starting..." onCancel={onExit} />
      ) : null}

      <CornerTools
        corner={corner}
        onCorner={setCorner}
        width={ROW_WIDTH}
        label="Training"
        layer={layer}
      >
        <ToolButton
          label="Training steps"
          icon="wf-menu-training"
          on={menuOpen}
          width={ROW_WIDTH - 41}
          onClick={() => setMenuOpen((open) => !open)}
          onPointerEnter={() => hover(true)}
          onPointerLeave={() => hover(false)}
        />
      </CornerTools>

      {menuOpen ? (
        <StepMenu
          sequence={sequence}
          step={started ? step : -1}
          corner={corner}
          onStep={(index) => {
            setPhase("steps");
            setStep(index);
          }}
          onExit={onExit}
          onPointer={hover}
        />
      ) : null}
    </div>
  );
}
