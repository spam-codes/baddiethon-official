"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./AboutSection.module.css";

type Tone = "serif" | "display" | "impact" | "quiet" | "final";

const STATEMENTS: { text: string; tone: Tone; note: string }[] = [
  {
    text: "Bored of traditional hackathons?",
    tone: "serif",
    note: "A fair question",
  },
  {
    text: "How many more projects do you want to let die on your GitHub?",
    tone: "display",
    note: "The graveyard is full",
  },
  {
    text: "Why not build something real?",
    tone: "serif",
    note: "Radical idea",
  },
  {
    text: "FOR REAL PEOPLE.",
    tone: "impact",
    note: "Not for judges",
  },
  {
    text: "It could be silly.",
    tone: "serif",
    note: "Permission granted",
  },
  {
    text: "It could be ridiculous.",
    tone: "serif",
    note: "Even better",
  },
  {
    text: "It could be useful.",
    tone: "serif",
    note: "The best"
  },
  {
    text: "The only catch is...",
    tone: "quiet",
    note: "There is always a catch",
  },
  {
    text: "MAKE PEOPLE WANT TO USE IT.",
    tone: "final",
    note: "The whole brief",
  },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      const items = itemRefs.current.filter(Boolean) as HTMLParagraphElement[];
      if (!items.length) return;

      gsap.set(items, { opacity: 0, yPercent: 12, scale: 0.985 });
      gsap.set(items[0], { opacity: 1, yPercent: 0, scale: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(
              items.length - 1,
              Math.max(0, Math.round(self.progress * (items.length - 1))),
            );
            if (next !== activeRef.current) {
              activeRef.current = next;
              setActive(next);
            }
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      tl.to({}, { duration: 0.35 });

      items.forEach((item, index) => {
        const isLast = index === items.length - 1;
        const at = 0.35 + index * 1.02;

        if (!isLast) {
          tl.to(
            item,
            {
              opacity: 0,
              yPercent: -16,
              scale: 0.97,
              filter: "blur(5px)",
              duration: 0.34,
              ease: "power2.in",
            },
            at + 0.62,
          );
          tl.fromTo(
            items[index + 1],
            { opacity: 0, yPercent: 14, scale: 0.985, filter: "blur(5px)" },
            {
              opacity: 1,
              yPercent: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.44,
            },
            at + 0.82,
          );
        } else {
          tl.to(item, { scale: 1.015, duration: 0.9, ease: "power1.inOut" }, at);
          tl.to({}, { duration: 0.8 });
        }
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  const current = STATEMENTS[active] ?? STATEMENTS[0];

  return (
    <section
      ref={sectionRef}
      id="about"
      className={styles.about}
      aria-labelledby="about-heading"
    >
      <div className={styles.ghost} aria-hidden="true">
        WHY
      </div>

      <div ref={trackRef} className={styles.track} data-reduced={reduced}>
        <div className={styles.stage} data-tone={current.tone}>
          <div className={styles.stageInner}>
            <div className={styles.head}>
              <div>
                <p className="eyebrow">01 / Philosophy</p>
                <h2 id="about-heading" className={styles.heading}>
                  WHAT IS BADDIETHON?
                </h2>
              </div>
              <p className={styles.headMeta}>
                Eight statements
                <br />
                One condition
              </p>
            </div>

            {reduced ? (
              <ol className={styles.staticList}>
                {STATEMENTS.map((item, index) => (
                  <li key={item.text} className={styles.staticItem}>
                    <span className={styles.staticIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className={styles[`tone_${item.tone}`]}>{item.text}</p>
                    <span className={styles.staticNote}>{item.note}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <>
                <div className={styles.statements}>
                  {STATEMENTS.map((item, index) => (
                    <p
                      key={item.text}
                      ref={(node) => {
                        itemRefs.current[index] = node;
                      }}
                      className={`${styles.statement} ${styles[`tone_${item.tone}`]}`}
                      data-active={active === index}
                    >
                      {item.text}
                    </p>
                  ))}
                </div>

                <div className={styles.controls}>
                  <span className={styles.counter}>
                    <span className={styles.counterNow}>
                      {String(active + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.counterSlash}>/</span>
                    {String(STATEMENTS.length).padStart(2, "0")}
                  </span>

                  <div className={styles.meter} aria-hidden="true">
                    <span ref={barRef} style={{ transform: "scaleX(0)" }} />
                  </div>

                  <span className={styles.note}>{current.note}</span>
                </div>
              </>
            )}
          </div>

          <div className={styles.stageFoot}>
            <span>Keep scrolling / the catch is coming</span>
            <span className={styles.coords}>Philosophy_01 — {String(active + 1).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
