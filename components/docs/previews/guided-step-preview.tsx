"use client";

import { Noto_Sans } from "next/font/google";
import { useState } from "react";
import { OPERATING_THE_FOILS } from "@/components/prototype/wavefoil/guided-data";
import { Tip } from "@/components/prototype/wavefoil/guided-mode";
import { ComponentStage, ControlRow, Controls, SelectControl } from "./preview-stage";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

// The chapter ends in a step that only opens its test and has no box, so it is left out here.
const STEPS = OPERATING_THE_FOILS.steps.filter((step) => step.tip.width > 0);
const OPTIONS = STEPS.map((step, at) => [String(at), `${at + 1}. ${step.label}`] as const);

const STAGE_HEIGHT = 360;

const SIDES = [
  ["left", "Left"],
  ["right", "Right"],
  ["top", "Top"],
  ["bottom", "Bottom"],
  ["none", "None"],
] as const;
type Side = (typeof SIDES)[number][0];

/** The explanation box with the steps of a real chapter, so the buttons can be pressed. */
export function GuidedStepPreview() {
  const [index, setIndex] = useState(0);
  // The side of the pointer follows the step, and can be set to another side to see it there.
  const [side, setSide] = useState<Side>(STEPS[0].arrow ?? "none");
  const go = (next: number) => {
    setIndex(next);
    setSide(STEPS[next].arrow ?? "none");
  };
  const own = STEPS[index];
  // On the step's own side the pointer is placed at what it explains; on another it is centred on that side.
  const step =
    side === (own.arrow ?? "none") ? own : { ...own, arrow: side === "none" ? null : side, hole: null };

  return (
    <div className={notoSans.className}>
      {/* High enough for the tallest step, so the box does not change size from one step to the next. */}
      <ComponentStage minHeight={STAGE_HEIGHT}>
        <Tip
          step={step}
          index={index}
          last={index === STEPS.length - 1}
          onPrevious={() => go(Math.max(0, index - 1))}
          onNext={() => go(Math.min(STEPS.length - 1, index + 1))}
          onFinish={() => go(0)}
        />
      </ComponentStage>

      <Controls>
        <ControlRow name="step" text="The step being shown. It sets the words, the place and the side the pointer is on.">
          <SelectControl
            name="step"
            value={String(index)}
            options={OPTIONS}
            onChange={(value) => go(Number(value))}
          />
        </ControlRow>
        <ControlRow name="pointer" text="The side of the box the pointer is on, towards what it explains. None when it explains the whole screen.">
          <SelectControl name="pointer" value={side} options={SIDES} onChange={setSide} />
        </ControlRow>
      </Controls>
    </div>
  );
}
