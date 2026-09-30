/**
 * Content for the Wavefoil training section, taken from the Figma file. The
 * types are the ones the Orkla training already uses; only the content differs.
 */

import type { Chapter, LogEntry, PageDef } from "../training-data";

export const PAGES: PageDef[] = [
  {
    id: "overview",
    label: "Overview",
    icon: "nav-overview",
    description: "Training log with personal advice for better learning.",
  },
  {
    id: "getting-started",
    label: "Getting started",
    icon: "nav-getting-started",
    description: "Learn the basics, and get familiar with the system.",
  },
  {
    id: "explore",
    label: "Explore",
    icon: "nav-explore",
    description: "Explore the application freely, without affecting the system.",
  },
  {
    id: "scenarios",
    label: "Scenarios",
    icon: "nav-scenarios",
    description: "Practice critical situations in simulated scenarios.",
  },
];

export const CHAPTERS: Chapter[] = [
  { id: "application-patterns", title: "Application patterns", icon: "application-patterns", result: 92, status: "completed" },
  { id: "component-overview", title: "Component overview", icon: "wf-component-overview", result: 20, status: "in-progress", highlighted: true },
  { id: "operating-the-foils", title: "Operating the foils", icon: "wf-operating-the-foils", result: 0, status: "not-started" },
  { id: "decision-support", title: "Decision support", icon: "wf-decision-support", result: 0, status: "not-started" },
  { id: "alarms", title: "Alarms", icon: "wf-alarms", result: 0, status: "not-started" },
];

export const SCENARIOS: Chapter[] = [
  { id: "docking-alarm", title: "Docking alarm", icon: "wf-docking-alarm", result: 92, status: "completed" },
  { id: "heavy-seas", title: "Heavy seas", icon: "wf-heavy-seas", result: 20, status: "in-progress", highlighted: true },
];

export const TRAINING_LOG: LogEntry[] = [
  { id: "l1", date: "18.08.26", kind: "Getting started", title: "Onboarding refresh", result: 92, status: "in-progress" },
  { id: "l2", date: "15.04.26", kind: "Scenario", title: "Alarm", result: 80, status: "completed" },
  { id: "l3", date: "02.01.26", kind: "Scenario", title: "Critical alarm", result: 98, status: "completed" },
  { id: "l4", date: "23.11.25", kind: "Getting started", title: "Onboarding", result: 96, status: "completed" },
];
