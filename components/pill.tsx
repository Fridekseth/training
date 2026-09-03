import type { ReactNode } from "react";

type PillProps = {
  children: ReactNode;
  /** `solid` marks the primary label (stage, category); `quiet` marks keywords. */
  tone?: "solid" | "quiet";
};

export function Pill({ children, tone = "quiet" }: PillProps) {
  const styles =
    tone === "solid"
      ? "bg-accent-soft text-accent"
      : "border border-border text-faint";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${styles}`}
    >
      {children}
    </span>
  );
}
