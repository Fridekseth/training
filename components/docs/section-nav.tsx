"use client";

import { useEffect, useState } from "react";

type Item = { id: string; title: string };

/**
 * The sections of the page as a row of links that stays under the header, with
 * the one being read marked. It reads the headings off the page itself, so a
 * page that has fewer sections simply has fewer links.
 */
export function SectionNav({ target }: { target: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = [...document.querySelectorAll<HTMLElement>(`#${target} h2[id]`)];
    // The headings are in the document only once the page is on screen, so they are read here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(headings.map((heading) => ({ id: heading.id, title: heading.textContent ?? "" })));

    // The section being read is the last heading that has passed the line just under the sticky bars.
    const mark = () => {
      let current = headings[0]?.id ?? null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= 140) current = heading.id;
      }
      setActive(current);
    };
    const frame = requestAnimationFrame(mark);
    window.addEventListener("scroll", mark, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", mark);
    };
  }, [target]);

  if (!items.length) return <div className="h-11" aria-hidden="true" />;

  return (
    <nav
      aria-label="On this page"
      className="sticky top-[3.9rem] z-[9] -mx-6 border-b border-border bg-background/90 px-6 backdrop-blur-sm"
    >
      <ul className="flex gap-1 overflow-x-auto py-2 text-sm whitespace-nowrap">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={`rounded-full px-3 py-1 transition-colors ${
                active === item.id
                  ? "bg-accent-soft font-medium text-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
