import Link from "next/link";
import { CATEGORIES, type ComponentDoc } from "@/lib/component-docs";

/**
 * The list of every component, grouped by category, with the one being read
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

      {CATEGORIES.map((category) => {
        const inGroup = docs.filter((doc) => doc.category === category);
        if (!inGroup.length) return null;
        return (
          <div key={category} className="mb-5">
            <p className="mb-1.5 text-xs font-medium tracking-wide text-faint uppercase">
              {category}
            </p>
            <ul className="space-y-0.5 border-l border-border">
              {inGroup.map((doc) => {
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
          </div>
        );
      })}
    </nav>
  );
}
