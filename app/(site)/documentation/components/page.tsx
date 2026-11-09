import type { Metadata } from "next";
import Link from "next/link";
import { ArrowBack } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { Pill } from "@/components/pill";
import {
  CATEGORIES,
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
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent"
    >
      <div className="grid aspect-[16/9] place-items-center overflow-hidden border-b border-border bg-accent-soft">
        {doc.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={doc.preview}
            alt=""
            className="size-full object-cover object-top-left transition-transform duration-300 group-hover:scale-[1.02]"
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
          <Pill tone={doc.status === "documented" ? "solid" : "quiet"}>
            {STATUS_LABEL[doc.status]}
          </Pill>
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
      <Link
        href="/documentation"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
      >
        <ArrowBack className="size-3.5" />
        Documentation
      </Link>
      <PageHeader
        title="Components"
        lead="Components for learning are interactive building blocks that are made specifically to support the OpenBridge learning patterns. They are either customized versions of existing OpenBridge UI components, or new components that follow the OpenBridge guidelines. They are organized into categories based on their purpose: Action, communication, navigation."
      />

      {/* The structure every page follows, shown once here so each page does not have to explain it. */}
      <section aria-labelledby="structure" className="mt-10">
        <h2 id="structure" className="text-xl font-semibold tracking-tight text-foreground">
          How a component page is built
        </h2>
        <ol className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {SECTIONS.map(([name, text], at) => (
            <li key={name} className="flex gap-3 text-[0.9rem] leading-6 text-muted">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-[0.7rem] font-semibold text-accent">
                {at + 1}
              </span>
              <span>
                <strong className="font-medium text-foreground">{name}.</strong> {text}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {CATEGORIES.map((category) => {
        const inGroup = docs.filter((doc) => doc.category === category);
        if (!inGroup.length) return null;
        return (
          <section key={category} aria-labelledby={category} className="mt-14">
            <h2
              id={category}
              className="mb-5 border-b border-border pb-3 text-xl font-semibold tracking-tight text-foreground"
            >
              {category}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {inGroup.map((doc) => (
                <Card key={doc.slug} doc={doc} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
