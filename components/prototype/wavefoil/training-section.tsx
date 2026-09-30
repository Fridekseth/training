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
import { HOME, type PageDef, type PageId } from "../training-data";
import { PAGES } from "./training-data";
import {
  ExplorePage,
  GettingStartedPage,
  HomePage,
  OverviewPage,
  ScenariosPage,
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
  page: PageDef;
  active: boolean;
  iconOnly: boolean;
  onSelect: (id: PageId) => void;
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

export function TrainingSection() {
  const [page, setPage] = useState<PageId>("home");
  const [history, setHistory] = useState<PageId[]>(["home"]);
  const [step, setStep] = useState(0);
  const [folded, setFolded] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const go = (id: PageId) => {
    if (id === page) return;
    // The pages are drawn for the folded menu, so leaving Home folds it away.
    if (id !== "home") setFolded(true);
    const next = [...history.slice(0, step + 1), id];
    setHistory(next);
    setStep(next.length - 1);
    setPage(id);
    setMessage(null);
  };

  const move = (delta: number) => {
    const target = step + delta;
    if (target < 0 || target >= history.length) return;
    setStep(target);
    setPage(history[target]);
    setMessage(null);
  };

  const current: PageDef = page === "home" ? HOME : PAGES.find((p) => p.id === page)!;

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
          <span className={styles.toolbarDivider} />
          <span className={styles.crumb}>
            <MaskIcon name={current.icon} />
            {current.label}
          </span>
        </div>

        <div className={styles.scroll}>
          {page === "home" ? <HomePage onOpen={go} /> : null}
          {page === "overview" ? <OverviewPage onOpen={go} /> : null}
          {page === "getting-started" ? (
            <GettingStartedPage onStart={(title) => setMessage(`Starting: ${title}`)} />
          ) : null}
          {page === "explore" ? (
            <ExplorePage onEnter={() => setMessage("Explore mode would open here")} />
          ) : null}
          {page === "scenarios" ? (
            <ScenariosPage onStart={(title) => setMessage(`Starting scenario: ${title}`)} />
          ) : null}

          {message ? <p className={styles.message}>{message}</p> : null}
        </div>
      </div>
    </div>
  );
}
