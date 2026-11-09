import Link from "next/link";
import { Pill } from "@/components/pill";
import type { SectionItem, SectionKey } from "@/lib/documentation";

/**
 * The pages of a section as cards that look like the ones for components. They
 * have no picture or line of text until their page is written.
 */
export function PlannedItems({ section, items }: { section: SectionKey; items: SectionItem[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.slug}>
          <Link
            href={`/documentation/${section}/${item.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent"
          >
            <div className="grid aspect-[16/9] place-items-center border-b border-border bg-accent-soft">
              <span className="text-sm text-faint">No preview yet</span>
            </div>
            <div className="flex items-center justify-between gap-3 p-4">
              <h3 className="text-base font-semibold tracking-tight text-foreground group-hover:text-accent">
                {item.title}
              </h3>
              <Pill>Planned</Pill>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
