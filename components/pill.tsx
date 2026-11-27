import type { ReactNode } from "react";

type PillProps = {
  children: ReactNode;
  /** `solid` marks the primary label (stage, category); `quiet` marks keywords; `beta` marks work that is not fully done. */
  tone?: "solid" | "quiet" | "beta";
};

export function Pill({ children, tone = "quiet" }: PillProps) {
  const styles =
    tone === "solid"
      ? "bg-accent-soft text-accent"
      : tone === "beta"
        ? "border border-accent/40 text-accent"
        : "border border-border text-faint";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${styles}`}
    >
      {children}
    </span>
  );
}
