import Image from "next/image";
import Link from "next/link";
import { ArrowForward } from "@/components/icons";
import { formatDate, getPosts } from "@/lib/posts";
import { papers } from "@/content/papers";
import { PAGE_CONTAINER, PROSE_WIDTH } from "@/lib/layout";

export default async function HomePage() {
  const posts = await getPosts();
  const recent = posts.slice(0, 3);

  return (
    <div className={`${PAGE_CONTAINER} pt-6 pb-20`}>
      <section>
        {/* The drawings from the training language, as the face of the project. */}
        <div className="overflow-hidden rounded-2xl bg-accent-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/training-layer.svg"
            alt="Isometric drawings of a book, a dumbbell, an alarm clock, puzzle pieces, speech bubbles and a bar chart"
            className="block h-[clamp(180px,30vw,340px)] w-full object-cover"
          />
        </div>

        <p className="mt-10 text-xl leading-snug tracking-tight text-muted sm:text-2xl">
          OpenBridge training layer:
        </p>
        <h1 className="mt-1 max-w-4xl text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground sm:text-[2.6rem]">
          How might training live inside OpenBridge interfaces?
        </h1>

        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-xl text-[1.05rem] leading-8 text-muted">
            Exploring how training in complex workplaces can move from the
            classroom into the interface, where the work actually happens. This
            page documents the project as it goes, with design decisions,
            research notes and the reasoning in between.
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

      {recent.length > 0 ? (
        <section className="mt-16 border-t border-border pt-10">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-semibold text-faint">Latest entries</h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent"
            >
              All entries
              <ArrowForward className="size-3.5" />
            </Link>
          </div>

          <ol className="mt-4 space-y-4">
            {recent.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent"
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
                      <time
                        dateTime={post.date}
                        className="text-xs tracking-wide text-faint"
                      >
                        {formatDate(post.date)}
                      </time>
                      <h3 className="mt-1.5 font-medium tracking-tight text-foreground group-hover:text-accent">
                        {post.title}
                      </h3>
                      <p
                        className={`mt-1 text-[0.95rem] leading-7 text-muted ${PROSE_WIDTH}`}
                      >
                        {post.summary}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
