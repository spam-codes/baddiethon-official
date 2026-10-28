"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./CustomCursor.module.css";

/**
 * Cursor states are derived from what is under the pointer, so no section
 * needs to know this component exists. `data-cursor` / `data-cursor-label`
 * are available as explicit overrides for future interactive elements.
 */
type CursorState = "default" | "link" | "button" | "card" | "agent" | "native";

interface CursorTarget {
  state: CursorState;
  label: string;
  /** Element the trailing ring gently drifts towards (links only). */
  magnet: Element | null;
}

const INTERACTIVE = "a[href], button, [role='button'], summary, [role='tab']";
const FORM_CONTROL = "input, textarea, select, [contenteditable='true']";

function resolveTarget(node: Element | null): CursorTarget {
  if (!node) return { state: "default", label: "", magnet: null };

  const explicit = node.closest<HTMLElement>("[data-cursor]");
  if (explicit) {
    const state = (explicit.dataset.cursor || "button") as CursorState;
    return {
      state,
      label: explicit.dataset.cursorLabel ?? "",
      magnet: explicit.matches("a[href]") ? explicit : null,
    };
  }

  // Track files are the only interactive cards: one scans, one explores.
  // Scoped to `article` so the open track dialog is not treated as a card.
  const card = node.closest<HTMLElement>("article[data-track]");
  if (card) {
    const agent = card.dataset.track === "ai-agents";
    return {
      state: agent ? "agent" : "card",
      label: agent ? "ACTIVATE" : "EXPLORE",
      magnet: null,
    };
  }

  // Native cursor is restored over form controls (e.g. the volume slider).
  if (node.closest(FORM_CONTROL)) return { state: "native", label: "", magnet: null };

  const link = node.closest<HTMLElement>("a[href]");
  if (link) return { state: "link", label: "", magnet: link };

  if (node.closest(INTERACTIVE)) return { state: "button", label: "", magnet: null };

  return { state: "default", label: "", magnet: null };
}

/**
 * Lightweight pointer overlay: reticle + dot track the pointer directly, the
 * ring trails behind on a single rAF loop that stops as soon as it settles.
 * Everything is written imperatively so pointer movement never re-renders
 * React, and the whole layer is pointer-events: none.
 *
 * Disabled for coarse pointers and reduced motion, where the native cursor is
 * left untouched.
 */
export function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const reticleRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const labelTextRef = useRef<HTMLSpanElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const root = rootRef.current;
    if (!root) return;
    // Touch, pens, and hybrid devices keep their native cursor.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const html = document.documentElement;
    const ring = ringRef.current;
    const reticle = reticleRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    const ripple = rippleRef.current;

    html.setAttribute("data-custom-cursor", "on");
    root.dataset.state = "default";

    // The intro has its own reticle treatment until it hands off to the hero.
    let introMode = html.getAttribute("data-intro") !== "seen";
    root.dataset.intro = String(introMode);

    let pointerX = 0;
    let pointerY = 0;
    let ringX = 0;
    let ringY = 0;
    let targetX = 0;
    let targetY = 0;
    let magnetX = 0;
    let magnetY = 0;
    let magnetEl: Element | null = null;
    let state: CursorState = "default";
    let labelText = "";
    let lastTarget: Element | null = null;
    let visible = false;
    let frame = 0;
    let clickTimer = 0;

    const clampMagnet = (value: number) => Math.max(-10, Math.min(10, value));

    const paint = () => {
      const dx = targetX - ringX;
      const dy = targetY - ringY;
      ringX += dx * 0.18;
      ringY += dy * 0.18;

      if (ring) {
        ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0)`;
      }
      if (reticle) {
        reticle.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      }
      if (dot) {
        dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      }
      if (label) {
        label.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      }

      // Stop burning frames once the trail is visually settled.
      if (Math.abs(dx) + Math.abs(dy) > 0.06) {
        frame = requestAnimationFrame(paint);
      } else {
        frame = 0;
      }
    };

    const aim = () => {
      targetX = pointerX + magnetX;
      targetY = pointerY + magnetY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const measureMagnet = () => {
      if (!magnetEl) {
        magnetX = 0;
        magnetY = 0;
        return;
      }
      const rect = magnetEl.getBoundingClientRect();
      magnetX = clampMagnet((rect.left + rect.width / 2 - pointerX) * 0.22);
      magnetY = clampMagnet((rect.top + rect.height / 2 - pointerY) * 0.22);
    };

    const setIntroMode = (next: boolean) => {
      introMode = next;
      root.dataset.intro = String(next);
    };

    const hide = () => {
      if (!visible) return;
      visible = false;
      root.removeAttribute("data-visible");
      lastTarget = null;
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!visible) {
        visible = true;
        ringX = pointerX;
        ringY = pointerY;
        root.setAttribute("data-visible", "true");
      }

      // The intro can finish without this component hearing the event (e.g.
      // skipping before mount), so re-check on the first movement.
      if (introMode && html.getAttribute("data-intro") === "seen") setIntroMode(false);

      if (event.target !== lastTarget) {
        lastTarget = event.target as Element | null;
        const next = resolveTarget(lastTarget);
        magnetEl = next.magnet;

        if (next.state !== state || next.label !== labelText) {
          state = next.state;
          labelText = next.label;
          root.dataset.state = state;
          if (labelTextRef.current) labelTextRef.current.textContent = labelText;
        }
        measureMagnet();
      } else if (state === "link" && magnetEl) {
        // Keep the pull centred while travelling across a link.
        measureMagnet();
      }

      aim();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" || event.button !== 0 || !visible) return;

      // Re-add the attribute so a rapid second click restarts the pulse.
      root.removeAttribute("data-click");
      void root.offsetWidth;
      root.setAttribute("data-click", "true");
      if (ripple) {
        ripple.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
      window.clearTimeout(clickTimer);
      clickTimer = window.setTimeout(() => {
        root.removeAttribute("data-click");
      }, 480);
    };

    const onIntroDone = () => setIntroMode(false);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("mouseleave", hide);
    window.addEventListener("baddiethon:intro-done", onIntroDone);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("mouseleave", hide);
      window.removeEventListener("baddiethon:intro-done", onIntroDone);

      window.clearTimeout(clickTimer);
      if (frame) cancelAnimationFrame(frame);

      html.removeAttribute("data-custom-cursor");
      root.removeAttribute("data-visible");
      root.removeAttribute("data-click");
      root.removeAttribute("data-state");
      root.removeAttribute("data-intro");
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div ref={rootRef} className={styles.root} data-cursor-root aria-hidden="true">
      <span ref={ringRef} className={styles.anchor}>
        <span className={styles.ring}>
          <span className={styles.scan} />
        </span>
      </span>

      <span ref={reticleRef} className={styles.anchor}>
        <span className={styles.reticle} />
      </span>

      <span ref={dotRef} className={styles.anchor}>
        <span className={styles.dot} />
      </span>

      <span ref={labelRef} className={styles.anchor}>
        <span ref={labelTextRef} className={styles.label} />
      </span>

      <span ref={rippleRef} className={styles.anchor}>
        <span className={styles.ripple} />
      </span>
    </div>
  );
}
