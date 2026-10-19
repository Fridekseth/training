"use client";

/**
 * The five pages of the Wavefoil training: Home, Overview, Learning,
 * Explore and Scenarios. Text and numbers are the design's; the pieces are the
 * isometric drawings made for this prototype, each a sheet that is cropped to
 * the plate or tile it sits on.
 */

import type { ReactNode } from "react";
import { ObcElevatedCard } from "@oicl/openbridge-webcomponents-react/components/elevated-card/elevated-card";
import { ObcElevatedCardSize } from "@oicl/openbridge-webcomponents/dist/components/elevated-card/elevated-card";
import { ObiChevronRightGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-chevron-right-google";
import { MaskIcon, Piece, SymbolCard } from "../pieces";
import { TrainingRichButton } from "../training-rich-button";
import type { Chapter, PageId } from "../training-data";
import { PAGES, SCENARIOS, TRAINING_LOG } from "./training-data";
import { ChapterTable, ResultsTable, TrainingLogTable } from "./training-tables";
import type { TestResult } from "./guided-data";
import { CommentList } from "./comment-list";
import type { Thread } from "./explore-data";
import styles from "./training.module.css";

/** The size the design sets card descriptions in on this screen. */
const SMALL_TEXT = 11.5;

/** The teal plate the drawings sit on: smaller, softer than the Orkla one. */
function Plate({ children, width }: { children: ReactNode; width: number }) {
  return (
    <SymbolCard
      style={{
        width,
        height: 148.5,
        flex: `0 1 ${width}px`,
        borderRadius: 4.434,
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      {children}
    </SymbolCard>
  );
}

/** The collage on the home and explore pages. */
function Collage() {
  return (
    <Plate width={284}>
      {/* The drawing is a larger sheet, cropped to the plate the way a cover fit does it. */}
      <Piece src="wf-home" left={0} top={-1.55} width={284} height={151.6} />
    </Plate>
  );
}

function Intro({
  title,
  children,
  width,
  top = 0,
}: {
  title: string;
  children?: ReactNode;
  width: number;
  /** The design sets some headings lower than others. */
  top?: number;
}) {
  return (
    // Squeezed a little harder than the plate, which is how the design sizes the
    // two once the side menu is open.
    <div className={styles.intro} style={{ flex: `0 1.27 ${width}px`, paddingTop: top }}>
      <p className={styles.introTitle}>{title}</p>
      {children ? <p className={styles.introText}>{children}</p> : null}
    </div>
  );
}

export function HomePage({ onOpen }: { onOpen: (id: PageId) => void }) {
  return (
    <div className={styles.page} style={{ paddingInline: 50 }}>
      <div className={`${styles.introRow} ${styles.introRowTall}`}>
        <Intro title="Training" width={299}>
          Training lets you explore the system in a safe environment. Changes and
          actions made while training is activated will not affect the system.
          <br />
          <br />
          It is recommended to keep training consistent in order to increase safety
          and ensure routines are handled correctly.
        </Intro>
        <Collage />
      </div>

      <div className={styles.cardGrid}>
        {PAGES.map((page) => (
          <ObcElevatedCard
            className={styles.homeCard}
            key={page.id}
            size={ObcElevatedCardSize.MultiLine}
            hasLeadingIcon
            hasTrailingIcon
            onClick={() => onOpen(page.id)}
          >
            <MaskIcon slot="leading-icon" name={page.icon} />
            <div slot="label">{page.label}</div>
            <div slot="description">{page.description}</div>
            <ObiChevronRightGoogle slot="trailing-icon" />
          </ObcElevatedCard>
        ))}
      </div>
    </div>
  );
}

export function OverviewPage({ onOpen }: { onOpen: (id: PageId) => void }) {
  return (
    <div className={styles.page} style={{ paddingInline: 48 }}>
      <p className={styles.heading}>Welcome back!</p>

      <div className={styles.overviewCards}>
        <TrainingRichButton
          label="Recurrent training"
          description="Complete the recurrent training course within the 31.08 to keep you certification."
          descriptionSize={SMALL_TEXT}
          onClick={() => onOpen("getting-started")}
        />
        <TrainingRichButton
          label="Recommended practice"
          description="There has not been a critical alarm in 4 months. Complete a scenario to practice routines!"
          descriptionSize={SMALL_TEXT}
          onClick={() => onOpen("scenarios")}
        />
      </div>

      <p className={styles.heading} style={{ marginTop: 32 }}>
        Training log:
      </p>
      <div className={styles.tableBlock}>
        <TrainingLogTable entries={TRAINING_LOG} />
      </div>
    </div>
  );
}

export function GettingStartedPage({
  chapters,
  onStart,
}: {
  chapters: Chapter[];
  onStart: (chapter: Chapter) => void;
}) {
  return (
    <div className={styles.page} style={{ paddingInline: 48 }}>
      <div className={styles.introRow}>
        <Intro title="Learning" width={305} top={16}>
          The onboarding sequence gives an introduction to the system, and all
          features. The whole course takes about 30 minutes to complete. You can
          choose whether to complete the whole in one go, or take breaks. You can
          leave the course at any time, and your progress will be saved.
        </Intro>
        <Plate width={283.75}>
          <Piece src="wf-learning" left={0} top={-17.83} width={283.75} height={184.15} />
        </Plate>
      </div>

      <div className={styles.tableBlock} style={{ marginTop: 32 }}>
        <ChapterTable chapters={chapters} onStart={onStart} gettingStarted />
      </div>
    </div>
  );
}

/** A chapter's results: what the learner answered in its test, and a way to take it again. */
export function ChapterResultsPage({
  title,
  results,
  onStartOver,
}: {
  title: string;
  results: TestResult[];
  onStartOver: () => void;
}) {
  return (
    <div className={styles.page} style={{ paddingInline: 48 }}>
      <div className={styles.introRow} style={{ alignItems: "center" }}>
        <Intro title={title} width={305}>
          This chapter gives an overview of the screens for the topping stations.
        </Intro>
        <div style={{ flex: "0 1 240px" }}>
          <TrainingRichButton
            label="Start from scratch"
            description="Start from the beginning."
            descriptionSize={SMALL_TEXT}
            onClick={onStartOver}
          />
        </div>
      </div>

      <p className={styles.heading} style={{ marginTop: 20 }}>
        Results:
      </p>
      <div className={styles.tableBlock}>
        <ResultsTable results={results} />
      </div>
    </div>
  );
}

export function ExplorePage({
  threads,
  onEnter,
  onOpen,
}: {
  threads: Thread[];
  onEnter: () => void;
  onOpen: (id: string) => void;
}) {
  return (
    <div className={styles.page} style={{ paddingInline: 50 }}>
      <div className={styles.introRow} style={{ alignItems: "center" }}>
        <Intro title="Explore" width={260}>
          When explore mode is activated, you can click around in the interface
          without controlling the system. You can add comments to your team, and
          read others tips and tricks.
        </Intro>
        <div style={{ flex: "0 1 322px" }}>
          <TrainingRichButton
            label="Start explore mode"
            description="This function is only available when system is not in use."
            descriptionSize={SMALL_TEXT}
            onClick={onEnter}
            illustration={
              <Piece src="wf-explore" left={-9} top={10.9} width={105.2} height={68.3} />
            }
          />
        </div>
      </div>

      <p className={styles.heading} style={{ marginTop: 20 }}>
        Comments:
      </p>
      <CommentList threads={threads} onOpen={onOpen} />
    </div>
  );
}

export function ScenariosPage({ onStart }: { onStart: (title: string) => void }) {
  return (
    <div className={styles.page} style={{ paddingInline: 48 }}>
      <div className={styles.introRow}>
        <Intro title="Scenarios" width={305} top={16}>
          Practice critical situations in simulated scenarios. It is recommended to
          practice scenarios on a regular basis in order to keep routines in case
          of critical situations.
        </Intro>
        <Plate width={283.75}>
          <Piece src="wf-scenarios" left={0} top={-17.83} width={283.75} height={184.15} />
        </Plate>
      </div>

      <div className={styles.tableBlock} style={{ marginTop: 32 }}>
        <ChapterTable chapters={SCENARIOS} onStart={(chapter) => onStart(chapter.title)} />
      </div>
    </div>
  );
}
