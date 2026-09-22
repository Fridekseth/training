"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Noto_Sans } from "next/font/google";
import type { Variant } from "./training-app";
import type { PageId } from "./training-data";

/** OpenBridge draws in Noto Sans; shadow DOM inherits it from the stage. */
const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

/**
 * `ssr: false` keeps the Lit elements out of the server render. The palette is
 * selected with `data-obc-theme` on <html>, which is where the library declares
 * it, so the stage sets it while a prototype is on screen.
 */
const PrototypeScreen = dynamic(() => import("./prototype-screen"), {
  ssr: false,
  loading: () => (
    <p className="p-6 text-sm text-muted">Loading the prototype...</p>
  ),
});

/**
 * A page can hold several prototypes, and the palette lives on <html>, so the
 * attribute is counted rather than set and unset by whichever mounts last.
 */
let mounted = 0;

export function PrototypeStage({
  theme = "day",
  className = "",
  variant,
  initialPage,
  syncHash = false,
}: {
  theme?: string;
  className?: string;
  variant?: Variant;
  initialPage?: PageId;
  /** The standalone page keeps the screen in the address bar; embeds do not. */
  syncHash?: boolean;
}) {
  useEffect(() => {
    const html = document.documentElement;
    mounted += 1;
    html.dataset.obcTheme = theme;
    document.body.classList.add("obc-component-size-regular");

    return () => {
      mounted -= 1;
      if (mounted === 0) {
        delete html.dataset.obcTheme;
        document.body.classList.remove("obc-component-size-regular");
      }
    };
  }, [theme]);

  return (
    <div className={`${notoSans.className} h-full w-full ${className}`}>
      <PrototypeScreen
        variant={variant}
        initialPage={initialPage}
        syncHash={syncHash}
      />
    </div>
  );
}
