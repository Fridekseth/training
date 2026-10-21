import type { ComponentPropsWithoutRef } from "react";

/*
  A table for posts that need to set things side by side. Markdown tables are
  not parsed here, so a post writes the table out with these, one cell to a
  line of its own.
*/

/** Scrolls sideways on a narrow screen rather than squeezing the columns. */
export function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table
        className="w-full min-w-[44rem] border-collapse text-left text-sm leading-6"
        {...props}
      />
    </div>
  );
}

export function Th(props: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      className="border-b border-border bg-surface px-4 py-2.5 align-bottom font-medium text-foreground"
      {...props}
    />
  );
}

export function Td(props: ComponentPropsWithoutRef<"td">) {
  return (
    <td
      className="border-b border-border px-4 py-3 align-top text-muted [tr:last-child_&]:border-b-0"
      {...props}
    />
  );
}

/** A small screenshot in a cell, which opens full size in a new tab. */
export function Shot({ src, alt }: { src: string; alt: string }) {
  return (
    <a href={src} target="_blank" rel="noopener noreferrer" className="mb-2 block w-56">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full rounded-md border border-border" />
    </a>
  );
}
