"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { AmbientEngine } from "@/lib/audio-engine";
import {
  getAudioPreferences,
  getServerAudioPreferences,
  setAudioArmed,
  setAudioVolume,
  subscribeAudioPreferences,
} from "@/lib/audio-preferences";

interface AudioContextValue {
  enabled: boolean;
  /** Restored "on" intent from this session, waiting for a gesture to resume. */
  armed: boolean;
  pending: boolean;
  error: string | null;
  volume: number;
  toggle: () => Promise<void>;
  setVolume: (value: number) => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

/**
 * Ambient audio is OFF by default and only starts inside a user gesture.
 * Volume and the on/off preference are remembered for the session. A restored
 * "on" preference never autoplays: it arms the engine and resumes on the next
 * interaction outside the audio controls.
 */
export function AudioProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<AmbientEngine | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preferences live outside React so hydration can restore them without a
  // state write from an effect.
  const { volume, armed } = useSyncExternalStore(
    subscribeAudioPreferences,
    getAudioPreferences,
    getServerAudioPreferences,
  );

  useEffect(() => {
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  const toggle = useCallback(async () => {
    if (pending) return;
    setError(null);
    setAudioArmed(false);

    if (enabled) {
      engineRef.current?.stop();
      setEnabled(false);
      return;
    }

    setPending(true);
    try {
      if (!engineRef.current) {
        engineRef.current = new AmbientEngine();
      }
      engineRef.current.setVolume(volume);
      await engineRef.current.start();
      setEnabled(true);
      setAudioArmed(true);
    } catch {
      engineRef.current?.dispose();
      engineRef.current = null;
      setEnabled(false);
      setError("Audio unavailable on this device.");
    } finally {
      setPending(false);
    }
  }, [enabled, pending, volume]);

  /**
   * A restored preference resumes on the next deliberate gesture. Gestures
   * inside the audio controls are left to the toggle, so clicking "Resume
   * sound" does not start and immediately stop the engine.
   */
  useEffect(() => {
    if (!armed || enabled || pending) return;

    const onGesture = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-audio-control]")) {
        setAudioArmed(false);
        return;
      }
      void toggle();
    };

    window.addEventListener("pointerdown", onGesture, { passive: true });
    window.addEventListener("keydown", onGesture);
    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
  }, [armed, enabled, pending, toggle]);

  const setVolume = useCallback((value: number) => {
    const clamped = Math.min(1, Math.max(0, value));
    setAudioVolume(clamped);
    engineRef.current?.setVolume(clamped);
  }, []);

  return (
    <AudioContext.Provider
      value={{ enabled, armed, pending, error, volume, toggle, setVolume }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used inside AudioProvider");
  }
  return context;
}
