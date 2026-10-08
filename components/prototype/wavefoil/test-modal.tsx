"use client";

/**
 * The test of a chapter, on the library's sequence modal. Each question is a
 * step: a scenario to open and carry out on the ship screen, or a plain
 * question to answer. The toolbar along the bottom moves between them.
 */

import { ObcButton } from "@oicl/openbridge-webcomponents-react/components/button/button";
import { ObcSequenceModal } from "@oicl/openbridge-webcomponents-react/components/sequence-modal/sequence-modal";
import { ObcSequenceStep } from "@oicl/openbridge-webcomponents-react/components/sequence-step/sequence-step";
import { ObcSequenceToolbar } from "@oicl/openbridge-webcomponents-react/components/sequence-toolbar/sequence-toolbar";
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

const fitModal = (modal: HTMLElement | null) =>
  adopt(modal, ".sequence-modal-header-actions { display: none; } .sequence-modal { height: 399px; }");
const fitToolbar = (toolbar: HTMLElement | null) =>
  adopt(toolbar, ".sequence-toolbar.type-sequential { width: 100%; }");

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
  /** What was chosen on the plain questions. */
  answers: (string | undefined)[];
  onOpenScenario: () => void;
  onAnswer: (value: string) => void;
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

            <div className={styles.testAction}>
              {question.kind === "scenario" ? (
                <>
                  <ObcButton
                    variant={ButtonVariant.normal}
                    showLeadingIcon
                    disabled={passed[index]}
                    onClick={onOpenScenario}
                  >
                    <ObiMediaPlay slot="leading-icon" />
                    Open scenario
                  </ObcButton>
                  {passed[index] ? <ObiPassed className={styles.testPassed} /> : null}
                </>
              ) : (
                <div className={styles.testChoices} role="radiogroup" aria-label={question.title}>
                  {question.options.map((option) => (
                    <ObcButton
                      key={option}
                      variant={answers[index] === option ? ButtonVariant.raised : ButtonVariant.normal}
                      role="radio"
                      aria-checked={answers[index] === option}
                      onClick={() => onAnswer(option)}
                    >
                      {option}
                    </ObcButton>
                  ))}
                </div>
              )}
            </div>

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
