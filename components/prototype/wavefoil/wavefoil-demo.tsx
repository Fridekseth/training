"use client";

import { useState } from "react";
import { ScaledFrame } from "../scaled-frame";
import type { Conditions } from "./conditions";
import { ConditionsPicker } from "./conditions-picker";
import { WavefoilStage } from "./wavefoil-stage";

/**
 * The Wavefoil screen in its frame on the demo page. Explore mode draws a teal
 * ring just outside the screen, so while it is on the frame stops clipping.
 */
export function WavefoilDemo() {
  const [exploring, setExploring] = useState(false);
  const [conditions, setConditions] = useState<Conditions>("ideal");

  return (
    <>
      {/*
        Drawn at its own size, so the frame closes around it instead of stretching
        to the column; box-content keeps the border out of the 786px, so the scale
        stays at 1.
      */}
      <ScaledFrame
        width={786}
        height={590}
        overflowVisible={exploring}
        className="mx-auto mt-5 box-content max-w-[786px] rounded-lg border border-border shadow-sm"
      >
        <WavefoilStage conditions={conditions} onExploring={setExploring} />
      </ScaledFrame>
      <ConditionsPicker value={conditions} onChange={setConditions} />
    </>
  );
}
