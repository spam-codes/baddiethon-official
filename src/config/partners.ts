import type { Partner } from "@/types";

/**
 * Confirmed community partners.
 * Empty until real partnerships are signed. Never populate with fictional orgs.
 * Each entry can include a logo path in /public/images, a short description,
 * and an external href.
 */
export const partners: Partner[] = [];

export const partnersEmptyState = {
  title: "The bench is forming.",
  body: "Community partners will appear here as they are confirmed. If you run a builder community and want to get weird with us, find us in Discord.",
  ctaLabel: "Pitch a partnership",
};
