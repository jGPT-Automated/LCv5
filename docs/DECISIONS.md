# Decisions

One line per decision, newest last. Agents read this before changing anything.

- **D1** (2026-10-26) Rebuild the UI in a fresh repo (`LCv5`) on Expo SDK 58, from the official `create-expo-app` default template (`default@sdk-58`). The existing LocalCheck_Expo repo, its EAS project and its services are not touched.
- **D2** (2026-10-26) UI only. All data is mock data in `src/mock/`, ported from the LCPhoneV5 prototype. No network calls, keys or env vars.
- **D3** (2026-10-26) Tokens in `src/theme`. Near-duplicate values in the design were merged: `#9a9aaa` → `muted #9a9aa7`; ink alphas 0.08/0.09/0.1 → `border`, 0.12/0.13 → `borderStrong`, 0.16/0.18 → `control`, 0.2/0.22/0.24 → `controlStrong`. Spacing 9 and 11 snap to 8 and 10.
- **D4** (2026-10-26) Fonts are the static Google Fonts files: Inter 500/600/700/800 and Oswald 500/600/700. Design weights map 550→500, 650→600, 750/780→800 (Inter) and 630/650→600 (Oswald).
- **D5** (2026-10-26) Corner color washes (CSS radial gradients in the design) are drawn with SVG (`Glow`) so they match on iOS, Android and web.
- **D6** (2026-10-26) Sheets render in a root overlay so they cover the tab bar, as in the design.
- **D7** (2026-10-26) Drawer gesture: drag down past 30% of its height or flick faster than 800 pt/s to close; otherwise it springs back. Dragging up rubber-bands. Built on react-native-gesture-handler 3 (`usePanGesture`) and Reanimated 4.
- **D8** (2026-10-26) On web the app renders in a 430pt column so the Vercel preview reads like a phone.
- **D9** (2026-10-26) Not built in chunk 1, kept off screen instead of shown as dead buttons: Log game, New game sheet, Schedule grid, Compete page. Schedule and Compete tabs show a placeholder.
- **D10** (2026-10-26) Me page gets Activity / Friends / Inbox tabs (owner liked the tabs in the current app). Inbox mocks friend requests (Accept / Decline), score confirmations (Approve / Dispute) and game invites (Join / Skip).
- **D11** (2026-10-26) Settings has a "Preview data" section to switch mock court load (empty / normal / packed) and your tier, so every state can be reviewed on the web preview.
- **D12** (2026-10-27) Motion: intentional, in components only, on the moments listed in DESIGN.md (commit presses, tab and segment changes, icon swaps, rolling counts, the check-in header, sheets, the live dot). Routine taps dim instantly. Techniques learned from beUI Native (springs, number ticker) and Jakub Krehel's polish rules (0.96 press, no-bounce icon swaps). Neither library is installed.
- **D13** (2026-10-27) One page frame: `Page` draws the only header, fixed, on every screen; content scrolls in `PageScroll`. Fixes the Me header that scrolled away.
- **D14** (2026-10-27) Screens choose text by named style (`t="rowTitle"`), never by size. The type scale and when to use each style are in DESIGN.md.
- **D15** (2026-10-27) `check:design` fails CI when a screen draws its own frame, type, radius or sizes, or skips `Page`. Verified by adding a screen with its own scrolling header: the check failed with four errors.
- **D16** (2026-10-27) Folders follow Expo's project-structure skill: screen bodies moved from `src/features` to `src/screens`.
- **D17** (2026-10-27) Gutter is 20pt everywhere, cards included (was 16 for cards, 20 for text). One leading edge.
- **D18** (2026-10-27) One row height (56pt) and three button sizes (36, 44, 50). Previously rows were 50, 56, 58 or 60 and buttons 34, 36, 44, 50 depending on the screen.
- **D19** (2026-10-27) The checked-in header shows on every tab page, not only Home (the earlier final-flow decision that check-in status is visible everywhere).
- **D20** (2026-10-27) Sub-agents run on Haiku or Sonnet, set explicitly. Work is proposed in chunks and signed off before it starts.
- **D21** (2026-10-27) Opt-out: `Glow.tsx` builds an `rgb()` string from a token's `glowRGB` value (`tokens-ok`). It's the only opt-out.
- **D22** (2026-10-29) Backend stays the current one (owner). Neon was looked at: its auth has no documented Expo or Sign in with Apple path and its realtime is beta without row-level security (`docs/research/flows.md`). Not wired; UI first.
- **D23** (2026-10-29) The preview opens signed in with sample data. No admin gate. Sign out (Settings) shows the real signed-out flow: welcome, sign in, onboarding. Settings keeps a "Sample data" section at the bottom.
- **D24** (2026-10-29) Wording is our own, not the previous app's, following `docs/COPY.md` (Apple HIG Writing, Material). Data points over sentences.
- **D25** (2026-10-29) Onboarding: name → location (While Using) → home court → auto check-in (Always) → alerts. Each permission on its own step, asked when tapped, with Not now (Apple HIG Privacy). Background location only works in a development build, not Expo Go.
- **D26** (2026-10-29) Illustrations are SVG from tokens in the website's style (topographic map, orange route, court rings, court lines). New `FlowPage` frame for sign-in and onboarding; the design check accepts `Page` or `FlowPage`.
- **D27** (2026-10-29) Avatar is a circle with initials, a thin tier ring set off by a gap, and an orange live dot. The friend bar and live bar are gone (owner disliked the old avatar).
- **D28** (2026-10-29) Explore card: sport left, place and distance top right, court name centered on up to two lines over court lines, live and locals as numbers, Check in. Saving a court moved to a labeled Save button in the court page header.
- **D29** (2026-10-29) Games have a review state: logged → waiting on the other side (auto-approves in 3 days) → final; disputed → the logger accepts the fix or it voids in 7 days. Inbox "Needs you" holds score reviews, friend requests and invites with the answer inline.
- **D30** (2026-10-29) Names open profiles and games open the game page everywhere (`PlayerRow`, `MatchRow`, `ScoreCard`). Challenges are friends only.
- **D31** (2026-10-29) Pushed pages keep the default edge swipe back (no `fullScreenGestureEnabled`), from the main app's swipe-back bug.
- **D32** (2026-10-29) Reverts D27 and D28 (owner): avatars are the V5 rounded squares again, the Explore card is the V5 card, Save on the court page is the bookmark. The circle avatar and the redesigned card were mine, not asked for.
- **D33** (2026-10-29) Schedule and Compete are built from the V5 design (S1–S3, C1): the week heat grid with Select / Only mine / Clear mine, the slot panel, the New game sheet; the rank card, tiers, key and board. A court's Week grid opens Schedule at the tapped time. The Schedule and Compete I designed in D29 era are removed.
- **D34** (2026-10-29) The game flow follows the current app's layout (owner): game score page (countdown, status card, timeline, Hide score), profile (header with ELO, Head to head / Activity / Details, H2H card), Log game (court, played day, matchup picker, typed score, review step), Me (header, Wins / Losses / Check-ins, tabs), inbox (Pending filter, search, game status cards). Wording is ours.
- **D35** (2026-10-29) Actions on pushed pages are pinned to the bottom (`Page` `footer`), not placed in the header or mid-page.
