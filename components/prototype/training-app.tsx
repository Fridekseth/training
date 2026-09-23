"use client";

/**
 * The training section of the Orkla monitoring app, as drawn in Figma:
 * a menu that moves between the training modes, and the five screens it opens.
 * Everything that exists in OpenBridge is an OpenBridge component; the drawings
 * and the teal cards are from the design file.
 */

import { useState } from "react";
import { ObcTopBar } from "@oicl/openbridge-webcomponents-react/components/top-bar/top-bar";
import { ObcNavigationItem } from "@oicl/openbridge-webcomponents-react/components/navigation-item/navigation-item";
import { ObcIconButton } from "@oicl/openbridge-webcomponents-react/components/icon-button/icon-button";
import { ObcRichButton } from "@oicl/openbridge-webcomponents-react/components/rich-button/rich-button";
import { ObcAlertButton } from "@oicl/openbridge-webcomponents-react/components/alert-button/alert-button";
import { ObcClock } from "@oicl/openbridge-webcomponents-react/components/clock/clock";
import { ObiSearch } from "@oicl/openbridge-webcomponents-react/icons/icon-search";
import { ObiPanelLeftClose } from "@oicl/openbridge-webcomponents-react/icons/icon-panel-left-close";
import { ObiArrowLeftGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-arrow-left-google";
import { ObiArrowRightGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-arrow-right-google";
import { ObiChevronRightGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-chevron-right-google";
import { IconButtonVariant } from "@oicl/openbridge-webcomponents/dist/components/icon-button/icon-button";
import { RichButtonDirection } from "@oicl/openbridge-webcomponents/dist/components/rich-button/rich-button";
import { ObcAlertButtonType } from "@oicl/openbridge-webcomponents/dist/components/alert-button/alert-button";
import { useRef } from "react";
import { AppMenu } from "./app-menu";
import { MainInterface } from "./main-interface";
import { RunThrough, TrainingSplash } from "./run-through";
import { MaskIcon, PageIntro, Piece, SymbolCard } from "./pieces";
import { TrainingRichButton } from "./training-rich-button";
import { ChapterTable, TrainingLogTable } from "./training-table";
import {
  CHAPTERS,
  HOME,
  PAGES,
  type PageDef,
  type PageId,
  SCENARIOS,
  TRAINING_LOG,
} from "./training-data";

/** Which layer of the prototype is on top. */
export type Layer = "app" | "training" | "splash" | "run-through";

/** Which experiment's version of the screens to show. */
export type Variant = "second-test" | "third-test" | "fourth-test";

const ACTIVE_COLOR = "var(--on-amplified-active-color, #1d3c67)";
const NEUTRAL_COLOR = "var(--on-flat-neutral-color, #535353)";

function MenuItem({
  page,
  active,
  onSelect,
}: {
  page: PageDef;
  active: boolean;
  onSelect: (id: PageId) => void;
}) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <ObcNavigationItem
        label={page.label}
        checked={active}
        hasIcon
        onClick={() => onSelect(page.id)}
      >
        <MaskIcon
          slot="icon"
          name={page.icon}
          style={{ color: active ? ACTIVE_COLOR : NEUTRAL_COLOR }}
        />
      </ObcNavigationItem>
      {page.badge ? (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 1,
            top: 1,
            width: 8,
            height: 8,
            borderRadius: 100,
            background: "var(--base-teal-500, #005d61)",
            border: "1px solid var(--border-silhouette-color, #f0f0f0)",
          }}
        />
      ) : null}
    </div>
  );
}

function HomePage({ onOpen }: { onOpen: (id: PageId) => void }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <PageIntro title="Training">
          Training lets you explore the system in a safe environment. Changes and
          actions made while training is activated will not affect the system. It is
          recomended to keep training consistent in order to increase saftety and
          ensure routines are handled correctly.
        </PageIntro>

        <SymbolCard
          style={{ width: 384, height: 201, boxShadow: "0 4px 4px rgba(0,0,0,0.25)" }}
        >
          <Piece src="home-piece-20" left={-28} top={103} width={140.5} height={72.666} />
          <Piece src="home-piece-17" left={84} top={17} width={114.732} height={78.673} />
          <Piece src="home-piece-19" left={224} top={-13} width={98.947} height={102.381} />
          <Piece src="home-piece-30" left={26} top={190} width={98.947} height={102.381} />
          <Piece src="home-piece-18" left={-12} top={-11} width={69.464} height={90.982} />
          <Piece src="home-piece-13" left={261} top={96} width={64.457} height={89} />
          <Piece src="home-piece-27" left={141} top={119} width={88.387} height={91.252} />
          <Piece src="home-piece-26" left={334} top={23} width={99.312} height={70.448} />
          <Piece src="home-piece-20" left={342} top={147} width={140.5} height={72.666} />
        </SymbolCard>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 8,
          marginTop: 24,
        }}
      >
        {PAGES.map((page) => (
          <ObcRichButton
            key={page.id}
            label={page.label}
            description={page.description}
            hasLeadingIcon
            hasTrailingIcon
            fullWidth
            direction={RichButtonDirection.Horizontal}
            onClick={() => onOpen(page.id)}
          >
            <MaskIcon slot="leading-icon" name={page.icon} />
            <ObiChevronRightGoogle slot="trailing-icon" />
          </ObcRichButton>
        ))}
      </div>
    </>
  );
}

/**
 * The cards as they were built in the second experiment: the stock OpenBridge
 * rich button with an illustration slotted in, and a hand-made badge.
 */
function OverviewCardsSecondTest() {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
      <div style={{ position: "relative", flex: "1 1 340px" }}>
        <ObcRichButton
          label="Recurrent training"
          description="Complete the recurrent training course within the 31.08 to keep you certification."
          hasLeadingIcon
          hasTrailingIcon
          fullWidth
          direction={RichButtonDirection.Horizontal}
        >
          <SymbolCard slot="leading-icon" size={90}>
            <Piece src="overview-group13" left={16} top={8} width={54} height={74.561} />
          </SymbolCard>
          <ObiChevronRightGoogle slot="trailing-icon" />
        </ObcRichButton>
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 16,
            height: 16,
            borderRadius: 2,
            background: "var(--element-active-color, #1f1f1f)",
            color: "#fff",
            fontSize: 11,
            lineHeight: "16px",
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          i
        </span>
      </div>

      <div style={{ flex: "1 1 340px" }}>
        <ObcRichButton
          label="Recommended practice"
          description="There has not been a critical alarm in 4 months. Complete a scenario to practice routines!"
          hasLeadingIcon
          hasTrailingIcon
          fullWidth
          direction={RichButtonDirection.Horizontal}
        >
          <SymbolCard slot="leading-icon" size={90}>
            <Piece src="overview-group8" left={7.5} top={10} width={73} height={75.532} />
          </SymbolCard>
          <ObiChevronRightGoogle slot="trailing-icon" />
        </ObcRichButton>
      </div>
    </div>
  );
}

/** The same cards built from the custom rich button of the third experiment. */
function OverviewCardsThirdTest({ onOpen }: { onOpen: (id: PageId) => void }) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 340px" }}>
        <TrainingRichButton
          label="Recurrent training"
          description="Complete the recurrent training course within the 31.08 to keep you certification."
          badge
          onClick={() => onOpen("getting-started")}
          illustration={
            <Piece src="overview-group13" left={16} top={8} width={54} height={74.561} />
          }
        />
      </div>

      <div style={{ flex: "1 1 340px" }}>
        <TrainingRichButton
          label="Recommended practice"
          description="There has not been a critical alarm in 4 months. Complete a scenario to practice routines!"
          onClick={() => onOpen("scenarios")}
          illustration={
            <Piece src="overview-group8" left={7.5} top={10} width={73} height={75.532} />
          }
        />
      </div>
    </div>
  );
}

function OverviewPage({
  onOpen,
  variant,
}: {
  onOpen: (id: PageId) => void;
  variant: Variant;
}) {
  return (
    <>
      <PageIntro title="Welcome back!" />

      {variant === "second-test" ? (
        <OverviewCardsSecondTest />
      ) : (
        <OverviewCardsThirdTest onOpen={onOpen} />
      )}

      <p style={{ margin: "24px 0 8px", fontSize: 16, fontWeight: 600 }}>Training log:</p>
      <TrainingLogTable entries={TRAINING_LOG} />
    </>
  );
}

function GettingStartedPage({ onStart }: { onStart: (chapter: string) => void }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <PageIntro title="Getting started">
          The onboarding sequence gives an introduction to the system, and all
          features. The whole course takes about 30 minutes to complete. You can
          choose weather to compleate the whole in one go, or take brakes. You can
          leave the course at any time, and your progress will be saved.
        </PageIntro>
        <SymbolCard
          style={{ width: 384, height: 201, boxShadow: "0 4px 4px rgba(0,0,0,0.25)" }}
        >
          <Piece
            src="getting-started-book"
            left={77}
            top={22}
            width={229.667}
            height={157.486}
          />
        </SymbolCard>
      </div>

      <div style={{ marginTop: 24 }}>
        <ChapterTable chapters={CHAPTERS} onStart={(chapter) => onStart(chapter.title)} />
      </div>
    </>
  );
}

function ScenariosPage({ onStart }: { onStart: (title: string) => void }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <PageIntro title="Scenarios">
          Practice critical situations in simulated scenarios. It is recommended to
          practice scenarios on a regular basis in order to keep routines in case of
          critical situations.
        </PageIntro>
        <SymbolCard
          style={{ width: 384, height: 201, boxShadow: "0 4px 4px rgba(0,0,0,0.25)" }}
        >
          <Piece
            src="scenarios-alarm-clock"
            left={137}
            top={25}
            width={110.133}
            height={152.068}
          />
        </SymbolCard>
      </div>

      <div style={{ marginTop: 24 }}>
        <ChapterTable chapters={SCENARIOS} onStart={(chapter) => onStart(chapter.title)} />
      </div>
    </>
  );
}

function ExplorePage({ onEnter }: { onEnter: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap",
      }}
    >
      <PageIntro title="Explore" width={493}>
        When explore mode is activated, you can click around in the interface without
        controlling the system. You can add comments to your team, and read others tips
        and trics.
      </PageIntro>

      <div style={{ width: 240 }}>
        <ObcRichButton
          label="Go to explore mode"
          description="This function is only available when system is not in use."
          hasTrailingIcon
          fullWidth
          direction={RichButtonDirection.Horizontal}
          onClick={onEnter}
        >
          <ObiChevronRightGoogle slot="trailing-icon" />
        </ObcRichButton>
      </div>
    </div>
  );
}

const PAGE_IDS: PageId[] = ["home", ...PAGES.map((item) => item.id)];

/** The screen named in the address bar, so a single screen can be linked to. */
function pageFromHash(): PageId {
  const fromHash = window.location.hash.replace("#", "") as PageId;
  return PAGE_IDS.includes(fromHash) ? fromHash : "home";
}

export function TrainingApp({
  variant = "fourth-test",
  initialPage,
  /** Only the standalone page writes the screen into the address bar. */
  syncHash = false,
  initialLayer,
}: {
  variant?: Variant;
  initialPage?: PageId;
  syncHash?: boolean;
  /** Which layer an embedded copy opens on. */
  initialLayer?: Layer;
} = {}) {
  const start = initialPage ?? (syncHash ? pageFromHash() : "home");
  const [page, setPage] = useState<PageId>(start);
  const [history, setHistory] = useState<PageId[]>(() => [start]);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  /** Which layer is on top: the app itself, the training section, or a run-through. */
  const [layer, setLayer] = useState<Layer>(() => {
    if (variant !== "fourth-test") return "training";
    if (!syncHash) return initialLayer ?? "app";
    const fromHash = window.location.hash.replace("#", "");
    if (fromHash === "run-through" || fromHash === "training") return fromHash;
    return initialLayer ?? "app";
  });
  const frame = useRef<HTMLDivElement>(null);

  const go = (id: PageId) => {
    const next = [...history.slice(0, step + 1), id];
    setHistory(next);
    setStep(next.length - 1);
    setPage(id);
    setMessage(null);
    if (syncHash) window.history.replaceState(null, "", `#${id}`);
  };

  const move = (delta: number) => {
    const target = step + delta;
    if (target < 0 || target >= history.length) return;
    setStep(target);
    setPage(history[target]);
    setMessage(null);
    if (syncHash) window.history.replaceState(null, "", `#${history[target]}`);
  };

  const current: PageDef = page === "home" ? HOME : PAGES.find((p) => p.id === page)!;

  const trainingSection = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--container-section-color, #f0f0f0)",
        color: "var(--element-active-color, #1f1f1f)",
        fontSize: 16,
      }}
    >
      <ObcTopBar appTitle="Orkla monitorering" pageName="Training" showClock showDimmingButton>
        <ObcAlertButton slot="alerts" type={ObcAlertButtonType.Flat} />
        <ObcClock slot="clock" date="2026-09-22T14:30:12Z" showSeconds timeZoneOffsetHours={0} />
      </ObcTopBar>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <nav
          style={{
            width: 211,
            flexShrink: 0,
            // The design draws 16px here; 12 keeps "Getting started" from clipping.
            padding: "0 12px",
            borderRight: "1px solid var(--border-divider-color, #ddd)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 0",
            }}
          >
            <ObcIconButton variant={IconButtonVariant.flat}>
              <ObiPanelLeftClose />
            </ObcIconButton>
            <ObcIconButton variant={IconButtonVariant.flat}>
              <ObiSearch />
            </ObcIconButton>
          </div>

          <div style={{ paddingBottom: 16 }}>
            <MenuItem page={HOME} active={page === "home"} onSelect={go} />
          </div>
          <span
            style={{
              height: 1,
              background: "var(--border-divider-color, #ddd)",
            }}
          />
          <div style={{ paddingTop: 16, display: "flex", flexDirection: "column" }}>
            {PAGES.map((item) => (
              <MenuItem
                key={item.id}
                page={item}
                active={page === item.id}
                onSelect={go}
              />
            ))}
          </div>
        </nav>

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              height: 48,
              display: "flex",
              alignItems: "center",
              padding: "0 4px",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <ObcIconButton
                variant={IconButtonVariant.flat}
                cornerRight
                disabled={step === 0}
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
            <span
              style={{
                width: 1,
                height: 16,
                background: "var(--border-divider-color, #ddd)",
              }}
            />
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                color: "var(--on-flat-active-color, #3d3d3d)",
              }}
            >
              <MaskIcon name={current.icon} />
              {current.label}
            </span>
          </div>

          <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: 48 }}>
            {page === "home" ? <HomePage onOpen={go} /> : null}
            {page === "overview" ? <OverviewPage onOpen={go} variant={variant} /> : null}
            {page === "getting-started" ? (
              <GettingStartedPage
                onStart={(chapter) => {
                  if (variant === "fourth-test" && chapter === "Topping") {
                    setLayer("splash");
                    setMessage(null);
                  } else {
                    setMessage(`Starting: ${chapter}`);
                  }
                }}
              />
            ) : null}
            {page === "explore" ? (
              <ExplorePage onEnter={() => setMessage("Explore mode would open here")} />
            ) : null}
            {page === "scenarios" ? (
              <ScenariosPage onStart={(title) => setMessage(`Starting scenario: ${title}`)} />
            ) : null}

            {message ? (
              <p
                style={{
                  marginTop: 24,
                  fontSize: 14,
                  color: "var(--element-neutral-color, #535353)",
                }}
              >
                {message}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  // Older variants are the training section on its own, as those experiments were.
  if (variant !== "fourth-test") return trainingSection;

  return (
    <div ref={frame} style={{ position: "relative", height: "100%", overflow: "hidden" }}>
      {layer === "training" ? (
        trainingSection
      ) : (
        <>
          <MainInterface />
          <AppMenu containerRef={frame} onOpenTraining={() => setLayer("training")} />
        </>
      )}

      {layer === "splash" ? (
        <TrainingSplash onDone={() => setLayer("run-through")} />
      ) : null}

      {layer === "run-through" ? (
        <RunThrough frame={frame} onExit={() => setLayer("app")} />
      ) : null}
    </div>
  );
}
