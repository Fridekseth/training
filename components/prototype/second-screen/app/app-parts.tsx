"use client";

import type { CSSProperties, ReactNode } from "react";
import { ObcBadge } from "@oicl/openbridge-webcomponents-react/components/badge/badge";
import { ObcRichButton } from "@oicl/openbridge-webcomponents-react/components/rich-button/rich-button";
import { ObiChevronRightGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-chevron-right-google";
import { BadgeType } from "@oicl/openbridge-webcomponents/dist/components/badge/badge";
import { RichButtonDirection } from "@oicl/openbridge-webcomponents/dist/components/rich-button/rich-button";
import styles from "./second-screen-app.module.css";

/** A drawing from a file, in the color of the text around it. */
export function Mask({ src, className = styles.icon }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={className === styles.icon ? className : `${className} ${styles.masked}`}
      style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` } as CSSProperties}
    />
  );
}

export const Divider = () => <div className={styles.divider} role="separator" />;

/** A card that leads to a system or a page: the library's rich button, with an icon in front and a chevron behind. */
export function Card({
  label,
  text,
  icon,
  teal = false,
  badge,
  onClick,
}: {
  label: string;
  text: string;
  icon: ReactNode;
  teal?: boolean;
  /** A number in the top right corner, for what is new. */
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <div className={styles.cardWrap}>
      <ObcRichButton
        className={`${styles.card} ${teal ? styles.tealCard : ""}`}
        onClick={onClick}
        label={label}
        description={text}
        direction={RichButtonDirection.Horizontal}
        hasLeadingIcon
        hasTrailingIcon
      >
        <span slot="leading-icon" className={styles.libraryIcon}>
          {icon}
        </span>
        <ObiChevronRightGoogle slot="trailing-icon" />
      </ObcRichButton>
      {badge ? (
        <ObcBadge className={styles.badge} type={BadgeType.enhance} number={badge} showNumber />
      ) : null}
    </div>
  );
}

