"use client";

/**
 * The application's own menu. It stays out of the way while the operator works
 * and slides in when the pointer reaches the edge of the screen, which is how
 * the design keeps the whole display available for the line.
 */

import { useEffect, useRef, useState } from "react";
import { ObcTopBar } from "@oicl/openbridge-webcomponents-react/components/top-bar/top-bar";
import { ObcNavigationItem } from "@oicl/openbridge-webcomponents-react/components/navigation-item/navigation-item";
import { ObcAlertButton } from "@oicl/openbridge-webcomponents-react/components/alert-button/alert-button";
import { ObcClock } from "@oicl/openbridge-webcomponents-react/components/clock/clock";
import { ObcAlertButtonType } from "@oicl/openbridge-webcomponents/dist/components/alert-button/alert-button";
import { MaskIcon } from "./pieces";
import styles from "./app-menu.module.css";

/** How close to the edge the pointer has to come, in px. */
const EDGE = 24;
/** How far past the menu the pointer has to travel before it hides again. */
const KEEP = 48;

const LINES = [
  { id: "topping", label: "Topping", icon: "topping" },
  { id: "bakeri", label: "Bakeri", icon: "bakeri" },
  { id: "folie", label: "Folie", icon: "folie" },
  { id: "pakking", label: "Pakking", icon: "pakking" },
];

export function AppMenu({
  onOpenTraining,
  containerRef,
}: {
  onOpenTraining: () => void;
  /** The prototype's own frame, so the edge is the screen's edge, not the page's. */
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [open, setOpen] = useState(false);
  const [line, setLine] = useState("topping");
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = containerRef.current;
    if (!frame) return;

    const onMove = (event: PointerEvent) => {
      const box = frame.getBoundingClientRect();
      // An embedded prototype is scaled down, so measure in its own pixels.
      const scale = box.width / frame.offsetWidth || 1;
      const x = (event.clientX - box.left) / scale;
      const y = (event.clientY - box.top) / scale;
      const inside =
        x >= 0 && y >= 0 && x <= frame.offsetWidth && y <= frame.offsetHeight;
      if (!inside) {
        setOpen(false);
        return;
      }

      const width = menu.current?.offsetWidth ?? 270;
      if (x <= EDGE || y <= EDGE) {
        setOpen(true);
      } else if (x > width + KEEP) {
        setOpen(false);
      }
    };

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", () => setOpen(false));
    return () => {
      frame.removeEventListener("pointermove", onMove);
    };
  }, [containerRef]);

  return (
    <div className={`${styles.layer} ${open ? styles.open : ""}`} aria-hidden={!open}>
      <div className={styles.topbar}>
        <ObcTopBar
          appTitle="Orkla monitorering"
          showClock
          showDimmingButton
          menuButtonActivated={open}
          onMenuButtonClicked={() => setOpen((value) => !value)}
        >
          <ObcAlertButton slot="alerts" type={ObcAlertButtonType.Flat} />
          <ObcClock slot="clock" date="2026-09-23T14:30:12Z" showSeconds timeZoneOffsetHours={0} />
        </ObcTopBar>
      </div>

      <nav className={styles.menu} ref={menu}>
        <div className={styles.group}>
          {LINES.map((item) => (
            <ObcNavigationItem
              key={item.id}
              label={item.label}
              checked={line === item.id}
              hasIcon
              onClick={() => setLine(item.id)}
            >
              <MaskIcon
                slot="icon"
                name={item.icon}
                style={{
                  color:
                    line === item.id
                      ? "var(--on-amplified-active-color, #1d3c67)"
                      : "var(--on-flat-neutral-color, #535353)",
                }}
              />
            </ObcNavigationItem>
          ))}
        </div>

        <div className={styles.footer}>
          <ObcNavigationItem label="Alerts" hasIcon>
            <MaskIcon slot="icon" name="nav-scenarios" />
          </ObcNavigationItem>
          <ObcNavigationItem label="Help" hasIcon>
            <MaskIcon slot="icon" name="nav-explore" />
          </ObcNavigationItem>
          <ObcNavigationItem label="Training" hasIcon onClick={onOpenTraining}>
            <MaskIcon slot="icon" name="training" />
          </ObcNavigationItem>
          <ObcNavigationItem label="Settings" hasIcon>
            <MaskIcon slot="icon" name="nav-overview" />
          </ObcNavigationItem>
        </div>
      </nav>
    </div>
  );
}
