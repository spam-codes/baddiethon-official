"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

interface ModalBehaviorOptions {
  open: boolean;
  onClose: () => void;
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared modal plumbing: scroll lock, Escape, focus trap, focus restore.
 * Works with or without Lenis (reduced motion uses native scroll).
 */
export function useModalBehavior({
  open,
  onClose,
  containerRef,
  initialFocusRef,
}: ModalBehaviorOptions) {
  const { stop, start } = useSmoothScroll();
  const onCloseRef = useRef(onClose);

  // Keep the latest close handler without re-running the lock/focus effect.
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    stop();

    const focusTimer = window.setTimeout(() => {
      const target =
        initialFocusRef?.current ??
        containerRef.current?.querySelector<HTMLElement>(FOCUSABLE) ??
        containerRef.current;
      target?.focus({ preventScroll: true });
    }, 40);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter(
        (element) =>
          element.offsetWidth > 0 ||
          element.offsetHeight > 0 ||
          element.getClientRects().length > 0,
      );

      if (focusable.length === 0) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      start();
      if (previous?.isConnected) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [open, containerRef, initialFocusRef, start, stop]);
}
