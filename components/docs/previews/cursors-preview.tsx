"use client";

import { ComponentStage } from "./preview-stage";

/** Where each cursor is used, and the file it is drawn from. The hot spot is the point of the picture that is the point of the pointer. */
const CURSORS = [
  {
    name: "Pointer",
    file: "/prototype/cursor-teal.svg",
    hotspot: "2 2",
    fallback: "auto",
    text: "Over a chapter of Learn",
  },
  {
    name: "Hand",
    file: "/prototype/wavefoil/cursor-hand.svg",
    hotspot: "8 3",
    fallback: "grab",
    text: "Look around, in Explore",
  },
  {
    name: "Comment",
    file: "/prototype/wavefoil/cursor-comment.svg",
    hotspot: "2 22",
    fallback: "crosshair",
    text: "Adding a comment",
  },
] as const;

/** The cursors of the training pattern, each over a square where it can be tried with the pointer. */
export function CursorsPreview() {
  return (
    <div>
      <ComponentStage>
        <div className="flex flex-wrap justify-center gap-4">
          {CURSORS.map((cursor) => (
            <div key={cursor.name} className="w-40 text-center">
              <div
                className="grid h-28 place-items-center rounded-md border border-dashed"
                style={{
                  borderColor: "#1d9da1",
                  background: "#e2f2f3",
                  cursor: `url(${cursor.file}) ${cursor.hotspot}, ${cursor.fallback}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cursor.file} alt="" width={32} height={32} style={{ background: "#e2f2f3" }} />
              </div>
              <p className="m-0 mt-2 text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                {cursor.name}
              </p>
              <p className="m-0 text-xs" style={{ color: "#535353" }}>
                {cursor.text}
              </p>
            </div>
          ))}
        </div>
      </ComponentStage>
    </div>
  );
}
