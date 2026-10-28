"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Lock } from "lucide-react";
import { rewardSeals, rewardsCopy } from "@/config/rewards";
import { site } from "@/config/site";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./RewardsSection.module.css";

export function RewardsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-reward-line]", {
        yPercent: 110,
        opacity: 0,
        duration: 1.05,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 72%", once: true },
      });

      gsap.from("[data-reward-seal]", {
        opacity: 0,
        y: 26,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-reward-vault]", start: "top 84%", once: true },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="rewards"
      className={styles.rewards}
      aria-labelledby="rewards-heading"
    >
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.rail}>
        <p className={styles.eyebrow}>{rewardsCopy.kicker}</p>
        <p className={styles.railStatus}>
          <span className={styles.pulse} aria-hidden="true" />
          Vault sealed / reveal pending
        </p>
        <p className={styles.railYear}>{site.edition}</p>
      </div>

      <div className={styles.main}>
        <div className={styles.copy}>
          <h2 id="rewards-heading" className={styles.heading}>
            <span className={styles.mask}>
              <span data-reward-line className={styles.line}>
                A LOT OF{" "}
              </span>
            </span>
            <span className={styles.mask}>
              <span data-reward-line className={styles.line}>
                REWARDS<span className={styles.dot}>.</span>
              </span>
            </span>
          </h2>

          <p className={styles.sub}>
            <span className={styles.subBar} aria-hidden="true" />
            {rewardsCopy.subheading}
          </p>

          <p className={styles.support}>{rewardsCopy.support}</p>

          <div className={styles.actions}>
            <a
              className={styles.cta}
              href={site.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {rewardsCopy.cta}
              <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
            </a>
            <span className={styles.note}>{rewardsCopy.note}</span>
          </div>
        </div>

        <div className={styles.vault} data-reward-vault>
          <div className={styles.vaultHead}>
            <span>Baddiethon / Prize vault</span>
            <Lock size={13} strokeWidth={1.6} aria-hidden="true" />
          </div>

          <div className={styles.lockup}>
            <span className={styles.lockCode}>SEAL—26</span>
            <span className={styles.redact} aria-hidden="true" />
            <span className={styles.redactShort} aria-hidden="true" />
            <span className={styles.lockLabel}>Contents classified</span>
          </div>

          <ol className={styles.seals}>
            {rewardSeals.map((seal, index) => (
              <li key={seal.code} data-reward-seal className={styles.seal}>
                <span className={styles.sealCode}>{seal.code}</span>
                <span className={styles.sealBars} aria-hidden="true">
                  <i style={{ width: `${82 - index * 12}%` }} />
                  <i style={{ width: `${54 + index * 8}%` }} />
                </span>
                <span className={styles.sealState}>{seal.state}</span>
              </li>
            ))}
          </ol>

          <div className={styles.vaultFoot}>
            <span>Unlock window / TBA</span>
            <span>Official reveal only</span>
          </div>
        </div>
      </div>

      <div className={styles.strip} aria-hidden="true">
        <div className={styles.stripTrack}>
          {[0, 1].map((group) => (
            <div className={styles.stripGroup} key={group}>
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={`${group}-${index}`}>
                  {rewardsCopy.subheading}
                  <i>✳</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
