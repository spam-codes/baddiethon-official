"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { site } from "@/config/site";
import type { Track } from "@/types";
import { useModalBehavior } from "@/hooks/useModalBehavior";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useRegistration } from "@/components/registration/RegistrationProvider";
import { DiscIcon } from "@/components/ui/Icons";
import { AgentCharacter } from "./AgentCharacter";
import { WildcardVisual } from "./WildcardVisual";
import styles from "./TrackDetailsModal.module.css";

interface TrackDetailsModalProps {
  track: Track | null;
  onClose: () => void;
}

/**
 * Track dossier. Same content model as the card, expanded.
 * Registration is opened only after this dialog closes, so the two focus
 * traps never stack on top of each other.
 */
export function TrackDetailsModal({ track, onClose }: TrackDetailsModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const { openDialog } = useRegistration();

  const open = Boolean(track);

  useModalBehavior({
    open,
    onClose,
    containerRef,
    initialFocusRef: closeRef,
  });

  const startRegistration = () => {
    onClose();
    window.setTimeout(() => openDialog(), 260);
  };

  // AnimatePresence keeps the outgoing tree alive for its exit animation, so
  // the dialog does not need a render-time copy of the last track.
  const isAgent = track?.id === "ai-agents";

  return (
    <AnimatePresence>
      {track && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.3 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={containerRef}
            className={styles.dialog}
            data-track={track.id}
            role="dialog"
            aria-modal="true"
            aria-labelledby="track-modal-title"
            aria-describedby="track-modal-summary"
            tabIndex={-1}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 30, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.995 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.topBar}>
              <div className={styles.topMeta}>
                <span className={styles.code}>{track.index}</span>
                <span>{track.kicker}</span>
              </div>
              <button
                ref={closeRef}
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label="Close track details"
              >
                <X size={17} strokeWidth={1.6} aria-hidden="true" />
              </button>
            </div>

            <div className={styles.body}>
              <div className={styles.content}>
                <h2 id="track-modal-title" className={styles.name}>
                  {track.name}
                </h2>

                <p id="track-modal-summary" className={styles.hook}>
                  {track.hook}
                </p>

                <p className={styles.description}>{track.description}</p>

                <div className={styles.section}>
                  <p className={styles.sectionLabel}>What could live here</p>
                  <ol className={styles.examples}>
                    {track.examples.map((example, index) => (
                      <li key={example}>
                        <span className={styles.exampleIndex}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className={styles.rule} aria-hidden="true" />
              </div>

              <aside className={styles.visualPanel} aria-hidden="true">
                <span className={styles.panelCode}>
                  {isAgent ? "AGT—01 / LIVE" : "WLD—02 / UNCLASSIFIED"}
                </span>
                <div className={styles.visualInner}>
                  {isAgent ? (
                    <AgentCharacter active showTag={false} />
                  ) : (
                    <WildcardVisual large />
                  )}
                </div>
                <span className={styles.panelFoot}>
                  {isAgent ? "Autonomous unit / verified" : "Specimen / refuses labels"}
                </span>
              </aside>
            </div>

            <div className={styles.actions}>
              <button type="button" className="btn btn--primary" onClick={startRegistration}>
                <span className="btn__dot" aria-hidden="true" />
                {site.registrationUrl ? "Register for this track" : "Register interest"}
                <ArrowUpRight size={14} strokeWidth={2} className="btn__arrow" aria-hidden="true" />
              </button>

              <a
                className={styles.secondary}
                href={site.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DiscIcon size={14} />
                Ask in Discord
              </a>

              <button type="button" className={styles.back} onClick={onClose}>
                Back to tracks
              </button>
            </div>

            <p className={styles.footNote}>
              Same rule for both files: a real person has to want to use the thing.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
