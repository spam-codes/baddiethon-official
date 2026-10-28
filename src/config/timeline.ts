import type { TimelineMilestone } from "@/types";

/**
 * Timeline content.
 * Dates are provisional until the official schedule is locked.
 * Add, remove, or reorder milestones here — the UI adapts.
 */
export const timeline: TimelineMilestone[] = [
  {
    id: "registration-opens",
    month: "OCT",
    day: "30",
    dateLabel: "30 OCT 2026",
    title: "Registration Opens",
    phase: "Round 01 / Entry",
    description:
      "Registration and Round 1 PPT submissions begin. Tell us what you want to build, who it is for, and why they would care.",
    state: "opening",
  },
  {
    id: "registration-closes",
    month: "NOV",
    day: "14",
    dateLabel: "14 NOV 2026",
    title: "Registration Closes",
    phase: "Round 01 / Deadline",
    description: "Final deadline to register and submit your Round 1 entry.",
    state: "upcoming",
  },
  {
    id: "round-two",
    month: "NOV",
    day: "16",
    dateLabel: "16 NOV 2026",
    title: "Round 2 Begins",
    phase: "Round 02 / Shortlist",
    description:
      "Shortlisted teams are announced and Round 2 begins. This is where the deck becomes a product.",
    state: "upcoming",
  },
  {
    id: "product-deadline",
    month: "NOV",
    day: "20",
    dateLabel: "20 NOV 2026",
    title: "Product Submission Deadline",
    phase: "Round 02 / Build",
    description:
      "Teams must build and submit their products by this date. Working, reachable, and ready for real people.",
    state: "upcoming",
  },
  {
    id: "growth-phase",
    month: "NOV",
    day: "20—30",
    dateLabel: "20–30 NOV 2026",
    title: "Growth Phase",
    phase: "Round 03 / Distribution",
    description:
      "Teams promote their products, market them, and bring in real users. This is the part most hackathons skip.",
    state: "upcoming",
  },
  {
    id: "final-evaluation",
    month: "NOV / DEC",
    day: "30—07",
    dateLabel: "30 NOV–07 DEC 2026",
    title: "Final Evaluation Week",
    phase: "Round 03 / Evaluation",
    description:
      "Final evaluation takes place while teams can continue improving performance and attracting users.",
    state: "upcoming",
  },
  {
    id: "final-results",
    month: "DEC",
    day: "15",
    dateLabel: "15 DEC 2026",
    title: "Final Results",
    phase: "The Reveal",
    description: "Final results are announced. Bring your users, your receipts, and your strange little product.",
    state: "upcoming",
  },
];

export const timelineGroups = [
  { month: "OCT", label: "October", note: "The signal" },
  { month: "NOV", label: "November", note: "The build" },
  { month: "DEC", label: "December", note: "The verdict" },
];
