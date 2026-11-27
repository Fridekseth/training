"use client";

import { Noto_Sans } from "next/font/google";
import { useRef, useState } from "react";
import { TrainingFrame } from "@/components/prototype/wavefoil/training-frame";
import { PreviewStage } from "./preview-stage";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

/** The frame around a screen. It is drawn once when it appears, so there is a button to see it drawn again. */
export function TrainingFramePreview() {
  const layer = useRef<HTMLDivElement>(null);
  const [round, setRound] = useState(0);

  return (
    <div className={notoSans.className}>
      <PreviewStage layer={layer} ring height={300}>
        <TrainingFrame key={round} />
      </PreviewStage>
      <div className="mt-3 flex flex-wrap items-center justify-end gap-x-6 gap-y-2">
        <button
          type="button"
          onClick={() => setRound((now) => now + 1)}
          className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:border-accent/40 hover:text-accent"
        >
          Replay
        </button>
      </div>
    </div>
  );
}
