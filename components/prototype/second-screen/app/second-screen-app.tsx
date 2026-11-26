"use client";

/**
 * The second screen as an app for a phone: a home page with the agenda and what
 * to jump back into, the systems to learn, the notifications, and a profile. The
 * four are reached from the row at the bottom.
 */

import { useState } from "react";
import type { ReactNode } from "react";
import "@oicl/openbridge-webcomponents/dist/openbridge.css";
import { ObcButton } from "@oicl/openbridge-webcomponents-react/components/button/button";
import { ObiAlerts } from "@oicl/openbridge-webcomponents-react/icons/icon-alerts";
import { ObiAlertsActive } from "@oicl/openbridge-webcomponents-react/icons/icon-alerts-active";
import { ObiArrowLeftGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-arrow-left-google";
import { ObiCalendarGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-calendar-google";
import { ObiChevronDownGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-chevron-down-google";
import { ObiChevronRightGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-chevron-right-google";
import { ObiChevronUpGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-chevron-up-google";
import { ObiComMessageGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-com-message-google";
import { ObiComMessageActiveGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-com-message-active-google";
import { ObiHome } from "@oicl/openbridge-webcomponents-react/icons/icon-home";
import { ObiSettingsIec } from "@oicl/openbridge-webcomponents-react/icons/icon-settings-iec";
import { ObiShipTugboat } from "@oicl/openbridge-webcomponents-react/icons/icon-ship-tugboat";
import { ObiStarSelected } from "@oicl/openbridge-webcomponents-react/icons/icon-star-selected";
import { ObiSyncGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-sync-google";
import { ObiUser } from "@oicl/openbridge-webcomponents-react/icons/icon-user";
import { ButtonVariant } from "@oicl/openbridge-webcomponents/dist/components/button/button";
import {
  AGENDA,
  ALL_SYSTEMS,
  CREW,
  FAVORITE_SYSTEMS,
  JUMP_BACK_IN,
  NOTICES,
  PROFILE,
  SYNC_DATE,
  SYSTEMS,
  TRAINING_LOG,
  VESSEL_NAME,
  VOYAGES,
  type Notice,
  type TabId,
} from "./app-data";
import { SecondScreen } from "../second-screen";
import { Card, Divider, Mask } from "./app-parts";
import { HomeIndicator, StatusBar } from "./device-chrome";
import {
  WavefoilComponentsPage,
  WavefoilPage,
  WavefoilWindowPage,
  type WavefoilTarget,
} from "./wavefoil-pages";
import styles from "./second-screen-app.module.css";

function SystemCard({ id, onClick }: { id: string; onClick?: () => void }) {
  const system = SYSTEMS[id];
  return <Card label={system.label} text={system.text} icon={<Mask src={system.icon} />} onClick={onClick} />;
}

/* ---- the four pages ---- */

function HomePage({ onSync, onWavefoil }: { onSync: () => void; onWavefoil: () => void }) {
  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.agendaTitle}>{AGENDA.title}</h2>
        <p className={styles.agendaText}>{AGENDA.text}</p>
        <div className={styles.trip}>
          {[AGENDA.from, AGENDA.to].map((stop) => (
            <div key={stop.place}>
              <b>{stop.place}</b>
              <span>{stop.role}</span>
              <span className={styles.time}>
                <b style={{ display: "inline" }}>{stop.time}</b> <em>{stop.date}</em>
              </span>
            </div>
          ))}
        </div>
        <Card
          teal
          label="Sync"
          text="Update on what's new"
          icon={<ObiSyncGoogle style={{ width: 40, height: 40 }} />}
          onClick={onSync}
        />
      </section>
      <Divider />
      <section className={styles.section}>
        <p className={styles.label}>Jump back in</p>
        <div className={styles.stack}>
          {JUMP_BACK_IN.map((id) => (
            <SystemCard key={id} id={id} onClick={id === "wavefoil" ? onWavefoil : undefined} />
          ))}
        </div>
      </section>
      <Divider />
      <section className={styles.section}>
        <p className={styles.label}>Training log</p>
        <ul className={styles.log}>
          {TRAINING_LOG.map((entry) => (
            <li key={entry.id}>
              <button type="button" className={styles.logRow}>
                <span className={styles.logDate}>{entry.date}</span>
                <span className={styles.logText}>
                  <strong>{entry.kind}</strong>
                  {entry.title}
                </span>
                <ObiChevronRightGoogle className={styles.logChevron} />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function LearnPage({ onWavefoil }: { onWavefoil: () => void }) {
  return (
    <>
      <section className={styles.section}>
        <p className={`${styles.label} ${styles.labelRow}`}>
          <ObiStarSelected />
          Favorite systems
        </p>
        <div className={styles.stack}>
          {FAVORITE_SYSTEMS.map((id) => (
            <SystemCard key={id} id={id} onClick={id === "wavefoil" ? onWavefoil : undefined} />
          ))}
        </div>
      </section>
      <Divider />
      <section className={styles.section}>
        <p className={styles.label}>All systems</p>
        <div className={styles.stack}>
          {ALL_SYSTEMS.map((id) => (
            <SystemCard key={id} id={id} />
          ))}
        </div>
      </section>
    </>
  );
}

function NoticeIcon({ kind }: { kind: Notice["kind"] }) {
  if (kind === "sync") return <ObiSyncGoogle className={styles.noticeIcon} />;
  if (kind === "comment") return <ObiComMessageActiveGoogle className={styles.noticeIcon} />;
  return <Mask className={styles.noticeIcon} src="/prototype/icons/wf-menu-training.svg" />;
}

function NotificationsPage() {
  const [notices, setNotices] = useState(NOTICES);
  const toggle = (id: string) =>
    setNotices((now) => now.map((item) => (item.id === id ? { ...item, open: !item.open } : item)));

  return (
    <div>
      {notices.map((notice) => (
        <div key={notice.id} className={styles.notice}>
          <button
            type="button"
            className={styles.noticeHead}
            aria-expanded={notice.open}
            onClick={() => toggle(notice.id)}
          >
            <NoticeIcon kind={notice.kind} />
            <span className={styles.noticeBody}>
              <span className={styles.noticeTop}>
                <span className={styles.noticeTitle}>{notice.title}</span>
                <span className={styles.noticeWhen}>{notice.when}</span>
              </span>
              <span className={`${styles.noticeText} ${notice.open ? "" : styles.clamped}`} style={{ display: "block" }}>
                {notice.text}
              </span>
            </span>
            {notice.open ? (
              <ObiChevronUpGoogle className={styles.noticeChevron} />
            ) : (
              <ObiChevronDownGoogle className={styles.noticeChevron} />
            )}
          </button>
          {notice.open && notice.actions ? (
            <div className={styles.noticeActions}>
              {notice.actions.map((label) => (
                <ObcButton key={label} variant={ButtonVariant.normal} fullWidth onClick={() => toggle(notice.id)}>
                  {label}
                </ObcButton>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ProfilePage() {
  const icons: Record<string, ReactNode> = {
    calendar: <ObiCalendarGoogle style={{ width: 40, height: 40 }} />,
    sync: <ObiSyncGoogle style={{ width: 40, height: 40 }} />,
    results: <Mask src="/prototype/icons/nav-overview.svg" />,
  };
  return (
    <>
      <div className={styles.person}>
        <span className={styles.avatar} aria-hidden="true">
          {PROFILE.initials}
        </span>
        <span>
          <span className={styles.personName}>{PROFILE.name}</span>
          <span className={styles.personRole}>{PROFILE.role}</span>
        </span>
      </div>
      <Divider />
      <section className={styles.section}>
        <div className={styles.stack}>
          {PROFILE.cards.map((card) => (
            <Card key={card.id} label={card.label} text={card.text} icon={icons[card.id]} />
          ))}
        </div>
      </section>
      <Divider />
      <ul className={styles.menu}>
        <li>
          <button type="button" className={styles.menuRow}>
            <ObiSettingsIec className={styles.menuIcon} />
            <span>Settings</span>
            <ObiChevronRightGoogle className={styles.menuIcon} />
          </button>
        </li>
        <li>
          <button type="button" className={styles.menuRow}>
            <Mask className={styles.menuIcon} src="/prototype/second-screen/icons/logout.svg" />
            <span>Log out</span>
            <ObiChevronRightGoogle className={styles.menuIcon} />
          </button>
        </li>
      </ul>
    </>
  );
}

/** What has happened since the last trip: the day, the port, the crew, what to catch up on and the voyages. */
function SyncPage() {
  const trip = [AGENDA.from, AGENDA.to];
  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.agendaTitle}>{AGENDA.title}</h2>
        <p className={styles.agendaText}>{AGENDA.text}</p>
      </section>
      <Divider />
      <section className={styles.section}>
        <p className={styles.label}>Port</p>
        <div className={`${styles.trip} ${styles.tripFlat}`}>
          {trip.map((stop) => (
            <div key={stop.place}>
              <b>{stop.place}</b>
              <span>{stop.role}</span>
              <span className={styles.time}>
                <b style={{ display: "inline" }}>{stop.time}</b> <em>{stop.date}</em>
              </span>
            </div>
          ))}
        </div>
      </section>
      <Divider />
      <section className={styles.section}>
        <p className={styles.label}>Crew</p>
        <div className={styles.crew}>
          {CREW.map((group) => (
            <ul key={group.status} className={styles.crewRow}>
              {group.initials.map((initials) => (
                <li
                  key={initials}
                  className={`${styles.crewMember} ${group.status === "Leaving" ? styles.crewLeaving : ""}`}
                >
                  <span className={styles.crewAvatar}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/prototype/second-screen/crew-avatar.png" alt="" />
                  </span>
                  <b>{initials}</b>
                  <span>{group.status}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>
      <Divider />
      <section className={styles.section}>
        <p className={styles.label}>Catch up</p>
        <div className={styles.stack}>
          <Card
            label="New notes"
            text="See new updates and notes from the previous captain."
            icon={<ObiComMessageGoogle style={{ width: 40, height: 40 }} />}
            badge={9}
          />
          <Card
            label="Previous voyage debrief"
            text="Explore foil controls and environments."
            icon={<Mask src={SYSTEMS.wavefoil.icon} />}
          />
        </div>
      </section>
      <Divider />
      <section className={styles.section}>
        <p className={styles.label}>Voyage log</p>
        <ul className={styles.log}>
          {VOYAGES.map((voyage) => (
            <li key={voyage.id}>
              <button type="button" className={styles.logRow}>
                <span className={styles.logDate}>{voyage.date}</span>
                <strong className={styles.logText}>{voyage.route}</strong>
                <ObiChevronRightGoogle className={styles.logChevron} />
              </button>
            </li>
          ))}
          <li className={styles.logFooter}>
            <button type="button" className={styles.logRow}>
              <ObiCalendarGoogle className={styles.menuIcon} />
              <span className={styles.logText}>All voyages</span>
            </button>
          </li>
        </ul>
      </section>
    </>
  );
}

/* ---- the frame around them ---- */

const TABS: { id: TabId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "learn", label: "Learn" },
  { id: "notifications", label: "Notifications" },
  { id: "profile", label: "Profile" },
];

/** The icon of a place, as the row at the bottom has it and as the title bar has it. */
function PlaceIcon({ id, active }: { id: TabId; active: boolean }) {
  if (id === "home") return <ObiHome />;
  if (id === "learn") return <Mask className={styles.tabMask} src="/prototype/icons/nav-getting-started.svg" />;
  if (id === "notifications") return active ? <ObiAlertsActive /> : <ObiAlerts />;
  return <ObiUser />;
}

const TITLE: Record<TabId, string> = {
  home: `${VESSEL_NAME} learning`,
  learn: `${VESSEL_NAME} learning`,
  notifications: `${VESSEL_NAME} learning`,
  profile: "Profile",
};

/** The pages that are opened from another page, which the back arrow takes back from. */
export type View = "sync" | "wavefoil" | "components" | "window" | "gyro";

/** A page that fills the whole screen, with its own close button and no row at the bottom. */
const FULL: View[] = ["window", "gyro"];

/** The pages a shortcut from the demo page starts on, with the pages that lead to it behind it. */
const START: Record<string, { tab: TabId; stack: View[] }> = {
  sync: { tab: "home", stack: ["sync"] },
  window: { tab: "learn", stack: ["wavefoil", "components", "window"] },
  gyro: { tab: "learn", stack: ["wavefoil", "components", "gyro"] },
};

const VIEW_TITLE: Partial<Record<View, string>> = {
  wavefoil: "Wavefoil",
  components: "Wavefoil Components",
};

export function SecondScreenApp({
  device = false,
  start,
}: {
  device?: boolean;
  /** A page to open on, as a shortcut from the demo page does: sync, window or gyro. */
  start?: string | null;
}) {
  const begin = start ? START[start] : undefined;
  const [tab, setTab] = useState<TabId>(begin?.tab ?? "home");
  // The pages opened from another page, newest last. The row at the bottom stays for all but the full ones.
  const [stack, setStack] = useState<View[]>(begin?.stack ?? []);
  const view = stack.at(-1);
  const open = (next: View) => setStack((now) => [...now, next]);
  const back = () => setStack((now) => now.slice(0, -1));
  const places = (next: TabId) => {
    setStack([]);
    setTab(next);
  };
  const openTarget = (target: WavefoilTarget) => open(target);

  if (view && FULL.includes(view)) {
    return (
      <div className={styles.app}>
        <div className={styles.fullPage}>
          {view === "window" ? <WavefoilWindowPage onClose={back} /> : <SecondScreen embedded onClose={back} />}
          {device ? <StatusBar overlay tone={view === "gyro" ? "tint" : "white"} /> : null}
          {device ? <HomeIndicator overlay /> : null}
        </div>
      </div>
    );
  }

  const title =
    view === "sync" ? `Sync ${SYNC_DATE}` : view ? VIEW_TITLE[view] : TITLE[tab];
  // The pages of the Wavefoil flow belong to Learn, so it stays marked while they are open.
  const marked = view === "sync" ? null : tab;

  return (
    <div className={styles.app}>
      {/* A phone has its own status bar, so this one is only for the frame on the demo page. */}
      {device ? <StatusBar /> : null}
      <header className={`${styles.bar} ${device ? styles.barBelowStatus : ""}`}>
        {view === "wavefoil" || view === "components" ? (
          <button type="button" className={styles.barBack} aria-label="Back" onClick={back}>
            <ObiArrowLeftGoogle />
          </button>
        ) : (
          <span className={styles.barIcon}>
            {view === "sync" ? <ObiSyncGoogle /> : tab === "home" ? <ObiShipTugboat /> : <PlaceIcon id={tab} active />}
          </span>
        )}
        <h1 className={styles.barTitle}>{title}</h1>
      </header>

      <main className={styles.page} key={view ?? tab}>
        {view === "sync" ? <SyncPage /> : null}
        {view === "wavefoil" ? <WavefoilPage onOpen={openTarget} /> : null}
        {view === "components" ? <WavefoilComponentsPage onOpen={openTarget} /> : null}
        {!view && tab === "home" ? <HomePage onSync={() => open("sync")} onWavefoil={() => open("wavefoil")} /> : null}
        {!view && tab === "learn" ? <LearnPage onWavefoil={() => open("wavefoil")} /> : null}
        {!view && tab === "notifications" ? <NotificationsPage /> : null}
        {!view && tab === "profile" ? <ProfilePage /> : null}
      </main>

      <nav className={styles.tabs} aria-label="Places">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={styles.tab}
            aria-label={label}
            aria-current={marked === id ? "page" : undefined}
            onClick={() => places(id)}
          >
            <PlaceIcon id={id} active={marked === id} />
          </button>
        ))}
      </nav>
      {device ? <HomeIndicator /> : null}
    </div>
  );
}
