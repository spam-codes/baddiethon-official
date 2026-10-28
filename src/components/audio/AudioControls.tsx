"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { useAudio } from "./AudioProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./AudioControls.module.css";

interface AudioControlsProps {
  variant?: "bar" | "menu";
}

export function AudioControls({ variant = "bar" }: AudioControlsProps) {
  const { enabled, armed, pending, error, volume, toggle, setVolume } = useAudio();
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const label = pending
    ? "Connecting"
    : enabled
      ? "Sound on"
      : armed
        ? "Resume sound"
        : "Sound off";
  const VolumeIcon = enabled ? (volume > 0.55 ? Volume2 : Volume1) : VolumeX;

  if (variant === "menu") {
    return (
      <div className={styles.menuPanel} data-audio-control>
        <div className={styles.menuHead}>
          <span className="mono">Ambient transmission</span>
          <span className={styles.menuState} data-on={enabled}>
            {enabled ? "ON AIR" : armed ? "PAUSED" : "MUTED"}
          </span>
        </div>
        <button
          type="button"
          className={`${styles.menuToggle} ${enabled ? styles.isOn : ""}`}
          onClick={() => void toggle()}
          aria-pressed={enabled}
          disabled={pending}
        >
          <span className={styles.menuBars} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>{label}</span>
        </button>
        <label className={styles.menuRange}>
          <span className="mono">Volume</span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={Math.round(volume * 100)}
            onChange={(event) => setVolume(Number(event.target.value) / 100)}
            aria-label="Ambient audio volume"
          />
          <span className={styles.percent}>{Math.round(volume * 100)}%</span>
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <p className={styles.note}>
          Generated live in your browser. No track, no licence, no autoplay.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.audio} ref={wrapRef} data-audio-control>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => void toggle()}
        aria-pressed={enabled}
        aria-label={`${label}. Toggle ambient audio`}
        disabled={pending}
      >
        <span className={styles.bars} data-on={enabled} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className={styles.label}>{label}</span>
      </button>

      <button
        type="button"
        className={styles.expand}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Audio volume settings"
      >
        <VolumeIcon size={14} strokeWidth={1.7} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.panel}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.panelHead}>
              <span className="mono">Audio</span>
              <span className={styles.state} data-on={enabled}>
                {enabled ? "ON" : armed ? "PAUSED" : "OFF"}
              </span>
            </div>
            <label className={styles.rangeRow}>
              <span className="sr-only">Ambient audio volume</span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={Math.round(volume * 100)}
                onChange={(event) => setVolume(Number(event.target.value) / 100)}
              />
            </label>
            <div className={styles.panelFoot}>
              <span className={styles.percent}>{Math.round(volume * 100)}%</span>
              <button
                type="button"
                className={styles.miniToggle}
                onClick={() => void toggle()}
                disabled={pending}
              >
                {enabled ? "Mute" : "Play"}
              </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
