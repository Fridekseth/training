"use client";

import { Noto_Sans } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { Toast } from "@/components/prototype/wavefoil/guided-mode";
import {
  ControlRow,
  PreviewStage,
  Controls,
  SelectControl,
  TextControl,
} from "./preview-stage";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

const TIMES = [
  ["10", "10 seconds"],
  ["30", "30 seconds"],
  ["60", "60 seconds"],
] as const;

/** The toast is 480px wide, and opens 8px from the top. */
const TOAST_WIDTH = 480;
const TOP = 8;

/** The bar that says what the task is while a scenario runs, with a way to give it up. */
export function ToastPreview() {
  const layer = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("Deploy the foils");
  const [subtitle, setSubtitle] = useState("");
  const [seconds, setSeconds] = useState<(typeof TIMES)[number][0]>("30");
  // Where the toast has been dragged to; until then it stands in the middle at the top, as it opens in a test.
  const [at, setAt] = useState<{ left: number; top: number } | null>(null);
  // The time left, as a share, running down as it does while a scenario in a test runs.
  const [remaining, setRemaining] = useState(100);
  const [round, setRound] = useState(0);

  useEffect(() => {
    const total = Number(seconds) * 1000;
    const began = performance.now();
    const tick = window.setInterval(() => {
      const left = Math.max(
        0,
        100 - ((performance.now() - began) / total) * 100,
      );
      setRemaining(left);
      if (left === 0) window.clearInterval(tick);
    }, 100);
    return () => window.clearInterval(tick);
  }, [seconds, round]);

  return (
    <div className={notoSans.className}>
      {/* As high as the toast with room to drag it around. */}
      <PreviewStage layer={layer} height={200}>
        {(screen) => (
          <Toast
            title={title}
            subtitle={subtitle || undefined}
            remaining={remaining}
            at={
              at ?? {
                left: Math.max(0, (screen.width - TOAST_WIDTH) / 2),
                top: TOP,
              }
            }
            onMove={setAt}
            layer={layer}
            onCancel={() => setRound((now) => now + 1)}
          />
        )}
      </PreviewStage>

      <div className="mt-3 flex flex-wrap items-center justify-end gap-x-6 gap-y-2">
        <button
          type="button"
          onClick={() => {
            setAt(null);
            setRound((now) => now + 1);
          }}
          className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:border-accent/40 hover:text-accent"
        >
          Replay
        </button>
      </div>

      <Controls>
        <ControlRow name="title" text="What the task is, in bold.">
          <TextControl name="title" value={title} onChange={setTitle} />
        </ControlRow>
        <ControlRow
          name="subtitle"
          text="A second line under the title. A scenario has none."
        >
          <TextControl
            name="subtitle"
            value={subtitle}
            onChange={setSubtitle}
            placeholder="Nothing"
          />
        </ControlRow>
        <ControlRow
          name="time"
          text="How long the task has. The ring round the cancel button runs down with the time left."
        >
          <SelectControl
            name="time"
            value={seconds}
            options={TIMES}
            onChange={(value) => {
              setSeconds(value);
              setRound((now) => now + 1);
            }}
          />
        </ControlRow>
      </Controls>
    </div>
  );
}
