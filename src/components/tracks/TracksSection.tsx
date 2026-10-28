"use client";

import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { tracks } from "@/config/tracks";
import { site } from "@/config/site";
import type { Track } from "@/types";
import { AgentCharacter } from "./AgentCharacter";
import { WildcardVisual } from "./WildcardVisual";
import { TrackDetailsModal } from "./TrackDetailsModal";
import styles from "./TracksSection.module.css";

export function TracksSection() {
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);

  const onSpotlight = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--mx",
      `${((event.clientX - rect.left) / rect.width) * 100}%`,
    );
    event.currentTarget.style.setProperty(
      "--my",
      `${((event.clientY - rect.top) / rect.height) * 100}%`,
    );
  };

  return (
    <section id="tracks" className={styles.tracks}>
      <div className="shell">
        <header className={styles.head}>
          <div>
            <p className="eyebrow">03 / The tracks</p>
            <h2 className={styles.heading}>
              PICK YOUR
              <br />
              <span>CHAOS.</span>
            </h2>
          </div>

          <div className={styles.headSide}>
            <p className={styles.headCopy}>
              Exactly two tracks. No filler categories. The same condition applies
              to both: somebody real has to want the thing.
            </p>
            <p className={styles.headMeta}>02 files / choose one / both are valid</p>
          </div>
        </header>

        <div className={styles.grid}>
          {tracks.map((track) => {
            const isAgent = track.id === "ai-agents";
            const titleId = `track-title-${track.id}`;

            return (
              <article
                key={track.id}
                className={`${styles.card} ${isAgent ? styles.cardAgent : styles.cardOpen}`}
                onPointerMove={onSpotlight}
                data-track={track.id}
              >
                <div className={styles.spotlight} aria-hidden="true" />

                <div className={styles.cardTop}>
                  <span className={styles.index}>{track.index}</span>
                  <span className={styles.kicker}>{track.kicker}</span>
                  <span className={styles.corner} aria-hidden="true">
                    <ArrowUpRight size={18} strokeWidth={1.4} />
                  </span>
                </div>

                <div className={styles.cardContent}>
                  <h3 id={titleId} className={styles.name}>
                    {track.name}
                  </h3>
                  <p className={styles.hook}>{track.hook}</p>
                  <p className={styles.description}>{track.description}</p>

                  <ul className={styles.examples}>
                    {track.examples.slice(0, 3).map((example) => (
                      <li key={example}>
                        <Plus size={11} strokeWidth={2} aria-hidden="true" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.visual} aria-hidden="true">
                  {isAgent ? (
                    <AgentCharacter showTag={false} />
                  ) : (
                    <WildcardVisual />
                  )}
                </div>

                <div className={styles.cardFoot} aria-hidden="true">
                  <span className={styles.open}>
                    Open file
                    <ArrowUpRight size={12} strokeWidth={1.8} />
                  </span>
                  <span className={styles.fileCode}>
                    {isAgent ? "AGT—01 / LIVE" : "WLD—02 / UNCLASSIFIED"}
                  </span>
                </div>

                <button
                  type="button"
                  className={styles.cardButton}
                  aria-labelledby={titleId}
                  aria-haspopup="dialog"
                  onClick={() => setActiveTrack(track)}
                >
                  <span className="sr-only">Open {track.name} track details</span>
                </button>
              </article>
            );
          })}
        </div>

        <footer className={styles.foot}>
          <p className={styles.footCopy}>
            <span aria-hidden="true">↳</span>
            Not sure which one fits? Pick the idea that would be more fun to
            explain to a stranger.
          </p>
          <a
            className={styles.footLink}
            href={site.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask the Discord <span aria-hidden="true">↗</span>
          </a>
        </footer>
      </div>

      <TrackDetailsModal
        track={activeTrack}
        onClose={() => setActiveTrack(null)}
      />
    </section>
  );
}
