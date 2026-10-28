"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { faqs } from "@/config/faqs";
import { site } from "@/config/site";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./FAQSection.module.css";

const FIRST_OPEN = faqs[0]?.id ?? "";

export function FAQSection() {
  const [openId, setOpenId] = useState<string>(FIRST_OPEN);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-faq-side]", {
        opacity: 0,
        y: 26,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 76%", once: true },
      });

      gsap.from("[data-faq-row]", {
        opacity: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.035,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-faq-list]", start: "top 82%", once: true },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faqs"
      className={styles.faqs}
      aria-labelledby="faqs-heading"
    >
      <div className={`shell ${styles.layout}`}>
        <div className={styles.side} data-faq-side>
          <p className="eyebrow">07 / FAQ</p>
          <h2 id="faqs-heading" className={styles.heading}>
            NO DUMB
            <br />
            <span>QUESTIONS.</span>
          </h2>

          <p className={styles.sideCopy}>
            The short version: build something people want, bring real users, and
            let the work speak. Everything else is below.
          </p>

          <div className={styles.stuck}>
            <p className={styles.stuckLabel}>Still stuck?</p>
            <p className={styles.stuckBody}>
              Ask a human in the Discord. Answers there are official; answers in
              your group chat are not.
            </p>
            <a
              className={styles.stuckLink}
              href={site.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.stuckDot} aria-hidden="true" />
              Ask in Discord
              <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" />
            </a>
          </div>

          <p className={styles.sideMeta}>
            {String(faqs.length).padStart(2, "0")} entries / official answers only
          </p>
        </div>

        <div className={styles.list} data-faq-list>
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            const buttonId = `faq-question-${faq.id}`;
            const panelId = `faq-answer-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={styles.row}
                data-faq-row
                data-open={isOpen}
              >
                <h3 className={styles.rowHeading}>
                  <button
                    id={buttonId}
                    type="button"
                    className={styles.trigger}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? "" : faq.id)}
                  >
                    <span className={styles.number}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.question}>{faq.question}</span>
                    <span className={styles.tag}>{faq.tag}</span>
                    <span className={styles.toggle} aria-hidden="true">
                      <Plus size={16} strokeWidth={1.8} />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  className={styles.panel}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                >
                  <div className={styles.panelInner}>
                    <p className={styles.answer}>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className={styles.listFoot}>
            <span>Question not listed?</span>
            <a
              href={site.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.listFootLink}
            >
              Bring it to the Discord <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
