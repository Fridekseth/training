"use client";

import { useRef, useState } from "react";

export type Slide = {
  src: string;
  /** What the picture shows, for anyone who cannot see it. */
  alt: string;
  /** Shown under the picture while its slide is the current one. */
  caption?: string;
};

/**
 * A row of pictures shown one at a time, so a post can document many screens
 * without giving each its own stretch of page. It scrolls natively, which gives
 * swipe on touch screens, and the buttons, the dots and the arrow keys move it
 * one slide at a time.
 */
export function Carousel({
  slides,
  label,
  ratio = "798 / 602",
}: {
  slides: Slide[];
  /** Names the carousel for screen readers. */
  label: string;
  /** The shape of a slide, as CSS aspect-ratio, so the page does not jump while pictures load. */
  ratio?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = (target: number) => {
    const el = track.current;
    if (!el) return;
    const next = Math.min(slides.length - 1, Math.max(0, target));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: next * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
    setIndex(next);
  };

  const onScroll = () => {
    const el = track.current;
    if (!el || el.clientWidth === 0) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const current = slides[index];

  return (
    <figure
      className="my-8"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={track}
          onScroll={onScroll}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              goTo(index + 1);
            } else if (event.key === "ArrowLeft") {
              event.preventDefault();
              goTo(index - 1);
            }
          }}
          tabIndex={0}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-lg border border-border bg-surface [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              className="w-full shrink-0 snap-center"
              style={{ aspectRatio: ratio }}
            >
              {/* Plain img: these are fixed pictures from /public, as in the rest of the post. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src}
                alt={slide.alt}
                loading={i === 0 ? "eager" : "lazy"}
                className="size-full object-contain"
              />
            </div>
          ))}
        </div>

        {(
          [
            { side: "left-3", step: -1, label: "Previous", path: "M15 6l-6 6 6 6" },
            { side: "right-3", step: 1, label: "Next", path: "M9 6l6 6-6 6" },
          ] as const
        ).map(({ side, step, label: name, path }) => {
          const disabled = index + step < 0 || index + step > slides.length - 1;
          return (
            <button
              key={name}
              type="button"
              onClick={() => goTo(index + step)}
              disabled={disabled}
              aria-label={`${name} slide`}
              className={`absolute top-1/2 ${side} flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-sm transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-0`}
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={path} />
              </svg>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-start justify-between gap-4">
        <figcaption className="min-h-12 text-sm leading-6 text-faint italic" aria-live="polite">
          {current?.caption}
        </figcaption>
        <div className="flex shrink-0 items-center gap-1.5 pt-2" role="tablist" aria-label="Choose a slide">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`size-2 rounded-full transition-colors ${i === index ? "bg-accent" : "bg-border hover:bg-faint"}`}
            />
          ))}
        </div>
      </div>
    </figure>
  );
}
