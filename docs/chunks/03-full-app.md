# Chunk 3: The rest of the app, on sample data

Status: In review

## Why
The owner wants to see the whole app working end to end before any backend
work: every name opens a profile, every game opens a game, sign-in and
onboarding exist, Settings reads like a standard app. Wording and flow are
our own, grounded in Apple's and Material's guidance (`docs/COPY.md`,
`docs/research/flows.md`), not carried over from the previous app.

## What changed
- **Sign-in and onboarding** (`FlowPage`): welcome, create account / sign
  in (Apple first, email, reset password), then name → location (While
  Using, asked on tap) → home court → auto check-in (Always, explained
  with the 150 m / 5 min / Hide data points) → alerts. Illustrations in the
  website's style.
- **Settings** rewritten: Playing, Privacy (who sees you, blocked),
  Location (auto check-in, access), Notifications, LocalPlus, Account (sign
  out, delete with confirmation), Support, Sample data.
- **Schedule**: day strip, your plans, runs at your courts, busy times per
  court; Plan sheet adds a time or posts a run.
- **Compete**: your tier and progress, games waiting on your review,
  leaderboard (your court, friends, all courts), tiers. Log game.
- **Log game**: format, court, teams, score steppers, ranked; posts as
  waiting on the other side.
- **Game page**: scoreboard, approve or dispute (corrected score + note),
  disputed state with accept, ELO changes, players, history.
- **Player profile**: tier, rank, stats, add friend / accept / requested,
  challenge (friends only), head to head, recent games, details, report
  and block.
- **Inbox** (Me): "Needs you" with inline answers, then "Earlier".
- **Court page**: new Activity tab (games and check-ins); labeled Save in
  the header.
- **Explore card** redesigned (D28); **Add a court** flow.
- **Avatar** redesigned (D27).
- New components: `FlowPage`, `Field`, `ChoiceList`, `ListRow`, `Dialog`,
  `Stepper`, `DayStrip`, `Chip`, `Badge`, `Pill`, `MatchRow`, `ScoreCard`,
  and the art set. Logged in DESIGN.md.
- `app.json`: expo-location plugin with purpose strings and background
  location enabled for future development builds.

## How it was checked
- `npm run check` (typecheck, tokens, design) passes.
- `expo export --platform ios` compiles.
- Web build walked with Playwright: every route and the main flows
  (onboarding steps, dispute, plan, inbox, court activity, drawer, settings
  dialog). No console errors. Screenshots in `03-screens/`.
- Not checked on a phone. Permission prompts and haptics need a device.

## Revision after owner review (2026-10-29)
- Reverted my avatar and Explore card changes (D32).
- Schedule and Compete rebuilt from the V5 design (D33).
- Game score, profile, Log game, Me and inbox rebuilt on the current app's
  layouts, actions pinned to the bottom (D34, D35).
- Removed: my Schedule/Plan sheet, my Compete, ScoreCard, DayStrip, Badge.

## Not in this chunk
Backend wiring, real map, push delivery, device tuning (chunk 4).
