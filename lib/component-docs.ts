import fs from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";

/**
 * How far a component's page has got: `documented` has every section written,
 * `draft` has some of them, and `planned` is a page with only its structure.
 */
export type DocStatus = "documented" | "draft" | "planned";

/** Shape every component page declares via `export const metadata` in its MDX file. */
export type ComponentFrontmatter = {
  title: string;
  /** One sentence for the card on the index. */
  summary: string;
  /** One of CATEGORIES. It is not shown; it only keeps related components next to each other in the list. */
  category: string;
  status: DocStatus;
  /** True for a component that is not fully done, which then carries a Beta tag. */
  beta?: boolean;
  /** A picture for the card on the index, from `public/`. */
  preview?: string;
  /** The place within its category; lower comes first. */
  order?: number;
};

export type ComponentDoc = ComponentFrontmatter & { slug: string };

/** The order related components are listed in, on the index and in the side menu. */
export const CATEGORIES = [
  "Action",
  "Communication",
  "Navigation",
] as const;

/** What each section of a component page holds, in the order the page has them. */
export const SECTIONS = [
  ["Demo", "An interactive demo with properties panel."],
  ["Overview", "What it is."],
  ["Features", "What it does."],
  ["Variants", "The different forms it comes in."],
  ["Specs", "Sizes, positions and timings, as numbers."],
  ["Guidelines", "How to use and how not to use it."],
] as const;

const DOCS_DIR = path.join(process.cwd(), "content/components");

async function readSlugs(): Promise<string[]> {
  const entries = await fs.readdir(DOCS_DIR);
  return (
    entries
      // A file that starts with an underscore is a template, not a page.
      .filter((name) => name.endsWith(".mdx") && !name.startsWith("_"))
      .map((name) => name.replace(/\.mdx$/, ""))
  );
}

/** Loads a page's compiled component together with its frontmatter. */
export async function getComponentDoc(
  slug: string,
): Promise<{ Content: ComponentType; meta: ComponentDoc }> {
  const mod = await import(`@/content/components/${slug}.mdx`);
  return {
    Content: mod.default as ComponentType,
    meta: { ...mod.metadata, slug },
  };
}

/**
 * The order the components are listed in, on the index and in the side menu: roughly the order
 * the learner meets them in. A page that is not listed here comes last.
 */
const ORDER = [
  "cursors",
  "training-frame",
  "mode-tab",
  "step-menu",
  "mode-intro",
  "guided-step",
  "rich-button-with-image",
  "comment-pin",
  "thread",
  "test-toolbar",
  "toast",
];

/** Every page, in the order of ORDER. */
export async function getComponentDocs(): Promise<ComponentDoc[]> {
  const slugs = await readSlugs();
  const docs = await Promise.all(
    slugs.map(async (slug) => (await getComponentDoc(slug)).meta),
  );
  const rank = (slug: string) => {
    const at = ORDER.indexOf(slug);
    return at === -1 ? ORDER.length : at;
  };
  return docs.sort((a, b) => rank(a.slug) - rank(b.slug) || a.title.localeCompare(b.title));
}

export async function getComponentDocParams() {
  return (await readSlugs()).map((slug) => ({ slug }));
}

export const STATUS_LABEL: Record<DocStatus, string> = {
  documented: "Documented",
  draft: "Draft",
  planned: "Planned",
};
