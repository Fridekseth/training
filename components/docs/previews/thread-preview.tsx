"use client";

import { Noto_Sans } from "next/font/google";
import { useState } from "react";
import { THREADS } from "@/components/prototype/wavefoil/explore-data";
import { ThreadPanel } from "@/components/prototype/wavefoil/explore-mode";
import { ComponentStage, ControlRow, Controls, SelectControl } from "./preview-stage";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

const THREAD = THREADS[0];

/** The panel a comment is read and answered in, with the messages of the first comment of the prototype. */
export function ThreadPreview() {
  const [count, setCount] = useState(String(THREAD.messages.length));
  const [subject, setSubject] = useState(true);

  return (
    <div className={notoSans.className}>
      {/* The panel is as tall as the screen in the prototype, so it is given a height here. */}
      <ComponentStage className="[&>*]:!h-[30rem]">
        <ThreadPanel
          thread={subject ? THREAD : { ...THREAD, subject: undefined }}
          messages={THREAD.messages.slice(0, Number(count))}
          side="left"
          belowBar={false}
          draft=""
          onTypeRequest={() => {}}
          onSend={() => {}}
          onClose={() => {}}
        />
      </ComponentStage>

      <Controls>
        <ControlRow name="messages" text="How many messages are in the thread. The first one is pinned at the top.">
          <SelectControl
            name="messages"
            value={count}
            options={THREAD.messages.map((_, at) => [String(at + 1), `${at + 1} message${at ? "s" : ""}`] as const)}
            onChange={setCount}
          />
        </ControlRow>
        <ControlRow name="subject" text="What the thread is about in the header. Without one, the header has the title.">
          <SelectControl
            name="subject"
            value={subject ? "yes" : "no"}
            options={[
              ["yes", `With a subject, ${THREAD.subject}`],
              ["no", `Without one, ${THREAD.title}`],
            ]}
            onChange={(value) => setSubject(value === "yes")}
          />
        </ControlRow>
      </Controls>
    </div>
  );
}
