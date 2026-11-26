/** What the second-screen app shows. It is written here so the screens only lay it out. */

export type TabId = "home" | "learn" | "notifications" | "profile";

/** The name of the vessel in the title of the app. */
export const VESSEL_NAME = "MS Nordby";

export const AGENDA = {
  title: "Today's agenda",
  text: "Shift of crew in the morning, then sailing to Bodø for fish pickup.",
  from: { place: "Bergen", role: "Departure", time: "15:16", date: "24.06.26" },
  to: { place: "Bodø", role: "Destination", time: "09:30", date: "25.06.26" },
};

/** A system the learner can open: its icon is a file in `public/prototype`, and a missing one is drawn by the library. */
export type System = { id: string; label: string; text: string; icon: string };

export const SYSTEMS: Record<string, System> = {
  conning: {
    id: "conning",
    label: "Conning",
    text: "Explore ship monitoring instruments.",
    icon: "/prototype/second-screen/icons/conning.svg",
  },
  wavefoil: {
    id: "wavefoil",
    label: "Wavefoil",
    text: "Explore foil controls and environments.",
    icon: "/prototype/icons/wf-wavefoil.svg",
  },
  navigation: {
    id: "navigation",
    label: "Navigation",
    text: "ECDIS and",
    icon: "/prototype/icons/wf-heavy-seas.svg",
  },
  bridge: {
    id: "bridge",
    label: "Bridge",
    text: "Explore ship monitoring instruments.",
    icon: "/prototype/second-screen/icons/bridge.svg",
  },
  machine: {
    id: "machine",
    label: "Machine",
    text: "Machine",
    icon: "/prototype/second-screen/icons/machine.svg",
  },
  deck: {
    id: "deck",
    label: "Deck",
    text: "Fish well and deck equipment",
    icon: "/prototype/second-screen/icons/deck.svg",
  },
};

/** The systems the learner was last in, on the home page. */
export const JUMP_BACK_IN = ["wavefoil", "navigation"];
export const FAVORITE_SYSTEMS = ["conning", "wavefoil", "navigation"];
export const ALL_SYSTEMS = ["bridge", "machine", "deck"];

export const TRAINING_LOG = [
  { id: "l1", date: "18.08.26", kind: "Getting started", title: "Onboarding refresh" },
  { id: "l2", date: "15.04.26", kind: "Scenario", title: "Alarm" },
  { id: "l3", date: "02.01.26", kind: "Scenario", title: "Critical alarm" },
  { id: "l4", date: "23.11.25", kind: "Getting started", title: "Onboarding" },
];

export type NotificationKind = "sync" | "comment" | "practice";

export type Notice = {
  id: string;
  kind: NotificationKind;
  title: string;
  /** When it came, as the day or the date, and the time. */
  when: string;
  text: string;
  /** The buttons it shows when it is open. */
  actions?: [string, string];
  open: boolean;
};

export const NOTICES: Notice[] = [
  {
    id: "n1",
    kind: "sync",
    title: "New sync available",
    when: "Yesterday  09:12",
    text: "Update on what's new since last trip.",
    actions: ["Mark as read", "Open"],
    open: true,
  },
  {
    id: "n2",
    kind: "comment",
    title: "Kjetil Nordby",
    when: "Yesterday  09:12",
    text: "Had great effect of the foils when going south from Bodø last week!",
    actions: ["Mark as read", "Open"],
    open: true,
  },
  {
    id: "n3",
    kind: "comment",
    title: "Kjetil Nordby",
    when: "12.11.26  10:22",
    text: "Had a bit of trouble with this foil during my…",
    actions: ["Mark as read", "Open"],
    open: false,
  },
  {
    id: "n4",
    kind: "comment",
    title: "Jon Fauske",
    when: "07.11.26  07:38",
    text: "It seems the foil motors need service soon….",
    actions: ["Mark as read", "Open"],
    open: false,
  },
  {
    id: "n5",
    kind: "practice",
    title: "Practice MOB routines",
    when: "05.11.26  15:17",
    text: "The MOB drill is coming up. Practice routine…",
    actions: ["Remind me later", "Start practice"],
    open: true,
  },
];

export const PROFILE = {
  initials: "SW",
  name: "Sunniva Wildhagen",
  role: "Captain",
  cards: [
    { id: "calendar", label: "Calendar", text: "Overview of upcoming activities." },
    { id: "sync", label: "Sync", text: "Add notes for next shift" },
    { id: "results", label: "Results", text: "My training" },
  ],
};

/** The page the Sync button leads to: what has happened since the last trip. */
export const SYNC_DATE = "18.11.2026";

export type CrewStatus = "Incoming" | "Staying" | "Leaving";

/** The crew by their initials, in the three groups the page shows them in. */
export const CREW: { status: CrewStatus; initials: string[] }[] = [
  { status: "Incoming", initials: ["HK", "PL", "AR"] },
  { status: "Staying", initials: ["PUS", "OKA", "AD", "WL"] },
  { status: "Leaving", initials: ["GE", "MB", "ØL"] },
];

export const VOYAGES = [
  { id: "v1", date: "18.11.26", route: "Bodø - Tromsø" },
  { id: "v2", date: "17.11.26", route: "Harstad - Bodø" },
  { id: "v3", date: "16.11.26", route: "Ørnes - Harstad" },
  { id: "v4", date: "15.11.26", route: "Glomfjord - Ørnes" },
];

/** What the Wavefoil page in Learn leads to. */
export const WAVEFOIL_PAGES = [
  {
    id: "components",
    label: "Components",
    text: "Explore the components in the interface.",
    icon: "/prototype/icons/application-patterns.svg",
  },
  {
    id: "manual",
    label: "Manual",
    text: "Explore the components in the interface.",
    icon: "/prototype/second-screen/icons/manual.svg",
  },
];

/** The components of the Wavefoil interface, to be explored one at a time. A component with no `page` has no content yet. */
export const WAVEFOIL_COMPONENTS: {
  id: string;
  label: string;
  text: string;
  icon: string;
  page?: "window" | "gyro";
}[] = [
  {
    id: "window",
    label: "Wavefoil window",
    text: "Explore ship monitoring instruments.",
    icon: "/prototype/icons/wf-heavy-seas.svg",
    page: "window",
  },
  {
    id: "gyro",
    label: "Pitch roll heave",
    text: "Explore ship monitoring instruments.",
    icon: "/prototype/second-screen/icons/conning.svg",
    page: "gyro",
  },
  {
    id: "foils",
    label: "Foil controls",
    text: "How to operate the foils",
    icon: "/prototype/icons/wf-wavefoil.svg",
  },
  {
    id: "advice",
    label: "Advice",
    text: "How to read and use advice",
    icon: "/prototype/second-screen/icons/advice.svg",
  },
  {
    id: "alarms",
    label: "Alarms",
    text: "How to monitor Wavefoil alarms",
    icon: "/prototype/icons/nav-scenarios.svg",
  },
  {
    id: "debrief",
    label: "Debrief",
    text: "How to use the debrief page",
    icon: "/prototype/icons/idea.svg",
  },
];

/** What the wave height says about the foils, in the words of the design. */
export const WAVE_ADVICE = {
  poor: { title: "Poor wave conditions", text: "Using wavefoil could slow down propulsion." },
  optimal: { title: "Optimal waves", text: "Wave conditions are within foil operating range." },
  harmful: { title: "Harmful waves", text: "Current wave conditions are too heavy for foil use." },
};
