"use client";

import { Noto_Sans } from "next/font/google";
import { useState } from "react";
import { THREADS } from "@/components/prototype/wavefoil/explore-data";
import { Indicator } from "@/components/prototype/wavefoil/explore-mode";
import {
  ComponentStage,
  ControlRow,
  Controls,
  SelectControl,
  SwitchControl,
} from "./preview-stage";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

const STATES = [
  ["enabled", "Enabled"],
  ["checked", "Checked, the comment is open"],
  ["disabled", "Disabled, another comment is open"],
] as const;

const PEOPLE = ["HT", "AR", "KN"];

/** A pin on a screen, taken from the first comment of the prototype, with the three things that change how it looks. */
export function CommentPinPreview() {
  const [state, setState] = useState<(typeof STATES)[number][0]>("enabled");
  const [unread, setUnread] = useState(true);
  const [people, setPeople] = useState("2");
  const thread = { ...THREADS[0], unread, authors: PEOPLE.slice(0, Number(people)) };

  return (
    <div className={notoSans.className}>
      <ComponentStage>
        <Indicator
          thread={thread}
          state={state}
          onClick={() => setState((now) => (now === "checked" ? "enabled" : "checked"))}
        />
      </ComponentStage>

      <p className="mt-3 text-sm text-faint">Press the pin to open and close the comment.</p>

      <Controls>
        <ControlRow name="state" text="While one comment is open, the others are disabled.">
          <SelectControl name="state" value={state} options={STATES} onChange={setState} />
        </ControlRow>
        <ControlRow name="unread" text="Unread comments are drawn dark, and read ones light.">
          <SwitchControl name="unread" value={unread} onChange={setUnread} />
        </ControlRow>
        <ControlRow name="authors" text="How many people have written in it. The open pin grows into their initials.">
          <SelectControl
            name="authors"
            value={people}
            options={[
              ["1", "1 person"],
              ["2", "2 people"],
              ["3", "3 people"],
            ]}
            onChange={setPeople}
          />
        </ControlRow>
      </Controls>
    </div>
  );
}
