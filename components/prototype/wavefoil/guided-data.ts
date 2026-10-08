/**
 * The guided sequences of Getting started. Each step lights one part of the
 * screen and explains it. The rectangles and where the explanation sits are the
 * design's own, in the 786 x 590 screen's pixels; the text is the design's too.
 */

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

/** A question of a chapter's test: something to do on the screen, or something to answer. */
export type TestQuestion =
  | {
      kind: "scenario";
      title: string;
      text: string;
      /** How far out the foils are when the scenario opens. */
      start: number;
      /** What ends it: the foils out, the foils in, or stopped about half way and then taken in. */
      goal: "deploy" | "retract" | "halfway-retract";
      /** It ends by itself after this long, if the goal has not been reached. */
      seconds: number;
    }
  | {
      kind: "choice";
      title: string;
      text: string;
      options: string[];
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
  steps: GuidedStep[];
  /** The questions of the last step, which is the chapter's test. */
  test?: TestQuestion[];
};

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
      kind: "choice",
      title: "Are the foils retracted?",
      text: "Look at the foils on the screen as you left them, and answer.",
      options: ["Yes", "No"],
    },
    {
      kind: "scenario",
      title: "Stop deployment at about 50%, and retract the foils",
      text: "Stop the deployment at about 50%, and then retract the foils. The scenario automatically ends once foils are retracted, or after 60 seconds.",
      start: 0,
      goal: "halfway-retract",
      seconds: 60,
    },
  ],
};
