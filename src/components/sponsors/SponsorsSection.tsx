"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Lock } from "lucide-react";
import { sponsors, sponsorsEmptyState } from "@/config/sponsors";
import { site } from "@/config/site";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./SponsorsSection.module.css";

const SLOTS = ["01", "02", "03"] as const;

export function SponsorsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-sponsor-head]", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 78%", once: true },
      });

      gsap.from("[data-sponsor-slot]", {
        opacity: 0,
        y: 36,
        duration: 0.95,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-sponsor-wall]", start: "top 86%", once: true },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const isEmpty = sponsors.length === 0;

  return (
    <section
      ref={sectionRef}
      id="sponsors"
      className={styles.sponsors}
      aria-labelledby="sponsors-heading"
    >
      <div className={styles.ghost} aria-hidden="true">
        $$$
      </div>

      <div className="shell">
        <header className={styles.head}>
          <div data-sponsor-head>
            <p className="eyebrow eyebrow--magenta">06 / Sponsors</p>
            <h2 id="sponsors-heading" className={styles.heading}>
              BACK THE
              <br />
              <span>CHAOS.</span>
            </h2>
          </div>

          <div className={styles.headSide} data-sponsor-head>
            <p className={styles.headCopy}>
              {isEmpty
                ? "A hackathon about building things people want needs people willing to back the strange. The wall stays empty until every name is real."
                : "The brands and teams backing Baddiethon. Every entry below is confirmed before it appears."}
            </p>
            <p className={styles.headMeta}>
              {isEmpty ? sponsorsEmptyState.title : `${sponsors.length} confirmed sponsor files`}
            </p>
          </div>
        </header>

        <div className={styles.wall} data-sponsor-wall>
          {isEmpty ? (
            <>
              {SLOTS.map((slot) => (
                <article key={slot} className={styles.slot} data-sponsor-slot>
                  <div className={styles.slotTop}>
                    <span className={styles.slotCode}>SPONSOR / {slot}</span>
                    <Lock size={12} strokeWidth={1.6} aria-hidden="true" />
                  </div>

                  <span className={styles.slotIndex} aria-hidden="true">
                    {slot}
                  </span>

                  <div className={styles.slotBody}>
                    <span className={styles.slotBars} aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <p className={styles.slotState}>Awaiting signal</p>
                  </div>

                  <div className={styles.slotFoot}>
                    <span>Slot unclaimed</span>
                    <span>—</span>
                  </div>
                </article>
              ))}

              <div className={styles.note} data-sponsor-slot>
                <p className={styles.noteLabel}>Sponsor briefing</p>
                <p className={styles.noteBody}>{sponsorsEmptyState.body}</p>
                <a
                  className={styles.noteCta}
                  href={site.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {sponsorsEmptyState.ctaLabel}
                  <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" />
                </a>
              </div>
            </>
          ) : (
            sponsors.map((sponsor) => {
              const content = (
                <>
                  <div className={styles.slotTop}>
                    <span className={styles.slotCode}>{sponsor.tier ?? "Sponsor"}</span>
                    {sponsor.href && (
                      <ArrowUpRight size={14} strokeWidth={1.6} aria-hidden="true" />
                    )}
                  </div>

                  {sponsor.logo && (
                    <span className={styles.sponsorLogo}>
                      <Image
                        src={sponsor.logo}
                        alt=""
                        width={140}
                        height={56}
                        className={styles.sponsorLogoImage}
                      />
                    </span>
                  )}

                  <div className={styles.slotBody}>
                    <span className={styles.sponsorName}>{sponsor.name}</span>
                    {sponsor.description && (
                      <p className={styles.sponsorDescription}>{sponsor.description}</p>
                    )}
                  </div>
                </>
              );

              return (
                <article key={sponsor.name} className={styles.slot} data-sponsor-slot>
                  {sponsor.href ? (
                    <a
                      className={styles.slotLink}
                      href={sponsor.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className={styles.slotLink}>{content}</div>
                  )}
                </article>
              );
            })
          )}
        </div>

        <footer className={styles.foot}>
          <span>Sponsor wall / {isEmpty ? "sealed" : "live"}</span>
          <span>No fake logos. No imaginary backers.</span>
        </footer>
      </div>
    </section>
  );
}
