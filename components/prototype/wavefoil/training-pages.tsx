"use client";

/**
 * The five pages of the Wavefoil training: Home, Overview, Getting started,
 * Explore and Scenarios. Text and numbers are the design's; the pieces are the
 * isometric drawings the Orkla training already uses, placed as this design
 * places them at its smaller size.
 */

import type { ReactNode } from "react";
import { ObcElevatedCard } from "@oicl/openbridge-webcomponents-react/components/elevated-card/elevated-card";
import { ObcElevatedCardSize } from "@oicl/openbridge-webcomponents/dist/components/elevated-card/elevated-card";
import { ObiChevronRightGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-chevron-right-google";
import { MaskIcon, Piece, SymbolCard } from "../pieces";
import { TrainingRichButton } from "../training-rich-button";
import type { PageId } from "../training-data";
import { CHAPTERS, PAGES, SCENARIOS, TRAINING_LOG } from "./training-data";
import { ChapterTable, TrainingLogTable } from "./training-tables";
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
      <Piece src="home-piece-20" left={-24} top={77.8} width={100.3} height={51.87} />
      <Piece src="home-piece-17" left={55.95} top={16.4} width={81.9} height={56.16} />
      <Piece src="home-piece-19" left={155.9} top={-5} width={70.63} height={73.09} />
      <Piece src="home-piece-30" left={14.55} top={139.9} width={70.64} height={73.09} />
      <Piece src="home-piece-18" left={-12.58} top={-3.57} width={49.59} height={64.95} />
      <Piece src="home-piece-13" left={182.3} top={72.8} width={46.01} height={63.53} />
      <Piece src="home-piece-27" left={96.64} top={89.23} width={63.1} height={65.14} />
      <Piece src="home-piece-26" left={234.4} top={20.7} width={70.9} height={50.29} />
      <Piece src="home-piece-20" left={240.1} top={109.2} width={100.3} height={51.87} />
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

export function GettingStartedPage({ onStart }: { onStart: (title: string) => void }) {
  return (
    <div className={styles.page} style={{ paddingInline: 48 }}>
      <div className={styles.introRow}>
        <Intro title="Getting started" width={305} top={16}>
          The onboarding sequence gives an introduction to the system, and all
          features. The whole course takes about 30 minutes to complete. You can
          choose whether to complete the whole in one go, or take breaks. You can
          leave the course at any time, and your progress will be saved.
        </Intro>
        <Plate width={283.75}>
          <Piece src="getting-started-book" left={56.9} top={16.26} width={169.71} height={116.37} />
        </Plate>
      </div>

      <div className={styles.tableBlock} style={{ marginTop: 32 }}>
        <ChapterTable chapters={CHAPTERS} onStart={(chapter) => onStart(chapter.title)} />
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
              <Piece src="overview-group13" left={16} top={8} width={54} height={74.561} />
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
          <Piece src="scenarios-alarm-clock" left={97.75} top={13} width={88.24} height={121.84} />
        </Plate>
      </div>

      <div className={styles.tableBlock} style={{ marginTop: 32 }}>
        <ChapterTable chapters={SCENARIOS} onStart={(chapter) => onStart(chapter.title)} />
      </div>
    </div>
  );
}
