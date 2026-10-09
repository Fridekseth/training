"use client";

import { useEffect, useState } from "react";
import { ObcTopBar } from "@oicl/openbridge-webcomponents-react/components/top-bar/top-bar";
import { ObcAlertButton } from "@oicl/openbridge-webcomponents-react/components/alert-button/alert-button";
import { ObcClock } from "@oicl/openbridge-webcomponents-react/components/clock/clock";
import { ObcNotificationButton } from "@oicl/openbridge-webcomponents-react/components/notification-button/notification-button";
import { ObiNotificationAdvice } from "@oicl/openbridge-webcomponents-react/icons/icon-notification-advice";
import { ObiNotificationAdviceActive } from "@oicl/openbridge-webcomponents-react/icons/icon-notification-advice-active";
import { NotificationButtonStyle } from "@oicl/openbridge-webcomponents/dist/components/notification-button/notification-button";
import { ObcAlertButtonType } from "@oicl/openbridge-webcomponents/dist/components/alert-button/alert-button";

/** The time, ticking each second. The clock component shows the date it is given. */
function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);
  return now;
}

/**
 * The top bar of the Wavefoil screens. It carries the alert and the advice
 * buttons everywhere, in the training section as well.
 */
export function WavefoilTopBar({
  pageName,
  palette,
  onDim,
  menuOpen,
  onMenu,
  adviceOpen = false,
  onAdvice,
  onAlerts,
}: {
  pageName: string;
  palette: string;
  onDim: () => void;
  menuOpen: boolean;
  onMenu: () => void;
  /** The advice list under the bar is open. */
  adviceOpen?: boolean;
  onAdvice?: () => void;
  onAlerts?: () => void;
}) {
  const now = useNow();

  return (
    // A plain wrapper, so explore mode can find the bar to comment on.
    <div data-comment="Top bar" style={{ position: "relative", zIndex: 2 }}>
      <ObcTopBar
        appTitle="Wavefoil"
        pageName={pageName}
        showClock
        showDimmingButton
        dimmingButtonActivated={palette !== "day"}
        onDimmingButtonClicked={onDim}
        menuButtonActivated={menuOpen}
        onMenuButtonClicked={onMenu}
      >
        {/* The alarms and the advice are reachable from every screen, the training section included. */}
        <span slot="alerts" style={{ display: "flex", alignItems: "center" }}>
          <ObcAlertButton data-comment="Alert button" type={ObcAlertButtonType.Flat} onClick={onAlerts} />
          <ObcNotificationButton
            data-comment="Advice button"
            isActive={adviceOpen}
            buttonStyle={NotificationButtonStyle.Normal}
            aria-label="Advice"
            onObcClick={onAdvice}
          >
            {adviceOpen ? (
              <ObiNotificationAdviceActive slot="icon" />
            ) : (
              <ObiNotificationAdvice slot="icon" />
            )}
          </ObcNotificationButton>
        </span>
        <ObcClock
          data-comment="Clock"
          slot="clock"
          date={now.toISOString()}
          showSeconds
          // The clock shows UTC plus an offset, so the offset is the viewer's own.
          timeZoneOffsetHours={-now.getTimezoneOffset() / 60}
        />
      </ObcTopBar>
    </div>
  );
}
