/**
 * Types for the research library. Categories and types are const arrays so the
 * filter UI can enumerate them and TypeScript flags a typo in the data file.
 * Add a value here and it becomes usable — and filterable — straight away.
 */

export const CATEGORIES = [
  "learning",
  "neuroscience",
  "ID",
  "UX",
] as const;

export const TYPES = ["lecture", "article", "book", "design"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Type = (typeof TYPES)[number];

export type Paper = {
  /** Stable slug, used as the anchor and React key. */
  id: string;
  title: string;
  authors: string[];
  year: number;
  /** Journal, conference, course, publisher — whatever the source sits in. */
  venue: string;
  /** Omit when the source has no public link. */
  url?: string;
  /** The full reference, in whichever citation style the course uses. */
  citation: string;
  /** A source can sit in more than one category. */
  category: Category[];
  type: Type;
  keywords: string[];
  /** The takeaways worth remembering, one per bullet. */
  keyFindings: string[];
  /** Why this matters for the training-in-OpenBridge question, one per bullet. */
  relevance: string[];
};

export function sortPapers(papers: Paper[]): Paper[] {
  return [...papers].sort(
    (a, b) => b.year - a.year || a.title.localeCompare(b.title),
  );
}
