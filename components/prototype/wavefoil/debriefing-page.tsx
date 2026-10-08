"use client";

/**
 * Debriefing: the trip afterwards. The log of the voyage on the left, the route
 * on a map at the top right, and an analytics graph under it.
 */

import { useMemo, useRef, useState } from "react";
import { ObcLineGraph } from "@oicl/openbridge-webcomponents-react/bars-graphs/line-graph/line-graph";
import { ObiDropDownGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-drop-down-google";
import { ObiChevronRightGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-chevron-right-google";
import { MaskIcon } from "../pieces";
import {
  FOILS_OUT,
  MAP_WAYPOINTS,
  SERIES,
  TRIPS,
  type Moment as TripMoment,
  type Trip,
  type Docking,
  type FoilEvent,
  type LogEntry,
  type SeriesId,
  type Waypoint,
} from "./debriefing-data";
import { LAND } from "./debriefing-land";
import { useWavePalette } from "./wave-chart";
import styles from "./debriefing.module.css";

function Heading({ label }: { label: string }) {
  return (
    <p className={styles.heading}>
      <button type="button" className={styles.headingLink}>
        {label}
        <ObiChevronRightGoogle style={{ width: 16, height: 16 }} />
      </button>
    </p>
  );
}

function Place({ place, role }: { place: string; role: string }) {
  return (
    <div className={styles.place}>
      <span className={styles.placeName}>{place}</span>
      <span className={styles.placeRole}>{role}</span>
    </div>
  );
}

function Moment({ moment }: { moment?: TripMoment }) {
  return (
    <div className={styles.moment}>
      {moment?.time ? <strong>{moment.time}</strong> : null}
      {moment ? <span>{moment.date}</span> : null}
    </div>
  );
}

function Measure({ value, label, unit }: { value: string; label: string; unit: string }) {
  return (
    <div className={styles.measure}>
      <span className={styles.measureValue}>{value}</span>
      <span className={styles.measureLabel}>
        <strong>{label}</strong> {unit}
      </span>
    </div>
  );
}

function WaypointCard({ entry }: { entry: Waypoint }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <span className={styles.waypointMark} />
        <span className={styles.cardName}>{entry.name}</span>
        <span className={styles.cardStamp}>
          {entry.twol ? <strong>{entry.twol} </strong> : null}
          {entry.time}
        </span>
      </div>
      <div className={styles.measures}>
        <Measure value={entry.dist} label="Dist" unit="NM" />
        <Measure value={entry.brg} label="BRG" unit="DEG" />
        <Measure value={entry.spd} label="SPD" unit="kn" />
      </div>
    </div>
  );
}

function EventCard({ entry }: { entry: FoilEvent }) {
  const out = entry.kind === "activated";
  return (
    <div className={`${styles.card} ${out ? styles.eventCard : ""}`}>
      <div className={styles.cardTitle}>
        <MaskIcon name={out ? "wf-wavefoil" : "wf-circle-alert"} size={16} />
        <span className={styles.cardName}>{out ? "Wavefoil was activated" : "Wavefoil was retracted"}</span>
        <span className={styles.cardStamp}>
          Hs <strong>{entry.hs}</strong> m
        </span>
      </div>
      <p className={styles.eventText}>{entry.text}</p>
    </div>
  );
}

function DockingCard({ entry }: { entry: Docking }) {
  return (
    <div className={styles.card}>
      <div className={`${styles.cardTitle} ${styles.dockingTitle}`}>
        <MaskIcon name="wf-location" size={24} />
        <span className={styles.dockingName}>
          <strong>Docking</strong>
          <span>{entry.place}</span>
        </span>
        <span className={styles.dockingTime}>
          <span>{entry.ttg}</span>
          <strong>TTG</strong>
        </span>
      </div>
    </div>
  );
}

function LogRow({ entry, first, last }: { entry: LogEntry; first: boolean; last: boolean }) {
  const docking = entry.kind === "docking";
  return (
    <div className={styles.row}>
      <span className={`${styles.stamp} ${docking ? styles.stampDocking : ""}`}>{entry.at}</span>
      <span
        className={`${styles.rail} ${first ? styles.railFirst : ""} ${last ? styles.railLast : ""} ${docking ? styles.railDocking : ""}`}
      >
        <span className={styles.dot} />
      </span>
      {entry.kind === "waypoint" ? (
        <WaypointCard entry={entry} />
      ) : entry.kind === "docking" ? (
        <DockingCard entry={entry} />
      ) : (
        <EventCard entry={entry} />
      )}
    </div>
  );
}

/** The trips to pick from, in a menu that drops down from the vessel's name. */
function TripMenu({
  current,
  onPick,
  onClose,
}: {
  current: Trip;
  onPick: (trip: Trip) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className={styles.menuScrim} onClick={onClose} aria-hidden="true" />
      <div
        className={styles.tripMenu}
        role="listbox"
        aria-label="Trips"
        onKeyDown={(event) => event.key === "Escape" && onClose()}
      >
        {TRIPS.map((trip) => (
          <button
            key={trip.id}
            type="button"
            role="option"
            aria-selected={trip.id === current.id}
            className={`${styles.tripOption} ${trip.id === current.id ? styles.tripOptionCurrent : ""}`}
            onClick={() => onPick(trip)}
          >
            <span>{trip.date}</span>
            <strong>
              {trip.from} - {trip.to}
            </strong>
          </button>
        ))}
      </div>
    </>
  );
}

function TripCard({ trip, onPick }: { trip: Trip; onPick: (trip: Trip) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <section className={styles.trip} data-comment="Voyage">
      <header className={styles.tripHeader}>
        <button
          type="button"
          className={styles.tripPicker}
          aria-label="Choose trip"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((now) => !now)}
        >
          <MaskIcon name="wf-ship" size={21} />
          <span className={styles.tripPickerName}>
            {trip.date} <strong>{trip.from} - {trip.to}</strong>
          </span>
          <ObiDropDownGoogle style={{ width: 25, height: 25 }} />
        </button>
        <div className={styles.tripGrid}>
          <Place place={trip.from} role="Departure" />
          <Place place={trip.to} role="Destination" />
          <Moment moment={trip.departure} />
          <Moment moment={trip.destination} />
        </div>
      </header>
      {open ? (
        <TripMenu
          current={trip}
          onPick={(next) => {
            onPick(next);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      ) : null}
      <Heading label="Voyage" />
      <div className={styles.log}>
        {trip.log.length === 0 ? (
          <p className={styles.empty}>No voyage log for this trip yet.</p>
        ) : null}
        {trip.log.map((entry, index) => (
          <LogRow
            key={`${entry.at}-${index}`}
            entry={entry}
            first={index === 0}
            last={index === trip.log.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

/** The compass at the foot of the map: a ring, its ticks and an arrow for north. */
function Compass() {
  return (
    <svg className={styles.compass} viewBox="0 0 34 34" aria-hidden="true">
      <circle cx="17" cy="17" r="12.5" className={styles.compassRing} />
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1="17"
          y1="3"
          x2="17"
          y2={i % 3 === 0 ? 6.5 : 5}
          transform={`rotate(${i * 30} 17 17)`}
          className={styles.compassTick}
        />
      ))}
      <path d="M17 8.5 21 21.5 17 19 13 21.5Z" className={styles.compassArrow} />
    </svg>
  );
}

/** The map card and the coast behind it, so the view can be dragged as far as there is land. */
const MAP_WIDTH = 452;
const MAP_HEIGHT = 334;
const LAND_BOUNDS = { left: -169, top: -459, right: 666, bottom: 390 };
const PAN_LIMITS = {
  minX: MAP_WIDTH - LAND_BOUNDS.right,
  maxX: -LAND_BOUNDS.left,
  minY: MAP_HEIGHT - LAND_BOUNDS.bottom,
  maxY: -LAND_BOUNDS.top,
};
const KEY_STEP = 40;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** The map can be dragged, or moved with the arrow keys; the bar at its foot stays put. */
function RouteMap({ recorded }: { recorded: boolean }) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const grab = useRef<{ x: number; y: number; from: { x: number; y: number }; scale: number } | null>(null);

  const moveTo = (x: number, y: number) =>
    setPan({
      x: clamp(x, PAN_LIMITS.minX, PAN_LIMITS.maxX),
      y: clamp(y, PAN_LIMITS.minY, PAN_LIMITS.maxY),
    });

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    // The screen may be scaled down, so a pixel on screen is not a pixel of the map.
    const scale = event.currentTarget.getBoundingClientRect().width / MAP_WIDTH;
    grab.current = { x: event.clientX, y: event.clientY, from: pan, scale };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const start = grab.current;
    if (!start) return;
    moveTo(
      start.from.x + (event.clientX - start.x) / start.scale,
      start.from.y + (event.clientY - start.y) / start.scale,
    );
  };

  const release = () => {
    grab.current = null;
    setDragging(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const step: Record<string, [number, number]> = {
      ArrowLeft: [KEY_STEP, 0],
      ArrowRight: [-KEY_STEP, 0],
      ArrowUp: [0, KEY_STEP],
      ArrowDown: [0, -KEY_STEP],
    };
    const move = step[event.key];
    if (!move) return;
    event.preventDefault();
    moveTo(pan.x + move[0], pan.y + move[1]);
  };

  return (
    <section
      className={`${styles.map} ${dragging ? styles.mapDragging : ""}`}
      data-comment="Route map"
      tabIndex={0}
      aria-label="Route map. Drag or use the arrow keys to move it."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      onKeyDown={onKeyDown}
    >
      <div className={styles.mapLayer} style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}>
        <svg
          className={styles.land}
          style={{ left: -169, top: -459 }}
          width="835.4"
          height="849.6"
          viewBox="0 0 835.425 849.62"
          aria-hidden="true"
        >
          {LAND.map((d, i) => (
            <path key={i} d={d} className={styles.landShape} />
          ))}
        </svg>
        {recorded ? (
          <>
        <svg
          className={styles.route}
          style={{ left: -82.3, top: -424.3 }}
          width="670.2"
          height="728.7"
          viewBox="0 0 670.199 728.73"
          aria-hidden="true"
        >
          <path
            d="M321.022 33.3911L312.171 69.9053L201.153 145.884L201.153 182.03L150.992 210.43L178.654 240.673L169.802 312.964L188.981 347.634L154.311 460.127L246.15 537.213L251.314 592.168L304.794 674.417L359.012 674.417L381.141 627.207L474.824 612.454"
            className={styles.routeLine}
          />
          {/* The stretches sailed with the foils out. */}
          <path d="M150.992 210.43L178.654 240.674L169.802 312.964L188.98 347.634" className={styles.routeFoils} />
          <path d="M154.311 460.127L246.15 537.212" className={styles.routeFoils} />
        </svg>

        {MAP_WAYPOINTS.map(([left, top]) => (
          <span key={`${left}-${top}`} className={styles.waypoint} style={{ left, top }}>
            <span className={styles.waypointInner} />
          </span>
        ))}
        <span className={styles.destination} style={{ left: 381, top: 177 }} />

        <span className={styles.vesselMarker}>
          <span className={styles.vesselMarkerInner}>
            <MaskIcon name="wf-wavefoil" size={20} />
          </span>
        </span>
          </>
        ) : null}
      </div>

      <div className={styles.legendBar}>
        <Compass />
        <div className={styles.legendItems}>
          <span><strong>N-up</strong>Orientation</span>
          <span><strong>1:1000</strong>Scale</span>
          <span><strong>OFF CENT</strong>Position</span>
          <span><strong>RM</strong>Motion</span>
        </div>
      </div>
    </section>
  );
}

const PLOT_WIDTH = 358;
const PLOT_HEIGHT = 108;

function Analytics({ palette, recorded }: { palette: string; recorded: boolean }) {
  const [selected, setSelected] = useState<SeriesId>("power");
  const [open, setOpen] = useState(false);
  const series = SERIES.find((item) => item.id === selected) ?? SERIES[1];
  const colour = useWavePalette(false, palette);

  const datasets = useMemo(
    () => [
      {
        label: series.label,
        data: recorded
          ? series.data.map((value) => (value / series.max) * 100)
          : series.data.map(() => null as unknown as number),
        borderColor: colour.measured,
        backgroundColor: colour.fill,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
    ],
    [series, colour, recorded],
  );

  return (
    <>
    <section className={styles.analytics} data-comment="Analytics">
      <button
        type="button"
        className={styles.seriesPicker}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((now) => !now)}
      >
        <span>{series.label}</span>
        <span className={styles.seriesUnit}>{series.unit}</span>
        <ObiDropDownGoogle style={{ width: 25, height: 25 }} />
      </button>
      <div className={styles.yLabels}>
        {[series.max, series.max / 2, 0].map((value, i) => (
          <span key={value} style={{ top: i * (PLOT_HEIGHT / 2) }}>
            {value}
          </span>
        ))}
      </div>

      <div className={styles.plot}>
        {(recorded ? FOILS_OUT : []).map(([from, to]) => (
          <span key={from} className={styles.foilsBand} style={{ left: from, width: to - from }} />
        ))}
        <ObcLineGraph
          className={styles.plotLayer}
          width={PLOT_WIDTH}
          height={PLOT_HEIGHT}
          fixedAspectRatioScaling={false}
          hasLabelPadding={false}
          unit=""
          labels={series.data.map((_, i) => String(i))}
          yAxes={[{ id: "y", position: "left", min: 0, max: 100 }]}
          datasets={datasets}
        />
      </div>
      {(recorded ? FOILS_OUT : []).map(([from, to]) => (
        <span key={from}>
          <span
            className={styles.foilsMark}
            style={{ left: 54 + from, width: to - from }}
          />
          {/* A wavefoil under each stretch, to say the foils were out. */}
          <MaskIcon
            name="wf-wavefoil"
            size={24}
            style={{
              position: "absolute",
              top: 172,
              left: 54 + (from + to) / 2 - 12,
              color: "var(--instrument-enhanced-secondary-color, #2d548b)",
            }}
          />
        </span>
      ))}
    </section>
    {/* Outside the section, which clips what it holds: on a tablet the chart's own layer was drawn over the menu. */}
      {open ? (
        <>
          <div className={styles.menuScrim} onClick={() => setOpen(false)} aria-hidden="true" />
          <div className={styles.seriesMenu} role="listbox" aria-label="Series">
            {SERIES.map((item) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={item.id === selected}
                className={`${styles.seriesOption} ${item.id === selected ? styles.tripOptionCurrent : ""}`}
                onClick={() => {
                  setSelected(item.id);
                  setOpen(false);
                }}
              >
                <span>{item.label}</span>
                <span className={styles.seriesUnit}>{item.unit}</span>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}

export function DebriefingPage({ palette }: { palette: string }) {
  const [trip, setTrip] = useState<Trip>(TRIPS[1]);

  return (
    <div className={styles.page}>
      <TripCard trip={trip} onPick={setTrip} />
      <RouteMap recorded={trip.recorded} />
      <Analytics palette={palette} recorded={trip.recorded} />
    </div>
  );
}
