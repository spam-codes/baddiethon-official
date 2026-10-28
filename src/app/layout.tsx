import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { RegistrationProvider } from "@/components/registration/RegistrationProvider";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { CustomCursor } from "@/components/cursor/CustomCursor";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const body = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const editorial = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: `${site.name} ${site.edition} — ${site.tagline}`,
    template: `%s / ${site.name} ${site.edition}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Baddiethon",
    "hackathon",
    "AI agents",
    "build products",
    "product hackathon",
    "online hackathon",
    "indie builders",
  ],
  openGraph: {
    title: `${site.name} ${site.edition}`,
    description: site.tagline,
    type: "website",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "Baddiethon" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} ${site.edition}`,
    description: site.tagline,
    images: ["/images/og.jpg"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#070706",
  colorScheme: "dark",
};

/**
 * Runs before first paint: avoid replaying the intro for returning visitors.
 * `?intro=1` forces a replay (useful for reviews and recordings).
 */
const introBootScript = `(function(){try{var k='baddiethon:intro-seen';if(new URLSearchParams(location.search).has('intro')){sessionStorage.removeItem(k);}else if(sessionStorage.getItem(k)||matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.setAttribute('data-intro','seen');}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${editorial.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
        <style>{`html[data-intro="seen"] [data-intro-overlay]{display:none!important}`}</style>
        <noscript>
          <style>{`[data-intro-overlay]{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <AudioProvider>
          <SmoothScrollProvider>
            <RegistrationProvider>
              {children}
              <GrainOverlay />
            </RegistrationProvider>
          </SmoothScrollProvider>
        </AudioProvider>
        <CustomCursor />
      </body>
    </html>
  );
}
