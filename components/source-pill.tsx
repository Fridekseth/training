import Link from "next/link";
import type { ReactNode } from "react";

/**
 * A citation that links straight to its entry on /research, styled like the
 * solid Pill but interactive. Used inside process entries in place of a
 * "Source:" line, so the reference sits inline with the text discussing it.
 */
export function SourcePill({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-accent transition-colors hover:bg-accent hover:text-background"
    >
      {children}
    </Link>
  );
}
