"use client";

import { Noto_Sans } from "next/font/google";
import { useRef, useState } from "react";
import { Toast } from "@/components/prototype/wavefoil/guided-mode";
import {
  ComponentStage,
  ControlRow,
  Controls,
  SelectControl,
  TextControl,
} from "./preview-stage";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

const RING = [
  ["turning", "Turning, while the task starts"],
  ["100", "Running down, all the time left"],
  ["60", "Running down, 60 % left"],
  ["20", "Running down, 20 % left"],
] as const;

/** The bar that says what the task is while a scenario runs, with a way to give it up. */
export function ToastPreview() {
  const layer = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("Deploy the foils");
  const [subtitle, setSubtitle] = useState("");
  const [ring, setRing] = useState<(typeof RING)[number][0]>("turning");

  return (
    <div className={notoSans.className}>
      <ComponentStage layer={layer}>
        <Toast
          title={title}
          subtitle={subtitle || undefined}
          remaining={ring === "turning" ? undefined : Number(ring)}
          at={{ left: 0, top: 0 }}
          onMove={() => {}}
          layer={layer}
          onCancel={() => {}}
        />
      </ComponentStage>

      <Controls>
        <ControlRow name="title" text="What the task is, in bold.">
          <TextControl name="title" value={title} onChange={setTitle} />
        </ControlRow>
        <ControlRow name="subtitle" text="A second line under the title. A scenario has none.">
          <TextControl name="subtitle" value={subtitle} onChange={setSubtitle} placeholder="Nothing" />
        </ControlRow>
        <ControlRow name="remaining" text="The ring round the cancel button: turning while the sequence starts, or running down with the time left.">
          <SelectControl name="remaining" value={ring} options={RING} onChange={setRing} />
        </ControlRow>
      </Controls>
    </div>
  );
}
