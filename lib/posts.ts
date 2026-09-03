import fs from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";

/** Shape every post declares via `export const metadata` in its MDX file. */
export type PostFrontmatter = {
  title: string;
  /** ISO date, e.g. "2026-02-14". */
  date: string;
  summary: string;
  /** Where this entry sits in the course: research, concept, prototype... */
  stage?: string;
  tags?: string[];
  /** Drafts are listed while developing and hidden from production builds. */
  draft?: boolean;
};

export type Post = PostFrontmatter & { slug: string };

const POSTS_DIR = path.join(process.cwd(), "content/posts");

async function readSlugs(): Promise<string[]> {
  const entries = await fs.readdir(POSTS_DIR);
  return entries
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => name.replace(/\.mdx$/, ""));
}

/**
 * Loads a post's compiled component together with its frontmatter. The import
 * is a template literal so the bundler builds one context module over
 * `content/posts`, which is what lets a new `.mdx` file appear with no wiring.
 */
export async function getPost(
  slug: string,
): Promise<{ Content: ComponentType; meta: Post }> {
  const mod = await import(`@/content/posts/${slug}.mdx`);
  return {
    Content: mod.default as ComponentType,
    meta: { ...mod.metadata, slug },
  };
}

/** All posts, newest first. Drafts are dropped outside of `next dev`. */
export async function getPosts(): Promise<Post[]> {
  const slugs = await readSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => (await getPost(slug)).meta),
  );

  return posts
    .filter((post) => !post.draft || process.env.NODE_ENV === "development")
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Params for `generateStaticParams` — every post, drafts included. */
export async function getPostParams(): Promise<{ slug: string }[]> {
  const slugs = await readSlugs();
  return slugs.map((slug) => ({ slug }));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
