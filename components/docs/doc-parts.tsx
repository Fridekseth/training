import type { ReactNode } from "react";

/*
  The building blocks a component page is written with. They are registered in
  `mdx-components.tsx`, so a page's MDX file uses them by name and holds only
  the words, the pictures and the numbers.
*/

const STAGE = "rounded-lg border border-border bg-accent-soft";
/** Text inside a part. A paragraph written there comes out of markdown with its own spacing, which is taken off. */
const BODY = "text-sm leading-6 text-muted [&_p]:m-0 [&_p]:text-sm [&_p]:leading-6 [&_p+p]:mt-2";

/** A picture on a tinted stage, with room for a caption. */
export function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-6">
      <div className={`${STAGE} p-4`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="mx-auto block max-w-full rounded-md" />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-sm leading-6 text-faint">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/* ---- anatomy ---- */

export type Part = {
  name: string;
  text: string;
  /** Where its marker goes on the picture, as a percentage of the width and the height. */
  x: number;
  y: number;
};

/**
 * A picture with a numbered marker on each part, and the parts listed under it
 * in the same order. A marker is placed on the part it names, not beside it.
 */
export function Anatomy({ src, alt, parts }: { src: string; alt: string; parts: Part[] }) {
  return (
    <div className="my-6">
      <div className={`${STAGE} p-4`}>
        <div className="relative mx-auto w-full max-w-[42.5rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="block w-full rounded-md" />
          {parts.map((part, at) => (
            <span
              key={part.name}
              aria-hidden="true"
              className="absolute grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-foreground text-[0.7rem] font-semibold text-background ring-2 ring-background"
              style={{ left: `${part.x}%`, top: `${part.y}%` }}
            >
              {at + 1}
            </span>
          ))}
        </div>
      </div>
      <ol className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {parts.map((part, at) => (
          <li key={part.name} className="flex gap-3 text-[0.9rem] leading-6 text-muted">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-foreground text-[0.7rem] font-semibold text-background">
              {at + 1}
            </span>
            <span>
              <strong className="font-medium text-foreground">{part.name}.</strong> {part.text}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---- states ---- */

/** The states laid out as a grid of cards, one picture and a line each. */
export function States({ children }: { children: ReactNode }) {
  return <div className="my-6 grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function State({
  name,
  src,
  alt,
  children,
}: {
  name: string;
  src?: string;
  alt?: string;
  children?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className={`${STAGE} rounded-none border-0 border-b p-3`}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt ?? name} className="mx-auto block max-w-full rounded-md" />
        ) : (
          <div className="grid h-16 place-items-center text-sm text-faint">No picture yet</div>
        )}
      </div>
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-foreground">{name}</p>
        {children ? <div className={`mt-1 ${BODY}`}>{children}</div> : null}
      </div>
    </div>
  );
}

/* ---- guidelines ---- */

/** Do and don't side by side, as two cards with a picture slot each. */
export function DoDont({ children }: { children: ReactNode }) {
  return <div className="my-6 grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Guideline({
  kind,
  src,
  alt,
  children,
}: {
  kind: "do" | "dont";
  src?: string;
  alt?: string;
  children: ReactNode;
}) {
  const bar = kind === "do" ? "bg-accent" : "bg-red-600 dark:bg-red-400";
  const label = kind === "do" ? "Do" : "Don't";
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? ""} className="block w-full border-b border-border" />
      ) : (
        <div className="grid h-28 place-items-center border-b border-dashed border-border text-sm text-faint">
          Picture
        </div>
      )}
      <div className={`h-1 ${bar}`} />
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <div className={`mt-1 ${BODY}`}>{children}</div>
      </div>
    </div>
  );
}

export const Do = (props: { src?: string; alt?: string; children: ReactNode }) => (
  <Guideline kind="do" {...props} />
);
export const Dont = (props: { src?: string; alt?: string; children: ReactNode }) => (
  <Guideline kind="dont" {...props} />
);

/* ---- numbers and inputs ---- */

const TABLE = "my-6 overflow-x-auto rounded-lg border border-border";
const HEAD = "border-b border-border bg-surface px-4 py-2.5 text-left font-medium text-foreground";
const CELL = "border-b border-border px-4 py-2.5 align-top text-muted";

/** Sizes, positions and timings: a name, the value and an optional note. */
export function SpecTable({ rows }: { rows: [name: string, value: string, note?: string][] }) {
  return (
    <div className={TABLE}>
      <table className="w-full border-collapse text-left text-sm leading-6">
        <thead>
          <tr>
            <th className={HEAD}>Measure</th>
            <th className={HEAD}>Value</th>
            <th className={HEAD}>Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, value, note]) => (
            <tr key={name} className="[&:last-child>td]:border-b-0">
              <td className={`${CELL} text-foreground`}>{name}</td>
              <td className={`${CELL} font-mono text-[0.8125rem] whitespace-nowrap`}>{value}</td>
              <td className={CELL}>{note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** What a component takes as input: the name, the type and what it does. */
export function PropTable({ rows }: { rows: [name: string, type: string, text: string][] }) {
  return (
    <div className={TABLE}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm leading-6">
        <thead>
          <tr>
            <th className={HEAD}>Prop</th>
            <th className={HEAD}>Type</th>
            <th className={HEAD}>What it does</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, type, text]) => (
            <tr key={name} className="[&:last-child>td]:border-b-0">
              <td className={`${CELL} font-mono text-[0.8125rem] whitespace-nowrap text-foreground`}>
                {name}
              </td>
              <td className={`${CELL} font-mono text-[0.8125rem]`}>{type}</td>
              <td className={CELL}>{text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---- what is left to write ---- */

/** What each section asks for, shown in a section that has not been written yet. */
const HINTS: Record<string, string> = {
  overview: "One or two sentences: what it is, and what it is for in the training pattern. Then the modes it is used in.",
  anatomy: "A picture of the component with a numbered marker on each part, and a line on what each part is.",
  variants: "The forms it comes in, each with a picture and when to choose it.",
  states: "How it looks while it is used: resting, hovered, pressed, open, disabled. One picture each.",
  behaviour: "What it does, in the order it happens, with the timing and the motion.",
  specs: "Sizes, positions and timings as numbers, in a table.",
  guidelines: "Two or three do and don't pairs, each with a picture and one sentence.",
  accessibility: "How it works with a keyboard and a screen reader, and what has been checked.",
  theory: "Why it is built this way: the sources and the feedback behind it, linked.",
  implementation: "What it is built from, the file it lives in, and what it takes as input.",
  questions: "What is still undecided, and what would settle it.",
};

/** A dashed box that marks a section, or a part of one, that is still to be written. */
export function Todo({ for: section, children }: { for?: keyof typeof HINTS; children?: ReactNode }) {
  const text = children ?? (section ? HINTS[section] : undefined);
  return (
    <div className="my-6 rounded-lg border border-dashed border-border px-4 py-3">
      <p className="text-xs font-medium tracking-wide text-faint uppercase">To write</p>
      {text ? <div className={`mt-1 ${BODY}`}>{text}</div> : null}
    </div>
  );
}
