"use client";

/**
 * The advice list that opens from the top bar. The library has the items but
 * not the panel around them, so the header, list and footer are built here.
 */

import { useState } from "react";
import { ObcMessageMenuItem } from "@oicl/openbridge-webcomponents-react/components/message-menu-item/message-menu-item";
import { ObiNotificationAdviceActive } from "@oicl/openbridge-webcomponents-react/icons/icon-notification-advice-active";
import { ObcButton } from "@oicl/openbridge-webcomponents-react/components/button/button";
import { ObiNotificationAdvice } from "@oicl/openbridge-webcomponents-react/icons/icon-notification-advice";
import { ButtonVariant } from "@oicl/openbridge-webcomponents/dist/components/button/button";
import styles from "./pages.module.css";

type Advice = {
  id: string;
  title: string;
  description: string;
  action?: string;
};

const ADVICE: Advice[] = [
  {
    id: "feedback-motion",
    title: "Feedback",
    description:
      "You have used the foils for 5 minutes. The results show a reduction in vessel motion of about 12%.",
  },
  {
    id: "decision",
    title: "Decision support",
    description:
      "Try the wings for 5 minutes without changing speed and monitor consumption and check the pitching.",
    action: "Deploy foils",
  },
  {
    id: "feedback-fuel",
    title: "Feedback",
    description: "The foil use on today's trip saved about 5% fuel.",
  },
];

export function AdviceMenu({
  onClose,
  onDeploy,
}: {
  onClose: () => void;
  onDeploy: () => void;
}) {
  const [items, setItems] = useState(ADVICE);
  const [open, setOpen] = useState<Record<string, boolean>>({
    "feedback-motion": true,
    decision: true,
  });
  const dismiss = (id: string) => setItems((all) => all.filter((item) => item.id !== id));

  return (
    <div className={styles.menuLayer}>
      <div className={styles.scrim} onClick={onClose} aria-hidden="true" />
      <div className={styles.adviceMenu} role="dialog" aria-label="Advice">
        <div className={styles.adviceHead}>
          <h2 className={styles.adviceHeading}>Advice</h2>
          <ObcButton variant={ButtonVariant.flat} onClick={() => setItems([])}>
            Clear list
          </ObcButton>
        </div>
        <div className={styles.adviceItems}>
          {items.length === 0 ? <p className={styles.adviceEmpty}>No advice right now.</p> : null}
          {items.map((item) => (
            // The library's advice item is this message item with the green advice
            // icon in it. The advice item cannot stack its buttons under the text,
            // which the design does at this width, so the message item is used
            // directly. It lists the secondary action first, so the labels are
            // set to read "Deploy foils" then "Dismiss".
            <ObcMessageMenuItem
              key={item.id}
              title={item.title}
              description={item.description}
              day="Yesterday"
              time="09:12:34"
              hasPrimaryIcon
              stackVertical
              open={open[item.id] ?? false}
              primaryActionLabel={item.action ? "Dismiss" : ""}
              secondaryActionLabel={item.action ?? ""}
              onMessageClick={() =>
                setOpen((all) => ({ ...all, [item.id]: !all[item.id] }))
              }
              onPrimaryActionClick={() => dismiss(item.id)}
              onSecondaryActionClick={() => {
                onDeploy();
                dismiss(item.id);
                onClose();
              }}
            >
              <ObiNotificationAdviceActive
                slot="primary-icon"
                style={{ color: "var(--instrument-enhanced-secondary-color)" }}
              />
            </ObcMessageMenuItem>
          ))}
        </div>
        <div className={styles.adviceFoot}>
          <ObcButton variant={ButtonVariant.flat} showLeadingIcon>
            <ObiNotificationAdvice slot="leading-icon" style={{ color: "var(--instrument-enhanced-secondary-color)" }} />
            All advice
          </ObcButton>
        </div>
      </div>
    </div>
  );
}
