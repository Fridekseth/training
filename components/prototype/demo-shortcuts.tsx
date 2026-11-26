"use client";

/**
 * Links next to a demo that take it to a part of it, so the parts worth seeing
 * can be reached without finding the way in the demo itself.
 */
export function DemoShortcuts<T extends string>({
  items,
  active,
  onPick,
  row = false,
}: {
  items: readonly (readonly [id: T, label: string])[];
  /** The one the demo was last sent to, if it is still there. */
  active?: T | null;
  onPick: (id: T) => void;
  /** Laid out in a row, for a demo that has no room beside it. */
  row?: boolean;
}) {
  return (
    <nav aria-label="Shortcuts">
      <p className="m-0 mb-2 text-sm font-medium text-faint">Shortcuts</p>
      <ul className={`m-0 flex list-none gap-2 p-0 ${row ? "flex-row flex-wrap" : "flex-col items-start"}`}>
        {items.map(([id, label]) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onPick(id)}
              aria-current={active === id ? "true" : undefined}
              className={`rounded-full border px-3 py-1 text-left text-sm transition-colors ${
                active === id
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted hover:border-accent/40 hover:text-accent"
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
