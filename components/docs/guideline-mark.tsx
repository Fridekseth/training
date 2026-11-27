"use client";

import { ObiError } from "@oicl/openbridge-webcomponents-react/icons/icon-error";
import { ObiPassedFill } from "@oicl/openbridge-webcomponents-react/icons/icon-passed-fill";

/** The OpenBridge mark in front of a do or a don't: passed, filled, for do, and error for don't. */
export function GuidelineMark({ kind, color }: { kind: "do" | "dont"; color: string }) {
  // The icons are drawn in the colour they are given, and in the library's active colour where they use it.
  const style = { color, "--element-active-color": color, width: 24, height: 24, flexShrink: 0 } as React.CSSProperties;
  return kind === "do" ? <ObiPassedFill style={style} /> : <ObiError style={style} />;
}
