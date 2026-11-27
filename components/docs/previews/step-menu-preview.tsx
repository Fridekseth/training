"use client";

import { Noto_Sans } from "next/font/google";
import { useState } from "react";
import { OPERATING_THE_FOILS, type GuidedSequence } from "@/components/prototype/wavefoil/guided-data";
import { StepMenu } from "@/components/prototype/wavefoil/guided-mode";
import { ComponentStage, ControlRow, Controls, SelectControl } from "./preview-stage";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

const VARIANTS = [
  ["light", "Light"],
  ["dark", "Dark, for light backgrounds"],
] as const;

const LENGTHS = [
  ["3", "3 steps"],
  ["6", "6 steps"],
  ["9", "9 steps"],
  ["12", "12 steps"],
] as const;

/** The steps of a chapter, taken from a real one and cut to the length chosen. */
const sequenceOf = (count: number): GuidedSequence => {
  const steps = Array.from({ length: count }, (_, at) => OPERATING_THE_FOILS.steps[at % OPERATING_THE_FOILS.steps.length]);
  return { ...OPERATING_THE_FOILS, steps };
};

export function StepMenuPreview() {
  const [count, setCount] = useState("6");
  const [step, setStep] = useState(2);
  const [variant, setVariant] = useState<(typeof VARIANTS)[number][0]>("light");
  const sequence = sequenceOf(Number(count));
  const current = Math.min(step, sequence.steps.length - 1);

  return (
    <div className={notoSans.className}>
      <ComponentStage>
        <StepMenu
          sequence={sequence}
          step={current}
          corner="top-left"
          variant={variant}
          onStep={setStep}
          onExit={() => setStep(0)}
        />
      </ComponentStage>

      <Controls>
        <ControlRow name="variant" text="Light by default. Dark is a light teal panel with lighter cards, for a light background.">
          <SelectControl name="variant" value={variant} options={VARIANTS} onChange={setVariant} />
        </ControlRow>
        <ControlRow name="sequence" text="How many steps the chapter has.">
          <SelectControl name="sequence" value={count} options={LENGTHS} onChange={setCount} />
        </ControlRow>
        <ControlRow name="step" text="The current step. The line is teal up to it, and grey after it.">
          <SelectControl
            name="step"
            value={String(current)}
            options={sequence.steps.map((_, at) => [String(at), `Step ${at + 1}`] as const)}
            onChange={(value) => setStep(Number(value))}
          />
        </ControlRow>
      </Controls>
    </div>
  );
}
