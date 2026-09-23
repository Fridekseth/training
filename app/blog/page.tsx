import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Pill } from "@/components/pill";
import { formatDate, getPosts } from "@/lib/posts";
import { PAGE_CONTAINER, PROSE_WIDTH } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Process",
  description: "Project documentation for OpenTraining",
};

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <div className={`${PAGE_CONTAINER} py-16`}>
      <PageHeader
        title="Process"
        lead="Working notes, in order. Sketches, dead ends and decisions as they happen, rather than a tidy account written afterwards."
      />

      {posts.length === 0 ? (
        <p
          className={`mt-10 text-[0.975rem] leading-7 text-muted ${PROSE_WIDTH}`}
        >
          No entries yet. Add an{" "}
          <code className="font-mono text-[0.85em] text-foreground">.mdx</code>{" "}
          file to{" "}
          <code className="font-mono text-[0.85em] text-foreground">
            content/posts/
          </code>{" "}
          to start.
        </p>
      ) : (
        <ol className="mt-6 space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              {/* The same card as a source in the research library. */}
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent focus:outline-none focus-visible:border-accent"
              >
                <div className="flex flex-row-reverse items-start justify-between gap-4">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.imageAlt ?? ""}
                      width={320}
                      height={200}
                      sizes="320px"
                      className="h-[92px] w-[140px] shrink-0 rounded-lg border border-border object-cover object-top sm:h-[208px] sm:w-[320px]"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-faint">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      {post.stage ? (
                        <Pill tone="solid">{post.stage}</Pill>
                      ) : null}
                      {post.draft ? <Pill>draft</Pill> : null}
                    </div>

                    <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-accent group-focus-visible:text-accent">
                      {post.title}
                    </h2>
                    <p
                      className={`mt-1.5 text-[0.95rem] leading-7 text-muted ${PROSE_WIDTH}`}
                    >
                      {post.summary}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
