import type { Sponsor } from "@/types";

/**
 * Confirmed sponsors.
 * Keep this empty until agreements are final. Tiers are not invented here;
 * use the `tier` field once official tier names are locked.
 */
export const sponsors: Sponsor[] = [];

export const sponsorsEmptyState = {
  title: "The wall is empty.",
  body: "Sponsor slots are not public yet. Brands backing the chaos will be listed here once confirmed. No fake logos, no imaginary backers.",
  ctaLabel: "Back the chaos",
};
