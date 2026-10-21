"use client";

/**
 * Wavefoil: three pages (overview, decision support and the alarm system), the
 * advice list in the top bar, and the training layer the menu leads to.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import "@oicl/openbridge-webcomponents/dist/openbridge.css";
import { AdviceMenu } from "./advice-menu";
import { AlarmPage } from "./alarm-page";
import { WavefoilMenu } from "./app-menu";
import { DebriefingPage } from "./debriefing-page";
import type { Conditions } from "./conditions";
import { DecisionSupportPage } from "./decision-support-page";
import { ExploreMode } from "./explore-mode";
import { GuidedMode } from "./guided-mode";
import { ScenarioMode } from "./scenario-mode";
import { PLAYABLE_SCENARIOS, type ScenarioDef } from "./scenario-data";
import {
  buildMixedTest,
  chapterScores,
  MIXED_TEST_ID,
  OPERATING_THE_FOILS,
  SEQUENCES,
  type GuidedSequence,
  type TestResult,
} from "./guided-data";
import { THREADS, type AppPage, type Thread, type ThreadId } from "./explore-data";
import { OverviewPage, type Moving } from "./overview-page";
import { WavefoilTopBar } from "./top-bar";
import type { LogEntry } from "../training-data";
import { TRAINING_LOG, type WfPageId } from "./training-data";
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
  conditions = "ideal",
  onDim,
  onExploring,
}: {
  palette: string;
  /** The state of the sea, which the decision support page reads. */
  conditions?: Conditions;
  onDim: () => void;
  onExploring?: (exploring: boolean) => void;
}) {
  const [page, setPage] = useState<AppPage>("overview");
  /** The pages, or the training section the menu leads to. */
  const [layer, setLayer] = useState<"app" | "training" | "explore" | "collaborate" | "guided" | "scenario">("app");
  /** The guided sequence that is running, when the layer is "guided". */
  const [sequence, setSequence] = useState<GuidedSequence>(OPERATING_THE_FOILS);
  /** The scenario that is running, when the layer is "scenario". */
  const [scenario, setScenario] = useState<ScenarioDef | null>(null);
  /** The tests taken in this visit, as entries for the training log. */
  const [testLog, setTestLog] = useState<LogEntry[]>([]);
  /** How each scenario went, as the share of its steps done right, for the Scenarios page. */
  const [scenarioResults, setScenarioResults] = useState<Record<string, number>>({});
  /** The cautions waiting in the top bar while a scenario runs. */
  const [alerts, setAlerts] = useState(0);
  /** How many times the alert button was pressed during a scenario, so the caution can come back. */
  const [bellPresses, setBellPresses] = useState(0);
  /** Which training page to open on, so explore mode returns to where it began. */
  const [trainingStart, setTrainingStart] = useState<WfPageId>("home");
  /** The comments left on the screen, shared by explore mode and the Explore page's list. */
  const [threads, setThreads] = useState<Thread[]>(THREADS);
  /** The comment explore mode opens on, when it was reached from the list. */
  const [exploreOn, setExploreOn] = useState<ThreadId | null>(null);
  /** How the learner did on the last test, kept for the results page. */
  const [outcomes, setOutcomes] = useState<Record<string, TestResult[]>>({});
  /** The chapter whose results Learning opens on, when it was just left by finishing its test. */
  const [resultsFor, setResultsFor] = useState<string | null>(null);
  /** The sea a guided sequence shows decision support in, in the place of the one picked outside the screen. */
  const [shownSea, setShownSea] = useState<Conditions | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adviceOpen, setAdviceOpen] = useState(false);

  /** 0 with the foils drawn in, 100 with them fully out. */
  const [deployment, setDeployment] = useState(0);
  const [moving, setMoving] = useState<Moving>(null);

  /**
   * The design shows the foils the way each sea state finds them: out when the
   * waves are harmful, in otherwise. Picking a sea state puts them there, so
   * the page can be seen as drawn without first moving the foils by hand.
   */
  const [seenConditions, setSeenConditions] = useState(conditions);
  if (seenConditions !== conditions) {
    setSeenConditions(conditions);
    setDeployment(conditions === "harmful" ? 100 : 0);
    setMoving(null);
  }

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
   * Explore mode and the guided sequences are sandboxes: the controls work as
   * they do on the real screen, but what the learner does is theirs alone. The
   * foil position from before is kept here and put back when they leave, so
   * nothing carries over to the system aboard. Both are framed in teal.
   */
  const sandbox = layer === "explore" || layer === "collaborate" || layer === "guided" || layer === "scenario";
  useEffect(() => {
    onExploring?.(sandbox);
  }, [sandbox, onExploring]);

  const real = useRef(0);
  const goTo = (next: "app" | "training" | "explore" | "collaborate" | "guided" | "scenario") => {
    const entering = next === "explore" || next === "collaborate" || next === "guided" || next === "scenario";
    if (entering && !sandbox) real.current = deployment;
    if (sandbox && !entering) {
      setDeployment(real.current);
      setMoving(null);
    }
    setLayer(next);
    setAdviceOpen(false);
  };

  /** Runs a guided sequence on the page and with the foils as it describes them. */
  const startGuided = (next: GuidedSequence) => {
    setSequence(next);
    setPage(next.page);
    setDeployment(next.deployment);
    setMoving(null);
    setMenuOpen(false);
    setResultsFor(null);
    goTo("guided");
  };

  /** Starts the test across the chapters, with the questions drawn from where the learner is weakest. */
  const startMixedTest = () => startGuided(buildMixedTest(chapterScores(outcomes)));

  /** Plays a scenario on the overview, with the foils out. */
  const startScenario = (next: ScenarioDef) => {
    setScenario(next);
    setPage("overview");
    setDeployment(100);
    setMoving(null);
    setMenuOpen(false);
    setAlerts(0);
    goTo("scenario");
  };

  const showPage = (next: AppPage) => {
    setPage(next);
    // Explore mode and the scenarios are sandboxes over the pages, so moving between them stays inside them.
    setLayer((now) => (now === "explore" || now === "collaborate" || now === "scenario" ? now : "app"));
    setMenuOpen(false);
    setAdviceOpen(false);
  };

  const deploy = () => setMoving("deploy");

  /** A test scenario puts the foils where it begins, or stops them where they are. */
  const placeFoils = useCallback((to: number | null, move?: "deploy") => {
    if (to !== null) setDeployment(to);
    setMoving(move ?? null);
  }, []);

  return (
    <div className={styles.screen}>
      <WavefoilTopBar
        pageName={layer === "app" || layer === "guided" || layer === "scenario" ? PAGE_NAMES[page] : "Training"}
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
        alerts={alerts}
        onAlerts={() => {
          // In a scenario with a caution waiting, the alert button brings the caution up.
          if (layer === "scenario" && alerts > 0) setBellPresses((n) => n + 1);
          else showPage("alarms");
        }}
      />

      {layer === "training" ? (
        <TrainingSection
          key={trainingStart}
          start={trainingStart}
          threads={threads}
          onExplore={() => goTo("explore")}
          onCollaborate={() => {
            setExploreOn(null);
            goTo("collaborate");
          }}
          onTest={startMixedTest}
          log={[...testLog, ...TRAINING_LOG]}
          onGuided={(id) => {
            const next = SEQUENCES[id];
            if (next) startGuided(next);
          }}
          onScenario={(id) => {
            const next = PLAYABLE_SCENARIOS[id];
            if (next) startScenario(next);
          }}
          scenarioResults={scenarioResults}
          results={outcomes}
          openResults={resultsFor}
          onOpenThread={(id) => {
            const thread = threads.find((item) => item.id === id);
            if (thread && thread.page !== "all") setPage(thread.page);
            setExploreOn(id);
            goTo("collaborate");
          }}
        />
      ) : null}

      {layer === "app" || layer === "explore" || layer === "collaborate" || layer === "guided" || layer === "scenario" ? (
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
          {page === "decision" ? <DecisionSupportPage
              palette={palette}
              conditions={shownSea ?? conditions}
              deployment={deployment}
              moving={moving}
              onDeploy={deploy}
              onRetract={() => setMoving("retract")}
              onStop={() => setMoving(null)}
            /> : null}
          {page === "alarms" ? <AlarmPage /> : null}
          {page === "debriefing" ? <DebriefingPage palette={palette} /> : null}
        </>
      ) : null}

      {layer === "explore" || layer === "collaborate" ? (
        <ExploreMode
          key={layer}
          variant={layer}
          threads={threads}
          onThreads={setThreads}
          initialOpen={layer === "collaborate" ? exploreOn : null}
          page={page}
          onExit={() => {
            setTrainingStart(layer);
            goTo("training");
          }}
        />
      ) : null}

      {layer === "guided" ? (
        <>
          <GuidedMode
            key={sequence.id}
            sequence={sequence}
            deployment={deployment}
            moving={moving}
            palette={palette}
            conditions={conditions}
            onFoils={placeFoils}
            onShowPage={setPage}
            onConditions={setShownSea}
            onExit={() => {
              setResultsFor(null);
              setTrainingStart(sequence.id === MIXED_TEST_ID ? "test" : "getting-started");
              goTo("training");
            }}
            onFinish={(results) => {
              if (results.length > 0) setOutcomes((now) => ({ ...now, [sequence.id]: results }));
              // The results of a chapter's test are what Learn opens on, and those of the mixed test are on the Test page.
              const mixed = sequence.id === MIXED_TEST_ID;
              if (mixed && results.length > 0) {
                // A test taken now goes at the top of the log, with its score.
                const now = new Date();
                const two = (n: number) => String(n).padStart(2, "0");
                setTestLog((all) => [
                  {
                    id: `test-${all.length + 1}`,
                    date: `${two(now.getDate())}.${two(now.getMonth() + 1)}.${String(now.getFullYear()).slice(2)}`,
                    kind: "Test",
                    title: "Mixed test",
                    result: Math.round((results.filter((item) => item.correct).length / results.length) * 100),
                    status: "completed",
                  },
                  ...all,
                ]);
              }
              setResultsFor(!mixed && results.length > 0 ? sequence.id : null);
              setTrainingStart(mixed ? "test" : "getting-started");
              goTo("training");
            }}
          />
        </>
      ) : null}

      {layer === "scenario" && scenario ? (
        <ScenarioMode
          key={scenario.id}
          scenario={scenario}
          page={page}
          deployment={deployment}
          moving={moving}
          bellPresses={bellPresses}
          onConditions={setShownSea}
          onAlerts={setAlerts}
          onOpenPage={showPage}
          onExit={() => {
            setTrainingStart("scenarios");
            goTo("training");
          }}
          onFinish={(result) => {
            setScenarioResults((now) => ({ ...now, [scenario.id]: result }));
            setTrainingStart("scenarios");
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
