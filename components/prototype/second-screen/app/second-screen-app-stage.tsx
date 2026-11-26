"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Noto_Sans } from "next/font/google";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

/** Browser only: the library's elements need the browser to define them. */
const SecondScreenApp = dynamic(
  () => import("./second-screen-app").then((mod) => ({ default: mod.SecondScreenApp })),
  { ssr: false },
);

/**
 * The library draws its colours from a palette set on the document, so the page
 * sets the day palette itself, and takes it off again when it goes.
 */
export function SecondScreenAppStage() {
  // In a frame on the demo page the app draws the status bar and the line at the bottom that a phone has.
  const [query] = useState(() =>
    typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search),
  );
  const device = query.has("device");
  const start = query.get("page");

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.obcTheme = "day";
    document.body.classList.add("obc-component-size-regular");
    return () => {
      delete html.dataset.obcTheme;
      document.body.classList.remove("obc-component-size-regular");
    };
  }, []);

  return (
    <div className={`${notoSans.className} h-full w-full`}>
      <SecondScreenApp device={device} start={start} />
    </div>
  );
}
