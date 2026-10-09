"use client";

/**
 * Explore mode: the learner looks around the screen without controlling it,
 * and reads or adds to the comments other crew have left on it. Everything
 * here is drawn over the ship screen, which stays as it is underneath.
 */

import { useEffect, useRef, useState } from "react";
import { ObcIconButton } from "@oicl/openbridge-webcomponents-react/components/icon-button/icon-button";
import { ObcTextareaField } from "@oicl/openbridge-webcomponents-react/components/textarea-field/textarea-field";
import { ObcKeyboardFull } from "@oicl/openbridge-webcomponents-react/components/keyboard-full/keyboard-full";
import { ObiCloseGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-close-google";
import { ObiPinGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-pin-google";
import { ObiInputKeyboardGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-input-keyboard-google";
import { IconButtonVariant } from "@oicl/openbridge-webcomponents/dist/components/icon-button/icon-button";
import { TextareaFieldType } from "@oicl/openbridge-webcomponents/dist/components/textarea-field/textarea-field";
import {
  ObcKeyboardFullType,
  type ObcKeyboardFull as ObcKeyboardFullElement,
} from "@oicl/openbridge-webcomponents/dist/components/keyboard-full/keyboard-full";
import { MaskIcon } from "../pieces";
import { noSystemKeyboard } from "./no-system-keyboard";
import {
  panelSide,
  SELF,
  type Message,
  type AppPage,
  onPage,
  type Thread,
  type ThreadId,
} from "./explore-data";
import { CornerTools, SCREEN, ToolButton, type Corner } from "./corner-tools";
import { TrainingFrame } from "./training-frame";
import tealStyles from "./teal-scope.module.css";
import styles from "./explore.module.css";

type Tool = "hand" | "comment";

/**
 * The design draws the number keys in a light teal and DONE in the dark one,
 * while the library gives both the same "raised" look. The keyboard exposes no
 * part to tell them apart, so a rule is added to its own shadow root.
 */
let numberKeys: CSSStyleSheet | undefined;
function tintNumberRow(keyboard: ObcKeyboardFullElement | null) {
  if (!keyboard) return;
  // The tablet's own keyboard would open over this one.
  noSystemKeyboard(keyboard);
  void keyboard.updateComplete.then(() => {
    const root = keyboard.shadowRoot;
    if (!root) return;
    if (!numberKeys) {
      numberKeys = new CSSStyleSheet();
      numberKeys.replaceSync(`
        .row-numbers obc-button {
          --raised-enabled-background-color: var(--base-teal-050, #e2f2f3);
          --raised-enabled-border-color: var(--base-teal-200, #80cacd);
          --raised-hover-background-color: var(--base-teal-100, #bee4e5);
          --raised-hover-border-color: var(--base-teal-300, #1d9da1);
          --raised-pressed-background-color: var(--base-teal-200, #80cacd);
          --raised-pressed-border-color: var(--base-teal-300, #1d9da1);
          --on-raised-active-color: var(--base-teal-500, #005d61);
        }
      `);
    }
    if (!root.adoptedStyleSheets.includes(numberKeys)) {
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, numberKeys];
    }
  });
}

function Avatar({ initials, self = false }: { initials: string; self?: boolean }) {
  return (
    <span className={`${styles.avatar} ${self ? styles.avatarSelf : ""}`}>{initials}</span>
  );
}

/**
 * The pin that marks a comment on the screen. Unread comments are drawn dark and
 * read ones light. While one comment is open the others are disabled, and the
 * open one grows into the people who have written in it.
 */
function Indicator({
  thread,
  state,
  onClick,
}: {
  thread: Thread;
  state: "enabled" | "disabled" | "checked";
  onClick: () => void;
}) {
  const read = !thread.unread;
  // The pill is wider and taller than the pin, so near an edge it is pushed back inside the screen.
  const width = thread.authors.length * 28 + 16;
  const centre = thread.indicator.left + 16;
  const shift = Math.min(
    Math.max(centre - width / 2, EDGE_GAP),
    SCREEN.width - EDGE_GAP - width,
  ) - (centre - width / 2);
  const drop = Math.max(0, EDGE_GAP - (thread.indicator.top - 12));
  const tone = `${read ? styles.markerRead : ""} ${state === "disabled" ? styles.markerDisabled : ""}`;
  return (
    <button
      type="button"
      className={`${styles.marker} ${tone} ${state === "checked" ? styles.markerChecked : ""}`}
      style={thread.indicator}
      aria-label={`Comments from ${thread.authors.join(", ")}`}
      aria-pressed={state === "checked"}
      disabled={state === "disabled"}
      onClick={onClick}
    >
      {state === "checked" ? (
        <span
          className={styles.markerPeople}
          style={{ "--shift": `${shift}px`, "--drop": `${drop}px` } as React.CSSProperties}
        >
          {thread.authors.map((author) => (
            <span key={author} className={styles.markerPerson}>
              <Avatar initials={author} self={read} />
            </span>
          ))}
        </span>
      ) : (
        <MaskIcon name="wf-explore-notification" size={24} />
      )}
    </button>
  );
}

function Bubble({ message }: { message: Message }) {
  if (message.author === SELF) {
    return (
      <div className={styles.rowSelf}>
        <p className={`${styles.bubble} ${styles.bubbleSelf}`}>{message.text}</p>
        <Avatar initials={message.author} self />
      </div>
    );
  }
  return (
    <div className={styles.row}>
      <Avatar initials={message.author} />
      <p className={styles.bubble}>
        <span>{message.text}</span>
        {message.pinned ? (
          <span className={styles.pin} aria-label="Pinned">
            <ObiPinGoogle />
          </span>
        ) : null}
      </p>
    </div>
  );
}

function ThreadPanel({
  thread,
  messages,
  side,
  belowBar,
  draft,
  onTypeRequest,
  onSend,
  onClose,
}: {
  thread: Thread;
  messages: Message[];
  side: "left" | "right";
  belowBar: boolean;
  draft: string;
  /** Opens the on-screen keyboard. */
  onTypeRequest: () => void;
  onSend: (text: string) => void;
  onClose: () => void;
}) {
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [messages.length, thread.id]);

  return (
    <aside
      className={`${styles.panel} ${side === "right" ? styles.panelRight : ""} ${belowBar ? styles.panelBelowBar : ""}`}
      aria-label={thread.title}
    >
      <header className={styles.panelHeader}>
        <MaskIcon className={styles.panelIcon} name="wf-explore-notification" />
        <span className={styles.panelTitle}>{thread.subject ?? thread.title}</span>
        <ObcIconButton
          className={styles.panelClose}
          variant={IconButtonVariant.flat}
          aria-label="Close thread"
          onClick={onClose}
        >
          <ObiCloseGoogle />
        </ObcIconButton>
      </header>

      <div className={styles.messages} ref={list}>
        {messages.map((message) => (
          <Bubble key={message.id} message={message} />
        ))}
      </div>

      {/* Any press on the field itself brings up the keyboard; the toolbar keeps its own buttons. */}
      <div
        className={styles.compose}
        onClick={(event) => {
          const onField = event
            .nativeEvent.composedPath()
            .some((node) => node instanceof HTMLTextAreaElement);
          if (onField) onTypeRequest();
        }}
      >
        <ObcTextareaField
          ref={noSystemKeyboard}
          type={TextareaFieldType.Message}
          hasLeadingIcon
          showToolbar
          showVoiceRecording
          placeholder="Write a message"
          value={draft}
          onSendClick={() => onSend(draft)}
        >
          <ObiInputKeyboardGoogle slot="leading-icon" onClick={onTypeRequest} />
        </ObcTextareaField>
      </div>
    </aside>
  );
}

/** How near the screen's edge a comment may come. */
const EDGE_GAP = 4;

const mirror = (corner: Corner): Corner =>
  corner.endsWith("left")
    ? (corner.replace("left", "right") as Corner)
    : (corner.replace("right", "left") as Corner);

export function ExploreMode({
  threads,
  onThreads: setThreads,
  initialOpen = null,
  page,
  onExit,
}: {
  /** The page being explored; its comments are the ones shown. */
  page: AppPage;
  /** Kept by the app, so the Explore page can list the same comments. */
  threads: Thread[];
  onThreads: React.Dispatch<React.SetStateAction<Thread[]>>;
  /** A thread to open straight away, when arriving from the list. */
  initialOpen?: ThreadId | null;
  onExit: () => void;
}) {
  const [tool, setTool] = useState<Tool>("comment");
  const [open, setOpen] = useState<ThreadId | null>(initialOpen);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const layer = useRef<HTMLDivElement>(null);
  /** Where the tool row has been left, and where it is while it is being dragged. */
  const [corner, setCorner] = useState<Corner>("bottom-right");

  const thread = threads.find((item) => item.id === open) ?? null;
  const target = thread?.target;
  const side = target ? panelSide(target) : "left";
  // A comment about the top bar leaves the bar uncovered.
  const belowBar = !!target && target.top === 0 && target.width >= 780;
  // An open comment sits on one side, so the tool row steps over to the other rather than cover it.
  const shown =
    thread && corner.endsWith(side) ? mirror(corner) : corner;

  /** Closes the open thread; one nobody wrote in is dropped rather than left as an empty pin. */
  const close = () => {
    // Reading a comment through is what marks it read, so it is drawn unread while it is open.
    setThreads((all) =>
      all
        .filter((item) => item.id !== open || item.messages.length > 0)
        .map((item) => (item.id === open ? { ...item, unread: false } : item)),
    );
    setOpen(null);
  };

  const show = (id: ThreadId) => {
    if (id !== open) setDraft("");
    setOpen(id);
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!thread || !trimmed) return;
    setThreads((all) =>
      all.map((item) =>
        item.id === thread.id
          ? {
              ...item,
              messages: [
                ...item.messages,
                {
                  id: `${item.id}-${item.messages.length + 1}`,
                  author: SELF,
                  text: trimmed,
                  at: new Date().toISOString(),
                },
              ],
            }
          : item,
      ),
    );
    setDraft("");
  };

  /**
   * A click in comment mode starts a thread on whatever component is under it:
   * the nearest element marked `data-comment`. The thread points at the spot
   * that was clicked and keeps the whole component clear while it is open.
   */
  const startThread = (event: React.MouseEvent<HTMLDivElement>) => {
    const frame = layer.current?.getBoundingClientRect();
    if (!frame) return;
    // The screen may be scaled down, so work in its own pixels.
    const scale = frame.width / 786;
    const hit = document
      .elementsFromPoint(event.clientX, event.clientY)
      .map((node) => node.closest<HTMLElement>("[data-comment]"))
      .find(Boolean);
    if (!hit) return;
    const box = hit.getBoundingClientRect();
    const clickY = Math.round((event.clientY - frame.top) / scale);
    const id = `new-${Date.now()}`;
    setDraft("");
    setThreads((all) => [
      ...all,
      {
        id,
        page,
        // Named by the component it is about.
        title: hit.dataset.comment ?? "Thread",
        subject: hit.dataset.comment,
        authors: [SELF],
        // The pin's tail points at the click, so the pin stands above it, centred (the tail hangs 6px below the pin).
        indicator: {
          left: Math.min(Math.max(Math.round((event.clientX - frame.left) / scale) - 16, 0), 786 - 32),
          top: Math.max(clickY - 38, 0),
        },
        target: {
          left: Math.round((box.left - frame.left) / scale),
          top: Math.round((box.top - frame.top) / scale),
          width: Math.round(box.width / scale),
          height: Math.round(box.height / scale),
        },
        messages: [],
      },
    ]);
    setOpen(id);
  };

  const pick = (next: Tool) => {
    setTool(next);
    if (next === "hand") close();
  };

  return (
    <div className={`${tealStyles.teal} ${styles.layer}`} ref={layer} data-explore-tool={tool}>
      <TrainingFrame />

      {/* The comment cursor: any click lands on a component. */}
      {tool === "comment" && !thread ? (
        <div className={styles.catcher} onClick={startThread} />
      ) : null}

      {thread && target ? (
        <>
          {/* A wash over everything except the part the thread is about. */}
          <div
            className={styles.scrim}
            style={{
              clipPath: `path(evenodd, "M0 0H786V590H0Z M${target.left} ${target.top}H${target.left + target.width}V${target.top + target.height}H${target.left}Z")`,
            }}
            onClick={close}
          />
          <div className={styles.target} style={target} aria-hidden="true" />
        </>
      ) : null}

      {tool === "comment"
        ? threads.filter((item) => onPage(item, page)).map((item) => (
            <Indicator
              key={item.id}
              thread={item}
              state={open === null ? "enabled" : open === item.id ? "checked" : "disabled"}
              onClick={() => (open === item.id ? close() : show(item.id))}
            />
          ))
        : null}

      {thread ? (
        <ThreadPanel
          thread={thread}
          messages={thread.messages}
          side={side}
          belowBar={belowBar}
          draft={draft}
          onTypeRequest={() => setTyping(true)}
          onSend={send}
          onClose={close}
        />
      ) : null}

      <CornerTools
        corner={shown}
        onCorner={setCorner}
        width={197}
        label="Explore tools"
        layer={layer}
      >
        <ToolButton label="Look around" icon="wf-explore-hand" on={tool === "hand"} onClick={() => pick("hand")} />
        <ToolButton label="Comments" icon="wf-explore-notification" on={tool === "comment"} onClick={() => pick("comment")} />
        <ToolButton
          label="Leave explore mode"
          icon="wf-explore-training"
          onClick={() => {
            if (open) close();
            onExit();
          }}
        />
      </CornerTools>

      {typing ? (
        <div className={styles.keyboardLayer}>
          <div className={styles.keyboard}>
            <ObcKeyboardFull
              ref={tintNumberRow}
              type={ObcKeyboardFullType.Floating}
              showTopBar
              showNumberRow
              parameterName="Thread"
              placeholder="Write a message"
              closeLabel="Done"
              value={draft}
              onValueChange={(event) => setDraft(event.detail.value)}
              onDoneClick={(event) => {
                setDraft(event.detail.value);
                setTyping(false);
              }}
              onCloseClick={() => setTyping(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
