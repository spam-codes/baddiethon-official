"use client";

import { useRef } from "react";
import Image from "next/image";
import { site } from "@/config/site";
import { RegisterButton, DiscordButton } from "@/components/registration/RegisterButton";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { SparkIcon } from "@/components/ui/Icons";
import styles from "./HeroSection.module.css";

const MARQUEE = [
  "Build anything",
  "Make people want it",
  "Stop building for judges",
  "Your GitHub graveyard ends here",
  "AI agents + open chaos",
];

export function HeroSection() {
  const artRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();

  const onArtMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || !artRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    artRef.current.style.transform = `translate3d(${x * -12}px, ${y * -12}px, 0) rotate(${x * 1.1}deg) scale(1.012)`;
  };

  const onArtLeave = () => {
    if (!artRef.current) return;
    artRef.current.style.transform = "translate3d(0,0,0) rotate(0deg) scale(1)";
  };

  return (
    <section id="home" className={styles.hero} aria-label="Baddiethon 2026">
      <div className={styles.aura} aria-hidden="true" />
      <div className={styles.gridLines} aria-hidden="true" />

      <div className={styles.shell}>
        <div className={styles.topRail}>
          <p className="eyebrow">
            {site.kicker} <span className={styles.railSlash}>/</span> {site.edition}
          </p>
          <p className={styles.online}>
            <span className={styles.dot} aria-hidden="true" />
            Online / worldwide
          </p>
          <p className={styles.coords}>28.61°N 77.20°E — WWW</p>
        </div>

        <div className={styles.main}>
          <div className={styles.copy}>
            <h1 className={styles.title} aria-label="Baddiethon">
              <span className={styles.line}>
                <span className={styles.lineInner}>BADDI</span>
              </span>
              <span className={`${styles.line} ${styles.lineTwo}`}>
                <span className={styles.lineInner}>
                  ETHON<span className={styles.asterisk}>*</span>
                </span>
                <span className={styles.year} aria-hidden="true">
                  2026
                </span>
              </span>
            </h1>

            <p className={styles.tagline}>
              Build anything.
              <br />
              <span>Make people want it.</span>
            </p>

            <p className={styles.support}>
              An experimental hackathon for people who would rather ship something
              strange than add another dead repository to the graveyard.
            </p>

            <div className={styles.actions}>
              <RegisterButton />
              <DiscordButton />
            </div>

            <dl className={styles.stats}>
              <div>
                <dt>Format</dt>
                <dd>Online</dd>
              </div>
              <div>
                <dt>Tracks</dt>
                <dd>02</dd>
              </div>
              <div>
                <dt>Opens</dt>
                <dd>30.10</dd>
              </div>
              <div>
                <dt>Results</dt>
                <dd>15.12</dd>
              </div>
            </dl>
          </div>

          <div className={styles.artColumn}>
            <div className={styles.artMeta} aria-hidden="true">
              <span>Poster_001</span>
              <span>{site.edition} / Official artwork</span>
            </div>

            <div
              className={styles.artFrame}
              onPointerMove={onArtMove}
              onPointerLeave={onArtLeave}
            >
              <div ref={artRef} className={styles.artInner}>
                <Image
                  src="/images/poster-main.webp"
                  alt="Baddiethon 2026 poster artwork: a lone figure in a dark dystopian scene beneath a glowing magenta city structure."
                  fill
                  priority
                  sizes="(max-width: 560px) 84vw, (max-width: 1000px) 464px, (max-width: 1500px) 36vw, 501px"
                  className={styles.artImage}
                />
                <div className={styles.artShade} aria-hidden="true" />
                <div className={styles.artScan} aria-hidden="true" />
              </div>

              <div className={styles.stamp} aria-hidden="true">
                <SparkIcon size={14} />
                <span>
                  Build anything
                  <br />
                  Make people want it
                </span>
              </div>

              <div className={styles.vertical} aria-hidden="true">
                Baddiethon — an experiment in building
              </div>
            </div>

            <p className={styles.artCaption}>
              <span>Fig. 01</span> The world is dark. The ideas are not.
            </p>
          </div>
        </div>

        <div className={styles.bottomRail}>
          <button
            type="button"
            className={styles.scrollCue}
            onClick={() => scrollTo("#about")}
          >
            <span className={styles.scrollLine} aria-hidden="true" />
            Scroll to enter
          </button>

          <p className={styles.bottomMeta}>
            <span>{site.status}</span>
            <span className={styles.bar} aria-hidden="true" />
            <span>Apply your weirdest idea</span>
          </p>
        </div>
      </div>

      <div className={styles.marquee} aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((group) => (
            <div className="marquee__group" key={group}>
              {MARQUEE.map((item) => (
                <span key={`${group}-${item}`} className={styles.marqueeItem}>
                  {item}
                  <SparkIcon size={11} className={styles.marqueeStar} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
