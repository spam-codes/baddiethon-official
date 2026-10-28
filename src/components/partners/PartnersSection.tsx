"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { partners, partnersEmptyState } from "@/config/partners";
import { site } from "@/config/site";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./PartnersSection.module.css";

export function PartnersSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-partner-head]", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 78%", once: true },
      });

      gsap.from("[data-partner-block]", {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-partner-body]", start: "top 84%", once: true },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="partners"
      className={styles.partners}
      aria-labelledby="partners-heading"
    >
      <div className="shell">
        <header className={styles.head}>
          <div data-partner-head>
            <p className="eyebrow">05 / Partners</p>
            <h2 id="partners-heading" className={styles.heading}>
              GOOD
              <br />
              <span>COMPANY.</span>
            </h2>
          </div>

          <div className={styles.headSide} data-partner-head>
            <p className={styles.headCopy}>
              The people who help make the chaos possible. Community partners,
              tool-makers, and organisers who believe builders deserve a real
              audience.
            </p>
            <p className={styles.headMeta}>00 files confirmed / 00 logos invented</p>
          </div>
        </header>

        <div className={styles.body} data-partner-body>
          {partners.length === 0 ? (
            <>
              <div className={styles.emptyCopy} data-partner-block>
                <p className={styles.status}>
                  <span className={styles.statusDot} aria-hidden="true" />
                  Awaiting confirmation
                </p>

                <h3 className={styles.emptyTitle}>{partnersEmptyState.title}</h3>
                <p className={styles.emptyBody}>{partnersEmptyState.body}</p>

                <a
                  className={styles.cta}
                  href={site.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {partnersEmptyState.ctaLabel}
                  <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" />
                </a>
              </div>

              <div className={styles.signal} data-partner-block aria-hidden="true">
                <div className={styles.orbit}>
                  <span className={styles.ringA} />
                  <span className={styles.ringB} />
                  <span className={styles.ringC} />
                  <span className={styles.orbitDot} />
                  <span className={styles.orbitDotAlt} />
                  <span className={styles.orbitCore}>
                    <span />
                    OPEN
                  </span>
                </div>
                <span className={styles.slotTag} data-slot="1">Slot 01</span>
                <span className={styles.slotTag} data-slot="2">Slot 02</span>
                <span className={styles.slotTag} data-slot="3">Slot 03</span>
              </div>
            </>
          ) : (
            <ul className={styles.list}>
              {partners.map((partner) => {
                const content = (
                  <>
                    {partner.logo && (
                      <span className={styles.logo}>
                        <Image
                          src={partner.logo}
                          alt=""
                          width={120}
                          height={48}
                          className={styles.logoImage}
                        />
                      </span>
                    )}
                    <span className={styles.partnerName}>{partner.name}</span>
                    {partner.description && (
                      <span className={styles.partnerDescription}>{partner.description}</span>
                    )}
                    {partner.href && (
                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.5}
                        className={styles.partnerArrow}
                        aria-hidden="true"
                      />
                    )}
                  </>
                );

                return (
                  <li key={partner.name} className={styles.partner}>
                    {partner.href ? (
                      <a
                        className={styles.partnerLink}
                        href={partner.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className={styles.partnerLink}>{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className={styles.foot}>
          <span>Partner files / {partners.length === 0 ? "none confirmed" : `${partners.length} confirmed`}</span>
          <span>Real logos only. No placeholder brands.</span>
        </footer>
      </div>
    </section>
  );
}
