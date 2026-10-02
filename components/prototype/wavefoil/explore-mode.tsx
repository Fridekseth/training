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
import { ObiComMessageGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-com-message-google";
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
import {
  panelSide,
  SELF,
  type Message,
  type Thread,
  type ThreadId,
} from "./explore-data";
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

/** The speech bubble that marks a comment on the screen. */
function Indicator({
  thread,
  open,
  onClick,
}: {
  thread: Thread;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.indicator} ${open ? styles.indicatorOpen : ""} ${thread.below ? styles.indicatorBelow : ""}`}
      style={thread.indicator}
      aria-label={`Comments from ${thread.authors.join(", ")}`}
      onClick={onClick}
    >
      {thread.authors.map((author) => (
        <span key={author} className={styles.indicatorAvatar}>
          <Avatar initials={author} self />
        </span>
      ))}
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
        <ObiComMessageGoogle className={styles.panelIcon} />
        <span className={styles.panelTitle}>{thread.title}</span>
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

export function ExploreMode({
  threads,
  onThreads: setThreads,
  initialOpen = null,
  onExit,
}: {
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

  const thread = threads.find((item) => item.id === open) ?? null;
  const target = thread?.target;
  const side = target ? panelSide(target) : "left";
  // A comment about the top bar leaves the bar uncovered.
  const belowBar = !!target && target.top === 0 && target.width >= 780;

  /** Closes the open thread; one nobody wrote in is dropped rather than left as an empty pin. */
  const close = () => {
    setThreads((all) =>
      all.filter((item) => item.id !== open || item.messages.length > 0),
    );
    setOpen(null);
  };

  const show = (id: ThreadId) => {
    if (id !== open) setDraft("");
    // Opening a comment reads it.
    setThreads((all) =>
      all.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    );
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
    const hangs = clickY - 48 < 6;
    const id = `new-${Date.now()}`;
    setDraft("");
    setThreads((all) => [
      ...all,
      {
        id,
        title: `${hit.dataset.comment} thread`,
        authors: [SELF],
        // The bubble's sharp corner sits on the click. Near the top edge it hangs
        // below the click instead, and near the right edge it is pulled back in.
        indicator: {
          left: Math.min(Math.round((event.clientX - frame.left) / scale), 786 - 56 - 6),
          top: hangs ? clickY : clickY - 48,
        },
        below: hangs,
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
    <div className={styles.layer} ref={layer} data-explore-tool={tool}>
      <div className={styles.frame} aria-hidden="true" />

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
        ? threads.map((item) => (
            <Indicator
              key={item.id}
              thread={item}
              open={open === item.id}
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

      <div
        className={`${styles.tools} ${thread && side === "right" ? styles.toolsTop : ""}`}
        role="toolbar"
        aria-label="Explore tools"
      >
        <button
          type="button"
          className={`${styles.tool} ${tool === "hand" ? styles.toolOn : ""}`}
          aria-label="Look around"
          aria-pressed={tool === "hand"}
          onClick={() => pick("hand")}
        >
          <MaskIcon name="wf-explore-hand" />
        </button>
        <button
          type="button"
          className={`${styles.tool} ${tool === "comment" ? styles.toolOn : ""}`}
          aria-label="Comments"
          aria-pressed={tool === "comment"}
          onClick={() => pick("comment")}
        >
          <MaskIcon name="wf-explore-comment" />
        </button>
        <button
          type="button"
          className={styles.tool}
          aria-label="Leave explore mode"
          onClick={onExit}
        >
          <MaskIcon name="wf-explore-training" />
        </button>
      </div>

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
