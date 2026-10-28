/**
 * Session-scoped audio preferences, read through `useSyncExternalStore`.
 *
 * Keeping them in a tiny external store (instead of copying sessionStorage
 * into React state from an effect) means:
 *  - the server render and the first client render agree (no hydration
 *    mismatch and no flash of the wrong label);
 *  - every auth/gesture path reads the same source of truth;
 *  - a stored "on" preference can be restored without ever autoplaying.
 */

export interface AudioPreferences {
  volume: number;
  /** Stored "on" intent, waiting for a user gesture before audio resumes. */
  armed: boolean;
}

const VOLUME_KEY = "baddiethon:volume";
const ENABLED_KEY = "baddiethon:audio";

const DEFAULT_PREFERENCES: AudioPreferences = { volume: 0.4, armed: false };

let cached: AudioPreferences | null = null;
const listeners = new Set<() => void>();

function clampVolume(value: number) {
  return Math.min(1, Math.max(0, value));
}

function readPreferences(): AudioPreferences {
  const preferences: AudioPreferences = { ...DEFAULT_PREFERENCES };
  try {
    const storedVolume = Number.parseFloat(sessionStorage.getItem(VOLUME_KEY) ?? "");
    if (Number.isFinite(storedVolume)) preferences.volume = clampVolume(storedVolume);
    preferences.armed = sessionStorage.getItem(ENABLED_KEY) === "on";
  } catch {
    // Session storage can be unavailable in private modes; keep the defaults.
  }
  return preferences;
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeAudioPreferences(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAudioPreferences(): AudioPreferences {
  cached ??= readPreferences();
  return cached;
}

export function getServerAudioPreferences(): AudioPreferences {
  return DEFAULT_PREFERENCES;
}

export function setAudioVolume(value: number) {
  const volume = clampVolume(value);
  if (getAudioPreferences().volume === volume) return;
  cached = { ...getAudioPreferences(), volume };
  try {
    sessionStorage.setItem(VOLUME_KEY, String(volume));
  } catch {
    // Ignore storage failures; the in-memory value still applies.
  }
  emit();
}

export function setAudioArmed(armed: boolean) {
  if (getAudioPreferences().armed === armed) return;
  cached = { ...getAudioPreferences(), armed };
  try {
    sessionStorage.setItem(ENABLED_KEY, armed ? "on" : "off");
  } catch {
    // Ignore storage failures; the in-memory value still applies.
  }
  emit();
}
