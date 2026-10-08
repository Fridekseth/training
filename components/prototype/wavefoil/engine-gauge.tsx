"use client";

/**
 * The engine load as a half-circle gauge, drawn here rather than taken from the
 * library: the design tints the bar instead of filling it, marks the value with
 * a line, and sets the advice as blue pills in the band outside the bar, none
 * of which the library's radial gauge can be set to do.
 */

const CX = 100;
const CY = 100;
/** The frame's outer and inner edges, and the bar's outer and inner edges. */
const FRAME_OUT = 96;
const FRAME_IN = 84;
const BAR_OUT = 83;
const BAR_IN = 60;

/** A point on the gauge: 0 is at the left of the baseline, 100 at the right. */
function at(radius: number, value: number) {
  const angle = Math.PI * (1 - value / 100);
  return { x: CX + radius * Math.cos(angle), y: CY - radius * Math.sin(angle) };
}

function arc(radius: number, from: number, to: number) {
  const a = at(radius, from);
  const b = at(radius, to);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${radius} ${radius} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

const TICKS = Array.from({ length: 11 }, (_, i) => i * 10);

export function EngineGauge({
  value,
  advice,
  label,
  unit,
}: {
  value: number;
  /** Stretches of the scale worth moving the load into, drawn as pills. */
  advice: { min: number; max: number }[];
  label: string;
  unit: string;
}) {
  const mid = (BAR_OUT + BAR_IN) / 2;
  const width = BAR_OUT - BAR_IN;
  const needleFrom = at(BAR_IN - 1, value);
  const needleTo = at(BAR_OUT + 1, value);

  return (
    <div style={{ position: "relative", width: 200, height: 126 }}>
      <svg
        width="200"
        height="126"
        viewBox="0 0 200 126"
        fill="none"
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        {/* The frame the bar sits in, with the scale along its band. */}
        <path
          d={`M ${CX - FRAME_OUT} ${CY} A ${FRAME_OUT} ${FRAME_OUT} 0 0 1 ${CX + FRAME_OUT} ${CY} L ${CX + FRAME_IN} ${CY} A ${FRAME_IN} ${FRAME_IN} 0 0 0 ${CX - FRAME_IN} ${CY} Z`}
          fill="var(--container-global-color, #fff)"
          stroke="var(--instrument-frame-tertiary-color, #bebebe)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {TICKS.slice(1, -1).map((tick) => {
          const major = tick === 50;
          const a = at(FRAME_IN + 1, tick);
          const b = at(major ? FRAME_OUT - 1 : FRAME_IN + 5, tick);
          return (
            <line
              key={tick}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--instrument-tick-mark-secondary-color, #8e8e8e)"
              strokeWidth="1"
            />
          );
        })}

        {/* The bar: tinted up to the value, a lighter track beyond it. */}
        <path
          d={arc(mid, 0, 100)}
          stroke="var(--instrument-frame-secondary-color, #eee)"
          strokeWidth={width}
        />
        <path
          d={arc(mid, 0, value)}
          stroke="color-mix(in srgb, var(--element-neutral-color, #535353) 45%, transparent)"
          strokeWidth={width}
        />
        <line
          x1={needleFrom.x}
          y1={needleFrom.y}
          x2={needleTo.x}
          y2={needleTo.y}
          stroke="var(--element-neutral-color, #535353)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* The advice: pills in the band between the bar and the frame. */}
        {advice.map(({ min, max }) => (
          <path
            key={`${min}-${max}`}
            d={arc((BAR_OUT + FRAME_IN) / 2 + 3, min, max)}
            stroke="var(--instrument-enhanced-secondary-color, #2d548b)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}
      </svg>

      <span style={{ ...scaleEnd, left: 10 }}>0</span>
      <span style={{ ...scaleEnd, left: 190 }}>100</span>

      <div style={readout}>
        <span style={{ fontSize: 24, lineHeight: "28px", fontWeight: 400 }}>{value}</span>
        <span style={{ fontSize: 11, lineHeight: "14px", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 11, lineHeight: "14px" }}>{unit}</span>
      </div>
    </div>
  );
}

const scaleEnd = {
  position: "absolute",
  top: 106,
  transform: "translateX(-50%)",
  fontSize: 12,
  lineHeight: "16px",
  color: "var(--element-neutral-color, #535353)",
} as const;

const readout = {
  position: "absolute",
  top: 60,
  right: 0,
  left: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "var(--element-neutral-color, #535353)",
} as const;
