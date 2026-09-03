"use client";

import { Fragment, useMemo, useState } from "react";
import { ArrowOutward } from "@/components/icons";
import { Pill } from "@/components/pill";
import { CATEGORIES, type Category, type Paper } from "@/lib/papers";

type Filter = Category | "All";

function matches(paper: Paper, query: string): boolean {
  if (!query) return true;
  const haystack = [
    paper.title,
    paper.venue,
    paper.type,
    paper.citation,
    ...paper.authors,
    ...paper.category,
    ...paper.keywords,
    ...paper.keyFindings,
    ...paper.relevance,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export function ResearchLibrary({ papers }: { papers: Paper[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["All", papers.length]]);
    for (const paper of papers) {
      for (const category of paper.category) {
        map.set(category, (map.get(category) ?? 0) + 1);
      }
    }
    return map;
  }, [papers]);

  const visible = papers.filter(
    (paper) =>
      (filter === "All" || paper.category.includes(filter)) &&
      matches(paper, query),
  );

  // Only offer categories that something is actually filed under.
  const tabs: Filter[] = ["All", ...CATEGORIES.filter((c) => counts.has(c))];

  return (
    <>
      <div className="mt-8 flex flex-col gap-4">
        <label className="relative block">
          <span className="sr-only">Search sources</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, author, keyword or finding…"
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </label>

        <div className="flex flex-wrap gap-1.5">
          {tabs.map((tab) => {
            const active = filter === tab;
            return (
              <button
                key={tab}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(tab)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-accent text-background"
                    : "border border-border text-muted hover:text-foreground"
                }`}
              >
                {tab}
                <span className={active ? "opacity-70" : "text-faint"}>
                  {" "}
                  {counts.get(tab)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-xs text-faint">
        {visible.length} of {papers.length}{" "}
        {papers.length === 1 ? "source" : "sources"}
      </p>

      {visible.length === 0 ? (
        <p className="mt-8 text-[0.975rem] leading-7 text-muted">
          Nothing matches that. Try a broader search or another category.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {visible.map((paper) => (
            <li
              key={paper.id}
              id={paper.id}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {paper.category.map((category) => (
                    <Pill key={category} tone="solid">
                      {category}
                    </Pill>
                  ))}
                </div>
                <Pill>{paper.type}</Pill>
              </div>

              <h2 className="mt-3 text-base font-semibold tracking-tight text-foreground">
                {paper.url ? (
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-transparent underline-offset-2 transition-colors hover:text-accent hover:decoration-accent/40"
                  >
                    {paper.title}
                  </a>
                ) : (
                  paper.title
                )}
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted">
                {paper.authors.join(", ")} · {paper.year} · {paper.venue}
              </p>

              {paper.relevance.length > 0 ? (
                <>
                  <h3 className="mt-5 text-xs font-semibold text-faint">
                    Relevance
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-[0.925rem] leading-6 text-muted">
                    {paper.relevance.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              {paper.keyFindings.length > 0 ? (
                <>
                  <h3 className="mt-5 text-xs font-semibold text-faint">
                    Key findings
                  </h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.925rem] leading-6 text-muted marker:text-faint">
                    {paper.keyFindings.map((finding) => (
                      <li key={finding}>{finding}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              <p className="mt-5 text-xs leading-6 text-faint">
                {paper.keywords.map((keyword, index) => (
                  <Fragment key={keyword}>
                    {index > 0 ? <span aria-hidden> · </span> : null}
                    <button
                      type="button"
                      onClick={() => setQuery(keyword)}
                      title={`Search for “${keyword}”`}
                      className="cursor-pointer transition-colors hover:text-accent hover:underline"
                    >
                      {keyword}
                    </button>
                  </Fragment>
                ))}
              </p>

              <div className="mt-5 border-t border-border pt-4">
                <p className="text-xs leading-5 text-faint">{paper.citation}</p>
                {paper.url ? (
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                  >
                    Open source
                    <ArrowOutward className="size-3.5" />
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
