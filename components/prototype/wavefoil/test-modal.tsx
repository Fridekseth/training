"use client";

/**
 * The test of a chapter, on the library's sequence modal. Each question is a
 * step: a scenario to open and carry out on the ship screen, or a plain
 * question to answer. The toolbar along the bottom moves between them.
 */

import { ObcButton } from "@oicl/openbridge-webcomponents-react/components/button/button";
import { ObcRadio } from "@oicl/openbridge-webcomponents-react/components/radio/radio";
import { ObcSequenceModal } from "@oicl/openbridge-webcomponents-react/components/sequence-modal/sequence-modal";
import { ObcSequenceStep } from "@oicl/openbridge-webcomponents-react/components/sequence-step/sequence-step";
import { ObcSequenceToolbar } from "@oicl/openbridge-webcomponents-react/components/sequence-toolbar/sequence-toolbar";
import { ObiChevronRightGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-chevron-right-google";
import { ObiMediaPlay } from "@oicl/openbridge-webcomponents-react/icons/icon-media-play";
import { ObiPassed } from "@oicl/openbridge-webcomponents-react/icons/icon-passed";
import { ButtonVariant } from "@oicl/openbridge-webcomponents/dist/components/button/button";
import { SequenceToolbarType } from "@oicl/openbridge-webcomponents/dist/components/sequence-toolbar/sequence-toolbar";
import {
  SequenceStyle,
  SequenceType,
  SequenceValue,
} from "@oicl/openbridge-webcomponents/dist/components/sequence-step/sequence-step";
import type { TestQuestion } from "./guided-data";
import styles from "./guided.module.css";

/**
 * Rules added to a component's shadow root, for what the library fixes in its
 * own styles: the modal is 506px tall with a close button, and the toolbar is
 * 608px wide, where the design's modal is 399px tall, without a close button,
 * with a toolbar that fits it.
 */
const sheets = new Map<string, CSSStyleSheet>();
function adopt(element: HTMLElement | null, css: string) {
  const host = element as (HTMLElement & { updateComplete?: Promise<unknown> }) | null;
  if (!host?.updateComplete) return;
  void host.updateComplete.then(() => {
    const root = host.shadowRoot;
    if (!root) return;
    let sheet = sheets.get(css);
    if (!sheet) {
      sheet = new CSSStyleSheet();
      sheet.replaceSync(css);
      sheets.set(css, sheet);
    }
    if (!root.adoptedStyleSheets.includes(sheet)) {
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
    }
  });
}

/**
 * The modal that opens the test is not a step, so the numbered circle the
 * library puts before every title is taken away. It is drawn by the card inside
 * the modal, so the rule goes in the card's own shadow root.
 */
const fitIntro = (modal: HTMLElement | null) => {
  fitModal(modal);
  const host = modal as (HTMLElement & { updateComplete?: Promise<unknown> }) | null;
  if (!host?.updateComplete) return;
  void host.updateComplete.then(() => {
    const card = host.shadowRoot?.querySelector("obc-sequence-card") as
      | (HTMLElement & { updateComplete?: Promise<unknown> })
      | null;
    if (card) adopt(card, "obc-sequence-step { display: none; }");
  });
};

const fitModal = (modal: HTMLElement | null) =>
  adopt(modal, ".sequence-modal-header-actions { display: none; } .sequence-modal { height: var(--modal-height, 399px); }");
const fitToolbar = (toolbar: HTMLElement | null) =>
  adopt(toolbar, ".sequence-toolbar.type-sequential { width: 100%; }");

/**
 * Before the first question: a modal that says what is coming, so the test is
 * not just there. The learner starts it when they are ready.
 */
export function TestIntro({
  questions,
  kinds,
  onStart,
}: {
  questions: number;
  /** Which kinds of question the test has, for saying what is in it. */
  kinds: Set<string>;
  onStart: () => void;
}) {
  return (
    <div className={styles.testLayer}>
      <div className={`${styles.testModal} ${styles.testIntro}`}>
        <ObcSequenceModal ref={fitIntro} modalTitle="Test" stepValue={SequenceValue.regular}>
          <div className={styles.testIntroBody}>
            <p className={styles.testText}>
              You have been through all the steps. Next is a test of what you have learned, with {questions}{" "}
              questions.{" "}
              {kinds.has("scenario")
                ? "Some are tasks to carry out on the screen, and others are questions to answer."
                : kinds.has("watch")
                  ? "Some of them are questions to answer after looking at the screen."
                  : "Each one is a question to answer."}
            </p>
            <div className={styles.testIntroAction}>
              <ObcButton variant={ButtonVariant.raised} showTrailingIcon onClick={onStart}>
                Start test
                <ObiChevronRightGoogle slot="trailing-icon" />
              </ObcButton>
            </div>
          </div>
        </ObcSequenceModal>
      </div>
    </div>
  );
}

export function TestModal({
  questions,
  index,
  passed,
  answers,
  onOpenScenario,
  onAnswer,
  onGo,
  onFinish,
}: {
  questions: TestQuestion[];
  index: number;
  /** Which scenarios have been carried out. */
  passed: boolean[];
  /** The option chosen on each scenario that is described, by its place in the list. */
  answers: (number | undefined)[];
  onOpenScenario: () => void;
  onAnswer: (option: number) => void;
  onGo: (index: number) => void;
  onFinish: () => void;
}) {
  const question = questions[index];
  const last = index === questions.length - 1;

  return (
    <div className={styles.testLayer}>
      <div className={styles.testModal}>
        <ObcSequenceModal
          ref={fitModal}
          modalTitle={question.title}
          stepLabel={String(index + 1)}
          stepValue={SequenceValue.regular}
        >
          <div className={styles.testBody}>
            <p className={styles.testText}>{question.text}</p>

            {question.kind === "ask" || (question.kind === "watch" && passed[index]) ? (
              // Once the scenario has played, it is described by choosing one of the answers.
              <div className={styles.testChoices} role="radiogroup" aria-label={question.title}>
                {question.options.map((option, at) => (
                  <div
                    key={at}
                    className={`${styles.testChoice} ${answers[index] === at ? styles.testChoiceOn : ""}`}
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
              <div className={styles.testAction}>
                <ObcButton
                  variant={ButtonVariant.normal}
                  showLeadingIcon
                  disabled={passed[index]}
                  onClick={onOpenScenario}
                >
                  <ObiMediaPlay slot="leading-icon" />
                  Start
                </ObcButton>
                {passed[index] ? <ObiPassed className={styles.testPassed} /> : null}
              </div>
            )}

            <ObcSequenceToolbar
              ref={fitToolbar}
              className={styles.testToolbar}
              type={SequenceToolbarType.sequential}
              onPrevClick={() => index > 0 && onGo(index - 1)}
              onNextClick={() => (last ? onFinish() : onGo(index + 1))}
            >
              {questions.map((item, at) => (
                <ObcSequenceStep
                  key={at}
                  type={SequenceType.medium}
                  styleType={SequenceStyle.regular}
                  value={
                    at < index ? SequenceValue.completed : at === index ? SequenceValue.active : SequenceValue.notStarted
                  }
                  showStepInputConnector={at > 0}
                  showStepOutputConnector={at < questions.length - 1}
                  onClick={() => onGo(at)}
                >
                  {at + 1}
                </ObcSequenceStep>
              ))}
              {last ? <span slot="end">Finish</span> : null}
            </ObcSequenceToolbar>
          </div>
        </ObcSequenceModal>
      </div>
    </div>
  );
}
