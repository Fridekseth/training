"use client";

import { useMemo, useState } from "react";
import { Pill } from "@/components/pill";
import { CATEGORIES, type Category, type Paper } from "@/lib/papers";

type Filter = Category | "All";

function matches(paper: Paper, query: string): boolean {
  if (!query) return true;
  const haystack = [
    paper.title,
    paper.venue ?? "",
    paper.kind ?? "",
    paper.relevance ?? "",
    ...paper.authors,
    ...paper.keywords,
    ...paper.keyFindings,
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
      map.set(paper.category, (map.get(paper.category) ?? 0) + 1);
    }
    return map;
  }, [papers]);

  const visible = papers.filter(
    (paper) =>
      (filter === "All" || paper.category === filter) && matches(paper, query),
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
        {visible.length} of {papers.length} sources
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
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="solid">{paper.category}</Pill>
                {paper.kind ? <Pill>{paper.kind}</Pill> : null}
                {paper.status ? <Pill>{paper.status}</Pill> : null}
              </div>

              <h2 className="mt-3 text-base font-semibold tracking-tight text-foreground">
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-transparent underline-offset-2 transition-colors hover:text-accent hover:decoration-accent/40"
                >
                  {paper.title}
                </a>
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted">
                {paper.authors.join(", ")} · {paper.year}
                {paper.venue ? ` · ${paper.venue}` : ""}
              </p>

              <h3 className="mt-5 text-xs font-semibold tracking-wide text-faint uppercase">
                Key findings
              </h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.925rem] leading-6 text-muted marker:text-faint">
                {paper.keyFindings.map((finding) => (
                  <li key={finding}>{finding}</li>
                ))}
              </ul>

              {paper.relevance ? (
                <p className="mt-4 border-l-2 border-accent pl-4 text-[0.925rem] leading-6 text-muted">
                  {paper.relevance}
                </p>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-1.5">
                {paper.keywords.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => setQuery(keyword)}
                    title={`Search for “${keyword}”`}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-faint transition-colors hover:border-accent hover:text-accent"
                  >
                    {keyword}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-4 text-xs">
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent hover:underline"
                >
                  Open source ↗
                </a>
                {paper.doi ? (
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-faint hover:text-accent"
                  >
                    doi:{paper.doi}
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
