import Link from "next/link";
import type { ReactNode } from "react";
import { Pill } from "@/components/pill";
import { ITEM_STATUS_LABEL, type SectionItem, type SectionKey } from "@/lib/documentation";

const TEAL_RAMP = ["#e2f2f3", "#bee4e5", "#80cacd", "#1d9da1", "#007d81", "#005d61", "#004346"];

const ICONS = [
  "nav-getting-started",
  "wf-nav-explore",
  "wf-nav-collaborate",
  "wf-nav-test",
  "nav-scenarios",
  "nav-overview",
  "wf-menu-training",
  "idea",
];

/** A spot illustration on the teal plate, as the picture of a pattern. */
const illustration = (name: string) => ({
  background: "#e2f2f3",
  node: (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/documentation/illustrations/${name}.svg`}
      alt=""
      className="size-full object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03]"
    />
  ),
});

/** The picture on the card of a page that has one, with the grey or teal it stands on. */
const PREVIEWS: Record<string, { background: string; node: ReactNode }> = {
  "visual-language/color": {
    background: "#e2f2f3",
    node: (
      <div className="flex size-full" aria-hidden="true">
        {TEAL_RAMP.map((color) => (
          <span key={color} className="h-full flex-1" style={{ background: color }} />
        ))}
      </div>
    ),
  },
  "visual-language/illustration": {
    background: "#e2f2f3",
    node: (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/hero/application-layers.svg"
        alt=""
        className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
    ),
  },
  "patterns/overview": illustration("statistics"),
  "patterns/learn": illustration("learn"),
  "patterns/explore": illustration("explore"),
  "patterns/collaborate": illustration("collaborate"),
  "patterns/practice": illustration("practice"),
  "patterns/test": illustration("puzzle"),
  "patterns/second-screen": illustration("compass"),
  "visual-language/icons": {
    background: "#f1f1f1",
    node: (
      <div className="grid grid-cols-4 gap-x-8 gap-y-6" aria-hidden="true">
        {ICONS.map((name) => (
          <span
            key={name}
            className="block size-8"
            style={{
              backgroundColor: "#535353",
              maskImage: `url(/prototype/icons/${name}.svg)`,
              WebkitMaskImage: `url(/prototype/icons/${name}.svg)`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
          />
        ))}
      </div>
    ),
  },
};

/**
 * The pages of a section as cards that look like the ones for components. A page that has no
 * picture yet has an empty box.
 */
export function PlannedItems({ section, items }: { section: SectionKey; items: SectionItem[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const preview = PREVIEWS[`${section}/${item.slug}`];
        return (
          <li key={item.slug}>
            <Link
              href={`/documentation/${section}/${item.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent/40"
            >
              {/* Centred with flex, which is reliable for a box that has its height from a ratio. */}
              <div
                className="flex aspect-[16/9] items-center justify-center overflow-hidden border-b border-border"
                style={{ background: preview?.background ?? "var(--accent-soft)" }}
              >
                {preview ? preview.node : <span className="text-sm text-faint">No preview yet</span>}
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <h3 className="text-base font-semibold tracking-tight text-foreground group-hover:text-accent">
                  {item.title}
                </h3>
                <Pill>{ITEM_STATUS_LABEL[item.status]}</Pill>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
