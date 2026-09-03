import type { Metadata } from "next";
import Link from "next/link";
import { ArrowBack } from "@/components/icons";
import { Pill } from "@/components/pill";
import { formatDate, getPost, getPostParams } from "@/lib/posts";

export async function generateStaticParams() {
  return getPostParams();
}

// Every post is known at build time, so an unknown slug 404s without rendering.
export const dynamicParams = false;

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const { meta } = await getPost(slug);
  return { title: meta.title, description: meta.summary };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const { Content, meta } = await getPost(slug);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
      >
        <ArrowBack className="size-3.5" />
        Process
      </Link>

      <header className="mt-8 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-faint">
          <time dateTime={meta.date}>{formatDate(meta.date)}</time>
          {meta.stage ? <Pill tone="solid">{meta.stage}</Pill> : null}
          {meta.draft ? <Pill>draft</Pill> : null}
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-foreground">
          {meta.title}
        </h1>
        <p className="mt-3 text-[0.975rem] leading-7 text-muted">
          {meta.summary}
        </p>

        {meta.tags?.length ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {meta.tags.map((tag) => (
              <li key={tag}>
                <Pill>{tag}</Pill>
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <div className="mt-2">
        <Content />
      </div>
    </article>
  );
}
