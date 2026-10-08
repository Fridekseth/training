/**
 * The guided sequences of Getting started. Each step lights one part of the
 * screen and explains it. The rectangles and where the explanation sits are the
 * design's own, in the 786 x 590 screen's pixels; the text is the design's too.
 */

import type { Conditions } from "./conditions";
import type { AppPage } from "./explore-data";

export type Rect = { left: number; top: number; width: number; height: number };

export type GuidedStep = {
  label: string;
  text: string;
  /** The part of the screen left clear while everything else is washed; none washes it all. */
  hole: Rect | null;
  /** Where the explanation sits; steps explaining something above it hang from the bottom. */
  tip: { left: number; width: number; top?: number; bottom?: number };
  /** The side of the explanation the pointer is on, towards the part it explains. */
  arrow: "left" | "right" | "top" | "bottom" | null;
};

/** A question of a chapter's test: something to do on the screen, or a scenario to watch and describe. */
export type TestQuestion =
  | {
      kind: "scenario";
      title: string;
      text: string;
      /** What the toast says while the scenario runs, when that is more than the title. */
      toast?: string;
      /** How far out the foils are when the scenario opens. */
      start: number;
      /** What ends it: the foils out, the foils in, or stopped before fully out and then taken in. */
      goal: "deploy" | "retract" | "halfway-retract";
      /** It ends by itself after this long, if the goal has not been reached. */
      seconds: number;
      /** The sea the decision support page reads, when the question is about it. */
      conditions?: Conditions;
    }
  | {
      kind: "watch";
      title: string;
      text: string;
      /** What happens on its own while the learner watches: the foils deploying, being stopped half way, or nothing but the page to look at. */
      script: "deploying" | "stopped-halfway" | "look";
      /** How far out the foils are when it opens; they start in when it is left out. */
      start?: number;
      /** The time the scenario takes, which the toast counts down. */
      seconds: number;
      /** The sea the decision support page reads, when the question is about it. */
      conditions?: Conditions;
      options: string[];
      /** The index of the option that describes the scenario. */
      correct: number;
    }
  | {
      /** A question that needs no scenario: the answers are there at once, with nothing to look at first. */
      kind: "ask";
      title: string;
      text: string;
      options: string[];
      /** The index of the right option. */
      correct: number;
      conditions?: Conditions;
    };

/** What the learner did on a question, for the results. */
export type TestResult = { question: string; answer: string; correct: boolean };

export type GuidedSequence = {
  id: string;
  title: string;
  icon: string;
  /** The page the sequence runs on. */
  page: AppPage;
  /** How far out the foils are when it starts, so the controls are in the state the steps describe. */
  deployment: number;
  /** The sea the decision support page reads while the steps run. */
  conditions?: Conditions;
  /** Whether the menu is shown folded to its icons on the first step; some chapters do not point at it. */
  rail?: boolean;
  steps: GuidedStep[];
  /** The questions of the last step, which is the chapter's test. */
  test?: TestQuestion[];
};

const DESCRIPTIONS = [
  "The foils are deploying.",
  "The foils are retracting.",
  "The foil deployment has been stopped mid action.",
  "The foil retraction has been stopped mid action.",
];

export const OPERATING_THE_FOILS: GuidedSequence = {
  id: "operating-the-foils",
  title: "Operating the foils",
  icon: "wf-operating-the-foils",
  page: "overview",
  deployment: 100,
  steps: [
    {
      label: "Overview in menu",
      text: "The foils are operated in the overview page in the menu",
      hole: { left: 0, top: 48, width: 56, height: 57 },
      tip: { left: 71, top: 52, width: 379 },
      arrow: "left",
    },
    {
      label: "Foil status illustration",
      text: "Provides an overview of the foil status from the point of view of the bridge. Blue, extended foils indicate that the foils are deployed. Grey foils indicate retracted foils.",
      hole: { left: 207, top: 48, width: 376, height: 248 },
      tip: { left: 207, top: 311, width: 379 },
      arrow: "top",
    },
    {
      label: "PORT foil progress bar",
      text: "The bar on the left side of the screen shows the progress of the foil deployment. Compare this bar to its STBD counterpart, to notice any irregularities during deployment.",
      hole: { left: 70, top: 96, width: 145, height: 328 },
      tip: { left: 232, top: 140, width: 379 },
      arrow: "left",
    },
    {
      label: "STBD foil progress bar",
      text: "The bar on the right side of the screen shows the progress of the foil deployment. Compare this bar to its PORT counterpart, to notice any irregularities during deployment.",
      hole: { left: 568, top: 96, width: 145, height: 328 },
      tip: { left: 170, top: 140, width: 379 },
      arrow: "right",
    },
    {
      label: "Foil controls: Deploy",
      text: "The deploy button lets you deploy the foils. Deployment takes about 2-3 minutes.",
      hole: { left: 47, top: 463, width: 231, height: 107 },
      tip: { left: 31, bottom: 150, width: 262 },
      arrow: "bottom",
    },
    {
      label: "Foil controls: Retract",
      text: "The retract button lets you retract the foils. Retraction takes about 2-3 minutes.",
      hole: { left: 276, top: 464, width: 231, height: 107 },
      tip: { left: 261, bottom: 142, width: 262 },
      arrow: "bottom",
    },
    {
      label: "Foil controls: Stop",
      text: "The stop button lets you stop any foil control operation.",
      hole: { left: 509, top: 464, width: 231, height: 107 },
      tip: { left: 491, bottom: 143, width: 262 },
      arrow: "bottom",
    },
    {
      label: "Test",
      text: "",
      hole: null,
      tip: { left: 0, width: 0 },
      arrow: null,
    },
  ],
  test: [
    {
      kind: "scenario",
      title: "Deploy the foils",
      text: "Deploy the foils in the scenario. The scenario automatically ends once foils are deployed, or after 30 seconds.",
      start: 0,
      goal: "deploy",
      seconds: 30,
    },
    {
      kind: "scenario",
      title: "Retract the foils",
      text: "Retract the foils in the scenario. The scenario automatically ends once foils are retracted, or after 30 seconds.",
      start: 100,
      goal: "retract",
      seconds: 30,
    },
    {
      kind: "watch",
      title: "What description would best fit this scenario?",
      text: "Look at the scenario, and choose the answer that best describes it.",
      script: "deploying",
      seconds: 7,
      options: DESCRIPTIONS,
      correct: 0,
    },
    {
      kind: "watch",
      title: "What description would best fit this scenario?",
      text: "Look at the scenario, and choose the answer that best describes it.",
      script: "stopped-halfway",
      seconds: 9,
      options: DESCRIPTIONS,
      correct: 2,
    },
    {
      kind: "scenario",
      title: "Stop a deployment",
      text: "Start a deployment, but stop it before it is fully deployed, and then retract the foils again.",
      toast: "Start a deployment, but stop it before it is fully deployed, and then retract the foils again.",
      start: 0,
      goal: "halfway-retract",
      seconds: 60,
    },
  ],
};

/*
  The other chapters follow the pattern of the first: a run through the main
  parts of the page, then a test. Their rectangles are worked out from the
  pages' own layout rather than drawn in the design, and the words are written
  for them, so both are for checking against the screen.
*/

/** The foil controls along the bottom, which decision support shares with the overview. */
const CONTROLS: Rect = { left: 47, top: 463, width: 693, height: 107 };

const ACT_DEPLOY =
  "The page advises an action. Carry it out in the scenario. The scenario automatically ends once the foils are deployed, or after 30 seconds.";
const ACT_RETRACT =
  "The page advises an action. Carry it out in the scenario. The scenario automatically ends once the foils are retracted, or after 30 seconds.";
const LOOK = "Look at the screen, and choose the answer that is right.";
const CHOOSE = "Choose the answer that is right.";

export const DECISION_SUPPORT: GuidedSequence = {
  id: "decision-support",
  title: "Decision support",
  icon: "wf-menu-help",
  page: "decision",
  deployment: 0,
  conditions: "ideal",
  steps: [
    {
      label: "Decision support in menu",
      text: "Decision support is opened from the menu.",
      hole: { left: 0, top: 96, width: 56, height: 57 },
      tip: { left: 71, top: 100, width: 379 },
      arrow: "left",
    },
    {
      label: "Wave conditions",
      text: "Shows the sea around the vessel: the wave height measured now, and how it is expected to develop over the next two hours.",
      hole: { left: 4, top: 52, width: 297, height: 380 },
      tip: { left: 316, top: 100, width: 379 },
      arrow: "left",
    },
    {
      label: "Vessel motion",
      text: "Shows how the vessel moves in the waves, as pitch and heave. The blue mark on the dial is the pitch the advice aims for.",
      hole: { left: 305, top: 52, width: 233, height: 380 },
      tip: { left: 28, top: 100, width: 262 },
      arrow: "right",
    },
    {
      label: "Engine power",
      text: "Shows how much of the engine's maximum power is in use. The blue mark on the gauge is the level the advice aims for.",
      hole: { left: 542, top: 52, width: 240, height: 380 },
      tip: { left: 148, top: 100, width: 379 },
      arrow: "right",
    },
    {
      label: "Advice",
      text: "Each card ends with an advice frame. Blue says the foils will help, yellow warns against using them, and grey says that their effect is unclear.",
      hole: { left: 33, top: 328, width: 236, height: 83 },
      tip: { left: 285, top: 190, width: 379 },
      arrow: "left",
    },
    {
      label: "Recommended action",
      text: "The control the page recommends is marked with a tag. The controls work as they do on the overview.",
      hole: { left: CONTROLS.left, top: 445, width: CONTROLS.width, height: 126 },
      tip: { left: 204, bottom: 160, width: 379 },
      arrow: "bottom",
    },
    { label: "Test", text: "", hole: null, tip: { left: 0, width: 0 }, arrow: null },
  ],
  test: [
    {
      kind: "scenario",
      title: "Follow the advice",
      text: ACT_DEPLOY,
      toast: "Follow the advice on the page.",
      start: 0,
      goal: "deploy",
      seconds: 30,
      conditions: "ideal",
    },
    {
      kind: "scenario",
      title: "Follow the advice",
      text: ACT_RETRACT,
      toast: "Follow the advice on the page.",
      start: 100,
      goal: "retract",
      seconds: 30,
      conditions: "harmful",
    },
    {
      kind: "watch",
      title: "What does the page advise?",
      text: LOOK,
      script: "look",
      start: 0,
      seconds: 8,
      conditions: "harmful",
      options: [
        "Deploy the foils.",
        "Retract the foils.",
        "Keep the foils retracted.",
        "Stop the deployment.",
      ],
      correct: 2,
    },
    {
      kind: "watch",
      title: "Which control does the page recommend?",
      text: LOOK,
      script: "look",
      start: 0,
      seconds: 8,
      conditions: "ideal",
      options: ["Deploy foils", "Retract foils", "Stop", "None of them"],
      correct: 0,
    },
  ],
};

export const DEBRIEFING: GuidedSequence = {
  id: "debriefing",
  title: "Debriefing",
  icon: "wf-menu-debriefing",
  page: "debriefing",
  deployment: 0,
  steps: [
    {
      label: "Debriefing in menu",
      text: "Debriefing is opened from the menu. It shows how a trip went.",
      hole: { left: 0, top: 144, width: 56, height: 57 },
      tip: { left: 71, top: 150, width: 379 },
      arrow: "left",
    },
    {
      label: "Trip",
      text: "Picks the trip to look at. Everything else on the page shows that trip.",
      hole: { left: 18, top: 64, width: 293, height: 40 },
      tip: { left: 326, top: 52, width: 379 },
      arrow: "left",
    },
    {
      label: "Timeline",
      text: "Lists what happened during the trip, from the waypoints passed to the foils being deployed and retracted, with the time of each.",
      hole: { left: 4, top: 215, width: 322, height: 371 },
      tip: { left: 342, top: 290, width: 379 },
      arrow: "left",
    },
    {
      label: "Route",
      text: "Shows where the vessel went. The foil symbol marks where the foils were out.",
      hole: { left: 330, top: 52, width: 452, height: 334 },
      tip: { left: 40, top: 130, width: 262 },
      arrow: "right",
    },
    {
      label: "Graph",
      text: "Shows how a value changed during the trip. The blue areas are where the foils were out, so their effect can be seen.",
      hole: { left: 330, top: 390, width: 452, height: 196 },
      tip: { left: 425, bottom: 220, width: 262 },
      arrow: "bottom",
    },
    {
      label: "Value in the graph",
      text: "Changes which value the graph shows: speed, engine power or pitch.",
      hole: { left: 332, top: 392, width: 152, height: 36 },
      tip: { left: 340, bottom: 220, width: 262 },
      arrow: "bottom",
    },
    { label: "Test", text: "", hole: null, tip: { left: 0, width: 0 }, arrow: null },
  ],
  test: [
    {
      kind: "ask",
      title: "What do the blue areas in the graph show?",
      text: CHOOSE,
      options: [
        "Where the foils were out.",
        "Where the waves were too heavy.",
        "Where the vessel stopped.",
        "The time of day.",
      ],
      correct: 0,
    },
    {
      kind: "watch",
      title: "Why were the foils retracted at 15:58?",
      text: LOOK,
      script: "look",
      start: 0,
      seconds: 10,
      options: [
        "The waves were too heavy.",
        "There was a lack of waves.",
        "The engine failed.",
        "The trip was over.",
      ],
      correct: 1,
    },
    {
      kind: "watch",
      title: "Which trip is shown?",
      text: LOOK,
      script: "look",
      start: 0,
      seconds: 6,
      options: ["Bergen - Bodø", "Bodø - Bergen", "Bergen - Tromsø", "Trondheim - Bodø"],
      correct: 0,
    },
  ],
};

export const ALARMS: GuidedSequence = {
  id: "alarms",
  title: "Alarms",
  icon: "wf-menu-alerts",
  page: "alarms",
  deployment: 0,
  steps: [
    {
      label: "Alerts in menu",
      text: "Alerts are opened from the menu. It collects the alarms, warnings and cautions from the foil drive.",
      hole: { left: 0, top: 438, width: 56, height: 57 },
      tip: { left: 71, top: 330, width: 379 },
      arrow: "left",
    },
    {
      label: "The list",
      text: "Every alert has its type, what raised it and the time. The types are alarm, warning and caution.",
      hole: { left: 4, top: 52, width: 778, height: 190 },
      tip: { left: 203, top: 262, width: 379 },
      arrow: "top",
    },
    {
      label: "List filter",
      text: "Chooses which alerts are listed: all of them, or only those that have not been acknowledged.",
      hole: { left: 0, top: 540, width: 214, height: 50 },
      tip: { left: 4, bottom: 72, width: 262 },
      arrow: "bottom",
    },
    {
      label: "Silence and acknowledge",
      text: "The speaker silences the alarm sound. ACK visible acknowledges all the alerts in the list at once.",
      hole: { left: 526, top: 540, width: 260, height: 50 },
      tip: { left: 500, bottom: 72, width: 262 },
      arrow: "bottom",
    },
    { label: "Test", text: "", hole: null, tip: { left: 0, width: 0 }, arrow: null },
  ],
  test: [
    {
      kind: "ask",
      title: "Which button acknowledges the alerts in the list?",
      text: CHOOSE,
      options: ["The speaker", "ACK visible", "The list filter", "The menu item"],
      correct: 1,
    },
    {
      kind: "ask",
      title: "What does the list filter do?",
      text: CHOOSE,
      options: [
        "Chooses which alerts are shown.",
        "Silences the alarm sound.",
        "Acknowledges the alerts.",
        "Clears the alerts from the system.",
      ],
      correct: 0,
    },
    {
      kind: "ask",
      title: "Which types of alert can be in the list?",
      text: CHOOSE,
      options: [
        "Alarm, warning and caution.",
        "Info, notice and advice.",
        "Red, yellow and green.",
        "Critical and minor.",
      ],
      correct: 0,
    },
  ],
};


export const APPLICATION_PATTERNS: GuidedSequence = {
  id: "application-patterns",
  title: "Application patterns",
  icon: "application-patterns",
  page: "overview",
  deployment: 0,
  // It is about the bar and the controls that every page shares, not about a page in the menu.
  rail: false,
  steps: [
    {
      label: "Menu button",
      text: "Opens the menu, with the pages of the application and the training.",
      hole: { left: 0, top: 0, width: 56, height: 48 },
      tip: { left: 8, top: 66, width: 379 },
      arrow: "top",
    },
    {
      label: "Page name",
      text: "Shows the application and the page you are on.",
      hole: { left: 52, top: 0, width: 236, height: 48 },
      tip: { left: 60, top: 66, width: 379 },
      arrow: "top",
    },
    {
      label: "Alert button",
      text: "Opens the alarm system, with all the alerts from the foil drive.",
      hole: { left: 543, top: 0, width: 52, height: 48 },
      tip: { left: 400, top: 66, width: 379 },
      arrow: "top",
    },
    {
      label: "Advice button",
      text: "Opens the list of advice from the system. It is the star in a speech bubble.",
      hole: { left: 595, top: 0, width: 48, height: 48 },
      tip: { left: 400, top: 66, width: 379 },
      arrow: "top",
    },
    {
      label: "Brilliance",
      text: "Switches the screen between day and dusk colours, for the light on the bridge.",
      hole: { left: 643, top: 0, width: 48, height: 48 },
      tip: { left: 400, top: 66, width: 379 },
      arrow: "top",
    },
    {
      label: "Greyed out controls",
      text: "A control that cannot be used in the current state is greyed out. With the foils in, only deploy is available.",
      hole: { left: 276, top: 464, width: 464, height: 107 },
      tip: { left: 300, bottom: 142, width: 379 },
      arrow: "bottom",
    },
    { label: "Test", text: "", hole: null, tip: { left: 0, width: 0 }, arrow: null },
  ],
  test: [
    {
      kind: "ask",
      title: "What does the button with the sun and moon do?",
      text: CHOOSE,
      options: [
        "Switches between day and dusk colours.",
        "Silences the alarm sound.",
        "Opens the menu.",
        "Turns the screen off.",
      ],
      correct: 0,
    },
    {
      kind: "ask",
      title: "Which button opens the list of advice?",
      text: CHOOSE,
      options: ["The bell", "The star in a speech bubble", "The sun and moon", "The menu button"],
      correct: 1,
    },
    {
      kind: "ask",
      title: "Where do you go to see the alarms?",
      text: CHOOSE,
      options: [
        "The alert button in the top bar",
        "The sun and moon button",
        "The page name",
        "The clock",
      ],
      correct: 0,
    },
    {
      kind: "ask",
      title: "What does a greyed out control mean?",
      text: CHOOSE,
      options: [
        "It cannot be used in the current state.",
        "It is out of order.",
        "It is the one recommended.",
        "It was the last one used.",
      ],
      correct: 0,
    },
  ],
};

/** Every chapter that has a sequence, by the id of the chapter it belongs to. */
export const SEQUENCES: Record<string, GuidedSequence> = {
  [APPLICATION_PATTERNS.id]: APPLICATION_PATTERNS,
  [OPERATING_THE_FOILS.id]: OPERATING_THE_FOILS,
  [DECISION_SUPPORT.id]: DECISION_SUPPORT,
  [DEBRIEFING.id]: DEBRIEFING,
  [ALARMS.id]: ALARMS,
};
