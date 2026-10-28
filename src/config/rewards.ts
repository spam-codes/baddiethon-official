/**
 * Rewards are not publicly announced yet.
 * Nothing here claims an amount, sponsor, tier, or guaranteed benefit.
 * The UI shows sealed placeholders until real rewards are confirmed.
 */
export const rewardsAnnounced = false;

export const rewardsCopy = {
  kicker: "04 / The rewards",
  heading: "A LOT OF REWARDS.",
  subheading: "REVEALING SOON.",
  support: "The vault stays sealed until the official reveal.",
  note: "No amounts. No invented tiers. No imaginary prize pools.",
  cta: "Watch for the reveal",
} as const;

export const rewardSeals = [
  { code: "RWD—01", state: "Sealed" },
  { code: "RWD—02", state: "Sealed" },
  { code: "RWD—03", state: "Sealed" },
] as const;
