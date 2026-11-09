import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { Carousel } from "@/components/carousel";
import {
  Anatomy,
  Do,
  DoDont,
  Dont,
  Figure,
  PropTable,
  SpecTable,
  State,
  States,
  Todo,
} from "@/components/docs/doc-parts";
import { PromptBox } from "@/components/prompt-box";
import { Shot, Table, Td, Th } from "@/components/post-table";
import { PrototypeEmbed } from "@/components/prototype-embed";
import { SourcePill } from "@/components/source-pill";

/** The text of a heading as an address, so a link can point at it. */
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/*
  Styles for elements produced by markdown. Applied here rather than via a
  wrapper's descendant selectors so post authors can override per element and
  so components imported into MDX inherit nothing unexpected.
*/
const components: MDXComponents = {
  Carousel,
  SourcePill,
  PromptBox,
  PrototypeEmbed,
  Table,
  Th,
  Td,
  Shot,
  // The parts a component page is written with.
  Anatomy,
  Do,
  DoDont,
  Dont,
  Figure,
  PropTable,
  SpecTable,
  State,
  States,
  Todo,
  h1: (props) => (
    <h1
      className="mt-12 mb-4 text-3xl font-semibold tracking-tight text-foreground first:mt-0"
      {...props}
    />
  ),
  // Headings get an address, and room above them for the bars that stay under the header.
  h2: ({ children, ...props }) => (
    <h2
      id={typeof children === "string" ? slugify(children) : undefined}
      className="mt-12 mb-3 scroll-mt-32 text-xl font-semibold tracking-tight text-foreground"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      id={typeof children === "string" ? slugify(children) : undefined}
      className="mt-8 mb-2 scroll-mt-32 text-base font-semibold tracking-tight text-foreground"
      {...props}
    >
      {children}
    </h3>
  ),
  p: (props) => (
    <p className="my-4 text-[0.975rem] leading-7 text-muted" {...props} />
  ),
  ul: (props) => (
    <ul
      className="my-4 list-disc space-y-2 pl-5 text-[0.975rem] leading-7 text-muted marker:text-faint"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="my-4 list-decimal space-y-2 pl-5 text-[0.975rem] leading-7 text-muted marker:text-faint"
      {...props}
    />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-2 border-accent pl-5 text-[0.975rem] leading-7 text-muted italic"
      {...props}
    />
  ),
  a: ({ href = "", children, ...rest }) => {
    const isInternal = href.startsWith("/");
    const className =
      "font-medium text-accent underline underline-offset-2 decoration-accent/40 hover:decoration-accent";
    return isInternal ? (
      <Link href={href} className={className} {...rest}>
        {children}
      </Link>
    ) : (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  },
  code: (props) => (
    <code
      className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-[0.8rem] leading-6 [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-border" />,
  strong: (props) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  figure: (props) => <figure className="my-8" {...props} />,
  figcaption: (props) => (
    <figcaption className="mt-3 text-sm leading-6 text-faint" {...props} />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-border bg-surface px-4 py-2.5 font-medium text-foreground"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border-b border-border px-4 py-2.5 text-muted" {...props} />
  ),
  // Markdown image syntax carries no intrinsic dimensions, which `next/image`
  // requires, so plain markdown images stay a plain `img`. Import and use
  // `next/image` directly inside an `.mdx` file when you want optimisation.
  img: ({ alt = "", ...rest }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} className="rounded-lg border border-border" {...rest} />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
