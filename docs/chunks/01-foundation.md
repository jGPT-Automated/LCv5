# Chunk 1: Foundation and first screens

Status: In review

## Goal
See the feel of v5 (backgrounds, cards, type, flow) on a web preview, on a clean
SDK 58 base, before any wiring.

## In scope
- SDK 58 default template, stripped of demo content.
- Design tokens (`src/theme`) and a token check (`npm run check:tokens`).
- Shared pieces: Text, Button, IconButton, Bookmark, SportTag, Segmented, EmptyRow, Avatar (tier ring, top 5, friend and on-court bars), AvatarStack, LiveDot, Glow, Sheet, Overlay, HourBars, PageHeader, Screen, TabBar.
- Home: header (Check in → orange checked-in bar with Check out), swipeable saved-court carousel with dots and a name dropdown, tabs:
  - Today: hour bars with drag-to-scrub, timeline with later hours on top, NOW row listing who's on court.
  - Week: planned-visit heat grid, Plan in Schedule, upcoming games with Join.
  - Players: Ranked / Recent / All.
- Explore: List (Saved, Near you) and Map placeholder, court cards with save and check in, court drawer.
- Court page (from the drawer): Home layout for one court with back, save and check in.
- Me: profile card by tier, stats, this week, tier progress, Activity / Friends / Inbox.
- Settings: privacy and notification toggles (mock), account rows, Preview data controls.
- Vercel config for a static web preview.

## Out of scope (later chunks)
Schedule grid, Compete, Log game, New game, game screen, real map, real data, device builds.

## Done when
- `npm run check` and `npm run export:web` pass.
- Owner has reviewed the Vercel preview and listed changes.

## Checks run
- Typecheck and token check pass.
- Web export builds; every screen rendered at 402×874 in Chromium with no console errors: Home (not checked in, checked in), Week, Players, Explore list, drawer, court page, map, Me (Activity, Inbox), Settings.
- ESLint not set up: `expo lint` needs network access to install its config, which this build environment blocks.

## Owner feedback
_(to fill in after review)_
