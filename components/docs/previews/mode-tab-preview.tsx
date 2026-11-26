"use client";

import { Noto_Sans } from "next/font/google";
import { useRef, useState } from "react";
import { ModeTab, TAB_WIDTH } from "@/components/prototype/wavefoil/training-tab";
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

/** A tab that is only the name of a mode is narrower, as it is in explore mode. */
const NAME_ONLY_WIDTH = 220;

/** The mode tab itself, with a control for each input, so it can be tried as it is used. */
export function ModeTabPreview() {
  const layer = useRef<HTMLDivElement>(null);
  const [icon, setIcon] = useState<(typeof ICONS)[number][0]>("nav-getting-started");
  const [label, setLabel] = useState("Learn");
  const [rest, setRest] = useState("operating the foils");
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  // A new key puts the tab back as it is when a mode opens, with its words out.
  const [round, setRound] = useState(0);

  return (
    <div className={notoSans.className}>
      <ComponentStage layer={layer}>
        <ModeTab
          key={round}
          corner="top-left"
          onCorner={() => {}}
          layer={layer}
          icon={icon}
          label={label || "Mode"}
          rest={rest || undefined}
          width={rest ? TAB_WIDTH : NAME_ONLY_WIDTH}
          compact={compact}
          open={open}
          onToggle={() => setOpen((now) => !now)}
        />
      </ComponentStage>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p className="m-0 text-sm text-faint">
          Press the tab, or hover its icon. It folds after 4 seconds, as it does in the prototype.
        </p>
        <button
          type="button"
          onClick={() => setRound((now) => now + 1)}
          className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:border-accent/40 hover:text-accent"
        >
          Replay
        </button>
      </div>

      <Controls>
        <ControlRow name="label" text="The mode, in bold.">
          <TextControl name="label" value={label} onChange={setLabel} />
        </ControlRow>
        <ControlRow
          name="rest"
          text="What it is about, after the mode. Empty for a mode that is only its name."
        >
          <TextControl name="rest" value={rest} onChange={setRest} placeholder="Nothing" />
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
