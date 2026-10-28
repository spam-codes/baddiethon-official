"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/config/site";
import { useRegistration } from "./RegistrationProvider";
import { cn } from "@/lib/utils";

export function RegisterButton({
  className,
  size = "md",
  label = "Register",
}: {
  className?: string;
  size?: "md" | "sm";
  label?: string;
}) {
  const { openDialog } = useRegistration();
  const classes = cn("btn", "btn--primary", size === "sm" && "btn--sm", className);

  if (site.registrationUrl) {
    return (
      <a
        className={classes}
        href={site.registrationUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="btn__dot" aria-hidden="true" />
        {label}
        <ArrowUpRight size={14} strokeWidth={2} className="btn__arrow" aria-hidden="true" />
      </a>
    );
  }

  return (
    <button type="button" className={classes} onClick={openDialog}>
      <span className="btn__dot" aria-hidden="true" />
      {label}
      <ArrowUpRight size={14} strokeWidth={2} className="btn__arrow" aria-hidden="true" />
    </button>
  );
}

export function DiscordButton({
  className,
  size = "md",
  children = "Join Discord",
}: {
  className?: string;
  size?: "md" | "sm";
  children?: ReactNode;
}) {
  return (
    <a
      className={cn("btn", size === "sm" && "btn--sm", className)}
      href={site.discordUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowUpRight size={14} strokeWidth={2} className="btn__arrow" aria-hidden="true" />
    </a>
  );
}
