"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Noto_Sans } from "next/font/google";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

/** Browser only, for the same reason as the training prototype. */
const WavefoilApp = dynamic(
  () => import("./wavefoil-app").then((mod) => ({ default: mod.WavefoilApp })),
  {
    ssr: false,
    loading: () => <p className="p-6 text-sm text-muted">Loading the prototype...</p>,
  },
);

let mounted = 0;

/**
 * The palette lives on the document, because the design system defines each
 * one under `:root[data-obc-theme]`. Dimming this screen therefore dims every
 * OpenBridge component on the page, the training prototype included.
 */
export function WavefoilStage({ theme = "day" }: { theme?: string }) {
  const [palette, setPalette] = useState(theme);

  useEffect(() => {
    const html = document.documentElement;
    mounted += 1;
    return () => {
      mounted -= 1;
      if (mounted === 0) {
        delete html.dataset.obcTheme;
        document.body.classList.remove("obc-component-size-regular");
      }
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.obcTheme = palette;
    document.body.classList.add("obc-component-size-regular");
  }, [palette]);

  /**
   * The attribute is set here rather than left to the effect, so that anything
   * reading a colour off the document while it re-renders already sees the new
   * palette rather than the one being left behind.
   */
  const dim = () => {
    const next = palette === "day" ? "dusk" : "day";
    document.documentElement.dataset.obcTheme = next;
    setPalette(next);
  };

  return (
    <div className={`${notoSans.className} h-full w-full`}>
      <WavefoilApp
        palette={palette}
        onDim={dim}
      />
    </div>
  );
}
