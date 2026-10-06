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

export type SeriesId = "power" | "speed" | "draft" | "hs";

export type Series = {
  id: SeriesId;
  label: string;
  /** The top of the axis; the labels are this, half of it and zero. */
  max: number;
  /** Eleven readings across the trip. */
  data: number[];
};

export const SERIES: Series[] = [
  { id: "power", label: "Engine power", max: 100, data: [22, 27, 39, 34, 56, 24, 38, 28, 43, 35, 39] },
  { id: "speed", label: "Speed", max: 20, data: [9, 11, 13.5, 12.5, 16, 11, 13, 12, 14, 13, 13.5] },
  { id: "draft", label: "Draft", max: 16, data: [11, 11, 10.8, 10.9, 10.7, 11, 10.9, 10.8, 10.7, 10.8, 10.8] },
  { id: "hs", label: "Hs", max: 8, data: [1.3, 2, 2.6, 2.5, 3.4, 3.9, 3.6, 2.9, 3.1, 2.9, 1.7] },
];

/** Where along the graph, in pixels of its 210 wide plot, the foils were out. */
export const FOILS_OUT: [number, number][] = [
  [98 - 56, 130 - 56],
  [155 - 56, 218 - 56],
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
 * The four trips of the picker. Only Bergen to Bodø has a log in the design, so
 * the others show their route and date and an empty log.
 */
export const TRIPS: Trip[] = [
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
  { id: "bodo-tromso", date: "31.06.26", from: "Bodø", to: "Tromsø", vessel: VESSEL, departure: { date: "31.06.26" }, log: [], recorded: false },
  { id: "tromso-harstad", date: "03.07.26", from: "Tromsø", to: "Harstad", vessel: VESSEL, departure: { date: "03.07.26" }, log: [], recorded: false },
  { id: "harstad-bodo", date: "08.07.26", from: "Harstad", to: "Bodø", vessel: VESSEL, departure: { date: "08.07.26" }, log: [], recorded: false },
];
