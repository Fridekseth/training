import Link from "next/link";
import { SectionMenu } from "@/components/docs/section-menu";
import { Todo } from "@/components/docs/doc-parts";
import { ArrowBack } from "@/components/icons";
import { Pill } from "@/components/pill";
import { getDocumentationSection, getSectionItems, type SectionKey } from "@/lib/documentation";
import { PAGE_CONTAINER } from "@/lib/layout";

/** The page of one item in a section that is not components, with the menu of the section at the side. */
export function SectionItemPage({ section: key, slug }: { section: SectionKey; slug: string }) {
  const section = getDocumentationSection(key);
  const items = getSectionItems(key);
  const item = items.find((candidate) => candidate.slug === slug)!;

  return (
    <div className={`${PAGE_CONTAINER} py-10`}>
      <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6">
            <SectionMenu section={key} title={section.title} items={items} current={slug} />
          </div>
        </aside>

        <div className="min-w-0">
          <details className="mb-6 rounded-lg border border-border px-4 py-3 lg:hidden">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              All in {section.title.toLowerCase()}
            </summary>
            <div className="mt-4">
              <SectionMenu section={key} title={section.title} items={items} current={slug} />
            </div>
          </details>

          <header>
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-sm text-muted"
            >
              <ArrowBack className="size-3.5" />
              <Link href="/documentation" className="transition-colors hover:text-accent">
                Documentation
              </Link>
              <span aria-hidden="true" className="text-faint">
                /
              </span>
              <Link
                href={`/documentation/${key}`}
                className="transition-colors hover:text-accent"
              >
                {section.title}
              </Link>
            </nav>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {item.title}
              </h1>
              <Pill>Planned</Pill>
            </div>
          </header>

          <div className="mt-8 max-w-[46rem]">
            <Todo>This page is not written yet.</Todo>
          </div>
        </div>
      </div>
    </div>
  );
}
