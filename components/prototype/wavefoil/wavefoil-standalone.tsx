"use client";

import { useState } from "react";
import type { Conditions } from "./conditions";
import { ConditionsPicker } from "./conditions-picker";
import { WavefoilStage } from "./wavefoil-stage";

/**
 * The prototype alone, at the size it was designed at, in the middle of the
 * window, with the picker for the sea state under it.
 */
export function WavefoilStandalone() {
  const [conditions, setConditions] = useState<Conditions>("ideal");

  return (
    <div className="flex min-h-full flex-col items-center justify-center py-4">
      <div style={{ width: 786, height: 590, flexShrink: 0 }}>
        <WavefoilStage conditions={conditions} />
      </div>
      <ConditionsPicker value={conditions} onChange={setConditions} />
    </div>
  );
}
