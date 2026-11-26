"use client";

import { useState } from "react";
import { DemoShortcuts } from "./demo-shortcuts";
import { PrototypeStage } from "./prototype-stage";
import { ScaledFrame } from "./scaled-frame";
import type { PageId } from "./training-data";

const SHORTCUTS = [
  ["overview", "Overview"],
  ["getting-started", "Getting started"],
  ["explore", "Explore"],
  ["scenarios", "Scenarios"],
] as const satisfies readonly (readonly [PageId, string])[];

/**
 * The factory monitoring interface in its frame, drawn at the size it was designed
 * at and scaled to fit the column, with shortcuts to the pages of its training.
 */
export function FactoryDemo() {
  const [shortcut, setShortcut] = useState<{ page: PageId; id: number } | null>(null);

  return (
    <>
      <div className="mt-5">
        <DemoShortcuts
          row
          items={SHORTCUTS}
          active={shortcut?.page}
          onPick={(page) => setShortcut((now) => ({ page, id: (now?.id ?? 0) + 1 }))}
        />
      </div>
      <ScaledFrame
        width={1080}
        height={608}
        className="mt-4 rounded-lg border border-border shadow-sm"
      >
        {/* Opening it again at a page is a new screen, so the page is asked for when it starts. */}
        <PrototypeStage
          key={shortcut ? `${shortcut.page}-${shortcut.id}` : "start"}
          syncHash
          initialPage={shortcut?.page}
          initialLayer={shortcut ? "training" : undefined}
        />
      </ScaledFrame>
    </>
  );
}
