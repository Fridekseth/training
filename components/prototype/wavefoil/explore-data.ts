/**
 * The comment threads of explore mode. Each comment indicator on the screen
 * opens one: who has written in it, where on the screen it points, and the
 * messages so far. The power bar thread is the one in the sketch; the wave
 * chart thread is written to the same pattern, a pinned tip followed by
 * replies, and is placeholder text to be replaced.
 */

/** The learner in explore mode, whose messages sit on the right. */
export const SELF = "KN";

export type ThreadId = string;

/** The three pages of the interface; a comment on the top bar belongs to all of them. */
export type AppPage = "overview" | "decision" | "alarms" | "debriefing";

export type Message = {
  id: string;
  author: string;
  text: string;
  /** When it was written, as an ISO date. */
  at: string;
  /** The first message of a thread is pinned to the top. */
  pinned?: boolean;
};

export type Box = { left: number; top: number; width: number; height: number };

export type Thread = {
  id: ThreadId;
  /** The page the comment is on. */
  page: AppPage | "all";
  /** Shown in the panel header. */
  title: string;
  /** What the thread is about, for the list; the title when left out. */
  subject?: string;
  /** Everyone who has written, in the order the indicator stacks them. */
  authors: string[];
  /** Where the speech bubble sits, in screen pixels. */
  indicator: { left: number; top: number };
  /** The bubble hangs below its point instead of standing above it, for things at the top edge. */
  below?: boolean;
  /** Something the learner has not opened yet. */
  unread?: boolean;
  /** The part of the screen the thread is about, left clear while it is open. */
  target: Box;
  messages: Message[];
};

export const THREADS: Thread[] = [
  {
    id: "foil-controls",
    page: "overview",
    title: "Foil controls thread",
    authors: ["VO"],
    unread: true,
    indicator: { left: 540, top: 470 },
    target: { left: 602, top: 52, width: 181, height: 533 },
    messages: [
      {
        id: "foil-controls-1",
        author: "VO",
        at: "2026-10-02T15:32:00",
        text: "The button sometimes need you to click quite hard to react.",
      },
    ],
  },
  {
    id: "dimming-button",
    page: "all",
    title: "Dimming button thread",
    authors: ["KS"],
    unread: true,
    below: true,
    indicator: { left: 662, top: 50 },
    target: { left: 640, top: 0, width: 48, height: 48 },
    messages: [
      {
        id: "dimming-button-1",
        author: "KS",
        at: "2026-10-02T15:12:00",
        text: "I prefer to use the dimmed state even in daylight.",
      },
    ],
  },
  {
    id: "chart",
    page: "decision",
    title: "Thread",
    subject: "Wave conditions",
    authors: ["IM"],
    indicator: { left: 330, top: 96 },
    target: { left: 40, top: 130, width: 360, height: 200 },
    messages: [
      {
        id: "chart-1",
        at: "2026-10-01T11:05:00",
        author: "IM",
        pinned: true,
        text: "The forecast tends to overshoot when the waves build quickly, so I trust the solid line more than the dotted one.",
      },
      {
        id: "chart-2",
        at: "2026-10-01T11:12:00",
        author: "IM",
        text: "When the two lines are far apart I wait for the actual line to settle before I decide on the foils.",
      },
    ],
  },
  {
    id: "power",
    page: "decision",
    title: "Thread",
    subject: "Engine power",
    authors: ["HT", "AR", "KN"],
    indicator: { left: 690, top: 62 },
    target: { left: 430, top: 112, width: 340, height: 60 },
    messages: [
      {
        id: "power-1",
        at: "2026-10-01T13:20:00",
        author: "HT",
        pinned: true,
        text: "Make sure to stay out of the no-go area, especially when foils are activated, as it is harder to feel the impact on the vessel with the reduced motion from the foils.",
      },
      {
        id: "power-2",
        at: "2026-10-01T13:48:00",
        author: "AR",
        text: "I have noticed this when coming around Hitra on the north side, the current there is heavy on the ship in high speed!",
      },
    ],
  },
];

/** Whether a comment is shown on a page. */
export function onPage(thread: Thread, page: AppPage): boolean {
  return thread.page === "all" || thread.page === page;
}

/** The panel opens on the side away from what the thread is about. */
export function panelSide(target: Box): "left" | "right" {
  return target.left + target.width / 2 < 393 ? "right" : "left";
}

export function lastMessage(thread: Thread): Message | undefined {
  return thread.messages[thread.messages.length - 1];
}

/** The comments with something in them, most recently written first. */
export function recentThreads(threads: Thread[]): Thread[] {
  return threads
    .filter((thread) => thread.messages.length > 0)
    .sort(
      (a, b) =>
        new Date(lastMessage(b)!.at).getTime() - new Date(lastMessage(a)!.at).getTime(),
    );
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "02 oct 2026" and "15:32", the way the list sets them. */
export function formatWhen(iso: string): { date: string; time: string } {
  const at = new Date(iso);
  const two = (value: number) => String(value).padStart(2, "0");
  return {
    date: `${two(at.getDate())} ${MONTHS[at.getMonth()]} ${at.getFullYear()}`,
    time: `${two(at.getHours())}:${two(at.getMinutes())}`,
  };
}
