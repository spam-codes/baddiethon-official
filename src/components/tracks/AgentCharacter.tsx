"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import styles from "./AgentCharacter.module.css";

interface AgentCharacterProps {
  className?: string;
  active?: boolean;
  showTag?: boolean;
}

/**
 * AGT-01. A hand-built SVG agent: one eye, one antenna, no manners.
 * Reusable across the track card, the detail modal, and the footer.
 */
export function AgentCharacter({
  className,
  active = true,
  showTag = true,
}: AgentCharacterProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;

    const apply = () => {
      frame = 0;
      wrap.style.setProperty("--look-x", targetX.toFixed(3));
      wrap.style.setProperty("--look-y", targetY.toFixed(3));
    };

    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const range = Math.max(220, rect.width * 1.4);
      targetX = Math.max(-1, Math.min(1, (event.clientX - cx) / range));
      targetY = Math.max(-1, Math.min(1, (event.clientY - cy) / range));
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn(styles.wrap, active && styles.active, className)}
      aria-hidden="true"
    >
      <svg viewBox="0 0 240 260" className={styles.svg} role="presentation">
        <defs>
          <linearGradient id="agent-face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1611" />
            <stop offset="1" stopColor="#0a0807" />
          </linearGradient>
          <radialGradient id="agent-glow" cx="50%" cy="35%" r="60%">
            <stop offset="0" stopColor="#e17a9e" stopOpacity="0.22" />
            <stop offset="1" stopColor="#e17a9e" stopOpacity="0" />
          </radialGradient>
          <pattern id="agent-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M16 0H0V16" fill="none" stroke="#f2eee3" strokeOpacity="0.05" strokeWidth="1" />
          </pattern>
        </defs>

        <rect x="0" y="0" width="240" height="260" fill="url(#agent-grid)" opacity="0.5" />
        <ellipse cx="120" cy="240" rx="86" ry="12" fill="#000" opacity="0.55" />
        <circle cx="120" cy="132" r="104" fill="url(#agent-glow)" />

        <g className={styles.halo}>
          <circle cx="120" cy="132" r="96" fill="none" stroke="#c9f94f" strokeOpacity="0.16" strokeWidth="1" strokeDasharray="2 10" />
        </g>

        <g className={styles.float}>
          {/* antenna */}
          <path d="M120 46V22" stroke="#c9f94f" strokeWidth="1.6" />
          <path d="M120 22l9-8-9-8-9 8z" fill="#c9f94f" />
          <circle cx="120" cy="8" r="3" fill="#e17a9e" className={styles.ping} />

          {/* head shell */}
          <path
            d="M56 50 L178 44 L184 146 L64 152 Z"
            fill="url(#agent-face)"
            stroke="#c9f94f"
            strokeWidth="2"
          />
          <path d="M56 50 L178 44 L184 146 L64 152 Z" fill="none" stroke="#c9f94f" strokeOpacity="0.18" strokeWidth="6" />
          <path d="M170 58l8-4v10" fill="none" stroke="#c9f94f" strokeWidth="1.2" opacity="0.7" />

          {/* eye socket */}
          <ellipse cx="120" cy="96" rx="45" ry="31" fill="#e17a9e" fillOpacity="0.1" stroke="#e17a9e" strokeWidth="1.4" />
          <ellipse cx="120" cy="96" rx="45" ry="31" fill="none" stroke="#e17a9e" strokeOpacity="0.25" strokeWidth="5" />

          {/* pupil */}
          <g className={styles.eye}>
            <circle cx="120" cy="96" r="15" fill="#c9f94f" />
            <circle cx="120" cy="96" r="6" fill="#070706" />
            <circle cx="125" cy="91" r="2.4" fill="#f2eee3" />
          </g>

          {/* eyelid */}
          <path d="M76 66 Q120 104 164 66 L164 122 Q120 152 76 122 Z" fill="#0a0807" className={styles.lid} />

          {/* mouth bars */}
          <g className={styles.mouth}>
            <rect x="100" y="134" width="5" height="8" fill="#c9f94f" opacity="0.8" />
            <rect x="110" y="134" width="5" height="12" fill="#c9f94f" opacity="0.9" />
            <rect x="120" y="134" width="5" height="6" fill="#e17a9e" />
            <rect x="130" y="134" width="5" height="10" fill="#c9f94f" opacity="0.7" />
          </g>

          {/* body + arms */}
          <path d="M84 158 L158 154 L150 208 L92 212 Z" fill="#0b0a08" stroke="#c9f94f" strokeOpacity="0.55" strokeWidth="1.4" />
          <path d="M104 172h40M100 184h50M108 196h36" stroke="#c9f94f" strokeOpacity="0.22" strokeWidth="1.4" />
          <path d="M84 168c-22 10-30 26-26 44" fill="none" stroke="#c9f94f" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M158 164c22 8 32 24 28 42" fill="none" stroke="#c9f94f" strokeWidth="1.6" strokeLinecap="round" />
          <g className={styles.handL}>
            <rect x="50" y="208" width="16" height="16" fill="#0b0a08" stroke="#c9f94f" strokeWidth="1.4" />
            <circle cx="58" cy="216" r="2.5" fill="#c9f94f" />
          </g>
          <g className={styles.handR}>
            <rect x="180" y="200" width="16" height="16" fill="#0b0a08" stroke="#e17a9e" strokeWidth="1.4" />
            <circle cx="188" cy="208" r="2.5" fill="#e17a9e" />
          </g>

          {/* wires */}
          <path d="M100 212c-6 20 8 28-2 42" fill="none" stroke="#c9f94f" strokeOpacity="0.5" strokeWidth="1.4" />
          <path d="M140 210c8 18-4 26 4 40" fill="none" stroke="#c9f94f" strokeOpacity="0.35" strokeWidth="1.4" />
        </g>

        <g className={styles.hud}>
          <path d="M28 34h10M28 34v10" stroke="#c9f94f" strokeOpacity="0.5" />
          <path d="M212 226h-10M212 226v-10" stroke="#c9f94f" strokeOpacity="0.5" />
          <text x="28" y="24" fill="#928c7d" fontSize="6" fontFamily="monospace" letterSpacing="1.5">
            AGT—01
          </text>
          <text x="196" y="244" fill="#928c7d" fontSize="6" fontFamily="monospace" letterSpacing="1.5">
            ONLINE
          </text>
        </g>
      </svg>

      {showTag && (
        <span className={styles.tag}>
          <span className={styles.tagDot} />
          Agent online
        </span>
      )}
    </div>
  );
}
