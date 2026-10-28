"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { desktopNavigation, navigation } from "@/config/navigation";
import { site } from "@/config/site";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { useModalBehavior } from "@/hooks/useModalBehavior";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AudioControls } from "@/components/audio/AudioControls";
import { RegisterButton } from "@/components/registration/RegisterButton";
import { DiscordButton } from "@/components/registration/RegisterButton";
import { SparkIcon } from "@/components/ui/Icons";
import type { SectionId } from "@/types";
import { cn } from "@/lib/utils";
import styles from "./Navbar.module.css";

const SECTION_IDS: SectionId[] = [
  "home",
  "about",
  "timeline",
  "tracks",
  "rewards",
  "partners",
  "sponsors",
  "faqs",
];

export function Navbar() {
  const { scrollTo } = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<SectionId>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useModalBehavior({
    open: menuOpen,
    onClose: () => setMenuOpen(false),
    containerRef: menuRef,
    initialFocusRef: closeRef,
  });

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);

      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(1, Math.max(0, y / height)) : 0);

      let current: SectionId = "home";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= window.innerHeight * 0.4) current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onResize = () => {
      if (window.innerWidth >= 960) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  const goTo = useCallback(
    (id: SectionId) => {
      setMenuOpen(false);
      if (id === "home") {
        scrollTo(0);
        return;
      }
      window.setTimeout(() => scrollTo(`#${id}`), 60);
    },
    [scrollTo],
  );

  return (
    <>
      <header className={cn(styles.nav, scrolled && styles.scrolled)}>
        <div
          className={styles.progress}
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />

        <div className={styles.inner}>
          <button
            type="button"
            className={styles.brand}
            onClick={() => scrollTo(0)}
            aria-label="Baddiethon home"
          >
            <span className={styles.mark}>
              <SparkIcon size={17} />
            </span>
            <span className={styles.brandText}>BADDIETHON</span>
            <span className={styles.brandYear}>26</span>
          </button>

          <nav className={styles.links} aria-label="Primary">
            {desktopNavigation.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.link}
                data-active={active === item.id}
                onClick={() => goTo(item.id)}
              >
                <span className={styles.linkIndex}>{item.index}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className={styles.actions}>
            <AudioControls />
            <RegisterButton size="sm" className={styles.register} label="Register" />
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="site-index"
              aria-label="Open site index"
            >
              <Menu size={18} strokeWidth={1.6} aria-hidden="true" />
              <span>Index</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="site-index"
            ref={menuRef}
            className={styles.menu}
            role="dialog"
            aria-modal="true"
            aria-label="Site index"
            tabIndex={-1}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.3 }}
          >
            <div className={styles.menuTop}>
              <span className={styles.menuMeta}>
                Global index / {site.year}
              </span>
              <button
                ref={closeRef}
                type="button"
                className={styles.menuClose}
                onClick={() => setMenuOpen(false)}
                aria-label="Close site index"
              >
                <X size={18} strokeWidth={1.6} aria-hidden="true" />
                <span>Close</span>
              </button>
            </div>

            <div className={styles.menuBody}>
              <nav className={styles.menuNav} aria-label="All sections">
                {navigation.map((item, index) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    className={styles.menuLink}
                    onClick={() => goTo(item.id)}
                    initial={reducedMotion ? false : { opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: reducedMotion ? 0 : 0.06 + index * 0.045,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <span className={styles.menuIndex}>{item.index}</span>
                    <span className={styles.menuLabel}>{item.label}</span>
                    <span className={styles.menuArrow} aria-hidden="true">
                      <ArrowUpRight size={20} strokeWidth={1.3} />
                    </span>
                  </motion.button>
                ))}
              </nav>

              <div className={styles.menuSide}>
                <AudioControls variant="menu" />
                <p className={styles.menuNote}>
                  Baddiethon is an experimental online hackathon about building
                  products people actually want to use.
                </p>
                <div className={styles.menuActions}>
                  <RegisterButton size="sm" />
                  <DiscordButton size="sm" />
                </div>
                <p className={styles.menuStatus}>
                  <span aria-hidden="true" />
                  {site.status}
                </p>
              </div>
            </div>

            <div className={styles.menuFoot}>
              <span>Build anything. Make people want it.</span>
              <span>Esc to close</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
