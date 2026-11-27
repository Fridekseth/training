import Link from "next/link";
import type { ComponentDoc } from "@/lib/component-docs";

/**
 * The list of every component, with the one being read
 * marked. It is the side menu on a wide screen and a folded list on a narrow one.
 */
export function DocNav({ docs, current }: { docs: ComponentDoc[]; current?: string }) {
  return (
    <nav aria-label="Components" className="text-sm">
      <Link
        href="/documentation/components"
        className={`mb-4 block font-medium transition-colors hover:text-accent ${
          current ? "text-foreground" : "text-accent"
        }`}
      >
        All components
      </Link>

      <ul className="space-y-0.5 border-l border-border">
        {docs.map((doc) => {
          const active = doc.slug === current;
          return (
            <li key={doc.slug}>
              <Link
                href={`/documentation/components/${doc.slug}`}
                aria-current={active ? "page" : undefined}
                className={`-ml-px flex items-center justify-between gap-2 border-l py-1 pr-2 pl-3 transition-colors ${
                  active
                    ? "border-accent font-medium text-accent"
                    : "border-transparent text-muted hover:border-border hover:text-foreground"
                }`}
              >
                <span>{doc.title}</span>
                {doc.status === "planned" ? (
                  <span aria-label="Planned" className="size-1.5 rounded-full border border-faint" />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
