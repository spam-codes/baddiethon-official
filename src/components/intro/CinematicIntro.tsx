"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./CinematicIntro.module.css";

const SESSION_KEY = "baddiethon:intro-seen";

/**
 * "pending" only exists on the server and during hydration: it renders the
 * neutral boot screen. The gate then resolves once, client-side, and is cached
 * for the rest of the tab so internal navigation never replays the intro.
 */
type IntroGate = "pending" | "play" | "seen";

function readSeen() {
  return document.documentElement.getAttribute("data-intro") === "seen";
}

function markSeenAttribute() {
  document.documentElement.setAttribute("data-intro", "seen");
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* storage can fail in private mode */
  }
}

let gate: IntroGate | null = null;
const gateListeners = new Set<() => void>();

function getGate(): IntroGate {
  if (gate) return gate;
  const forced = new URLSearchParams(window.location.search).has("intro");
  if (forced) document.documentElement.removeAttribute("data-intro");
  gate = !forced && (readSeen() || prefersReducedMotion()) ? "seen" : "play";
  return gate;
}

function getServerGate(): IntroGate {
  return "pending";
}

function subscribeGate(listener: () => void) {
  gateListeners.add(listener);
  return () => {
    gateListeners.delete(listener);
  };
}

/** The single place the intro is dismissed, whether finished or skipped. */
function resolveGate() {
  if (gate === "seen") return;
  gate = "seen";
  markSeenAttribute();
  gateListeners.forEach((listener) => listener());
}

/**
 * The intro is a layered poster sequence, not a video: faster, licence-clean,
 * and it never fails to load. It hands off to the hero with a scale/fade wipe.
 * Session-scoped so it does not replay on internal navigation; `?intro=1`
 * forces a replay for review.
 */
export function CinematicIntro() {
  const gate = useSyncExternalStore(subscribeGate, getGate, getServerGate);
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (gate !== "play") return;

    const root = rootRef.current;
    if (!root) return;

    document.documentElement.style.overflow = "hidden";
    document.body.setAttribute("data-scroll-locked", "true");

    const finish = () => {
      document.documentElement.style.overflow = "";
      document.body.removeAttribute("data-scroll-locked");
      resolveGate();
      window.dispatchEvent(new CustomEvent("baddiethon:intro-done"));
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: finish,
      });
      timelineRef.current = tl;

      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 115, opacity: 0 });
      gsap.set(markRef.current, { opacity: 0, scale: 0.96, filter: "blur(14px)" });
      gsap.set(barRef.current, { scaleX: 0, transformOrigin: "left center" });

      tl.fromTo(
        bgRef.current,
        { scale: 1.16, opacity: 0.2 },
        { scale: 1.04, opacity: 1, duration: 1.7, ease: "power2.out" },
        0,
      )
        .to(barRef.current, { scaleX: 1, duration: 5.6, ease: "none" }, 0.15)
        .to(
          line1Ref.current,
          { yPercent: 0, opacity: 1, duration: 0.9 },
          0.55,
        )
        .to({}, { duration: 1.05 })
        .to(
          line1Ref.current,
          { yPercent: -110, opacity: 0, duration: 0.7, ease: "power2.in" },
          2.5,
        )
        .to(
          line2Ref.current,
          { yPercent: 0, opacity: 1, duration: 0.9 },
          2.75,
        )
        .to({}, { duration: 0.75 })
        .to(
          line2Ref.current,
          { yPercent: -110, opacity: 0, duration: 0.65, ease: "power2.in" },
          4.25,
        )
        .to(
          markRef.current,
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.1, ease: "power2.out" },
          4.35,
        )
        .to(markRef.current, { letterSpacing: "-0.035em", duration: 1.2, ease: "power2.out" }, 4.45)
        .to({}, { duration: 0.55 })
        .to(
          root,
          {
            opacity: 0,
            scale: 1.035,
            duration: 0.85,
            ease: "power2.inOut",
          },
          6.15,
        );

      // Timecode is decorative texture, but it should feel alive.
      const counter = { value: 0 };
      gsap.to(counter, {
        value: 6.9,
        duration: 6.9,
        ease: "none",
        onUpdate: () => {
          if (timeRef.current) {
            timeRef.current.textContent = counter.value.toFixed(2).padStart(5, "0");
          }
        },
      });
    }, root);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        timelineRef.current?.progress(1);
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      ctx.revert();
      timelineRef.current = null;
      document.documentElement.style.overflow = "";
      document.body.removeAttribute("data-scroll-locked");
    };
  }, [gate]);

  const skip = () => {
    if (timelineRef.current) {
      timelineRef.current.progress(1);
      return;
    }
    document.documentElement.style.overflow = "";
    document.body.removeAttribute("data-scroll-locked");
    resolveGate();
  };

  if (gate === "pending") {
    return <div data-intro-overlay className={styles.boot} aria-hidden="true" />;
  }

  if (gate === "seen") return null;

  return (
    <div
      ref={rootRef}
      data-intro-overlay
      className={styles.intro}
      role="dialog"
      aria-modal="true"
      aria-label="Baddiethon cinematic introduction"
    >
      <div ref={bgRef} className={styles.bg}>
        <Image
          src="/images/poster-intro.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.bgImage}
        />
        <div className={styles.bgTint} />
      </div>

      <div className={styles.scan} aria-hidden="true" />
      <div className={styles.frame} aria-hidden="true">
        <span className={styles.cornerTL} />
        <span className={styles.cornerBR} />
      </div>

      <div className={styles.hudTop}>
        <span>Baddiethon / transmission 001</span>
        <span className={styles.hudMid}>
          <span className={styles.liveDot} /> live from the internet
        </span>
        <span>
          t+<span ref={timeRef}>00.00</span>
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.lineMask}>
          <p ref={line1Ref} className={styles.line1}>
            THE INTERNET DOESN&rsquo;T NEED{" "}
            <br />
            ANOTHER <em>dead project.</em>
          </p>
        </div>
        <div className={styles.lineMask}>
          <p ref={line2Ref} className={styles.line2}>
            BUILD SOMETHING
            <br />
            PEOPLE <span>WANT.</span>
          </p>
        </div>
        <div ref={markRef} className={styles.mark}>
          <span className={styles.markWord}>BADDIETHON</span>
          <span className={styles.markYear}>2026</span>
        </div>
      </div>

      <div className={styles.hudBottom}>
        <div className={styles.progress}>
          <span ref={barRef} />
        </div>
        <div className={styles.footRow}>
          <span>An experimental hackathon / online</span>
          <button type="button" className={styles.skip} onClick={skip}>
            Skip intro
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </div>
  );
}
