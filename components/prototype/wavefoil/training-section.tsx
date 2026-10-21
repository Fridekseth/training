"use client";

/**
 * The training section of the Wavefoil app: a side menu that can fold down to
 * icons, a toolbar with back and forward, and the five pages. It is the same
 * structure as the Orkla training, scaled to the smaller screen.
 */

import { useState } from "react";
import { ObcNavigationItem } from "@oicl/openbridge-webcomponents-react/components/navigation-item/navigation-item";
import { ObcIconButton } from "@oicl/openbridge-webcomponents-react/components/icon-button/icon-button";
import { ObiDockLeftGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-dock-left-google";
import { ObiSearch } from "@oicl/openbridge-webcomponents-react/icons/icon-search";
import { ObiArrowLeftGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-arrow-left-google";
import { ObiArrowRightGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-arrow-right-google";
import { ObcNavigationMenuVariant } from "@oicl/openbridge-webcomponents/dist/components/navigation-menu/navigation-menu";
import { IconButtonVariant } from "@oicl/openbridge-webcomponents/dist/components/icon-button/icon-button";
import { MaskIcon } from "../pieces";
import { HOME, type LogEntry } from "../training-data";
import { CHAPTERS, PAGES, SCENARIOS, type WfPageDef, type WfPageId } from "./training-data";
import { PLAYABLE_SCENARIOS } from "./scenario-data";
import { chapterScores, MIXED_TEST_ID, SEQUENCES, weightOf, type TestResult } from "./guided-data";
import type { Thread } from "./explore-data";
import {
  ChapterResultsPage,
  CollaboratePage,
  ExplorePage,
  GettingStartedPage,
  HomePage,
  OverviewPage,
  ScenariosPage,
  TestPage,
} from "./training-pages";
import styles from "./training.module.css";

const ACTIVE = "var(--on-amplified-active-color, #1d3c67)";
const NEUTRAL = "var(--on-flat-neutral-color, #535353)";

function MenuItem({
  page,
  active,
  iconOnly,
  onSelect,
}: {
  page: WfPageDef;
  active: boolean;
  iconOnly: boolean;
  onSelect: (id: WfPageId) => void;
}) {
  return (
    <ObcNavigationItem
      label={page.label}
      checked={active}
      hasIcon
      variant={iconOnly ? ObcNavigationMenuVariant.IconOnly : ObcNavigationMenuVariant.Full}
      onClick={() => onSelect(page.id)}
    >
      <MaskIcon
        slot="icon"
        name={page.icon}
        style={{ color: active ? ACTIVE : NEUTRAL }}
      />
    </ObcNavigationItem>
  );
}

export function TrainingSection({
  start = "home",
  threads,
  onExplore,
  onCollaborate,
  onTest,
  log,
  onGuided,
  onScenario,
  scenarioResults,
  results,
  openResults = null,
  onOpenThread,
}: {
  /** The page to open on, so leaving explore mode lands back on Explore. */
  start?: WfPageId;
  /** The comments, for the list on the Explore page. */
  threads: Thread[];
  onExplore: () => void;
  /** Starts collaborate mode, which is explore mode with the comments of the team. */
  onCollaborate: () => void;
  /** Starts the test across the chapters. */
  onTest: () => void;
  /** Everything the learner has done, newest first. */
  log: LogEntry[];
  /** Starts the guided sequence of a chapter in Learning. */
  onGuided: (chapterId: string) => void;
  /** Starts a scenario on the Scenarios page, if it can be played. */
  onScenario: (scenarioId: string) => void;
  /** How the scenarios that have been played went. */
  scenarioResults: Record<string, number>;
  /** How the learner did on the chapter's test, once they have taken it. */
  results: Record<string, TestResult[]>;
  /** Opens on that chapter's results rather than the list of chapters. */
  openResults?: string | null;
  onOpenThread: (id: string) => void;
}) {
  const [page, setPage] = useState<WfPageId>(start);
  const [history, setHistory] = useState<WfPageId[]>([start]);
  const [step, setStep] = useState(0);
  // Folded to icons until the panel button opens it.
  const [folded, setFolded] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  /** The chapter whose results are open, if any. */
  const [resultsFor, setResultsFor] = useState<string | null>(
    start === "getting-started" && openResults && results[openResults] ? openResults : null,
  );
  const resultsOpen = resultsFor !== null;

  // A chapter whose test has been taken is completed, with the share of right answers as its result.
  const chapters = CHAPTERS.map((chapter) => {
    const taken = results[chapter.id];
    return taken
      ? {
          ...chapter,
          status: "completed" as const,
          result: Math.round((taken.filter((item) => item.correct).length / taken.length) * 100),
        }
      : chapter;
  });

  // A scenario that has been played is completed, with the share of its steps done right as its result.
  const scenarios = SCENARIOS.map((scenario) =>
    scenarioResults[scenario.id] !== undefined
      ? { ...scenario, status: "completed" as const, result: scenarioResults[scenario.id] }
      : scenario,
  );

  // The chapters the next mixed test draws most from: the two with the highest weight.
  const scores = chapterScores(results);
  const focus = [...CHAPTERS]
    .sort((a, b) => weightOf(scores[b.id]) - weightOf(scores[a.id]))
    .slice(0, 2)
    .map((chapter) => chapter.title);

  const go = (id: WfPageId) => {
    if (id === page) return;
    // The pages are drawn for the folded menu, so leaving Home folds it away.
    if (id !== "home") setFolded(true);
    const next = [...history.slice(0, step + 1), id];
    setHistory(next);
    setStep(next.length - 1);
    setPage(id);
    setMessage(null);
    setResultsFor(null);
  };

  const move = (delta: number) => {
    // The results are a page inside Learning, so back leaves them for the list.
    if (resultsOpen && delta < 0) {
      setResultsFor(null);
      return;
    }
    const target = step + delta;
    if (target < 0 || target >= history.length) return;
    setStep(target);
    setPage(history[target]);
    setMessage(null);
  };

  const current: WfPageDef = page === "home" ? HOME : PAGES.find((p) => p.id === page)!;

  return (
    <div className={styles.training}>
      <nav className={`${styles.subNav} ${folded ? styles.subNavFolded : ""}`}>
        <div className={styles.subNavHeader}>
          <ObcIconButton
            variant={IconButtonVariant.flat}
            onClick={() => setFolded((value) => !value)}
          >
            <ObiDockLeftGoogle />
          </ObcIconButton>
          {folded ? null : (
            <ObcIconButton variant={IconButtonVariant.flat}>
              <ObiSearch />
            </ObcIconButton>
          )}
        </div>

        <div className={styles.subNavHome}>
          <MenuItem page={HOME} active={page === "home"} iconOnly={folded} onSelect={go} />
        </div>
        <span className={styles.subNavDivider} />
        <div className={styles.subNavList}>
          {PAGES.map((item) => (
            <MenuItem
              key={item.id}
              page={item}
              active={page === item.id}
              iconOnly={folded}
              onSelect={go}
            />
          ))}
        </div>
      </nav>

      <div className={styles.trainingColumn}>
        <div className={styles.toolbar}>
          <div className={styles.history}>
            <ObcIconButton
              variant={IconButtonVariant.flat}
              cornerRight
              disabled={step === 0 && !resultsOpen}
              onClick={() => move(-1)}
            >
              <ObiArrowLeftGoogle />
            </ObcIconButton>
            <ObcIconButton
              variant={IconButtonVariant.flat}
              cornerLeft
              disabled={step >= history.length - 1}
              onClick={() => move(1)}
            >
              <ObiArrowRightGoogle />
            </ObcIconButton>
          </div>
          <span className={styles.toolbarDivider} />
          <span className={styles.crumb}>
            <MaskIcon name={current.icon} />
            {current.label}
          </span>
        </div>

        <div className={styles.scroll}>
          {page === "home" ? <HomePage onOpen={go} /> : null}
          {page === "overview" ? <OverviewPage log={log} onOpen={go} /> : null}
          {page === "getting-started" && resultsFor && results[resultsFor] ? (
            <ChapterResultsPage
              title={CHAPTERS.find((chapter) => chapter.id === resultsFor)?.title ?? ""}
              results={results[resultsFor]}
              onStartOver={() => onGuided(resultsFor)}
            />
          ) : null}
          {page === "getting-started" && !resultsOpen ? (
            <GettingStartedPage
              chapters={chapters}
              onStart={(chapter) => {
                // A chapter with a sequence is started, or opened on its results once it has been taken.
                if (SEQUENCES[chapter.id]) {
                  if (results[chapter.id]) setResultsFor(chapter.id);
                  else onGuided(chapter.id);
                } else setMessage(`Starting: ${chapter.title}`);
              }}
            />
          ) : null}
          {page === "explore" ? <ExplorePage onEnter={onExplore} /> : null}
          {page === "collaborate" ? (
            <CollaboratePage threads={threads} onEnter={onCollaborate} onOpen={onOpenThread} />
          ) : null}
          {page === "test" ? (
            <TestPage
              focus={focus}
              log={log.filter((entry) => entry.kind === "Test")}
              results={results[MIXED_TEST_ID] ?? null}
              onStart={onTest}
            />
          ) : null}
          {page === "scenarios" ? (
            <ScenariosPage
              scenarios={scenarios}
              onStart={(scenario) => {
                if (PLAYABLE_SCENARIOS[scenario.id]) onScenario(scenario.id);
                else setMessage(`Starting scenario: ${scenario.title}`);
              }}
            />
          ) : null}

          {message ? <p className={styles.message}>{message}</p> : null}
        </div>
      </div>
    </div>
  );
}
