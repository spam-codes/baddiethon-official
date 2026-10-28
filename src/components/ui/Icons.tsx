import type { SVGProps } from "react";

/** Minimal inline marks so we do not add a second icon dependency. */

export function DiscIcon({
  size = 16,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M8.2 6.4a12.6 12.6 0 0 1 7.6 0M6.5 17.1c3.6 1.6 7.4 1.6 11 0M8.2 6.4C6.2 9 5 12 5 15c1.1 1.2 2.5 2.2 4.1 3l1-1.6M15.8 6.4c2 2.6 3.2 5.6 3.2 8.6-1.1 1.2-2.5 2.2-4.1 3l-1-1.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.4" cy="12.2" r="1.35" fill="currentColor" />
      <circle cx="14.6" cy="12.2" r="1.35" fill="currentColor" />
    </svg>
  );
}

export function SparkIcon({
  size = 18,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 1.5 14.2 9.8 22.5 12 14.2 14.2 12 22.5 9.8 14.2 1.5 12 9.8 9.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CornerMarks({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 12V0h12M88 0h12v12M100 88v12H88M12 100H0V88" fill="none" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}
