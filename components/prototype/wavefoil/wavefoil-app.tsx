"use client";

/**
 * Wavefoil: three pages (overview, decision support and the alarm system), the
 * advice list in the top bar, and the training layer the menu leads to.
 */

import { useEffect, useRef, useState } from "react";
import "@oicl/openbridge-webcomponents/dist/openbridge.css";
import { AdviceMenu } from "./advice-menu";
import { AlarmPage } from "./alarm-page";
import { WavefoilMenu } from "./app-menu";
import { DebriefingPage } from "./debriefing-page";
import { DecisionSupportPage } from "./decision-support-page";
import { ExploreMode } from "./explore-mode";
import { THREADS, type AppPage, type Thread, type ThreadId } from "./explore-data";
import { OverviewPage, type Moving } from "./overview-page";
import { WavefoilTopBar } from "./top-bar";
import type { PageId } from "../training-data";
import { TrainingSection } from "./training-section";
import styles from "./wavefoil.module.css";

/** How long the foils take to travel all the way, in either direction. */
const TRAVEL_SECONDS = 10;
const TICK_MS = 100;

const PAGE_NAMES: Record<AppPage, string> = {
  overview: "Overview",
  decision: "Decision support",
  alarms: "Alarm system",
  debriefing: "Debriefing",
};

export function WavefoilApp({
  palette,
  onDim,
  onExploring,
}: {
  palette: string;
  onDim: () => void;
  onExploring?: (exploring: boolean) => void;
}) {
  const [page, setPage] = useState<AppPage>("overview");
  /** The pages, or the training section the menu leads to. */
  const [layer, setLayer] = useState<"app" | "training" | "explore">("app");
  /** Which training page to open on, so explore mode returns to where it began. */
  const [trainingStart, setTrainingStart] = useState<PageId>("home");
  /** The comments left on the screen, shared by explore mode and the Explore page's list. */
  const [threads, setThreads] = useState<Thread[]>(THREADS);
  /** The comment explore mode opens on, when it was reached from the list. */
  const [exploreOn, setExploreOn] = useState<ThreadId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adviceOpen, setAdviceOpen] = useState(false);

  /** 0 with the foils drawn in, 100 with them fully out. */
  const [deployment, setDeployment] = useState(0);
  const [moving, setMoving] = useState<Moving>(null);

  useEffect(() => {
    if (!moving) return;
    const step = (100 / TRAVEL_SECONDS) * (TICK_MS / 1000);
    const tick = setInterval(() => {
      setDeployment((now) => {
        const next = moving === "deploy" ? Math.min(100, now + step) : Math.max(0, now - step);
        if (next === 0 || next === 100) setMoving(null);
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(tick);
  }, [moving]);

  /**
   * Explore mode is a sandbox: the controls work as they do on the real screen,
   * but what the learner does is theirs alone. The foil position from before is
   * kept here and put back when they leave, so nothing carries over to the
   * system aboard.
   */
  useEffect(() => {
    onExploring?.(layer === "explore");
  }, [layer, onExploring]);

  const real = useRef(0);
  const goTo = (next: "app" | "training" | "explore") => {
    if (next === "explore" && layer !== "explore") real.current = deployment;
    if (layer === "explore" && next !== "explore") {
      setDeployment(real.current);
      setMoving(null);
    }
    setLayer(next);
    setAdviceOpen(false);
  };

  const showPage = (next: AppPage) => {
    setPage(next);
    // Explore mode is a sandbox over the pages, so moving between them stays inside it.
    setLayer((now) => (now === "explore" ? now : "app"));
    setMenuOpen(false);
    setAdviceOpen(false);
  };

  const deploy = () => setMoving("deploy");

  return (
    <div className={styles.screen}>
      <WavefoilTopBar
        pageName={layer === "app" ? PAGE_NAMES[page] : "Training"}
        training={layer !== "app"}
        palette={palette}
        onDim={onDim}
        menuOpen={menuOpen}
        onMenu={() => {
          setAdviceOpen(false);
          setMenuOpen((open) => !open);
        }}
        adviceOpen={adviceOpen}
        onAdvice={() => {
          setMenuOpen(false);
          setAdviceOpen((open) => !open);
        }}
        onAlerts={() => showPage("alarms")}
      />

      {layer === "training" ? (
        <TrainingSection
          key={trainingStart}
          start={trainingStart}
          threads={threads}
          onExplore={() => {
            setExploreOn(null);
            goTo("explore");
          }}
          onOpenThread={(id) => {
            const thread = threads.find((item) => item.id === id);
            if (thread && thread.page !== "all") setPage(thread.page);
            setThreads((all) =>
              all.map((item) => (item.id === id ? { ...item, unread: false } : item)),
            );
            setExploreOn(id);
            goTo("explore");
          }}
        />
      ) : null}

      {layer === "app" || layer === "explore" ? (
        <>
          {page === "overview" ? (
            <OverviewPage
              deployment={deployment}
              moving={moving}
              dusk={palette !== "day"}
              onDeploy={deploy}
              onRetract={() => setMoving("retract")}
              onStop={() => setMoving(null)}
            />
          ) : null}
          {page === "decision" ? <DecisionSupportPage palette={palette} deployed={deployment > 0} /> : null}
          {page === "alarms" ? <AlarmPage /> : null}
          {page === "debriefing" ? <DebriefingPage palette={palette} /> : null}
        </>
      ) : null}

      {layer === "explore" ? (
        <ExploreMode
          threads={threads}
          onThreads={setThreads}
          initialOpen={exploreOn}
          page={page}
          onExit={() => {
            setTrainingStart("explore");
            goTo("training");
          }}
        />
      ) : null}

      {menuOpen ? (
        <WavefoilMenu
          page={page}
          inTraining={layer !== "app"}
          onPage={showPage}
          onTraining={() => {
            setTrainingStart("home");
            goTo("training");
            setMenuOpen(false);
          }}
          onClose={() => setMenuOpen(false)}
        />
      ) : null}

      {adviceOpen ? (
        <AdviceMenu
          onClose={() => setAdviceOpen(false)}
          onDeploy={() => {
            showPage("overview");
            deploy();
          }}
        />
      ) : null}
    </div>
  );
}
