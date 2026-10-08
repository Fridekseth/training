"use client";

import { CONDITIONS, type Conditions } from "./conditions";

/**
 * Not part of the interface: the prototype has no live sea, so this stands in
 * for it. It sits outside the screen and sets the state of the sea that the
 * decision support page reads.
 */
export function ConditionsPicker({
  value,
  onChange,
}: {
  value: Conditions;
  onChange: (next: Conditions) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Simulated sea state"
      className="mx-auto mt-4 flex max-w-[786px] flex-wrap items-center gap-3 text-sm text-muted"
    >
      <span>Simulated sea state</span>
      <div className="inline-flex overflow-hidden rounded-md border border-border">
        {CONDITIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={value === item.id}
            onClick={() => onChange(item.id)}
            className={`px-3 py-1.5 transition-colors ${
              value === item.id ? "bg-foreground text-background" : "hover:bg-border/40"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
