/**
 * Shared types for Baddiethon content and UI state.
 * Keeping event copy typed makes the config files safe to edit.
 */

export type SectionId =
  | "home"
  | "about"
  | "timeline"
  | "tracks"
  | "rewards"
  | "partners"
  | "sponsors"
  | "faqs";

export interface NavItem {
  id: SectionId;
  label: string;
  index: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export type MilestoneState = "opening" | "upcoming" | "live" | "closed";

export interface TimelineMilestone {
  id: string;
  month: string;
  day: string;
  dateLabel: string;
  title: string;
  phase: string;
  description: string;
  state: MilestoneState;
}

export type TrackId = "ai-agents" | "open";

export interface Track {
  id: TrackId;
  index: string;
  name: string;
  kicker: string;
  hook: string;
  description: string;
  examples: string[];
  accent: "acid" | "magenta";
  cta: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tag: string;
}

export interface Partner {
  name: string;
  description?: string;
  href?: string;
  logo?: string;
}

export interface Sponsor {
  name: string;
  tier?: string;
  description?: string;
  href?: string;
  logo?: string;
}

export interface RewardSeal {
  code: string;
  state: string;
}
