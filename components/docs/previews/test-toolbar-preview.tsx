"use client";

import { Noto_Sans } from "next/font/google";
import { useRef, useState } from "react";
import { QuestionToolbar, ScenarioChrome } from "@/components/prototype/wavefoil/test-screen";
import { ControlRow, Controls, PreviewStage, SelectControl, SwitchControl } from "./preview-stage";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

const COUNTS = ["2", "3", "4", "6", "8"].map((count) => [count, `${count} questions`] as const);

/** The toolbar floating over a scenario, with a step for each question. It can be dragged by its handle. */
export function TestToolbarPreview() {
  const layer = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState("4");
  const [index, setIndex] = useState(0);
  const [draggable, setDraggable] = useState(true);
  const total = Number(count);
  const current = Math.min(index, total - 1);

  return (
    <div className={notoSans.className}>
      {draggable ? (
        // As high as the toolbar with room to drag it around. The button back to the question is left out.
        <PreviewStage key="drag" layer={layer} height={200} className="[&>*:first-child]:hidden">
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
        </PreviewStage>
      ) : (
        // Fixed along the bottom, as on the question page, so the strip is only as high as the toolbar.
        <PreviewStage key="fixed" layer={layer} height={96}>
          <QuestionToolbar
            count={total}
            index={current}
            onGo={setIndex}
            onBack={() => setIndex(0)}
            onFinish={() => setIndex(0)}
          />
        </PreviewStage>
      )}

      <Controls>
        <ControlRow name="draggable" text="With a handle to move it, as over a scenario. Without, it stays along the bottom, as on the question page.">
          <SwitchControl name="draggable" value={draggable} onChange={setDraggable} />
        </ControlRow>
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
