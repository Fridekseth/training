"use client";

import Image from "next/image";
import { Fragment, useEffect, useMemo, useState } from "react";
import { ArrowOutward, ExpandMore } from "@/components/icons";
import { Pill } from "@/components/pill";
import {
  CATEGORIES,
  formatDate,
  type Category,
  type Finding,
  type Paper,
  type Screenshot,
} from "@/lib/papers";

type Filter = Category | "All";
type View = "sources" | "images";

/** Height of a screenshot thumbnail, in px. A phone screenshot comes out 110px wide. */
const THUMB_HEIGHT = 238;
/** Widest a thumbnail gets. Very wide images, like a toolbar strip, shrink in height instead. */
const THUMB_MAX_WIDTH = 520;

// A finding is a plain string, or an object with sub-points when a source
// itself splits a claim into parts. Flatten to plain text for search.
function findingText(finding: Finding): string {
  return typeof finding === "string"
    ? finding
    : [finding.text, ...finding.subPoints].join(" ");
}

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
    ...paper.keyFindings.map(findingText),
    ...paper.relevance,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

/** Caption under an image, plus the credit line when the image is borrowed. */
function ImageCaption({ image }: { image: Screenshot }) {
  return (
    <>
      <p className="mt-1.5 text-[0.7rem] leading-4 text-faint">
        {image.caption}
      </p>
      {image.credit ? (
        <p className="mt-1 text-[0.65rem] leading-4 text-muted italic">
          Reproduced from {image.credit.source}
          {image.credit.license ? (
            <>
              {", "}
              {image.credit.licenseUrl ? (
                <a
                  href={image.credit.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-accent"
                >
                  {image.credit.license}
                </a>
              ) : (
                image.credit.license
              )}
            </>
          ) : null}
        </p>
      ) : null}
    </>
  );
}

/**
 * Every image from the sources currently shown, as a grid. Each one links back
 * to its source card, so the gallery is a way into the library, not a dead end.
 */
function VisualLibrary({
  papers,
  onOpenSource,
}: {
  papers: Paper[];
  onOpenSource: (id: string) => void;
}) {
  const items = papers.flatMap((paper) =>
    (paper.images ?? []).map((image) => ({ image, paper })),
  );

  if (items.length === 0) {
    return (
      <p className="mt-8 text-[0.975rem] leading-7 text-muted">
        None of these sources has images yet.
      </p>
    );
  }

  return (
    <ul className="mt-4 columns-1 gap-4 sm:columns-2">
      {items.map(({ image, paper }) => {
        const portrait = image.height > image.width;
        return (
          <li
            key={image.src}
            className="mb-4 break-inside-avoid rounded-xl border border-border bg-surface p-3"
          >
            <a
              href={image.src}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
              title="Open full size"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(min-width: 640px) 330px, 100vw"
                // Phone screenshots would otherwise run very tall in a column.
                style={portrait ? { maxHeight: 440 } : undefined}
                className={`rounded-lg border border-border transition-colors group-hover:border-accent ${
                  portrait ? "mx-auto h-auto w-auto max-w-full" : "h-auto w-full"
                }`}
              />
            </a>
            <ImageCaption image={image} />
            <p className="mt-2 border-t border-border pt-2 text-xs leading-5">
              <span className="text-faint">Source: </span>
              <a
                href={`#${paper.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  onOpenSource(paper.id);
                }}
                className="font-medium text-accent hover:underline"
              >
                {paper.title}
              </a>
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * One source. Relevance and key findings stay collapsed so a long library
 * still scans quickly; the card keeps its own open state, which React
 * preserves across filtering because the list is keyed by paper id.
 */
function PaperCard({
  paper,
  onKeywordClick,
  highlighted,
}: {
  paper: Paper;
  onKeywordClick: (keyword: string) => void;
  /** Briefly outlined after arriving from the visual library. */
  highlighted: boolean;
}) {
  const [open, setOpen] = useState(false);

  const detailCount = paper.relevance.length + paper.keyFindings.length;
  const detailsId = `${paper.id}-details`;

  return (
    <li
      id={paper.id}
      className={`scroll-mt-20 rounded-xl border bg-surface p-6 transition-colors duration-500 ${
        highlighted ? "border-accent" : "border-border"
      }`}
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

      {paper.images?.length ? (
        <ul className="mt-4 flex items-start gap-3 overflow-x-auto pb-1">
          {paper.images.map((image) => {
            // Fixed height, width from the image's own proportions, so phone
            // and desktop screenshots sit in one strip at a readable size.
            const thumbWidth = Math.min(
              THUMB_MAX_WIDTH,
              Math.round((THUMB_HEIGHT * image.width) / image.height),
            );
            return (
              <li
                key={image.src}
                className="shrink-0"
                style={{ width: thumbWidth }}
              >
                <a
                  href={image.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                  title="Open full size"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes={`${thumbWidth}px`}
                    className="h-auto w-full rounded-lg border border-border transition-colors group-hover:border-accent"
                  />
                </a>
                <ImageCaption image={image} />
              </li>
            );
          })}
        </ul>
      ) : null}

      {detailCount > 0 ? (
        <>
          <button
            type="button"
            onClick={() => setOpen((wasOpen) => !wasOpen)}
            aria-expanded={open}
            aria-controls={detailsId}
            className="mt-4 inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            {open ? "Hide details" : "Show details"}
            <ExpandMore
              className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          <div id={detailsId} hidden={!open}>
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
                  {paper.keyFindings.map((finding) =>
                    typeof finding === "string" ? (
                      <li key={finding}>{finding}</li>
                    ) : (
                      <li key={finding.text}>
                        {finding.text}
                        <ul className="mt-1.5 list-disc space-y-1.5 pl-5 marker:text-faint">
                          {finding.subPoints.map((subPoint) => (
                            <li key={subPoint}>{subPoint}</li>
                          ))}
                        </ul>
                      </li>
                    ),
                  )}
                </ul>
              </>
            ) : null}
          </div>
        </>
      ) : null}

      <p className="mt-5 text-xs leading-6 text-faint">
        {paper.keywords.map((keyword, index) => (
          <Fragment key={keyword}>
            {index > 0 ? <span aria-hidden> · </span> : null}
            <button
              type="button"
              onClick={() => onKeywordClick(keyword)}
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
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
            >
              Open source
              <ArrowOutward className="size-3.5" />
            </a>
            {paper.accessed ? (
              <span className="text-xs text-faint">
                Accessed {formatDate(paper.accessed)}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}

export function ResearchLibrary({ papers }: { papers: Paper[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("sources");
  // The card to scroll to and outline after leaving the visual library.
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    if (view !== "sources" || !target) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document
      .getElementById(target)
      ?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    history.replaceState(null, "", `#${target}`);
    const timer = setTimeout(() => setTarget(null), 2000);
    return () => clearTimeout(timer);
  }, [view, target]);

  function openSource(id: string) {
    setView("sources");
    setTarget(id);
  }

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

  const imageCount = visible.reduce(
    (total, paper) => total + (paper.images?.length ?? 0),
    0,
  );
  const sourcesWithImages = visible.filter(
    (paper) => (paper.images?.length ?? 0) > 0,
  ).length;

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

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-xs text-faint">
          {view === "images"
            ? `${imageCount} ${imageCount === 1 ? "image" : "images"} from ${sourcesWithImages} ${sourcesWithImages === 1 ? "source" : "sources"}`
            : `${visible.length} of ${papers.length} ${papers.length === 1 ? "source" : "sources"}`}
        </p>

        <div
          role="group"
          aria-label="View"
          className="inline-flex rounded-full border border-border p-0.5"
        >
          {(
            [
              ["sources", "Sources"],
              ["images", "Visual library"],
            ] as const
          ).map(([value, label]) => {
            const active = view === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => setView(value)}
                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "bg-accent text-background"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-[0.975rem] leading-7 text-muted">
          Nothing matches that. Try a broader search or another category.
        </p>
      ) : (
        <>
          {/* Kept mounted while hidden, so open cards stay open across views. */}
          <ul className="mt-4 space-y-4" hidden={view !== "sources"}>
            {visible.map((paper) => (
              <PaperCard
                key={paper.id}
                paper={paper}
                onKeywordClick={setQuery}
                highlighted={target === paper.id}
              />
            ))}
          </ul>
          {view === "images" ? (
            <VisualLibrary papers={visible} onOpenSource={openSource} />
          ) : null}
        </>
      )}
    </>
  );
}
