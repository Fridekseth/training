"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Noto_Sans } from "next/font/google";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

/** Browser only: the library's elements need the browser to define them. */
const SecondScreen = dynamic(
  () => import("./second-screen").then((mod) => ({ default: mod.SecondScreen })),
  { ssr: false },
);

/**
 * The library draws its colours from a palette set on the document, so the
 * page sets the day palette itself, and takes it off again when it goes.
 */
export function SecondScreenStage() {
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
      <SecondScreen />
    </div>
  );
}
