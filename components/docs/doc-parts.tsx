import type { ReactNode } from "react";
import { CopySvgButton } from "./copy-svg-button";

/*
  The building blocks a component page is written with. They are registered in
  `mdx-components.tsx`, so a page's MDX file uses them by name and holds only
  the words, the pictures and the numbers.
*/

const STAGE = "rounded-lg border border-border bg-accent-soft";
/** Text inside a part. A paragraph written there comes out of markdown with its own spacing, which is taken off. */
const BODY = "text-sm leading-6 text-muted [&_p]:m-0 [&_p]:text-sm [&_p]:leading-6 [&_p+p]:mt-2";

/**
 * A picture on a tinted stage, with room for a caption. A picture that has its own white
 * background, such as an annotated drawing, is set on white with no stage with `plain`.
 */
export function Figure({
  src,
  alt,
  caption,
  plain = false,
  bare = false,
  zoom,
}: {
  src: string;
  alt: string;
  caption?: string;
  plain?: boolean;
  /** A transparent picture straight on the page, with no plate or border. Its black lines turn light at night. */
  bare?: boolean;
  /** Fills the plate edge to edge and scales the picture up by this much, cropping the margins. */
  zoom?: number;
}) {
  if (bare) {
    return (
      <figure className="my-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="invert-at-night mx-auto block w-full" />
        {caption ? (
          <figcaption className="mt-2 text-sm leading-6 text-faint">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className="my-6">
      <div
        className={
          plain
            ? "overflow-hidden rounded-lg border border-border bg-white"
            : zoom
              ? `${STAGE} overflow-hidden`
              : `${STAGE} p-4`
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          style={zoom ? { transform: `scale(${zoom})` } : undefined}
          className={
            plain || zoom ? "block w-full" : "mx-auto block max-w-full rounded-md"
          }
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-sm leading-6 text-faint">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/* ---- colors, illustrations and icons ---- */

/** The colors of a ramp as swatches: the name, the value and the token it is set by. */
export function Swatches({ rows }: { rows: [name: string, value: string, token: string][] }) {
  return (
    // Two columns that are filled down, so the first half of the list is on the left and the rest on the right.
    <div
      className="my-6 grid gap-4 sm:grid-flow-col sm:grid-cols-2 sm:[grid-template-rows:repeat(var(--rows),auto)]"
      style={{ "--rows": Math.ceil(rows.length / 2) } as React.CSSProperties}
    >
      {rows.map(([name, value, token]) => (
        <div key={name} className="flex items-center gap-4 rounded-lg border border-border bg-surface p-3">
          <span
            aria-hidden="true"
            className="size-16 shrink-0 rounded-md border border-black/10"
            style={{ background: value }}
          />
          <div className="min-w-0">
            <p className="m-0 text-sm font-semibold text-foreground">{name}</p>
            <p className="m-0 font-mono text-[0.75rem] leading-5 break-words text-muted">{value}</p>
            <p className="m-0 font-mono text-[0.75rem] leading-5 text-muted">{token}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * A set of pictures, each on a tile with its name: illustrations on the teal plate, and icons on a
 * grey one. The icons are drawn in one color whatever color their file has, so they match.
 */
export function Gallery({
  items,
  kind = "illustration",
}: {
  items: [src: string, name: string][];
  kind?: "illustration" | "icon";
}) {
  const icon = kind === "icon";
  return (
    <ul
      className={`my-6 grid list-none gap-4 p-0 ${
        icon ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3"
      }`}
    >
      {items.map(([src, name]) => (
        <li key={src} className="m-0 p-0">
          <div
            className={`relative flex items-center justify-center overflow-hidden rounded-lg border border-black/10 ${
              icon ? "h-28" : "aspect-[4/3]"
            }`}
            style={{ background: icon ? "#f1f1f1" : "#e2f2f3" }}
          >
            {icon ? (
              <span
                aria-hidden="true"
                className="block size-12"
                style={{
                  backgroundColor: "#535353",
                  maskImage: `url(${src})`,
                  WebkitMaskImage: `url(${src})`,
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                className="absolute inset-4 size-[calc(100%-2rem)] object-contain"
              />
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <p className="m-0 text-sm leading-5 text-muted">{name}</p>
            {src.endsWith(".svg") ? <CopySvgButton src={src} name={name} /> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---- states ---- */

/** The states laid out as a grid of cards, one picture and a line each. Two to a row, or three when asked. */
export function States({ children, columns = 2 }: { children: ReactNode; columns?: 2 | 3 }) {
  return (
    <div className={`my-6 grid gap-4 ${columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>{children}</div>
  );
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
  text = false,
  children,
}: {
  kind: "do" | "dont";
  src?: string;
  alt?: string;
  /** An example of wording, which has no picture. */
  text?: boolean;
  children: ReactNode;
}) {
  const bar = kind === "do" ? "bg-accent" : "bg-red-600 dark:bg-red-400";
  const label = kind === "do" ? "Do" : "Don't";
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? ""} className="block w-full border-b border-border" />
      ) : text ? null : (
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

export const Do = (props: { src?: string; alt?: string; text?: boolean; children: ReactNode }) => (
  <Guideline kind="do" {...props} />
);
export const Dont = (props: { src?: string; alt?: string; text?: boolean; children: ReactNode }) => (
  <Guideline kind="dont" {...props} />
);

/* ---- numbers ---- */

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

/* ---- what is left to write ---- */

/** What each section asks for, shown in a section that has not been written yet. */
const HINTS: Record<string, string> = {
  overview: "One or two sentences: what it is, and what it is for in the training pattern.",
  features: "What it does, as a short list.",
  variants: "The forms it comes in, each with a picture and when to choose it.",
  specs: "Sizes, positions and timings as numbers, in a table.",
  guidelines: "Two or three do and don't pairs, each with a picture and one sentence.",
};

/** A dashed box that marks a section, or a part of one, that is still to be written. */
export function Todo({ for: section, children }: { for?: keyof typeof HINTS; children?: ReactNode }) {
  const text = children ?? (section ? HINTS[section] : undefined);
  return (
    <div className="my-6 rounded-lg border border-dashed border-border px-4 py-3">
      <p className="text-sm font-medium text-faint">To write</p>
      {text ? <div className={`mt-1 ${BODY}`}>{text}</div> : null}
    </div>
  );
}
