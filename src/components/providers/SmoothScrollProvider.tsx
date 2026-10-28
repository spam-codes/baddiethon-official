"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type ScrollTarget = string | number | HTMLElement;

interface SmoothScrollContextValue {
  scrollTo: (target: ScrollTarget, offset?: number) => void;
  stop: () => void;
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

/**
 * One scroll system only: Lenis drives the page, GSAP's ticker drives Lenis,
 * and ScrollTrigger listens to Lenis. Reduced-motion users get native scroll.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const lockCount = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let cancelled = false;
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    const onLoad = () => ScrollTrigger.refresh();

    import("lenis")
      .then(({ default: LenisCtor }) => {
        if (cancelled) return;

        lenis = new LenisCtor({
          duration: 1.05,
          lerp: 0.09,
          smoothWheel: true,
          wheelMultiplier: 0.92,
          touchMultiplier: 1.5,
        });

        lenisRef.current = lenis;
        lenis.on("scroll", ScrollTrigger.update);

        tick = (time: number) => {
          lenis?.raf(time * 1000);
        };
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
        window.addEventListener("load", onLoad);
        ScrollTrigger.refresh();
      })
      .catch(() => {
        // Lenis failed to load: native scrolling remains fully usable.
      });

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  /**
   * Section targets already carry `scroll-margin-top` for the fixed nav, and
   * Lenis applies it too. Only pass an offset for extra adjustment — passing
   * the nav height here would double it.
   */
  const scrollTo = useCallback((target: ScrollTarget, offset = 0) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset,
        duration: 1.15,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
      return;
    }

    if (typeof target === "string") {
      const el = document.querySelector<HTMLElement>(target);
      el?.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }

    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "auto" });
      return;
    }

    target.scrollIntoView({ behavior: "auto", block: "start" });
  }, []);

  const stop = useCallback(() => {
    lockCount.current += 1;
    if (lockCount.current === 1) {
      lenisRef.current?.stop();
      document.body.setAttribute("data-scroll-locked", "true");
    }
  }, []);

  const start = useCallback(() => {
    lockCount.current = Math.max(0, lockCount.current - 1);
    if (lockCount.current === 0) {
      lenisRef.current?.start();
      document.body.removeAttribute("data-scroll-locked");
    }
  }, []);

  return (
    <SmoothScrollContext.Provider
      value={{ scrollTo, stop, start }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll(): SmoothScrollContextValue {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error("useSmoothScroll must be used inside SmoothScrollProvider");
  }
  return context;
}
