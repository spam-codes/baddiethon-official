"use client";

import { ArrowUp } from "lucide-react";
import { navigation } from "@/config/navigation";
import { site } from "@/config/site";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { RegisterButton, DiscordButton } from "@/components/registration/RegisterButton";
import { SparkIcon } from "@/components/ui/Icons";
import type { SectionId } from "@/types";
import styles from "./Footer.module.css";

export function Footer() {
  const { scrollTo } = useSmoothScroll();

  const goTo = (id: SectionId) => {
    if (id === "home") {
      scrollTo(0);
      return;
    }
    scrollTo(`#${id}`);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.aura} aria-hidden="true" />

      <div className="shell">
        <div className={styles.ctaBlock}>
          <div className={styles.ctaCopy}>
            <p className="eyebrow">08 / The end of the page</p>
            <h2 className={styles.ctaHeading}>
              BUILD ANYTHING.
              <br />
              <span>MAKE PEOPLE WANT IT.</span>
            </h2>
            <p className={styles.ctaBody}>
              {site.status} — provisional schedule. Bring a strange idea and a
              reason for someone real to use it.
            </p>          </div>

          <div className={styles.ctaActions}>
            <RegisterButton size="md" />
            <DiscordButton size="md" />
            <p className={styles.ctaNote}>
              <span aria-hidden="true" />
              {site.status}
            </p>
          </div>
        </div>

        <div className={styles.wordmark} aria-hidden="true">
          <span>BADDIETHON</span>
          <em>{site.edition}</em>
        </div>

        <div className={styles.grid}>
          <div className={styles.col}>
            <p className={styles.colLabel}>Index</p>
            <ul className={styles.colLinks}>
              {navigation.slice(1, 5).map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => goTo(item.id)}>
                    <span>{item.index}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <p className={styles.colLabel}>More</p>
            <ul className={styles.colLinks}>
              {navigation.slice(5).map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => goTo(item.id)}>
                    <span>{item.index}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <p className={styles.colLabel}>Signal</p>
            <ul className={styles.colLinks}>
              <li>
                <a href={site.discordUrl} target="_blank" rel="noopener noreferrer">
                  <span>↗</span>
                  Discord
                </a>
              </li>
              <li>
                <button type="button" onClick={() => goTo("faqs")}>
                  <span>↗</span>
                  Rules &amp; updates
                </button>
              </li>
            </ul>
          </div>

          <div className={styles.col}>
            <p className={styles.colLabel}>Event</p>
            <dl className={styles.facts}>
              <div>
                <dt>Format</dt>
                <dd>{site.format}</dd>
              </div>
              <div>
                <dt>Tracks</dt>
                <dd>AI Agents / Open Track</dd>
              </div>
              <div>
                <dt>Schedule</dt>
                <dd>Provisional</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {site.year} {site.copyright}
          </p>

          <p className={styles.credit}>
            <SparkIcon size={11} />
            Built for real people, not judges.
          </p>

          <button
            type="button"
            className={styles.top}
            onClick={() => scrollTo(0)}
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp size={14} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
