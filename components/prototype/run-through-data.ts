/**
 * The Topping run-through. Steps 1 to 3 carry the text from the design file;
 * the later ones are listed in the menu the way the design lists them, with no
 * text written yet.
 */

export type Step = {
  /** Matches a `data-step` attribute on the main interface. */
  target: string | null;
  label: string;
  description?: string;
};

export const TOPPING_STEPS: Step[] = [
  {
    target: "data-panel",
    label: "Data panel",
    description:
      "Provides a shared overview of production performance, stops, alerts, and tasks across the entire production line, enabling operators in different departments and roles to maintain a common understanding of production status.",
  },
  {
    target: "alerts",
    label: "Alerts",
    description:
      "This component shows all active alerts, and the most recent alerts on the line. All workstations on the line see all alerts, even though they might not be relevant at that station.",
  },
  {
    target: "tasks",
    label: "Tasks",
    description: "This component shows all tasks.",
  },
  { target: "performance", label: "Performance & production" },
  { target: "production", label: "Production" },
  { target: "stops", label: "Stops" },
  { target: null, label: "" },
  { target: null, label: "" },
  { target: "freezer", label: "Freezer" },
];

/** The steps that have text, and so can be visited. */
export const WRITTEN_STEPS = TOPPING_STEPS.filter((step) => step.description).length;
