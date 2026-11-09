import type { Metadata } from "next";
import Link from "next/link";
import { DocNav } from "@/components/docs/doc-nav";
import { SectionNav } from "@/components/docs/section-nav";
import { ArrowBack } from "@/components/icons";
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

/** A line of the facts about a component: a small label over its value. */
function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-faint uppercase">{label}</dt>
      <dd className="mt-1.5 flex flex-wrap gap-1.5 text-sm text-muted">{children}</dd>
    </div>
  );
}

export default async function ComponentPage(props: PageProps<"/documentation/components/[slug]">) {
  const { slug } = await props.params;
  const [{ Content, meta }, docs] = await Promise.all([getComponentDoc(slug), getComponentDocs()]);
  const at = docs.findIndex((doc) => doc.slug === slug);
  const previous = docs[at - 1];
  const next = docs[at + 1];

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
                href="/documentation/components"
                className="transition-colors hover:text-accent"
              >
                Components
              </Link>
              <span aria-hidden="true" className="text-faint">
                /
              </span>
              {meta.category}
            </nav>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {meta.title}
              </h1>
              <Pill tone={meta.status === "documented" ? "solid" : "quiet"}>
                {STATUS_LABEL[meta.status]}
              </Pill>
            </div>
            <p className="mt-3 max-w-2xl text-[1.05rem] leading-8 text-muted">{meta.summary}</p>

            {/* The facts that every page has, in the same order, so they are found in the same place. */}
            <dl className="mt-6 grid gap-x-8 gap-y-4 border-y border-border py-5 sm:grid-cols-3">
              <Fact label="Used in">
                {meta.usedIn?.length ? (
                  meta.usedIn.map((mode) => <Pill key={mode}>{mode}</Pill>)
                ) : (
                  <span className="text-faint">Not set</span>
                )}
              </Fact>
              <Fact label="Built from">
                <span>{meta.builtFrom ?? <span className="text-faint">Not set</span>}</span>
              </Fact>
              <Fact label="Source">
                {meta.source ? (
                  <code className="font-mono text-[0.8125rem]">
                    {/* A long path may break after a slash, and not in the middle of a name. */}
                    {meta.source.split("/").map((part, at, all) => (
                      <span key={at}>
                        {part}
                        {at < all.length - 1 ? "/" : null}
                        <wbr />
                      </span>
                    ))}
                  </code>
                ) : (
                  <span className="text-faint">Not set</span>
                )}
              </Fact>
            </dl>

            {/* The component in place, on the screen it belongs to. */}
            {meta.preview ? (
              <div className="mt-6 overflow-hidden rounded-xl border border-border bg-accent-soft p-4 sm:p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={meta.preview}
                  alt={meta.previewAlt ?? ""}
                  className="mx-auto block max-h-[26rem] w-auto max-w-full rounded-md"
                />
              </div>
            ) : (
              <div className="mt-6 grid h-40 place-items-center rounded-xl border border-dashed border-border text-sm text-faint">
                No preview yet
              </div>
            )}
          </header>

          <SectionNav target="doc-content" />

          <article id="doc-content" className="max-w-[46rem]">
            <Content />
          </article>

          {/* Previous and next in the order of the index, so the whole set can be read through. */}
          <div className="mt-16 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
            {previous ? (
              <Link
                href={`/documentation/components/${previous.slug}`}
                className="rounded-lg border border-border px-4 py-3 transition-colors hover:border-accent"
              >
                <span className="block text-xs text-faint">Previous</span>
                <span className="text-sm font-medium text-foreground">{previous.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/documentation/components/${next.slug}`}
                className="rounded-lg border border-border px-4 py-3 text-right transition-colors hover:border-accent sm:col-start-2"
              >
                <span className="block text-xs text-faint">Next</span>
                <span className="text-sm font-medium text-foreground">{next.title}</span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
