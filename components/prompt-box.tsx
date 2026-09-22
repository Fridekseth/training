import type { ReactNode } from "react";

/**
 * The prompt that produced a prototype, set apart from the surrounding text so
 * it reads as material rather than prose. Line breaks in the child text are
 * kept, so a prompt can be pasted in as written.
 */
export function PromptBox({
  label = "Prompt",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-6 rounded-xl border border-border bg-surface">
      <figcaption className="border-b border-border px-4 py-2 text-xs tracking-wide text-faint">
        {label}
      </figcaption>
      <div className="px-4 py-3 text-[0.9rem] leading-6 whitespace-pre-wrap text-foreground">
        {children}
      </div>
    </figure>
  );
}
