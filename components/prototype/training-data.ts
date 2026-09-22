/**
 * Content for the training prototype, kept apart from the markup so a screen
 * can be changed without touching layout. Text is taken from the Figma file.
 */

export type PageId = "home" | "overview" | "getting-started" | "explore" | "scenarios";

export type PageDef = {
  id: PageId;
  label: string;
  /** File under /public/prototype/icons, drawn as a mask so it can be tinted. */
  icon: string;
  /** Shown on the home page cards. */
  description: string;
  /** Small dot on the menu item, for "something new here". */
  badge?: boolean;
};

export const PAGES: PageDef[] = [
  {
    id: "overview",
    label: "Overview",
    icon: "nav-overview",
    description: "Training log with personal advice for better learnig.",
    badge: true,
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
    description: "Explore the application freely.",
  },
  {
    id: "scenarios",
    label: "Scenarios",
    icon: "nav-scenarios",
    description: "Practice critical situations in simulated scenarios.",
  },
];

export const HOME: PageDef = {
  id: "home",
  label: "Home",
  icon: "nav-home",
  description: "",
};

export type Status = "completed" | "in-progress" | "not-started";

export type Chapter = {
  id: string;
  title: string;
  icon: string;
  result: number;
  status: Status;
  /** The row the design shows as picked out, e.g. where the learner left off. */
  highlighted?: boolean;
};

export const CHAPTERS: Chapter[] = [
  { id: "application-patterns", title: "Application patterns", icon: "application-patterns", result: 92, status: "completed" },
  { id: "topping", title: "Topping", icon: "topping", result: 20, status: "in-progress", highlighted: true },
  { id: "bakeri", title: "Bakeri", icon: "bakeri", result: 0, status: "not-started" },
  { id: "folie", title: "Folie", icon: "folie", result: 0, status: "not-started" },
  { id: "pakking", title: "Pakking", icon: "pakking", result: 0, status: "not-started" },
];

export const SCENARIOS: Chapter[] = [
  { id: "fire-drill", title: "Fire drill", icon: "fire-drill", result: 92, status: "completed", highlighted: true },
  { id: "alarm", title: "Alarm", icon: "topping", result: 20, status: "in-progress" },
  { id: "bakeri", title: "Bakeri", icon: "bakeri", result: 0, status: "not-started" },
  { id: "folie", title: "Folie", icon: "folie", result: 0, status: "not-started" },
];

export type LogEntry = {
  id: string;
  date: string;
  kind: string;
  title: string;
  result: number;
  status: Status;
};

export const TRAINING_LOG: LogEntry[] = [
  { id: "l1", date: "18.08.2026", kind: "Getting started", title: "Onboarding refresh", result: 92, status: "in-progress" },
  { id: "l2", date: "15.04.2026", kind: "Scenario", title: "Alarm", result: 80, status: "completed" },
  { id: "l3", date: "02.01.2026", kind: "Scenario", title: "Critical alarm", result: 98, status: "completed" },
  { id: "l4", date: "23.11.2025", kind: "Getting started", title: "Onboarding", result: 96, status: "completed" },
];

export const STATUS_LABEL: Record<Status, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  "not-started": "Not started",
};
