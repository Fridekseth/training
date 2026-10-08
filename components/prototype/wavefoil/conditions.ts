/**
 * The state of the sea as the decision support page reads it. The design shows
 * three: waves the foils suit, waves too heavy for them, and waves where their
 * effect is unclear. The prototype has no live sea, so the demo lets the viewer
 * pick one.
 */

export type Conditions = "ideal" | "harmful" | "wicked";

export const CONDITIONS: { id: Conditions; label: string }[] = [
  { id: "ideal", label: "Ideal" },
  { id: "harmful", label: "Harmful" },
  { id: "wicked", label: "Wicked" },
];
