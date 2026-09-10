/**
 * Types for the research library. Categories and types are const arrays so the
 * filter UI can enumerate them and TypeScript flags a typo in the data file.
 * Add a value here and it becomes usable, and filterable, straight away.
 */

export const CATEGORIES = [
  "learning",
  "neuroscience",
  "ID",
  "UX",
  "design precedent",
] as const;

export const TYPES = [
  "lecture",
  "article",
  "book",
  "chapter",
  "design",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Type = (typeof TYPES)[number];

/**
 * A key finding is usually a single claim. Give it `subPoints` when a source
 * itself breaks that claim into parts, e.g. the two sides of a distinction.
 */
export type Finding = string | { text: string; subPoints: string[] };

/**
 * A screenshot or image belonging to a source, for design precedents where the
 * interface itself is the evidence. `width` and `height` are the file's real
 * pixel dimensions, which `next/image` needs to reserve space before loading.
 */
export type Screenshot = {
  src: string;
  /** Describes the screen for anyone who cannot see it. */
  alt: string;
  /** Short line printed under the thumbnail. */
  caption: string;
  width: number;
  height: number;
  /**
   * Attribution for an image reproduced from someone else's work, e.g. a
   * figure from a paper. Printed as "Reproduced from …" under the caption.
   * Leave it out for screenshots you captured yourself.
   */
  credit?: {
    /** Where it comes from, e.g. "Liu & Sra (2026), Figure 6". */
    source: string;
    /** Licence it is reused under, e.g. "CC BY 4.0". */
    license?: string;
    licenseUrl?: string;
  };
};

export type Paper = {
  /** Stable slug, used as the anchor and React key. */
  id: string;
  title: string;
  authors: string[];
  year: number;
  /** Journal, conference, course, publisher: whatever the source sits in. */
  venue: string;
  /** Omit when the source has no public link. */
  url?: string;
  /** ISO date the link was last checked to resolve. Omit alongside `url`. */
  accessed?: string;
  /** The full reference, in whichever citation style the course uses. */
  citation: string;
  /** A source can sit in more than one category. */
  category: Category[];
  type: Type;
  keywords: string[];
  /** Screenshots, for design precedents. Shown on the card without expanding. */
  images?: Screenshot[];
  /** The takeaways worth remembering, one per bullet. */
  keyFindings: Finding[];
  /** Why this matters for the training-in-OpenBridge question, one per bullet. */
  relevance: string[];
};

export function sortPapers(papers: Paper[]): Paper[] {
  return [...papers].sort(
    (a, b) => b.year - a.year || a.title.localeCompare(b.title),
  );
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
