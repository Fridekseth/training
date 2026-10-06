"use client";

/**
 * The design's vessel motion instrument is the library's pitch, roll and heave
 * instrument with the roll scale taken out: pitch on the right, heave on the
 * left, and the ring unbroken underneath. The library has no switch for that,
 * so this is the same element with the roll arc left out of the watch it
 * draws and the crosshair left off, since the design has none.
 */

import * as React from "react";
import { createComponent } from "@lit/react";
import { nothing, type PropertyValues } from "lit";
import { ObcPitchRollHeave } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/pitch-roll-heave/pitch-roll-heave";

const TAG = "wavefoil-pitch-heave";

type Angled = { angle: number };
type Arc = { startAngle: number; endAngle: number };
type Watch = HTMLElement & {
  areas?: Arc[];
  tickmarks?: Angled[];
  barAreas?: Arc[];
  needles?: Angled[];
};

/** Roll sits at 180 degrees on the watch; everything drawn within reach of it goes. */
const ROLL = 180;
const ROLL_REACH = 50;

const atRoll = (angle: number) => Math.abs(((angle - ROLL + 540) % 360) - 180) <= ROLL_REACH;
const arcAtRoll = ({ startAngle, endAngle }: Arc) => atRoll((startAngle + endAngle) / 2);

class PitchHeaveElement extends ObcPitchRollHeave {
  protected updated(changed: PropertyValues) {
    super.updated?.(changed);
    const watch = this.renderRoot?.querySelector<Watch>("obc-watch");
    if (!watch) return;
    watch.areas = watch.areas?.filter((area) => !arcAtRoll(area));
    watch.tickmarks = watch.tickmarks?.filter((tick) => !atRoll(tick.angle));
    watch.barAreas = watch.barAreas?.filter((area) => !arcAtRoll(area));
    watch.needles = watch.needles?.filter((needle) => !atRoll(needle.angle));
  }
}

// The base class marks this private; the element has to replace it all the same.
(PitchHeaveElement.prototype as unknown as { renderCrosshair: () => unknown }).renderCrosshair =
  () => nothing;

if (typeof customElements !== "undefined" && !customElements.get(TAG)) {
  customElements.define(TAG, PitchHeaveElement);
}

export const PitchHeave = createComponent({
  react: React,
  tagName: TAG,
  elementClass: PitchHeaveElement,
  events: {},
});
