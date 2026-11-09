import Link from "next/link";
import type { SectionItem, SectionKey } from "@/lib/documentation";

/**
 * The list of the pages in a section, with the one being read marked. It is the
 * side menu on a wide screen and a folded list on a narrow one.
 */
export function SectionMenu({
  section,
  title,
  items,
  current,
}: {
  section: SectionKey;
  title: string;
  items: SectionItem[];
  current: string;
}) {
  return (
    <nav aria-label={title} className="text-sm">
      <Link
        href={`/documentation/${section}`}
        className="mb-4 block font-medium text-foreground transition-colors hover:text-accent"
      >
        {title}
      </Link>
      <ul className="space-y-0.5 border-l border-border">
        {items.map((item) => {
          const active = item.slug === current;
          return (
            <li key={item.slug}>
              <Link
                href={`/documentation/${section}/${item.slug}`}
                aria-current={active ? "page" : undefined}
                className={`-ml-px block border-l py-1 pr-2 pl-3 transition-colors ${
                  active
                    ? "border-accent font-medium text-accent"
                    : "border-transparent text-muted hover:border-border hover:text-foreground"
                }`}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
