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
  /** Something the learner has not opened yet. */
  unread?: boolean;
  /** The part of the screen the thread is about, left clear while it is open. */
  target: Box;
  messages: Message[];
};

export const THREADS: Thread[] = [
  // ---- the overview ----
  {
    id: "foil-stuck",
    page: "overview",
    title: "Foil thread",
    subject: "Starboard foil",
    authors: ["HT", "AR"],
    unread: true,
    indicator: { left: 481, top: 130 },
    target: { left: 410, top: 165, width: 165, height: 122 },
    messages: [
      {
        id: "foil-stuck-1",
        author: "HT",
        pinned: true,
        at: "2026-10-02T14:05:00",
        text: "I have noticed that the starboard foil sometimes gets stuck. It helps to retract all the way and then deploy again.",
      },
      {
        id: "foil-stuck-2",
        author: "AR",
        at: "2026-10-02T14:20:00",
        text: "So have I! Great tips, will test it out.",
      },
      {
        id: "foil-stuck-3",
        author: "AR",
        at: "2026-10-02T14:21:00",
        text: "I would also strongly discourage sailing with foils not entirely deployed. This causes distress on the motor over time.",
      },
    ],
  },
  {
    id: "stbd-bar",
    page: "overview",
    title: "Deployment bar STBD foil",
    authors: ["MI"],
    unread: true,
    indicator: { left: 669, top: 116 },
    target: { left: 591, top: 145, width: 115, height: 266 },
    messages: [
      {
        id: "stbd-bar-1",
        author: "MI",
        pinned: true,
        at: "2026-10-02T14:40:00",
        text: "Pay close attention to this during deployment!! See my other comment on the STBD foil;)",
      },
    ],
  },
  {
    id: "foil-controls",
    page: "overview",
    title: "Foil controls thread",
    authors: ["VO"],
    indicator: { left: 377, top: 400 },
    target: { left: 1, top: 439, width: 784, height: 151 },
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
    indicator: { left: 665, top: 6 },
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

  // ---- decision support ----
  {
    id: "chart",
    page: "decision",
    title: "Thread",
    subject: "Wave conditions",
    authors: ["IM"],
    indicator: { left: 245, top: 72 },
    target: { left: 4, top: 52, width: 297, height: 380 },
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
    id: "motion",
    page: "decision",
    title: "Thread",
    subject: "Vessel motion",
    authors: ["TM", "IM"],
    unread: true,
    indicator: { left: 490, top: 72 },
    target: { left: 305, top: 52, width: 233, height: 380 },
    messages: [
      {
        id: "motion-1",
        at: "2026-10-01T12:10:00",
        author: "TM",
        pinned: true,
        text: "The pitch reading takes a few seconds to settle after the foils are out, so I wait before I judge the effect.",
      },
      {
        id: "motion-2",
        at: "2026-10-01T12:16:00",
        author: "IM",
        text: "Same here. The heave calms down first.",
      },
    ],
  },
  {
    id: "power",
    page: "decision",
    title: "Thread",
    subject: "Engine power",
    authors: ["HT", "AR", "KN"],
    unread: true,
    indicator: { left: 735, top: 72 },
    target: { left: 542, top: 52, width: 240, height: 380 },
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
  {
    id: "recommended",
    page: "decision",
    title: "Thread",
    subject: "Recommended action",
    authors: ["OI", "TM"],
    indicator: { left: 130, top: 400 },
    target: { left: 1, top: 439, width: 784, height: 151 },
    messages: [
      {
        id: "recommended-1",
        at: "2026-10-01T14:30:00",
        author: "OI",
        pinned: true,
        text: "The recommendation is a good place to start, but I still check the swell direction before I deploy.",
      },
      {
        id: "recommended-2",
        at: "2026-10-01T14:41:00",
        author: "TM",
        text: "Agree, especially with a cross sea.",
      },
    ],
  },

  // ---- debriefing ----
  {
    id: "voyage-log",
    page: "debriefing",
    title: "Thread",
    subject: "Voyage log",
    authors: ["HT", "AR"],
    unread: true,
    indicator: { left: 270, top: 178 },
    target: { left: 4, top: 52, width: 322, height: 534 },
    messages: [
      {
        id: "voyage-log-1",
        at: "2026-10-02T09:15:00",
        author: "HT",
        pinned: true,
        text: "I go through the log after each trip to see where the foils were out and what the waves were doing at the time.",
      },
      {
        id: "voyage-log-2",
        at: "2026-10-02T09:30:00",
        author: "AR",
        text: "It helps to compare the legs. The second one had much calmer water.",
      },
    ],
  },
  {
    id: "route-map",
    page: "debriefing",
    title: "Thread",
    subject: "Route map",
    authors: ["OI"],
    indicator: { left: 700, top: 110 },
    target: { left: 330, top: 52, width: 452, height: 334 },
    messages: [
      {
        id: "route-map-1",
        at: "2026-10-02T09:50:00",
        author: "OI",
        pinned: true,
        text: "Drag the map to find the leg where we retracted. The light blue stretches are where the foils were out.",
      },
    ],
  },
  {
    id: "analytics",
    page: "debriefing",
    title: "Thread",
    subject: "Analytics",
    authors: ["MI", "KS"],
    indicator: { left: 735, top: 400 },
    target: { left: 330, top: 390, width: 452, height: 196 },
    messages: [
      {
        id: "analytics-1",
        at: "2026-10-02T10:20:00",
        author: "MI",
        pinned: true,
        text: "Switch to pitch to see how much the foils actually calmed the vessel. The shaded stretches are the ones to look at.",
      },
      {
        id: "analytics-2",
        at: "2026-10-02T10:34:00",
        author: "KS",
        text: "Good tip, I had only been looking at engine power.",
      },
    ],
  },

  // ---- the alarm system ----
  {
    id: "alarm-list",
    page: "alarms",
    title: "Thread",
    subject: "Alarm list",
    authors: ["KS", "HT"],
    unread: true,
    indicator: { left: 560, top: 160 },
    target: { left: 0, top: 96, width: 786, height: 440 },
    messages: [
      {
        id: "alarm-list-1",
        at: "2026-10-03T08:05:00",
        author: "KS",
        pinned: true,
        text: "Acknowledge the emergency stop first, then the communication errors. The red ones are easy to find at the top.",
      },
      {
        id: "alarm-list-2",
        at: "2026-10-03T08:12:00",
        author: "HT",
        text: "And check the encoder failure before you deploy the foils again.",
      },
    ],
  },
  {
    id: "ack-all",
    page: "alarms",
    title: "Thread",
    subject: "ACK all",
    authors: ["TM"],
    indicator: { left: 690, top: 500 },
    target: { left: 0, top: 542, width: 786, height: 48 },
    messages: [
      {
        id: "ack-all-1",
        at: "2026-10-03T08:40:00",
        author: "TM",
        pinned: true,
        text: "Read the list before you use ACK all. It is easy to clear something you have not looked at.",
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
