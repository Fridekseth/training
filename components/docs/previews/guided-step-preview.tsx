"use client";

import { Noto_Sans } from "next/font/google";
import { useState } from "react";
import { OPERATING_THE_FOILS } from "@/components/prototype/wavefoil/guided-data";
import { Tip } from "@/components/prototype/wavefoil/guided-mode";
import { ComponentStage, ControlRow, Controls, SelectControl } from "./preview-stage";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

const STEPS = OPERATING_THE_FOILS.steps;
const OPTIONS = STEPS.map((step, at) => [String(at), `${at + 1}. ${step.label}`] as const);

/** The explanation box with the steps of a real chapter, so the buttons can be pressed. */
export function GuidedStepPreview() {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];

  return (
    <div className={notoSans.className}>
      <ComponentStage>
        <Tip
          step={step}
          index={index}
          last={index === STEPS.length - 1}
          onPrevious={() => setIndex((now) => Math.max(0, now - 1))}
          onNext={() => setIndex((now) => Math.min(STEPS.length - 1, now + 1))}
          onFinish={() => setIndex(0)}
        />
      </ComponentStage>

      <p className="mt-3 text-sm text-faint">
        Press Previous and Next to go through the chapter Operating the foils.
      </p>

      <Controls>
        <ControlRow name="step" text="The step being shown. It sets the words, the place and the side the pointer is on.">
          <SelectControl
            name="step"
            value={String(index)}
            options={OPTIONS}
            onChange={(value) => setIndex(Number(value))}
          />
        </ControlRow>
      </Controls>
    </div>
  );
}
