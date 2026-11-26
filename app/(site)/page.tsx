import Link from "next/link";
import { ArrowForward } from "@/components/icons";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/lib/posts";
import { papers } from "@/content/papers";
import { PAGE_CONTAINER } from "@/lib/layout";

export default async function HomePage() {
  const posts = await getPosts();
  // The entries marked `highlight: true` in their front matter, newest first.
  const highlighted = posts.filter((post) => post.highlight);
  // The one marked "main" is drawn big, across the whole width, and the rest are smaller under it.
  const main = highlighted.find((post) => post.highlight === "main") ?? highlighted[0];
  const others = highlighted.filter((post) => post !== main);

  return (
    <div className={`${PAGE_CONTAINER} pt-6 pb-20`}>
      <section>
        {/* The drawings from the training language, as the face of the project. */}
        <div className="overflow-hidden rounded-2xl bg-accent-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/application-layers.svg"
            alt="Isometric drawings of puzzle pieces, speech bubbles, a warning triangle, a dumbbell, a book, a bar chart and a magnifying glass"
            className="block h-[clamp(180px,30vw,340px)] w-full object-cover"
          />
        </div>

        <p className="mt-10 text-xl leading-snug tracking-tight text-muted sm:text-2xl">
          OpenBridge for learning:
        </p>
        <h1 className="mt-1 max-w-4xl text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground sm:text-[2.6rem]">
          How can high complexity work environments be taught through the systems themselves?
        </h1>

        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-xl text-[1.05rem] leading-8 text-muted">
            Exploring how documentation, learning and training in complex
            workplaces can move from the classroom into the interface, where the
            work actually happens. This page documents the project as it goes,
            with design decisions, research notes and the reasoning in between.
          </p>

          <div className="flex shrink-0 flex-col items-stretch gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center justify-between gap-6 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Latest updates
              <ArrowForward className="size-4" />
            </Link>
            <Link
              href="/research"
              className="inline-flex items-center justify-between gap-6 rounded-full border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent-soft"
            >
              {papers.length} references
              <ArrowForward className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {highlighted.length > 0 ? (
        <section className="mt-16 border-t border-border pt-10">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-semibold text-faint">Highlighted entries</h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent"
            >
              All entries
              <ArrowForward className="size-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            <PostCard post={main} wide />
            {others.length > 0 ? (
              <ol className="grid gap-4 sm:grid-cols-2">
                {others.map((post) => (
                  <li key={post.slug}>
                    <PostCard post={post} compact />
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
