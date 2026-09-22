"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * A prototype shown inside a post: a still image until it is started, then the
 * running thing itself, scaled down to the width of the text column. Nothing is
 * downloaded before the reader presses start, so a post can hold several.
 *
 * `app` runs a prototype that lives in this project; `src` frames a standalone
 * HTML prototype, which keeps its styling to itself.
 */

const TrainingPrototype = dynamic(
  () =>
    import("./prototype/prototype-stage").then((mod) => ({
      default: mod.PrototypeStage,
    })),
  {
    ssr: false,
    loading: () => (
      <p className="p-6 text-sm text-muted">Loading the prototype...</p>
    ),
  },
);

export function PrototypeEmbed({
  title,
  app,
  variant,
  initialPage,
  src,
  poster,
  width,
  height,
  href,
}: {
  /** Named under the frame, so a post with several stays readable. */
  title: string;
  /** A prototype built into this site. Currently only "training-menu". */
  app?: "training-menu";
  /** Which experiment's version of the prototype to run. */
  variant?: "second-test" | "third-test";
  /** The screen it opens on. */
  initialPage?: "home" | "overview" | "getting-started" | "explore" | "scenarios";
  /** A standalone HTML prototype under /public, shown in its own frame. */
  src?: string;
  poster: string;
  /** The size the prototype is drawn at, before scaling down. */
  width: number;
  height: number;
  /** Where "open full size" goes. Defaults to `src`. */
  href?: string;
}) {
  const [started, setStarted] = useState(false);
  const [scale, setScale] = useState(1);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);

  const fullSize = href ?? src;

  return (
    <figure className="my-8">
      <div
        ref={frame}
        className="relative overflow-hidden rounded-lg border border-border bg-surface"
        style={{ height: Math.round(height * scale) }}
      >
        <div
          style={{
            width,
            height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {started ? (
            src ? (
              <iframe
                src={src}
                title={title}
                width={width}
                height={height}
                className="block border-0"
              />
            ) : app === "training-menu" ? (
              <TrainingPrototype variant={variant} initialPage={initialPage} />
            ) : null
          ) : null}
        </div>

        {started ? null : (
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="group absolute inset-0 flex items-center justify-center"
            aria-label={`Start the prototype: ${title}`}
          >
            <Image
              src={poster}
              alt=""
              fill
              sizes="(min-width: 768px) 700px, 100vw"
              className="object-cover object-top"
            />
            <span className="relative rounded-full border border-border bg-background/95 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors group-hover:border-accent group-hover:text-accent">
              Start the prototype
            </span>
          </button>
        )}
      </div>

      <figcaption className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[0.8rem] text-faint">
        <span>{title}</span>
        {fullSize ? (
          <a
            href={fullSize}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-accent"
          >
            Open full size
          </a>
        ) : null}
      </figcaption>
    </figure>
  );
}
