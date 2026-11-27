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
  /** One of CATEGORIES, which decides the group it sits in. */
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

/** The groups on the index and in the side menu, in the order they are shown. */
export const CATEGORIES = [
  "Action",
  "Communication",
  "Navigation",
] as const;

/** What each section of a component page holds, in the order the page has them. Under the title comes a live preview. */
export const SECTIONS = [
  ["Overview", "What it is, and what it is for in the training pattern."],
  ["Features", "What it does, as a short list."],
  ["Variants", "The different forms it comes in."],
  ["Specs", "Sizes, positions and timings, as numbers."],
  ["Guidelines", "What to do and what not to do, side by side."],
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

/** Every page, grouped as the index shows them: by category, then by `order`. */
export async function getComponentDocs(): Promise<ComponentDoc[]> {
  const slugs = await readSlugs();
  const docs = await Promise.all(
    slugs.map(async (slug) => (await getComponentDoc(slug)).meta),
  );
  const rank = (category: string) => {
    const at = (CATEGORIES as readonly string[]).indexOf(category);
    return at === -1 ? CATEGORIES.length : at;
  };
  return docs.sort(
    (a, b) =>
      rank(a.category) - rank(b.category) ||
      (a.order ?? 99) - (b.order ?? 99) ||
      a.title.localeCompare(b.title),
  );
}

export async function getComponentDocParams() {
  return (await readSlugs()).map((slug) => ({ slug }));
}

export const STATUS_LABEL: Record<DocStatus, string> = {
  documented: "Documented",
  draft: "Draft",
  planned: "Planned",
};
