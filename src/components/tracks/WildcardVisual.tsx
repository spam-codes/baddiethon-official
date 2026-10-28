"use client";

import styles from "./WildcardVisual.module.css";
import { cn } from "@/lib/utils";

const TAGS = ["GAME", "TOOL", "TOY", "SOCIAL", "WEIRD", "USEFUL", "???"];

/** The Open Track's counterpart to AGT-01: an unclassified specimen. */
export function WildcardVisual({
  className,
  large = false,
}: {
  className?: string;
  large?: boolean;
}) {
  return (
    <div
      className={cn(styles.wrap, large && styles.large, className)}
      aria-hidden="true"
    >
      <div className={styles.orbit}>
        <span className={styles.ringOuter} />
        <span className={styles.ringInner} />
        <span className={styles.crossA} />
        <span className={styles.crossB} />
        <span className={styles.core}>?</span>
      </div>

      <span className={cn(styles.tag, styles.tag1)}>{TAGS[0]}</span>
      <span className={cn(styles.tag, styles.tag2)}>{TAGS[1]}</span>
      <span className={cn(styles.tag, styles.tag3)}>{TAGS[2]}</span>
      <span className={cn(styles.tag, styles.tag4)}>{TAGS[4]}</span>
      <span className={cn(styles.tag, styles.tag5)}>{TAGS[6]}</span>

      <span className={styles.code}>WLD—02 / UNCLASSIFIED</span>
    </div>
  );
}
