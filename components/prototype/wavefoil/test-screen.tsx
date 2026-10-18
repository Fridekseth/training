"use client";

/**
 * The test as the design's second look: the questions stand on a page of their
 * own, with the scenario as a small picture to open, and a scenario is carried
 * out on the full screen with the toolbar floating over it. The toolbar along
 * the bottom moves between the questions in both.
 */

import { useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { ObcIconButton } from "@oicl/openbridge-webcomponents-react/components/icon-button/icon-button";
import { ObcRadio } from "@oicl/openbridge-webcomponents-react/components/radio/radio";
import { ObcSequenceStep } from "@oicl/openbridge-webcomponents-react/components/sequence-step/sequence-step";
import { ObcSequenceToolbar } from "@oicl/openbridge-webcomponents-react/components/sequence-toolbar/sequence-toolbar";
import { ObiContentCollapseGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-content-collapse-google";
import { ObiContentExpandGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-content-expand-google";
import { ObiPassed } from "@oicl/openbridge-webcomponents-react/icons/icon-passed";
import { IconButtonVariant } from "@oicl/openbridge-webcomponents/dist/components/icon-button/icon-button";
import { SequenceToolbarType } from "@oicl/openbridge-webcomponents/dist/components/sequence-toolbar/sequence-toolbar";
import {
  SequenceStyle,
  SequenceType,
  SequenceValue,
} from "@oicl/openbridge-webcomponents/dist/components/sequence-step/sequence-step";
import { SCREEN, type Corner } from "./corner-tools";
import type { TestQuestion } from "./guided-data";
import { adopt } from "./test-modal";
import styles from "./test-screen.module.css";

/** The toolbar is 542px wide in the design, and grows when there are more questions than fit. */
const BAR_WIDTH = 542;
const BAR_HEIGHT = 48;
const barWidth = (count: number, handle: boolean) => Math.max(BAR_WIDTH, 224 + count * 48 + (handle ? 80 : 40));

/** The library fixes the toolbar at 608px; here it takes the width it is given, and leaves room for a handle when it has one. */
const fitToolbar = (toolbar: HTMLElement | null) =>
  adopt(
    toolbar,
    ".sequence-toolbar.type-sequential { width: 100%; padding-left: var(--toolbar-lead, 5px); } .sequence-step-item { box-sizing: border-box; width: 112px; padding: 0 6px; } .edge-button { display: block; width: 100%; } .edge-button::part(visible-wrapper) { width: 100%; }",
  );

function Steps({ count, index, onGo }: { count: number; index: number; onGo: (at: number) => void }) {
  return Array.from({ length: count }, (_, at) => (
    <ObcSequenceStep
      key={at}
      type={SequenceType.medium}
      styleType={SequenceStyle.regular}
      value={at < index ? SequenceValue.completed : at === index ? SequenceValue.active : SequenceValue.notStarted}
      showStepInputConnector={at > 0}
      showStepOutputConnector={at < count - 1}
      onClick={() => onGo(at)}
    >
      {at + 1}
    </ObcSequenceStep>
  ));
}

/**
 * Before the first question: what is coming, and a way back to the steps.
 */
export function TestScreenIntro({
  questions,
  kinds,
  raised,
  onBack,
  onStart,
}: {
  questions: number;
  /** Which kinds of question the test has, for saying what is in it. */
  kinds: Set<string>;
  /** Set when the tab is along the bottom, so the toolbar stands clear of it. */
  raised: boolean;
  onBack: () => void;
  onStart: () => void;
}) {
  return (
    <div className={`${styles.screen} ${styles.theme}`}>
      <h2 className={styles.introTitle}>Test what you remember</h2>
      <p className={styles.introText}>
        You have been through all the steps. Next is a test of what you have learned, with {questions} questions.{" "}
        {kinds.has("scenario")
          ? "Some are tasks to carry out on the screen, and others are questions to answer."
          : kinds.has("watch")
            ? "Some of them are questions to answer after looking at the screen."
            : "Each one is a question to answer."}
      </p>
      <div className={`${styles.bar} ${raised ? styles.barRaised : ""}`} style={{ width: 228 }}>
        <ObcSequenceToolbar ref={fitToolbar} type={SequenceToolbarType.sequential} onPrevClick={onBack} onNextClick={onStart}>
          <span slot="start">Back</span>
          <span slot="end">Start</span>
        </ObcSequenceToolbar>
      </div>
    </div>
  );
}

/** One question: its title and words, then the scenario in small or the answers to choose from. */
export function TestScreenQuestion({
  questions,
  index,
  passed,
  answers,
  preview,
  onOpenScenario,
  onAnswer,
  onGo,
  onBack,
  onFinish,
}: {
  questions: TestQuestion[];
  index: number;
  /** Which scenarios have been carried out. */
  passed: boolean[];
  /** The option chosen on each question that is answered, by its place in the list. */
  answers: (number | undefined)[];
  /** The screen a question's scenario starts from, drawn small. */
  preview: (question: TestQuestion) => ReactNode;
  onOpenScenario: () => void;
  onAnswer: (option: number) => void;
  onGo: (index: number) => void;
  /** Back from the first question, to the page that introduces the test. */
  onBack: () => void;
  onFinish: () => void;
}) {
  const question = questions[index];
  const last = index === questions.length - 1;
  const answering = question.kind === "ask" || (question.kind === "watch" && passed[index]);

  return (
    <div className={`${styles.screen} ${styles.theme}`}>
      <div className={styles.column}>
        <div className={styles.titleRow}>
          <span className={styles.indicator}>
            <ObcSequenceStep
              type={SequenceType.medium}
              styleType={SequenceStyle.regular}
              value={SequenceValue.notStarted}
              showStepInputConnector={false}
              showStepOutputConnector={false}
            >
              {index + 1}
            </ObcSequenceStep>
          </span>
          <h2 className={styles.title}>{question.title}</h2>
        </div>
        <p className={styles.text}>{question.text}</p>

        {question.kind !== "scenario" && answering ? (
          <div className={styles.choices} role="radiogroup" aria-label={question.title}>
            {question.options.map((option, at) => (
              <div
                key={at}
                className={`${styles.choice} ${answers[index] === at ? styles.choiceOn : ""}`}
                onClick={() => onAnswer(at)}
              >
                <ObcRadio
                  label={option}
                  name={`test-${index}`}
                  value={String(at)}
                  inputId={`test-${index}-${at}`}
                  checked={answers[index] === at}
                  onChange={() => onAnswer(at)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={`${styles.previewWrap} ${passed[index] ? styles.previewDone : ""}`}>
            <div className={styles.preview}>{preview(question)}</div>
            {passed[index] ? (
              <span className={styles.passed} role="img" aria-label="Done">
                <ObiPassed />
              </span>
            ) : (
              <ObcIconButton
                className={styles.expand}
                variant={IconButtonVariant.raised}
                aria-label="Open the scenario"
                onClick={onOpenScenario}
              >
                <ObiContentExpandGoogle />
              </ObcIconButton>
            )}
          </div>
        )}
      </div>

      <div className={styles.bar} style={{ width: barWidth(questions.length, false) }}>
        <ObcSequenceToolbar
          ref={fitToolbar}
          type={SequenceToolbarType.sequential}
          onPrevClick={() => (index > 0 ? onGo(index - 1) : onBack())}
          onNextClick={() => (last ? onFinish() : onGo(index + 1))}
        >
          <span slot="start">{index > 0 ? "Previous" : "Back"}</span>
          <Steps count={questions.length} index={index} onGo={onGo} />
          {last ? <span slot="end">Finish</span> : null}
        </ObcSequenceToolbar>
      </div>
    </div>
  );
}

/**
 * What stands over the ship screen while a scenario is carried out: the toolbar,
 * which can be moved off whatever it covers, and the button that takes the
 * screen back to the question's page. Both leave the scenario unfinished.
 */
export function ScenarioChrome({
  count,
  index,
  layer,
  tabCorner,
  onGo,
  onFinish,
  onLeave,
}: {
  count: number;
  index: number;
  /** The layer it stands in, measured for the screen's scale while the toolbar is dragged. */
  layer: RefObject<HTMLElement | null>;
  /** Where the tab is, so the corner button takes the other top corner when the tab is up there. */
  tabCorner: Corner;
  onGo: (index: number) => void;
  onFinish: () => void;
  onLeave: () => void;
}) {
  const width = barWidth(count, true);
  const [at, setAt] = useState({ left: Math.round((SCREEN.width - width) / 2), top: SCREEN.height - BAR_HEIGHT - 15 });
  const grab = useRef<{ x: number; y: number; left: number; top: number; scale: number } | null>(null);
  const last = index === count - 1;

  const place = (left: number, top: number) =>
    setAt({
      left: Math.min(SCREEN.width - width, Math.max(0, left)),
      top: Math.min(SCREEN.height - BAR_HEIGHT, Math.max(0, top)),
    });

  const start = (event: React.PointerEvent<HTMLButtonElement>) => {
    const frame = layer.current?.getBoundingClientRect();
    if (!frame) return;
    grab.current = { x: event.clientX, y: event.clientY, left: at.left, top: at.top, scale: frame.width / SCREEN.width };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const move = (event: React.PointerEvent<HTMLButtonElement>) => {
    const from = grab.current;
    if (!from) return;
    place(from.left + (event.clientX - from.x) / from.scale, from.top + (event.clientY - from.y) / from.scale);
  };

  // Without a pointer, the arrow keys move it.
  const nudge = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const by = { ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16], ArrowDown: [0, 16] }[event.key];
    if (!by) return;
    event.preventDefault();
    place(at.left + by[0], at.top + by[1]);
  };

  const upLeft = tabCorner === "top-right";

  return (
    <>
      <ObcIconButton
        className={`${styles.shrink} ${upLeft ? styles.shrinkLeft : ""}`}
        variant={IconButtonVariant.raised}
        aria-label="Back to the question"
        onClick={onLeave}
      >
        <ObiContentCollapseGoogle />
      </ObcIconButton>

      <div className={`${styles.theme} ${styles.barDrag}`} style={{ left: at.left, top: at.top, width }}>
        <ObcSequenceToolbar
          ref={fitToolbar}
          type={SequenceToolbarType.sequential}
          onPrevClick={() => onGo(Math.max(0, index - 1))}
          onNextClick={() => (last ? onFinish() : onGo(index + 1))}
        >
          <span slot="start">Previous</span>
          <Steps count={count} index={index} onGo={onGo} />
          {last ? <span slot="end">Finish</span> : null}
        </ObcSequenceToolbar>
        <button
          type="button"
          className={styles.grip}
          aria-label="Move the toolbar. Drag, or use the arrow keys."
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
        <span className={styles.gripLine} aria-hidden="true" />
      </div>
    </>
  );
}
