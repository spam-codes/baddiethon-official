import type { FaqItem } from "@/types";

/**
 * FAQ copy is editable. Answers stick to confirmed information and
 * defer unconfirmed rules / eligibility to official channels.
 */
export const faqs: FaqItem[] = [
  {
    id: "what",
    question: "What is Baddiethon?",
    answer:
      "Baddiethon is an experimental hackathon where builders turn unconventional ideas into real products and focus on getting people to use them.",
    tag: "The event",
  },
  {
    id: "who",
    question: "Who can participate?",
    answer:
      "Anyone who enjoys building products and experimenting with ideas can participate, subject to the final event eligibility and registration rules.",
    tag: "Eligibility",
  },
  {
    id: "experience",
    question: "Do I need to be an experienced developer?",
    answer:
      "No. You should be willing to learn, experiment, and build. The specific requirements will depend on the final competition rules.",
    tag: "Eligibility",
  },
  {
    id: "build",
    question: "What can I build?",
    answer:
      "Almost anything. Your idea can be silly, ridiculous, entertaining, or useful. The important part is creating a product people want to use.",
    tag: "The build",
  },
  {
    id: "tracks",
    question: "What are the available tracks?",
    answer: "There are two tracks: AI Agents and Open Track.",
    tag: "Tracks",
  },
  {
    id: "agent-required",
    question: "Do I need to build an AI agent?",
    answer:
      "No. AI agents are one track. The Open Track welcomes products built using other technologies and approaches.",
    tag: "Tracks",
  },
  {
    id: "format",
    question: "How does the competition work?",
    answer:
      "Participants first submit a presentation explaining their idea. Shortlisted teams proceed to the next round, where they build and submit their products. The following phase focuses on promotion, user acquisition, and product performance. The final evaluation process will follow the official event rules.",
    tag: "Format",
  },
  {
    id: "promote",
    question: "Why do I need to promote my product?",
    answer:
      "Baddiethon encourages builders to think beyond coding. Promoting your product helps you reach real users, understand their needs, and evaluate whether your product offers genuine value.",
    tag: "Format",
  },
  {
    id: "prizes",
    question: "What are the prizes?",
    answer:
      "The rewards will be announced soon. Follow the official Baddiethon channels for updates.",
    tag: "Rewards",
  },
  {
    id: "updates",
    question: "Where can I get updates and connect with other builders?",
    answer:
      "Join the official Baddiethon Discord community and follow the event's official communication channels.",
    tag: "Community",
  },
  {
    id: "register",
    question: "Where can I register?",
    answer:
      "Use the Register button on the homepage. Registration will be available through the official registration link once it is configured.",
    tag: "Registration",
  },
  {
    id: "rules",
    question: "Where can I find the rules and deadlines?",
    answer:
      "The official rules, eligibility requirements, submission instructions, and final deadlines will be published through Baddiethon's official channels.",
    tag: "Registration",
  },
];
