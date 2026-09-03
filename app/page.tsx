import Link from "next/link";
import { formatDate, getPosts } from "@/lib/posts";
import { papers } from "@/content/papers";

export default async function HomePage() {
  const posts = await getPosts();
  const recent = posts.slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <section>
        <p className="text-xs font-medium tracking-wide text-accent uppercase">
          Self-directed course · Interaction design
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl leading-tight font-semibold tracking-tight text-balance text-foreground">
          How might training live inside OpenBridge interfaces?
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
          A working hub for the project: design decisions, research notes and
          the reasoning in between, published as I go rather than written up at
          the end.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Read the process
          </Link>
          <Link
            href="/research"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {papers.length} sources
          </Link>
        </div>
      </section>

      {recent.length > 0 ? (
        <section className="mt-20 border-t border-border pt-10">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-semibold tracking-wide text-faint uppercase">
              Latest entries
            </h2>
            <Link
              href="/blog"
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              All entries →
            </Link>
          </div>

          <ol className="mt-2 divide-y divide-border">
            {recent.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block py-6">
                  <time
                    dateTime={post.date}
                    className="text-xs tracking-wide text-faint"
                  >
                    {formatDate(post.date)}
                  </time>
                  <h3 className="mt-1.5 font-medium tracking-tight text-foreground group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-[0.95rem] leading-7 text-muted">
                    {post.summary}
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
