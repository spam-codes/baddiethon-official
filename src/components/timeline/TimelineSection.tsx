"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, ArrowDown } from "lucide-react";
import { timeline, timelineGroups } from "@/config/timeline";
import { site } from "@/config/site";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./TimelineSection.module.css";

const MONTH_ORDER = ["OCT", "NOV", "DEC"];

function monthKey(month: string) {
  return MONTH_ORDER.find((key) => month.includes(key)) ?? "NOV";
}

export function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-timeline-head]", {
        opacity: 0,
        y: 22,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 78%", once: true },
      });

      gsap.from("[data-timeline-month]", {
        opacity: 0,
        y: 34,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-timeline-grid]", start: "top 82%", once: true },
      });

      gsap.fromTo(
        "[data-timeline-signal]",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-timeline-grid]",
            start: "top 80%",
            end: "bottom 55%",
            scrub: 0.5,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="timeline" className={styles.timeline}>
      <div className="shell">
        <header className={styles.head}>
          <div data-timeline-head>
            <p className="eyebrow">02 / The schedule</p>
            <h2 className={styles.heading}>
              THE ROAD TO
              <br />
              <span>BADDIETHON</span>
            </h2>
          </div>

          <div className={styles.headSide} data-timeline-head>
            <p className={styles.headCopy}>
              Seven milestones. One build. Then the part most hackathons skip:
              finding out if anybody actually wants the thing.
            </p>
            <p className={styles.provisional}>
              <AlertTriangle size={13} strokeWidth={1.7} aria-hidden="true" />
              {site.scheduleNote}
            </p>
          </div>
        </header>

        <div className={styles.rail} data-timeline-head>
          <span className={styles.railStart}>Reg. opens</span>
          <div className={styles.railLine}>
            <span data-timeline-signal className={styles.railSignal} />
            {timelineGroups.map((group, index) => (
              <span
                key={group.month}
                className={styles.railNode}
                style={{ left: `${(index / (timelineGroups.length - 1)) * 100}%` }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            ))}
          </div>
          <span className={styles.railEnd}>Results</span>
        </div>

        <div className={styles.months} data-timeline-grid>
          {timelineGroups.map((group) => {
            const items = timeline.filter((item) => monthKey(item.month) === group.month);
            return (
              <div key={group.month} className={styles.month} data-timeline-month>
                <div className={styles.monthHead}>
                  <span className={styles.monthGhost} aria-hidden="true">
                    {group.month}
                  </span>
                  <h3 className={styles.monthTitle}>
                    {group.label}
                    <span className={styles.monthCount}>{items.length} milestones</span>
                  </h3>
                  <p className={styles.monthNote}>{group.note}</p>
                </div>

                <ol className={styles.list}>
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className={styles.milestone}
                      data-state={item.state}
                    >
                      <span className={styles.node} aria-hidden="true">
                        <span />
                      </span>

                      <div className={styles.milestoneBody}>
                        <div className={styles.metaRow}>
                          <span className={styles.dateLabel}>{item.dateLabel}</span>
                          <span className={styles.phase}>{item.phase}</span>
                        </div>
                        <h4 className={styles.title}>{item.title}</h4>
                        <p className={styles.description}>{item.description}</p>
                        {item.state === "opening" && (
                          <span className={styles.opening}>
                            <span aria-hidden="true" />
                            Next up
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>

        <footer className={styles.foot}>
          <p className={styles.footNote}>
            <ArrowDown size={13} strokeWidth={1.6} aria-hidden="true" />
            Dates are provisional until the official schedule is locked. Nothing
            here is invented beyond the published milestones.
          </p>
          <a
            className={styles.footLink}
            href={site.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch for updates <span aria-hidden="true">↗</span>
          </a>
        </footer>
      </div>
    </section>
  );
}
