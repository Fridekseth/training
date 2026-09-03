/**
 * Types for the research library. Categories and statuses are const arrays so
 * the filter UI can enumerate them and TypeScript flags typos in the data file.
 */

export const CATEGORIES = [
  "Maritime HCI",
  "Training & Learning",
  "Design Systems",
  "Onboarding & Guidance",
  "Standards & Regulation",
  "Methods",
] as const;

export const STATUSES = ["to read", "reading", "read"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Status = (typeof STATUSES)[number];

export type Paper = {
  /** Stable slug, used as the anchor and React key. */
  id: string;
  title: string;
  authors: string[];
  year: number;
  /** Journal, conference, publisher, or site — whatever names the source. */
  venue?: string;
  /** What kind of source this is, e.g. "Journal article", "Standard", "Website". */
  kind?: string;
  url: string;
  doi?: string;
  category: Category;
  keywords: string[];
  /** The takeaways worth remembering, one per bullet. */
  keyFindings: string[];
  /** Why this matters for the training-in-OpenBridge question. */
  relevance?: string;
  status?: Status;
};

export function sortPapers(papers: Paper[]): Paper[] {
  return [...papers].sort(
    (a, b) => b.year - a.year || a.title.localeCompare(b.title),
  );
}

/** Every keyword across the library, deduped and alphabetised. */
export function allKeywords(papers: Paper[]): string[] {
  return [...new Set(papers.flatMap((p) => p.keywords))].sort((a, b) =>
    a.localeCompare(b),
  );
}
