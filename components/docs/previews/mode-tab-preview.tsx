"use client";

import { Noto_Sans } from "next/font/google";
import { useRef, useState } from "react";
import type { Corner } from "@/components/prototype/wavefoil/corner-tools";
import { ModeTab, TAB_WIDTH } from "@/components/prototype/wavefoil/training-tab";
import {
  PreviewStage,
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

/** A tab that is only the name of a mode is narrower, as it is in explore mode. */
const NAME_ONLY_WIDTH = 220;

/** The mode tab on a screen, where it can be dragged by its handle to the other corners, with a control for each input. */
export function ModeTabPreview() {
  const layer = useRef<HTMLDivElement>(null);
  const [icon, setIcon] = useState<(typeof ICONS)[number][0]>("nav-getting-started");
  const [label, setLabel] = useState("Learn");
  const [rest, setRest] = useState("operating the foils");
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [corner, setCorner] = useState<Corner>("top-left");
  // A new key puts the tab back as it is when a mode opens, with its words out.
  const [round, setRound] = useState(0);

  return (
    <div className={notoSans.className}>
      {/* As high as the tab with room to drag it between the corners. */}
      <PreviewStage layer={layer} height={200}>
        <ModeTab
          key={round}
          corner={corner}
          onCorner={setCorner}
          layer={layer}
          icon={icon}
          label={label || "Mode"}
          rest={rest || undefined}
          width={rest ? TAB_WIDTH : NAME_ONLY_WIDTH}
          compact={compact}
          open={open}
          onToggle={() => setOpen((now) => !now)}
        />
      </PreviewStage>

      <div className="mt-3 flex flex-wrap items-center justify-end gap-x-6 gap-y-2">
        <button
          type="button"
          onClick={() => setRound((now) => now + 1)}
          className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:border-accent/40 hover:text-accent"
        >
          Replay
        </button>
      </div>

      <Controls>
        <ControlRow name="title" text="The mode, in bold.">
          <TextControl name="title" value={label} onChange={setLabel} />
        </ControlRow>
        <ControlRow
          name="label"
          text="What it is about, after the mode. Empty for a mode that is only its name."
        >
          <TextControl name="label" value={rest} onChange={setRest} placeholder="Nothing" />
        </ControlRow>
        <ControlRow name="icon" text="The icon of the mode.">
          <SelectControl name="icon" value={icon} options={ICONS} onChange={setIcon} />
        </ControlRow>
        <ControlRow name="compact" text="Only the icon and the handle, whatever the time.">
          <SwitchControl name="compact" value={compact} onChange={setCompact} />
        </ControlRow>
        <ControlRow name="open" text="Whether the mode's menu is open.">
          <SwitchControl name="open" value={open} onChange={setOpen} />
        </ControlRow>
      </Controls>
    </div>
  );
}
