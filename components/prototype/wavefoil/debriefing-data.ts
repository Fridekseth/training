/**
 * The trip shown on the debriefing page: who sailed, the log of the voyage and
 * the series behind the analytics graph. The log and the engine power series
 * are the ones in the design (the times of the last entries are as drawn); the other three series are stand-ins so the
 * legend has something to switch to.
 */

export type Waypoint = {
  kind: "waypoint";
  at: string;
  name: string;
  /** Distance in NM, bearing in degrees and speed in knots. */
  dist: string;
  brg: string;
  spd: string;
  time: string;
  /** Time without leg, shown in place of the stamp on the later waypoints. */
  twol?: string;
};

export type FoilEvent = {
  kind: "activated" | "retracted";
  at: string;
  hs: string;
  text: string;
};

export type Docking = {
  kind: "docking";
  at: string;
  place: string;
  /** Time to go. */
  ttg: string;
};

export type LogEntry = Waypoint | FoilEvent | Docking;

const BERGEN_BODO_LOG: LogEntry[] = [
  { kind: "waypoint", at: "15:16", name: "WP 001", time: "15:16:00", dist: "0", brg: "8.5", spd: "0.5" },
  { kind: "activated", at: "15:27", hs: "2,8", text: "Wavefoil deployed successfully." },
  { kind: "retracted", at: "15:58", hs: "0.3", text: "Wavefoil retracted due to lack of waves." },
  { kind: "waypoint", at: "16:22", name: "WP 002", time: "16:22:23", dist: "1.3", brg: "189", spd: "2.1" },
  { kind: "activated", at: "16:43", hs: "3,7", text: "Wavefoil deployed successfully." },
  { kind: "waypoint", at: "13:35", name: "WP 003", time: "00:00:00", twol: "TWOL", dist: "2.3", brg: "234", spd: "2.5" },
  { kind: "waypoint", at: "13:35", name: "WP 004", time: "00:00:00", twol: "TWOL", dist: "6", brg: "231", spd: "4.3" },
  { kind: "retracted", at: "12:58", hs: "0.3", text: "Wavefoil retracted approaching harbour." },
  { kind: "docking", at: "16:24", place: "Bodø", ttg: "03:58:25" },
];

export type SeriesId = "speed" | "power" | "pitch" | "pitch-m";

export type Series = {
  id: SeriesId;
  label: string;
  unit: string;
  /** The top of the axis; the labels are this, half of it and zero. */
  max: number;
  /** Eleven readings across the trip. */
  data: number[];
};

/**
 * The four series of the picker, in the order the design lists them. Only the
 * engine power curve is in the design; the others are stand-ins. The last
 * entry is labelled "Pitch m" in the design.
 */
export const SERIES: Series[] = [
  { id: "speed", label: "Speed", unit: "kn", max: 20, data: [9, 11, 13.5, 12.5, 16, 11, 13, 12, 14, 13, 13.5] },
  { id: "power", label: "Engine power", unit: "kw", max: 100, data: [22, 27, 39, 34, 56, 24, 38, 28, 43, 35, 39] },
  { id: "pitch", label: "Pitch", unit: "DEG", max: 4, data: [1.2, 1.5, 2.1, 1.8, 2.6, 1.4, 1.9, 1.6, 2.2, 1.7, 1.9] },
  { id: "pitch-m", label: "Pitch", unit: "m", max: 4, data: [0.6, 0.8, 1.2, 1, 1.6, 0.7, 1.1, 0.9, 1.3, 1, 1.1] },
];

/** Where along the graph, in pixels of its 358 wide plot, the foils were out. */
export const FOILS_OUT: [number, number][] = [
  [44, 119],
  [171, 274],
];

/** The waypoints on the map, in the map card's own pixels. */
export const MAP_WAYPOINTS: [number, number][] = [
  [156.68, 103.83],
  [161.85, 159.16],
  [214.96, 240.3],
  [269.55, 240.3],
  [291.68, 194.57],
  [65.21, 27.12],
  [99.15, -85.74],
  [80.71, -120.41],
  [89.56, -192.7],
  [61.53, -222.21],
  [111.69, -287.13],
  [111.69, -251.72],
];

export type Moment = { time?: string; date: string };

export type Trip = {
  id: string;
  /** The date the trip sailed, as the picker lists it. */
  date: string;
  from: string;
  to: string;
  vessel: string;
  departure: Moment;
  destination?: Moment;
  /** The log, the route on the map and the analytics are only recorded for some trips. */
  log: LogEntry[];
  recorded: boolean;
};

const VESSEL = "MS Liafjord";

/**
 * The five trips of the picker. Only Bergen to Bodø has a log in the design, so
 * the others show their route and date and an empty log.
 */
export const TRIPS: Trip[] = [
  { id: "stavanger-bergen", date: "23.06.26", from: "Stavanger", to: "Bergen", vessel: VESSEL, departure: { date: "23.06.26" }, log: [], recorded: false },
  {
    id: "bergen-bodo",
    date: "24.06.26",
    from: "Bergen",
    to: "Bodø",
    vessel: VESSEL,
    departure: { time: "15:16", date: "24.06.26" },
    destination: { time: "09:30", date: "25.06.26" },
    log: BERGEN_BODO_LOG,
    recorded: true,
  },
  { id: "bodo-harstad", date: "25.06.26", from: "Bodø", to: "Harstad", vessel: VESSEL, departure: { date: "25.06.26" }, log: [], recorded: false },
  { id: "harstad-tromso", date: "26.06.26", from: "Harstad", to: "Tromsø", vessel: VESSEL, departure: { date: "26.06.26" }, log: [], recorded: false },
  { id: "tromso-bodo", date: "27.06.26", from: "Tromsø", to: "Bodø", vessel: VESSEL, departure: { date: "27.06.26" }, log: [], recorded: false },
];
