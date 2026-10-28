"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { site } from "@/config/site";
import { useModalBehavior } from "@/hooks/useModalBehavior";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DiscIcon } from "@/components/ui/Icons";
import styles from "./RegistrationDialog.module.css";

interface RegistrationDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Registration is intentionally gated until a real URL exists in config.
 * The dialog never invents a form, price, or deadline beyond the provisional
 * schedule already published on the timeline.
 */
export function RegistrationDialog({ open, onClose }: RegistrationDialogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useModalBehavior({
    open,
    onClose,
    containerRef,
    initialFocusRef: closeRef,
  });

  const directLink = Boolean(site.registrationUrl);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.28 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={containerRef}
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-title"
            aria-describedby="registration-body"
            tabIndex={-1}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.99 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.corner} aria-hidden="true" />

            <div className={styles.head}>
              <span className={styles.code}>REG / 2026</span>
              <button
                ref={closeRef}
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label="Close registration dialog"
              >
                <X size={17} strokeWidth={1.6} aria-hidden="true" />
              </button>
            </div>

            <p className={styles.status}>
              <span className={styles.pulse} aria-hidden="true" />
              {directLink ? "Registration is live" : "Transmission pending"}
            </p>

            <h2 id="registration-title" className={styles.title}>
              {directLink ? (
                <>
                  REGISTRATION
                  <br />
                  IS OPEN.
                </>
              ) : (
                <>
                  NOT OPEN
                  <br />
                  <span className={styles.acid}>YET.</span>
                </>
              )}
            </h2>

            <p id="registration-body" className={styles.body}>
              {directLink
                ? "The official Baddiethon registration form is ready."
                : "The official form is still being wired up. Registration opens on 30 October. The link will be posted in Discord first \u2014 and on this page the moment it exists."}
            </p>

            <ol className={styles.steps}>
              <li>
                <span className={styles.stepDay}>30 OCT</span>
                <span>Registration opens</span>
              </li>
              <li>
                <span className={styles.stepDay}>14 NOV</span>
                <span>Registration closes</span>
              </li>
              <li className={styles.stepNote}>
                <span className={styles.stepDay}>NOTE</span>
                <span>Schedule provisional until confirmed</span>
              </li>
            </ol>

            <div className={styles.actions}>
              {directLink ? (
                <a
                  className="btn btn--primary"
                  href={site.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Continue to form
                  <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
                </a>
              ) : (
                <a
                  className="btn btn--primary"
                  href={site.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DiscIcon size={15} />
                  Get the link in Discord
                </a>
              )}
              <button type="button" className={styles.secondary} onClick={onClose}>
                Back to the site
              </button>
            </div>

            <p className={styles.foot}>
              No payment, no fake form. Just the official announcement when it lands.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
