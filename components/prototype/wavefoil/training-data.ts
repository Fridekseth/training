/**
 * Content for the Wavefoil training section, taken from the Figma file. The
 * types are the ones the Orkla training already uses; only the content differs.
 */

import type { Chapter, LogEntry, PageDef, PageId } from "../training-data";

/**
 * The Wavefoil training has two pages the Orkla one does not, one for working
 * with the team and one for the mixed test, so its pages have their own ids.
 */
export type WfPageId = PageId | "collaborate" | "test";
export type WfPageDef = Omit<PageDef, "id"> & { id: WfPageId };

export const PAGES: WfPageDef[] = [
  {
    id: "overview",
    label: "Overview",
    icon: "nav-overview",
    description: "Training log with personal advice for better learning.",
  },
  {
    id: "getting-started",
    label: "Learn",
    icon: "nav-getting-started",
    description: "Learn the basics, and get familiar with the system.",
  },
  {
    id: "explore",
    label: "Explore",
    icon: "wf-nav-explore",
    description: "Explore the application freely, without affecting the system.",
  },  {
    id: "collaborate",
    label: "Collaborate",
    icon: "wf-nav-collaborate",
    description: "Share tips and experiences with your team, and read theirs.",
  },
  {
    id: "scenarios",
    label: "Practice",
    icon: "wf-menu-training",
    description: "Practice critical situations in simulated scenarios.",
  },
  {
    id: "test",
    label: "Test",
    icon: "wf-nav-test",
    description: "Test yourself on all the chapters, with the questions mixed.",
  },




];

export const CHAPTERS: Chapter[] = [
  { id: "application-patterns", title: "Application patterns", icon: "application-patterns", result: 92, status: "completed" },
  { id: "operating-the-foils", title: "Operating the foils", icon: "wf-operating-the-foils", result: 0, status: "not-started" },
  { id: "decision-support", title: "Decision support", icon: "wf-menu-help", result: 0, status: "not-started" },
  { id: "debriefing", title: "Debriefing", icon: "wf-menu-debriefing", result: 0, status: "not-started" },
  { id: "alarms", title: "Alarms", icon: "wf-menu-alerts", result: 0, status: "not-started" },
];

export const SCENARIOS: Chapter[] = [
  { id: "docking-alarm", title: "Docking alarm", icon: "wf-docking-alarm", result: 92, status: "completed" },
  { id: "heavy-seas", title: "Heavy seas", icon: "wf-heavy-seas", result: 20, status: "in-progress" },
];

export const TRAINING_LOG: LogEntry[] = [
  { id: "t3", date: "29.09.26", kind: "Test", title: "Mixed test", result: 74, status: "completed" },
  { id: "l1", date: "18.08.26", kind: "Learn", title: "Onboarding refresh", result: 92, status: "in-progress" },
  { id: "t2", date: "11.06.26", kind: "Test", title: "Mixed test", result: 68, status: "completed" },
  { id: "l2", date: "15.04.26", kind: "Practice", title: "Alarm", result: 80, status: "completed" },
  { id: "t1", date: "07.02.26", kind: "Test", title: "Mixed test", result: 61, status: "completed" },
  { id: "l3", date: "02.01.26", kind: "Practice", title: "Critical alarm", result: 98, status: "completed" },
  { id: "l4", date: "23.11.25", kind: "Learn", title: "Onboarding", result: 96, status: "completed" },
];
