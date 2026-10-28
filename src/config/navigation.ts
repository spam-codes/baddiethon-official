import type { NavItem } from "@/types";

/** Primary desktop navigation. The mobile index shows every section. */
export const navigation: NavItem[] = [
  { id: "home", label: "Home", index: "00" },
  { id: "about", label: "About", index: "01" },
  { id: "timeline", label: "Timeline", index: "02" },
  { id: "tracks", label: "Tracks", index: "03" },
  { id: "rewards", label: "Rewards", index: "04" },
  { id: "partners", label: "Partners", index: "05" },
  { id: "sponsors", label: "Sponsors", index: "06" },
  { id: "faqs", label: "FAQs", index: "07" },
];

/** The compressed desktop bar; the rest live in the Index overlay. */
export const desktopNavigation = navigation.filter((item) =>
  ["about", "timeline", "tracks", "rewards", "faqs"].includes(item.id),
);
