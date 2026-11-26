import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/lib/posts";
import { PAGE_CONTAINER, PROSE_WIDTH } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Process",
  description: "Process documentation for the OpenBridge training project",
};

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <div className={`${PAGE_CONTAINER} py-16`}>
      <PageHeader
        title="Process"
        lead="Insights, process and reflections throughout the process."
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
        // Two cards to a row, newest first. The cards in a row are as tall as each other, so the pictures line up.
        <ol className="mt-6 grid gap-5 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
