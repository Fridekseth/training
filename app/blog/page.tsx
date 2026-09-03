import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Pill } from "@/components/pill";
import { formatDate, getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Entries from a self-directed course on integrating training into OpenBridge interfaces.",
};

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <PageHeader
        title="Process"
        lead="Working notes, in order. Sketches, dead ends and decisions as they happen, rather than a tidy account written afterwards."
      />

      {posts.length === 0 ? (
        <p className="mt-10 text-[0.975rem] leading-7 text-muted">
          No entries yet. Add an{" "}
          <code className="font-mono text-[0.85em] text-foreground">.mdx</code>{" "}
          file to{" "}
          <code className="font-mono text-[0.85em] text-foreground">
            content/posts/
          </code>{" "}
          to start.
        </p>
      ) : (
        <ol className="mt-4 divide-y divide-border">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block py-7 focus:outline-none"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-faint">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  {post.stage ? <Pill tone="solid">{post.stage}</Pill> : null}
                  {post.draft ? <Pill>draft</Pill> : null}
                </div>

                <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-accent group-focus-visible:text-accent">
                  {post.title}
                </h2>
                <p className="mt-1.5 text-[0.95rem] leading-7 text-muted">
                  {post.summary}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
