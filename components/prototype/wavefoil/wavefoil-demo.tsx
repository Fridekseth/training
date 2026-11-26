"use client";

import { useState } from "react";
import { DemoShortcuts } from "../demo-shortcuts";
import { ScaledFrame } from "../scaled-frame";
import type { Conditions } from "./conditions";
import { ConditionsPicker } from "./conditions-picker";
import type { WfPageId } from "./training-data";
import { WavefoilStage } from "./wavefoil-stage";

/** Where the shortcuts take the screen: the pages of the training. */
const SHORTCUTS = [
  ["home", "Training homepage"],
  ["overview", "Overview"],
  ["getting-started", "Learn"],
  ["explore", "Explore"],
  ["collaborate", "Collaborate"],
  ["scenarios", "Practice"],
  ["test", "Test"],
] as const satisfies readonly (readonly [WfPageId, string])[];

/**
 * The Wavefoil screen in its frame on the demo page, with shortcuts to the pages of
 * the training beside it. Explore mode draws a teal ring just outside the screen,
 * so while it is on the frame stops clipping.
 */
export function WavefoilDemo() {
  const [exploring, setExploring] = useState(false);
  const [conditions, setConditions] = useState<Conditions>("ideal");
  const [shortcut, setShortcut] = useState<{ page: WfPageId; id: number } | null>(null);

  return (
    <>
      <div className="mt-5 flex flex-wrap items-start gap-x-8 gap-y-5">
        {/*
          Drawn at its own size, so the frame closes around it instead of stretching
          to the column; box-content keeps the border out of the 786px, so the scale
          stays at 1.
        */}
        <ScaledFrame
          width={786}
          height={590}
          overflowVisible={exploring}
          className="box-content w-full max-w-[786px] rounded-lg border border-border shadow-sm"
        >
          <WavefoilStage conditions={conditions} onExploring={setExploring} shortcut={shortcut} />
        </ScaledFrame>
        <DemoShortcuts
          items={SHORTCUTS}
          active={shortcut?.page}
          onPick={(page) => setShortcut((now) => ({ page, id: (now?.id ?? 0) + 1 }))}
        />
      </div>
      <ConditionsPicker value={conditions} onChange={setConditions} />
    </>
  );
}
