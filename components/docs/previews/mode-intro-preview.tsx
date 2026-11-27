"use client";

import { Noto_Sans } from "next/font/google";
import { useState } from "react";
import { ModeIntro } from "@/components/prototype/wavefoil/training-tab";
import {
  ComponentStage,
  ControlRow,
  Controls,
  SelectControl,
  SwitchControl,
  TextControl,
} from "./preview-stage";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

const ICONS = [
  ["nav-getting-started", "Learn"],
  ["wf-nav-explore", "Explore"],
  ["wf-nav-collaborate", "Collaborate"],
  ["wf-nav-test", "Test"],
] as const;

/**
 * The announcement, in the middle as it first appears and as the tab it settles into. In the
 * prototype it moves to the corner by itself, so here the move is a switch, and the box changes
 * where it is.
 */
export function ModeIntroPreview() {
  const [icon, setIcon] = useState<(typeof ICONS)[number][0]>("nav-getting-started");
  const [title, setTitle] = useState("Learn");
  const [subtitle, setSubtitle] = useState("Operating the foils");
  const [settled, setSettled] = useState(false);

  return (
    <div className={notoSans.className}>
      <ComponentStage>
        <ModeIntro
          corner="top-left"
          icon={icon}
          title={title}
          subtitle={subtitle || undefined}
          // The tab it settles into reads the same as the announcement: the mode, then what it is about.
          label={title}
          rest={subtitle ? subtitle.charAt(0).toLowerCase() + subtitle.slice(1) : undefined}
          phase={settled ? "settled" : "hold"}
          onSettled={() => {}}
        />
      </ComponentStage>

      <Controls>
        <ControlRow name="title" text="The big line in the middle.">
          <TextControl name="title" value={title} onChange={setTitle} />
        </ControlRow>
        <ControlRow name="subtitle" text="A second line under the title. Empty for a mode that needs none.">
          <TextControl name="subtitle" value={subtitle} onChange={setSubtitle} placeholder="Nothing" />
        </ControlRow>
        <ControlRow name="icon" text="The icon of the mode.">
          <SelectControl name="icon" value={icon} options={ICONS} onChange={setIcon} />
        </ControlRow>
        <ControlRow name="settled" text="Whether it has settled into the corner, as the tab.">
          <SwitchControl name="settled" value={settled} onChange={setSettled} />
        </ControlRow>
      </Controls>
    </div>
  );
}
