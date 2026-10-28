import type { Track } from "@/types";

/** Exactly two tracks. Do not add a third without an explicit event decision. */
export const tracks: Track[] = [
  {
    id: "ai-agents",
    index: "01",
    name: "AI Agents",
    kicker: "Track 01 / Machine curiosity",
    hook: "Give a machine a job. Make it worth using.",
    description:
      "Build an agent that does something useful, ridiculous, or completely unexpected. Take it past the prompt box: let it act, connect, decide, or make a mess. Then give people a reason to use it — and a reason to come back.",
    examples: [
      "An agent that owns an entire annoying chore",
      "A tool that quietly eats a daily workflow",
      "A strange little agent for a very specific audience",
      "Something only an agent could pull off",
    ],
    accent: "acid",
    cta: "Open agent file",
  },
  {
    id: "open",
    index: "02",
    name: "Open Track",
    kicker: "Track 02 / Unclassified",
    hook: "No category. No excuses. Just make it land.",
    description:
      "Build any product you want. A game, a utility, a social experiment, a weird internet toy, a tool for twelve people who will love it. The technology is up to you. The only requirement is that a real person somewhere wants to use the thing.",
    examples: [
      "A silly micro-app your friends cannot stop using",
      "A sharp utility for an everyday friction",
      "An interactive experiment released into the wild",
      "A product that refuses to fit the startup categories",
    ],
    accent: "magenta",
    cta: "Open wildcard file",
  },
];
