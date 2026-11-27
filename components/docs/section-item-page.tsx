import { SectionMenu } from "@/components/docs/section-menu";
import { Todo } from "@/components/docs/doc-parts";
import { Pill } from "@/components/pill";
import {
  ITEM_STATUS_LABEL,
  getDocumentationSection,
  getSectionItemContent,
  getSectionItems,
  type SectionKey,
} from "@/lib/documentation";
import { PAGE_CONTAINER } from "@/lib/layout";

/** The page of one item in a section that is not components, with the menu of the section at the side. */
export async function SectionItemPage({ section: key, slug }: { section: SectionKey; slug: string }) {
  const section = getDocumentationSection(key);
  const items = getSectionItems(key);
  const item = items.find((candidate) => candidate.slug === slug)!;
  const Content = await getSectionItemContent(key, slug);

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
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {item.title}
              </h1>
              {ITEM_STATUS_LABEL[item.status] ? <Pill>{ITEM_STATUS_LABEL[item.status]}</Pill> : null}
              {item.beta ? <Pill tone="beta">Beta</Pill> : null}
            </div>
          </header>

          <article className="mt-8 max-w-[46rem]">
            {Content ? <Content /> : <Todo>This page is not written yet.</Todo>}
          </article>
        </div>
      </div>
    </div>
  );
}
