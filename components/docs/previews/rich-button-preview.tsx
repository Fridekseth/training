"use client";

import { Noto_Sans } from "next/font/google";
import { useState } from "react";
import { Piece } from "@/components/prototype/pieces";
import { TrainingRichButton, type RichButtonState } from "@/components/prototype/training-rich-button";
import {
  ComponentStage,
  ControlRow,
  Controls,
  SelectControl,
  SwitchControl,
  TextControl,
} from "./preview-stage";

const STATES = [
  ["enabled", "Enabled"],
  ["hover", "Hover"],
  ["active", "Active"],
  ["focused", "Focused"],
  ["disabled", "Disabled"],
] as const satisfies readonly (readonly [RichButtonState, string])[];

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

/** The card that leads to a page of the training, with the plate for a drawing, a label and a line of text. */
export function RichButtonPreview() {
  const [label, setLabel] = useState("Recommended practice");
  const [description, setDescription] = useState(
    "There has not been a critical alarm in 4 months. Complete a scenario to practice routines!",
  );
  const [drawing, setDrawing] = useState(true);
  const [badge, setBadge] = useState(false);
  const [state, setState] = useState<RichButtonState>("enabled");

  return (
    <div className={notoSans.className}>
      <ComponentStage>
        <div style={{ width: 380 }}>
          <TrainingRichButton
            label={label}
            description={description || undefined}
            descriptionSize={11.5}
            badge={badge}
            state={state === "enabled" ? undefined : state}
            illustration={
              drawing ? <Piece src="wf-illo-dumbbell" left={9} top={13.6} width={72} height={62.8} /> : undefined
            }
          />
        </div>
      </ComponentStage>

      <Controls>
        <ControlRow name="state" text="The states of the OpenBridge rich button. Enabled also reacts to the pointer and keyboard.">
          <SelectControl name="state" value={state} options={STATES} onChange={setState} />
        </ControlRow>
        <ControlRow name="title" text="The name of what it leads to, in bold.">
          <TextControl name="title" value={label} onChange={setLabel} />
        </ControlRow>
        <ControlRow name="description" text="A line of text under the title.">
          <TextControl name="description" value={description} onChange={setDescription} placeholder="Nothing" />
        </ControlRow>
        <ControlRow name="has image" text="A placeholder for an illustration before the text.">
          <SwitchControl name="has image" value={drawing} onChange={setDrawing} />
        </ControlRow>
        <ControlRow name="badge" text="The badge in the top right corner, for something that needs attention.">
          <SwitchControl name="badge" value={badge} onChange={setBadge} />
        </ControlRow>
      </Controls>
    </div>
  );
}
