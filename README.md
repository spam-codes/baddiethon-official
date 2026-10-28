# Baddiethon 2026 — event site

A single-page, dark-cinematic event site for **Baddiethon 2026**: an experimental
hackathon about building things real people actually want to use.

Nine sections — Home, About, Timeline, Tracks, Rewards, Partners, Sponsors, FAQs,
Footer — wrapped in a poster-driven intro, a procedural ambient soundtrack, and
scroll-linked editorial motion.

```
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind (preflight only)
GSAP + ScrollTrigger · Motion for React · Lenis · lucide-react
CSS Modules for all layout and art direction
```

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint (react-hooks + next rules)
```

Node 20+ is expected. No environment variables are required to run locally;
`NEXT_PUBLIC_SITE_URL` is optional and only used for canonical metadata.

---

## Where to edit content

Everything an organiser is likely to change lives in `src/config/`. Components
never hard-code event copy.

| File | Controls |
| --- | --- |
| `src/config/site.ts` | Event name, tagline, description, status line, **registration URL**, Discord URL, contact email, canonical URL, `datesConfirmed`. |
| `src/config/navigation.ts` | Section labels/indices and which items appear in the compressed desktop bar. |
| `src/config/timeline.ts` | Seven milestones grouped into OCT / NOV / DEC, plus the "provisional" note. |
| `src/config/tracks.ts` | The two tracks only: **AI Agents** and **Open Track**, with hooks, descriptions, examples, and accent colour. |
| `src/config/rewards.ts` | The sealed rewards state. Copy is limited to "A LOT OF REWARDS." / "REVEALING SOON." until real rewards exist. |
| `src/config/partners.ts` | Confirmed partners. Ships **empty** on purpose — the UI has a designed empty state. |
| `src/config/sponsors.ts` | Confirmed sponsors/tiers. Ships **empty** on purpose. |
| `src/config/faqs.ts` | The twelve FAQs, in order. |
| `src/types/index.ts` | Shared types for all of the above. |

### Registration is intentionally gated

`site.registrationUrl` is empty. When it is empty the Register buttons open a
"not open yet" dialog that points people to Discord instead of inventing a form.
Set a real URL and every Register CTA becomes a normal external link (the dialog
also switches to its "live" state automatically).

```ts
// src/config/site.ts
registrationUrl: "https://…",      // ← add the real form here
```

### Answers that must not be invented

- Rewards: no amounts, no tiers, no sponsors, no guaranteed benefits.
- Partners/sponsors: no organisations, logos, or tiers until confirmed.
- Schedule: `datesConfirmed: false`; every date on the page is driven by config
  and labelled provisional.
- Tracks: exactly two. Do not add a third without a product decision to do so.

---

## Intro and audio behaviour

**Cinematic intro** (`src/components/intro/`)

- ~7.5s layered poster sequence, no video dependency.
- `Skip intro` button and <kbd>Esc</kbd> jump to the end.
- Plays once per browser session (`sessionStorage` key `baddiethon:intro-seen`).
- `?intro=1` forces a replay for reviews/recordings (it clears the session flag).
- Skipped entirely for `prefers-reduced-motion: reduce`, and never replays on
  internal navigation.
- A pre-paint inline script in `src/app/layout.tsx` hides the overlay before
  hydration for returning visitors, so there is no flash of the intro.

**Ambient audio** (`src/components/audio/`, `src/lib/audio-engine.ts`)

- Off by default and only ever starts inside a user gesture.
- Toggle in the nav bar; volume slider (also keyboard operable, 5% steps).
- Volume persists per session (`baddiethon:volume`).
- An "on" preference persists too (`baddiethon:audio`) but does **not** autoplay:
  it shows "Resume sound" and resumes on the next deliberate interaction outside
  the audio controls.
- Fully synthesised with the Web Audio API — no licensed track, no network
  request, and it fails silently (with a visible error) on devices without audio.

---

## Accessibility & motion

- Keyboard: skip link, focus-visible rings everywhere, focus trap + restore in
  the track and registration dialogs and the mobile index, <kbd>Esc</kbd> closes
  overlays, accordion works with <kbd>Enter</kbd>/<kbd>Space</kbd>.
- No horizontal scrolling at 1440, 1280, 820, or 390 CSS pixels. Decorative
  marquees/ghost type are clipped by design, not by accident.
- Scroll is never hijacked: Lenis only smooths wheel input, and reduced-motion
  users get native scrolling, static About statements, and no intro.
- Only one scroll system: Lenis drives the page, GSAP's ticker drives Lenis, and
  ScrollTrigger listens to Lenis. Section targets carry `scroll-margin-top`
  (`86px`); `scrollTo()` therefore takes no nav offset — passing one would
  double-count it.

---

## Artwork & credits

See [`ASSETS.md`](./ASSETS.md) for provenance, licensing, and how the images
were derived from the supplied posters.

---

## Deployment checklist

- [ ] Put the real registration URL in `src/config/site.ts`.
- [ ] Confirm the Discord invite (`https://discord.gg/EAGZJbEdp8`) is still live.
- [ ] Confirm the schedule; flip `datesConfirmed` and update the timeline copy.
- [ ] Add confirmed partners/sponsors (leave empty otherwise).
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production origin.
- [ ] Run `npm run lint && npm run build`.
- [ ] Spot-check the intro on a cold session and with `?intro=1`.
- [ ] Spot-check reduced motion (system setting) and keyboard-only navigation.
- [ ] Run `npx playwright` checks or the manual checklist below on a deployed URL.

### What has been verified locally

- `npm run lint` clean (no errors, no warnings), `npm run build` clean.
- Playwright/Chromium passes covering: intro skip/persistence/forced replay,
  reduced-motion skip, About scrub states, both track modals, the registration
  dialog hand-off, audio toggle/persistence/resume/volume, the twelve-FAQ
  accordion (keyboard + single-open), mobile menu focus trap, section navigation
  offset, dialog scroll-lock release, and zero console errors.
- Geometry audit at 1440×900, 1280×800, 820×1024, 390×844 for clipping, element
  overlap, and off-section spill.

Manual checks still worth doing on real hardware: Safari + iOS audio unlock,
device-specific reduced-motion, and a visual pass of the poster crops on wide
(>1920px) monitors.

---

## Project map

```
src/app/            layout, metadata, single page composition, global tokens
src/components/     one folder per section + intro/audio/providers/registration
src/config/         editorial content and event facts (edit here)
src/hooks/          reduced motion, modal focus/scroll-lock plumbing
src/lib/            GSAP setup, Web Audio engine, session audio store, utils
src/types/          shared content types
public/images/      optimised poster artwork + Open Graph image
```
