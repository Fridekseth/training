"use client";

/**
 * Wave height over the last two hours and the next two, drawn with OpenBridge's
 * line graph. Everything inside the plot is the component's own: the operating
 * window is a pair of datasets filled against each other, the measurement and
 * the estimate are datasets, and the dot ends the measurement.
 *
 * The framing is drawn here. The chart hides its own axis labels and grid
 * below 192px tall and this plot is 89, which is also how the design is put
 * together: its grid, its height labels and its window mark are each separate
 * from the graph.
 */

import { useMemo } from "react";
import { ObcLineGraph } from "@oicl/openbridge-webcomponents-react/bars-graphs/line-graph/line-graph";
import type { ObcLineGraph as ObcLineGraphElement } from "@oicl/openbridge-webcomponents/dist/bars-graphs/line-graph/line-graph";
import styles from "./pages.module.css";

/**
 * Wave height in metres from -2h to +2h. The design draws each line out of the
 * library's graph-node segments, ten of them across the plot, so the readings
 * are spaced to give the same ten bends rather than a finer curve.
 */
export const MEASURED = [0.9, 1.3, 2.9, 2.6, 3.9, 2.8];
/** The reading that ends in a spike, as on the page for harmful waves. */
export const MEASURED_HARMFUL = [0.5, 1.1, 2.6, 2.8, 3.3, 7.3];
/** The model runs across the whole window, over the past as well. */
const ESTIMATED = [
  1.3, 2.0, 2.6, 2.5, 3.4, 3.9, 3.6, 2.9, 3.1, 2.9, 1.7,
];
const POINTS = ESTIMATED.length;
/** Where the measurements stop and the forecast takes over. */
const NOW = MEASURED.length - 1;

/** The wave heights the foils work between, read off the design. */
const WINDOW_LOW = 1.6;
const WINDOW_HIGH = 6.3;
/** The plot, at the design's own size. The box around it must match, or the
 * chart draws short of its frame. */
const PLOT_WIDTH = 210;
const PLOT_HEIGHT = 105;

/**
 * A canvas has no CSS to resolve, so the chart cannot be handed a token the
 * way the markup around it can. The palette is read off the document instead
 * and passed down as plain colours, which means the graph follows a change of
 * theme like everything else rather than staying in the day colours.
 */
export type Palette = {
  measured: string;
  estimated: string;
  fill: string;
  edge: string;
  chip: string;
  chipEdge: string;
};

function rgb(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

/**
 * The band is a wash of its own colour, so it reads on light and on dark. The
 * palette hands back hex in some themes and `rgb()` in others, so both.
 */
function wash(colour: string, alpha: number) {
  const hex = colour.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const digits =
      hex[1].length === 3
        ? hex[1]
            .split("")
            .map((d) => d + d)
            .join("")
        : hex[1];
    const value = parseInt(digits, 16);
    const [r, g, b] = [(value >> 16) & 255, (value >> 8) & 255, value & 255];
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const parts = colour.match(/[\d.]+/g);
  if (parts && parts.length >= 3) {
    return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
  }
  return colour;
}

function readPalette(inWindow: boolean): Palette {
  const accent = inWindow
    ? rgb("--data-categorical-operational-01", "rgb(93, 143, 213)")
    : rgb("--element-neutral-color", "rgb(83, 83, 83)");
  return {
    measured: rgb("--element-neutral-color", "rgb(83, 83, 83)"),
    estimated: rgb("--instrument-tick-mark-secondary-color", "rgb(142, 142, 142)"),
    fill: wash(accent, 0.06),
    edge: wash(accent, 0.25),
    chip: wash(accent, 0.3),
    chipEdge: accent,
  };
}

type ChartDataset = NonNullable<ObcLineGraphElement["datasets"]>[number];

/** Chart.js reads null as a gap in the line; the typing here does not. */
const gaps = (count: number) => Array(count).fill(null) as unknown as number[];
const flat = (value: number) => Array<number>(POINTS).fill(value);
/** A dot on the last measurement only, the way the design ends the line. */
const LAST_POINT = Array.from({ length: POINTS }, (_, i) => (i === NOW ? 3 : 0));

/** One layer of the plot: same box, same axis, so the layers line up. */
function Plot({ datasets }: { datasets: ChartDataset[] }) {
  return (
    <ObcLineGraph
      className={styles.plotLayer}
      width={PLOT_WIDTH}
      height={PLOT_HEIGHT}
      fixedAspectRatioScaling={false}
      // We draw the labels and the frame, so the plot runs edge to edge;
      // otherwise the chart holds back room for ticks it never renders.
      hasLabelPadding={false}
      unit="m"
      labels={Array.from({ length: POINTS }, (_, i) => String(i))}
      yAxes={[{ id: "y", position: "left", min: 0, max: 8 }]}
      datasets={datasets}
    />
  );
}

/** The chart's colours, read again whenever the screen is dimmed; the legend beside it uses them too. */
export function useWavePalette(inWindow: boolean, palette: string): Palette {
  // `palette` is not read here; it is what tells us the document's colours
  // have changed underneath us and have to be read again.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => readPalette(inWindow), [inWindow, palette]);
}

export function WaveChart({
  palette,
  measured = MEASURED,
  harmful = false,
}: {
  /** Only to re-read the colours when the screen is dimmed. */
  palette: string;
  /** The readings up to now, in metres. */
  measured?: number[];
  /** The sea is above the window: that part of the plot and its marker are drawn as a warning. */
  harmful?: boolean;
}) {
  const colour = useWavePalette(false, palette);
  const nowAt = (NOW / (POINTS - 1)) * 100;
  const at = (metres: number) => (1 - metres / 8) * PLOT_HEIGHT;
  const high = at(WINDOW_HIGH);
  const low = at(WINDOW_LOW);

  return (
    <div className={styles.wave}>
      <div className={styles.wavePlot}>
        {harmful ? <span className={styles.waveAbove} style={{ height: high }} /> : null}
        {/*
          Two layers of the same chart so the grid can sit between them: the
          window underneath, the grid over it, the readings over that. One
          chart cannot interleave a grid with its own datasets.
        */}
        <Plot
          datasets={[
            {
              label: "Window low",
              data: flat(WINDOW_LOW),
              borderColor: colour.measured,
              borderDash: [1, 2],
              borderWidth: 1,
              pointRadius: 0,
              fill: false,
              order: 2,
            },
            {
              label: "Window high",
              data: flat(WINDOW_HIGH),
              borderColor: harmful ? colour.measured : colour.estimated,
              borderDash: [1, 2],
              borderWidth: 1,
              pointRadius: 0,
              fill: false,
              order: 1,
            },
          ]}
        />
        <span className={styles.gridLine} style={{ top: at(4) }} />
        <span className={styles.nowLine} style={{ left: `${nowAt}%` }} />
        <Plot
          datasets={[
            {
              label: "Estimated",
              data: ESTIMATED,
              borderColor: colour.estimated,
              borderDash: [1, 2],
              borderWidth: 1.5,
              pointRadius: 0,
              fill: false,
              order: 2,
            },
            {
              label: "Actual",
              data: [...measured, ...gaps(POINTS - measured.length)],
              borderColor: colour.measured,
              backgroundColor: colour.measured,
              pointBackgroundColor: colour.measured,
              pointBorderWidth: 0,
              borderWidth: 2,
              pointRadius: LAST_POINT,
              fill: false,
              order: 1,
            },
          ]}
        />
      </div>

      {/* The limits of the window, ticked out to the side with a hatched stretch beyond each. */}
      <span className={styles.limitTick} style={{ top: high + 1 }} />
      <span className={styles.limitTick} style={{ top: low + 1 }} />
      <span
        className={`${styles.hatch} ${harmful ? styles.hatchWarn : ""}`}
        style={{ top: 1, height: high - 3 }}
      />
      <span className={styles.hatch} style={{ top: low + 4, height: PLOT_HEIGHT - low - 3 }} />

      <div className={styles.xLabels}>
        <span style={{ left: 0 }}>-2h</span>
        <span style={{ left: "50%" }}>Now</span>
        <span style={{ left: "100%" }}>2h</span>
      </div>
    </div>
  );
}
