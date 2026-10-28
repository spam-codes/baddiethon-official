# Assets & credits

Everything visual in this site comes from the supplied Baddiethon artwork, the
project's own code, or open-source libraries. No stock photography, no
third-party track, no unlicensed logo was added.

---

## Artwork provenance

| File in this repo | Used by | Source |
| --- | --- | --- |
| `public/images/poster-main.webp` (1254×1254) | Hero art column | `../V0/MainPoster.png` (1254×1254) |
| `public/images/poster-intro.webp` (1024×1536) | Cinematic intro background | `../graphics/IntroductionPoster.png` (1024×1536) |
| `public/images/og.jpg` (1200×630) | Open Graph / Twitter card | `../V0/MainPoster.png`, cropped for social |
| `SupportAsset.png` (1774×887) | *Not used* — kept as supplied source material | provided with the poster set |

Both in-app posters are converted to WebP at their **native** resolution, so the
site never ships an upscaled image. Run from the project root:

```bash
# hero
node -e "const sharp=require('sharp');sharp('../V0/MainPoster.png').resize({width:1254}).webp({quality:88,effort:6}).toFile('public/images/poster-main.webp')"

# intro
node -e "const sharp=require('sharp');sharp('../graphics/IntroductionPoster.png').webp({quality:80,effort:6}).toFile('public/images/poster-intro.webp')"
```

These are byte-identical to the files committed in `public/images/` (the `sharp`
binary comes from Next.js' own dependency tree, so no extra install is needed).

The wide `SupportAsset.png` (a 2:1 banner) is intentionally unused: there was no
section where it could be placed without inventing context, and the layout is
already composed around the two posters. The optimised copy that briefly existed
in `public/images/` was removed so no unused asset ships. If a banner slot is
wanted later (e.g. a footer strip or OG variant), regenerate from the source
rather than adding a new stock image.

Do not replace the posters with unrelated imagery, and do not generate or
approximate sponsor/partner logos.

---

## Typography

Loaded with `next/font/google` in `src/app/layout.tsx` (self-hosted at build
time, no runtime request to Google):

| Role | Family | Licence |
| --- | --- | --- |
| Display / wordmarks | **Bricolage Grotesque** | SIL Open Font License 1.1 |
| Body | **Instrument Sans** | SIL Open Font License 1.1 |
| Editorial serif | **Instrument Serif** | SIL Open Font License 1.1 |
| Meta / labels / buttons | **JetBrains Mono** | SIL Open Font License 1.1 |

Fallback stacks are declared in `src/app/globals.css` (`--font-display`,
`--font-body`, `--font-serif`, `--font-mono`) so the layout degrades gracefully.

---

## Icons

[`lucide-react`](https://lucide.dev) — ISC licence. Used for UI glyphs only
(arrows, close, volume, alert). The Discord mark and the custom agent/wildcard
illustrations are hand-built SVG/CSS components in `src/components/`
(`ui/Icons.tsx`, `tracks/AgentCharacter.tsx`, `tracks/WildcardVisual.tsx`).

---

## Audio

There is **no audio file** in this repository. The ambient bed is synthesised in
the browser by `src/lib/audio-engine.ts` with the Web Audio API (filtered
oscillator pad + noise wash + slow LFO movement). Consequences:

- nothing to license, attribute, or takedown;
- no network request, no buffering state;
- it can only start from a user gesture, and it degrades to silence if the
  AudioContext is unavailable.

If a real licensed track is ever added, record its title, artist, licence, and
source URL here, and keep the existing gesture-gated behaviour.

---

## Libraries

| Package | Licence |
| --- | --- |
| Next.js / React | MIT |
| GSAP + ScrollTrigger | GreenSock standard "no charge" licence (free for this use, not OSI) |
| Motion for React | MIT |
| Lenis | MIT |
| Tailwind CSS (`@import "tailwindcss"` preflight) | MIT |
| lucide-react | ISC |

The design system itself (tokens, layout, art direction, grain/scanline
textures, clipped-corner components) is original to this project and lives in
`src/app/globals.css` plus the per-component CSS Modules.
