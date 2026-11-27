import type { Metadata } from "next";
import { ComponentPreview } from "@/components/docs/previews";
import { DocNav } from "@/components/docs/doc-nav";
import { SectionNav } from "@/components/docs/section-nav";
import { Pill } from "@/components/pill";
import {
  STATUS_LABEL,
  getComponentDoc,
  getComponentDocParams,
  getComponentDocs,
} from "@/lib/component-docs";
import { PAGE_CONTAINER } from "@/lib/layout";

export async function generateStaticParams() {
  return getComponentDocParams();
}

// Every page is known at build time, so an unknown slug 404s without rendering.
export const dynamicParams = false;

export async function generateMetadata(
  props: PageProps<"/documentation/components/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const { meta } = await getComponentDoc(slug);
  return { title: `${meta.title} · Components · Documentation`, description: meta.summary };
}

export default async function ComponentPage(props: PageProps<"/documentation/components/[slug]">) {
  const { slug } = await props.params;
  const [{ Content, meta }, docs] = await Promise.all([getComponentDoc(slug), getComponentDocs()]);

  return (
    <div className={`${PAGE_CONTAINER} py-10`}>
      <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        {/* Wide screens: the list of components stays at the side while the page is read. */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6">
            <DocNav docs={docs} current={slug} />
          </div>
        </aside>

        <div className="min-w-0">
          {/* Narrow screens: the same list, folded away above the page. */}
          <details className="mb-6 rounded-lg border border-border px-4 py-3 lg:hidden">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              All components
            </summary>
            <div className="mt-4">
              <DocNav docs={docs} current={slug} />
            </div>
          </details>

          <header className="mb-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {meta.title}
              </h1>
              {meta.status === "documented" ? null : <Pill>{STATUS_LABEL[meta.status]}</Pill>}
              {meta.beta ? <Pill tone="beta">Beta</Pill> : null}
            </div>
          </header>

          {/* The tabs right under the title, so the sections can be reached before the preview. */}
          <SectionNav target="doc-content" lead={{ id: "demo", title: "Demo" }} />

          {/* The component itself, to try before reading about it. */}
          <div id="demo" className="mt-8 max-w-[46rem] scroll-mt-32">
            <ComponentPreview slug={slug} />
          </div>

          <article id="doc-content" className="max-w-[46rem]">
            <Content />
          </article>
        </div>
      </div>
    </div>
  );
}
