"use client";

import { Noto_Sans } from "next/font/google";
import { useState } from "react";
import { Piece } from "@/components/prototype/pieces";
import { TrainingRichButton } from "@/components/prototype/training-rich-button";
import {
  ComponentStage,
  ControlRow,
  Controls,
  SwitchControl,
  TextControl,
} from "./preview-stage";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

/** The card that leads to a page of the training, with the plate for a drawing, a label and a line of text. */
export function RichButtonPreview() {
  const [label, setLabel] = useState("Recommended practice");
  const [description, setDescription] = useState(
    "There has not been a critical alarm in 4 months. Complete a scenario to practice routines!",
  );
  const [drawing, setDrawing] = useState(true);
  const [badge, setBadge] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <div className={notoSans.className}>
      <ComponentStage>
        <div style={{ width: 380 }}>
          <TrainingRichButton
            label={label}
            description={description || undefined}
            descriptionSize={11.5}
            badge={badge}
            disabled={disabled}
            illustration={
              drawing ? <Piece src="wf-illo-dumbbell" left={9} top={13.6} width={72} height={62.8} /> : undefined
            }
          />
        </div>
      </ComponentStage>

      <p className="mt-3 text-sm text-faint">Hover and press it to see its states.</p>

      <Controls>
        <ControlRow name="label" text="The name of what it leads to, in bold.">
          <TextControl name="label" value={label} onChange={setLabel} />
        </ControlRow>
        <ControlRow name="description" text="A line of text under the label.">
          <TextControl name="description" value={description} onChange={setDescription} placeholder="Nothing" />
        </ControlRow>
        <ControlRow name="illustration" text="A drawing on the teal plate. Without one the plate is left out.">
          <SwitchControl name="illustration" value={drawing} onChange={setDrawing} />
        </ControlRow>
        <ControlRow name="badge" text="The badge in the top right corner, for something that needs attention.">
          <SwitchControl name="badge" value={badge} onChange={setBadge} />
        </ControlRow>
        <ControlRow name="disabled" text="Not available.">
          <SwitchControl name="disabled" value={disabled} onChange={setDisabled} />
        </ControlRow>
      </Controls>
    </div>
  );
}
