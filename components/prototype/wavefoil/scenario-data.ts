/**
 * The scenarios of the Scenarios page that can be played. Each is a list of
 * things the learner should do, in order, while the screen changes around them.
 */

export type ScenarioStepId = "caution" | "investigate" | "retract" | "ack";

export type ScenarioStep = {
  id: ScenarioStepId;
  /** What the step menu says. */
  label: string;
};

export type ScenarioDef = {
  id: string;
  title: string;
  icon: string;
  steps: ScenarioStep[];
};

/** Foils are out, the weather turns, and the learner is to find out why and take the foils in. */
export const HEAVY_SEAS: ScenarioDef = {
  id: "heavy-seas",
  title: "Heavy seas",
  /** The icon the Scenarios page gives it, drawn in the menu header too. */
  icon: "wf-heavy-seas",
  steps: [
    { id: "caution", label: "Caution message appears" },
    { id: "investigate", label: "Investigate in decision support" },
    { id: "retract", label: "Retract foils" },
    { id: "ack", label: "ACK caution" },
  ],
};

export const PLAYABLE_SCENARIOS: Record<string, ScenarioDef> = {
  [HEAVY_SEAS.id]: HEAVY_SEAS,
};
