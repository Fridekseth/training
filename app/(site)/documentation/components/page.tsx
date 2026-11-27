import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Pill } from "@/components/pill";
import {
  SECTIONS,
  STATUS_LABEL,
  getComponentDocs,
  type ComponentDoc,
} from "@/lib/component-docs";
import { PAGE_CONTAINER } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Components · Documentation",
  description:
    "Interactive building blocks made specifically to support the OpenBridge learning patterns.",
};

/** One component on the index: a picture, its name and one line on what it is. */
function Card({ doc }: { doc: ComponentDoc }) {
  return (
    <Link
      href={`/documentation/components/${doc.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent/40"
    >
      {/* The same grey as the box the component is tried in on its page, so the picture has no edge. */}
      <div
        className="flex aspect-[16/9] items-center justify-center overflow-hidden border-b border-border"
        style={{ background: "#f1f1f1" }}
      >
        {doc.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={doc.preview}
            alt=""
            className="size-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="text-sm text-faint">No preview yet</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold tracking-tight text-foreground group-hover:text-accent">
            {doc.title}
          </h3>
          <span className="flex items-center gap-1.5">
            {doc.beta ? <Pill tone="beta">Beta</Pill> : null}
            {/* A documented component needs no tag; only the ones still being written are marked. */}
            {doc.status === "documented" ? null : <Pill>{STATUS_LABEL[doc.status]}</Pill>}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-6 text-muted">{doc.summary}</p>
      </div>
    </Link>
  );
}

export default async function ComponentsPage() {
  const docs = await getComponentDocs();

  return (
    <div className={`${PAGE_CONTAINER} py-16`}>
      <PageHeader
        title="Components"
        lead="Components for learning are interactive building blocks that are made specifically to support the OpenBridge learning patterns. They are either customized versions of existing OpenBridge UI components, or new components that follow the OpenBridge guidelines."
      />

      {/* The structure every page follows, shown once here so each page does not have to explain it. */}
      <section aria-labelledby="structure" className="mt-10">
        <h2 id="structure" className="text-xl font-semibold tracking-tight text-foreground">
          Structure
        </h2>
        <p className="mt-3 max-w-xl text-[0.9rem] leading-7 text-muted">
          Every component page starts with the title and a live demo, where the component can be
          tried. Below it come five sections, always in the same order, showing how it works and how
          to use it.
        </p>
        <ol className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {SECTIONS.map(([name, text], at) => (
            <li key={name} className="flex gap-3 text-[0.9rem] leading-6 text-muted">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-[0.7rem] leading-none font-semibold text-accent">
                {at + 1}
              </span>
              <span>
                <strong className="font-medium text-foreground">{name}.</strong> {text}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <hr className="mt-12 border-border" />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((doc) => (
          <Card key={doc.slug} doc={doc} />
        ))}
      </div>
    </div>
  );
}
