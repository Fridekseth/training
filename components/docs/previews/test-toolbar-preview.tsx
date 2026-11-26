"use client";

import { Noto_Sans } from "next/font/google";
import { useRef, useState } from "react";
import { ScenarioChrome } from "@/components/prototype/wavefoil/test-screen";
import { ComponentStage, ControlRow, Controls, SelectControl } from "./preview-stage";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

const COUNTS = ["2", "3", "4", "6", "8"].map((count) => [count, `${count} questions`] as const);

/** The toolbar floating over a scenario, with a step for each question. */
export function TestToolbarPreview() {
  const layer = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState("4");
  const [index, setIndex] = useState(0);
  const total = Number(count);
  const current = Math.min(index, total - 1);

  return (
    <div className={notoSans.className}>
      <ComponentStage layer={layer} className="[&>*:first-child]:hidden">
        <ScenarioChrome
          key={count}
          count={total}
          index={current}
          layer={layer}
          tabCorner="top-left"
          onGo={setIndex}
          onFinish={() => setIndex(0)}
          onLeave={() => setIndex(0)}
        />
      </ComponentStage>

      <p className="mt-3 text-sm text-faint">
        Go through the questions with Previous, the steps and Next.
      </p>

      <Controls>
        <ControlRow name="count" text="How many questions the test has. The toolbar grows when they do not fit.">
          <SelectControl name="count" value={count} options={COUNTS} onChange={setCount} />
        </ControlRow>
        <ControlRow name="index" text="The question being answered.">
          <SelectControl
            name="index"
            value={String(current)}
            options={Array.from({ length: total }, (_, at) => [String(at), `Question ${at + 1}`] as const)}
            onChange={(value) => setIndex(Number(value))}
          />
        </ControlRow>
      </Controls>
    </div>
  );
}
