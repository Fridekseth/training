import Image from "next/image";
import Link from "next/link";
import { Pill } from "@/components/pill";
import { formatDate, getStages, type Post } from "@/lib/posts";

/**
 * An entry of the process as a card: the date and the stage, the title and the
 * summary, and the picture under them. It lifts with a teal shadow on hover. It
 * is the card on the process page, and the front page has a smaller one.
 */
export function PostCard({
  post,
  compact = false,
  wide = false,
}: {
  post: Post;
  compact?: boolean;
  /** Across the whole width, with the picture first and the text beside it. */
  wide?: boolean;
}) {
  if (wide) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group grid overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent/40 focus:outline-none focus-visible:border-accent/40 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]"
      >
        {post.image ? (
          <Image
            src={post.image}
            alt={post.imageAlt ?? ""}
            width={1200}
            height={750}
            sizes="(min-width: 1024px) 560px, (min-width: 768px) 55vw, 100vw"
            className="aspect-[16/10] size-full object-cover object-center md:aspect-auto"
          />
        ) : null}
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-faint">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {getStages(post).map((stage) => (
              <Pill key={stage} tone="solid">
                {stage}
              </Pill>
            ))}
            {post.draft ? <Pill>draft</Pill> : null}
          </div>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground group-hover:text-accent group-focus-visible:text-accent">
            {post.title}
          </h3>
          <p className="mt-2 text-[0.95rem] leading-7 text-muted">
            {post.summary}
          </p>
        </div>
      </Link>
    );
  }

  // The compact card is the title and the picture, for a row of three on the front page.
  if (compact) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full flex-col rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent/40 focus:outline-none focus-visible:border-accent/40"
      >
        <h3 className="flex-1 text-base font-semibold tracking-tight text-foreground group-hover:text-accent group-focus-visible:text-accent">
          {post.title}
        </h3>
        {post.image ? (
          <Image
            src={post.image}
            alt={post.imageAlt ?? ""}
            width={480}
            height={300}
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 30vw, 90vw"
            className="mt-3 aspect-[16/10] w-full rounded-lg border border-border object-cover object-top"
          />
        ) : null}
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/40 focus:outline-none focus-visible:border-accent/40"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-faint">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        {getStages(post).map((stage) => (
          <Pill key={stage} tone="solid">
            {stage}
          </Pill>
        ))}
        {post.draft ? <Pill>draft</Pill> : null}
      </div>

      <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-accent group-focus-visible:text-accent">
        {post.title}
      </h3>
      <p className="mt-1.5 flex-1 text-[0.95rem] leading-7 text-muted">
        {post.summary}
      </p>

      {post.image ? (
        <Image
          src={post.image}
          alt={post.imageAlt ?? ""}
          width={720}
          height={450}
          sizes="(min-width: 1024px) 460px, (min-width: 640px) 45vw, 90vw"
          className="mt-5 aspect-[16/10] w-full rounded-lg border border-border object-cover object-top"
        />
      ) : null}
    </Link>
  );
}
