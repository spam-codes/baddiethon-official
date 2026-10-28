import type { SocialLink } from "@/types";

/**
 * ─────────────────────────────────────────────────────────────
 *  BADDIETHON / CENTRAL EVENT CONFIG
 * ─────────────────────────────────────────────────────────────
 *  Edit event-wide values here. Components read from this file;
 *  nothing here should be duplicated inside the UI.
 *
 *  ⚠️  PLACEHOLDERS
 *  - registrationUrl is intentionally EMPTY until the official
 *    form is live. The Register button shows a "not open yet"
 *    transmission instead of inventing a link.
 *  - discordUrl is carried over from the previous Baddiethon
 *    build. Replace it if the invite has changed.
 *  - datesConfirmed is false: the schedule is provisional.
 */
export const site = {
  name: "Baddiethon",
  wordmark: "BADDIETHON",
  edition: "2026",
  year: 2026,
  kicker: "An experimental hackathon",
  tagline: "Build anything. Make people want it.",
  supportingLine: "Stop building for judges. Start building for people.",
  description:
    "Baddiethon is an experimental hackathon for builders who would rather ship something strange than add another dead repository to the graveyard. Build a product. Find real users. Make people want it.",
  shortDescription:
    "An experimental hackathon about building things people actually want to use.",
  location: "Online / Worldwide",
  format: "Online hackathon",
  status: "Registration opens 30 Oct",
  statusShort: "Reg. opens 30.10",
  copyright: "Baddiethon. Built with bad ideas.",
  datesConfirmed: false,
  scheduleNote: "Schedule provisional. Final dates confirmed through official channels.",

  // ── LINKS (see placeholders above) ─────────────────────────
  registrationUrl: "",
  discordUrl: "https://discord.gg/EAGZJbEdp8",
  contactEmail: "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const socials: SocialLink[] = [
  { label: "Discord", href: site.discordUrl },
];

export const isRegistrationOpen = Boolean(site.registrationUrl);
