# LocalCheck design system

The contract for every screen. Screens are assembled from the shared
components; they never draw their own frame, type, radius or sizes.
`npm run check` enforces it and CI runs it on every pull request.

Values live in `src/theme/` (one entry point: `import { … } from '@/theme'`).
The visual source is the LCPhoneV5 design (Claude Design handoff); values in
the theme are taken from its source.

## Principles

1. **One way to do each thing.** A header, card, row, section, button and
   sheet look and behave the same everywhere.
2. **What matters first.** Who's here, who's coming, who's the best. On a
   court, the live count and the people lead.
3. **Less friction, more certainty.** Checking in should take one tap (or
   none, with auto check-in), and being checked in should be unmistakable on
   every tab.
4. **Motion with intent.** Subtle, on the moments that matter, and missed when
   it's gone. Never on routine taps. See Motion.
5. **Dark only.** Orange is reserved for live, check-in and "you".
6. **Plain copy, data first.** Numbers over sentences ("0 live now", "9
   going"). No emoji, no exclamation marks, first names only for other
   players. Full rules: `docs/COPY.md`.

## Folders

Following Expo's project-structure guidance (`expo/skills`, `expo-project-structure`):

```
src/app/          routes only; each file renders a screen from src/screens
src/screens/      screen bodies, with their private pieces beside them
src/components/   shared components (layout/, ui/, court/)
src/theme/        tokens: color, space, radius, size, type, motion
src/state/        app state
src/mock/         sample data and the pure helpers that shape it
```

## Page frame

Every screen renders inside `Page` (`src/components/layout/Page.tsx`).

```
┌──────────────────────────────┐  status bar inset
│ [mark] TITLE        [action] │  header, 52pt, fixed, drawn only by Page
├──────────────────────────────┤
│  body: PageScroll, Pager,    │  only the body scrolls
│  Tabs, or a full-bleed view  │
├──────────────────────────────┤
│  Home Schedule Compete …     │  tab bar, 84pt (tab pages)
└──────────────────────────────┘
```

- **Tab pages:** `<Page title="Home" action={…}>`. Logo mark, title, one action.
- **Pushed pages:** `<Page title="Settings" back={{ label: 'Me', fallback: '/me' }}>`.
  Back button, title, one optional action. No tab bar.
- **Checked in:** while you're checked in, the header on every tab page eases
  to orange and shows "Checked in", the court and time, and Check out. Same
  height and position. Pushed pages keep their back header.
- A screen can't move, hide or scroll the header. Scrolling content goes in
  `PageScroll` (20pt gutter, 12pt top, 24pt bottom).

## Flow frame

Sign-in and onboarding use `FlowPage` (`src/components/layout/FlowPage.tsx`)
instead of `Page`: no tab bar, no title bar.

```
┌──────────────────────────────┐
│ [‹]  ▬▬▬▬ ▬▬▬▬ ▭▭▭▭     Skip │  back, progress, optional skip
│                              │
│        illustration          │  MapArt, RadiusArt, AlertArt, SplashArt
│                              │
│ HEADLINE.                    │  `splash`, period in orange
│ One or two lines of `lead`.  │
│ [ step's own controls ]      │  fields, choices
├──────────────────────────────┤
│ [      PRIMARY (orange)    ] │  pinned to the bottom
│ [      Not now (ghost)     ] │
└──────────────────────────────┘
```

One decision per step. Permission steps ask at that moment, after the
reason, and always have Not now.

## Illustrations

`src/components/art/Art.tsx`, SVG drawn from tokens. The language is the
website's: a dark topographic map, rooftops, an orange route converging on
a court, rings around it.

| Art | Where |
|-----|-------|
| `MapArt` | Welcome, location step, add-court confirmation |
| `RadiusArt` | Auto check-in: the court in its check-in circle, you arriving, the 5-minute hold |
| `AlertArt` | Notifications step |
| `SplashArt` | Sign in: the mark lit from behind |
| `CourtArt` | Court lines in the corner of court cards and profile cards |

Illustrations are decoration only (`pointerEvents="none"`); never put
information only in art.

## Type

Screens choose a style by name: `<Text t="rowTitle">`. Never a size.

| Style | Font | Size | When |
|-------|------|------|------|
| `splash` | Oswald 700, caps | 46 | Onboarding headlines only |
| `pageTitle` | Oswald 600, caps | 24 | Header title only |
| `hero` | Oswald 600, caps | 28 | The one name a screen is about: court on Home, you on Me |
| `sheetTitle` | Oswald 600, caps | 30 | A sheet's headline |
| `cardTitle` | Oswald 600, caps | 22 | A card's headline |
| `itemTitle` | Oswald 600, caps | 15 | Named things inside rows: games, runs |
| `statXL` | Oswald 600 | 46 | The live count on Home |
| `statL` | Oswald 600 | 26 | Stats in a sheet |
| `stat` | Oswald 600 | 20 | Stats on a card |
| `statS` | Oswald 600 | 16 | Numbers and times in rows |
| `rowTitle` | Inter 600 | 13 | A row's main line: names, plain titles |
| `lead` | Inter 500 | 15 | One or two lines under an onboarding headline or in a dialog |
| `body` | Inter 500 | 13 | Sentences, field text |
| `caption` | Inter 600 | 12 | A supporting sentence under a block |
| `meta` | Inter 500 | 11 | Place, distance, notes |
| `rowSub` | Inter 500 | 10.5 | A row's second line |
| `section` | Inter 800, caps, tracked | 10 | Section labels and tabs |
| `eyebrow` | Inter 800, caps, tracked | 9 | Small labels above a title |
| `micro` | Inter 800, caps, tracked | 7.5 | Stat labels, chart labels |

Rules: Oswald is for names and numbers, Inter for everything you read. Caps
only through the styles that already set them. One `hero` per screen.

## Spacing, radius, size

- **Gutter:** 20pt on every screen, cards included. One leading edge.
- **Rhythm:** 24pt between sections, 10pt from a section label to its content,
  8pt between cards, 12pt between items in a row.
- **Radius** comes from components: button 4, segment 7, control 8, card 16,
  sheet 25, pill 999.
- **Heights** come from `size`: compact control 36, button 44, large button 50,
  field 42 (search) / 50 (form `Field`), segment 32, tab 42, row 56,
  header 52, tab bar 84, art banner 260.

## Components

| Need | Component |
|------|-----------|
| Page frame | `Page` (with `footer` for a pushed page's actions, pinned to the bottom), `PageScroll`, `Pager` (swipe between items with dots), `TabBar`, `FlowPage` (sign-in, onboarding) |
| Group of content | `Section` |
| Surface | `Card` (optional sport or tier glow), `Group` (settings-style list) |
| List item | `Row`, `RowValue`, `PlayerRow` (opens the profile), `GameRow` (a scheduled run), `MatchRow` (a played game; opens it), `ListRow` (settings row: value + chevron, toggle, or trailing) |
| Numbers | `StatStrip`, `NumberTicker`, `LivePill`, `Stepper` (scores) |
| Game (current app's layout) | `StatusCard` (status band + body), `GameBoard` (title, date, scores, ELO, players), `Countdown` (time left), `Timeline` (history), `H2HCard`, `ProfileHeader`, `PlayerPicker` |
| Schedule and Compete (V5 design) | `ScheduleGrid` (week heat grid, tap or drag to select), `CourtSwitchButton` + `CourtMenu`, `PlayerBoard` (Ranked / Recent / All), `TierStrip` |
| Actions | `Button` (`compact`, `regular`, `large`), `IconButton`, `BookmarkButton` |
| Choice | `Segmented`, `Tabs`, `Switch`, `Menu`, `ChoiceList` (pick one), `Chip` (pick several, or a short option) |
| Input | `SearchField`, `Field` (labeled input with hint or error), `SelectField` (dropdown trigger), `ScoreField` (big typed score), `PlayedDays` (last 7 days) |
| Player | `Avatar` (rounded square from the V5 design: tier ring, top-5 fill, friend bar, live bar), `AvatarStack` |
| Court data | `HourBars`, `HeatGrid`, `WeekBars`, `CourtMap` |

Where screens come from: Home, court page, Explore, Schedule and Compete
follow the V5 design. The game flow (game score, profile, Log game, Me and
inbox) follows the current LocalCheck app's layout, rebuilt on these
components.
| Small parts | `SportTag`, `LiveDot`, `Dot`, `Rule`, `ProgressBar`, `Glyph`, `EmptyRow`, `Pill` (status) |
| Overlay | `Sheet` (via `useOverlay`, so it covers the tab bar), `Dialog` (a decision in a sheet: title, body, actions) |
| Art | `MapArt`, `RadiusArt`, `AlertArt`, `SplashArt`, `CourtArt` (see Illustrations) |

### Navigation

- A player's name or avatar opens their profile (`PlayerRow`, `GameBoard`,
  inbox items). Your own opens Me.
- A game in any list opens the game page (`MatchRow`).
- A court opens the court page.
- A pushed page's actions go in `Page` `footer`, pinned to the bottom. Not in
  the header, not in the middle of the page.
- Pushed pages use the standard edge swipe to go back. No full-screen swipe:
  it fights vertical scrolling and sideways scrollers.

### Button kinds

| Kind | Use |
|------|-----|
| `orange` | Check in, and live actions |
| `light` | The one primary action on a card or sheet (Approve, Post game) |
| `outline` | A secondary action that changes state (Join) |
| `ghost` | Navigation and low-stakes actions (Court page, Plan in Schedule) |
| `dark` | Actions on the orange header (Check out) |
| `here` | "You're here" state of a check-in button |

At most one `orange` or `light` button per surface.

## Motion

Techniques learned from beUI Native's springs and number ticker, and Jakub
Krehel's interface polish rules, built into our components. Every motion
respects the system Reduce Motion setting.

| Moment | What moves | Component | Values |
|--------|------------|-----------|--------|
| Commit actions (check in, approve, join, post) | Scales to 0.96 while pressed, firm haptic | `Button` (orange, light, outline, dark) | `spring.press` |
| Changing a tab or segment | The highlight glides to the new choice; selection tick | `Tabs`, `Segmented` | `spring.layout` |
| Saving a court, marking "going" | The icon cross-fades, scaling up from 0.25 | `IconSwap`, `BookmarkButton` | `spring.swap` (300ms, no bounce) |
| Someone checks in or out | The count rolls digit by digit | `NumberTicker` | `timing.digit` |
| Checking in or out | The header eases to orange and back | `Page` | `timing.header` |
| Opening, dragging, flicking a sheet | Follows the finger, keeps the flick speed | `Sheet` | `spring.sheet` |
| Someone is on court | The dot breathes | `LiveDot` | 1.2s loop |

Everything else responds instantly with a dim: rows, chips, links, scrolling,
navigation. Screens never animate on their own; motion lives in components.

### Surfaces

- Cards, groups, menus and sheets carry a 1pt highlight along the top edge
  (`color.topHighlight`), as in the V5 panels.
- Nested radii are concentric: outer radius = inner radius + padding.

## Adding or changing a component

1. Check the table above. If a component nearly fits, extend it with a new
   variant or size, not a copy.
2. Build it in `src/components/` from tokens only. Variants, sizes and states
   are explicit props; callers may adjust layout (margin, flex), never identity.
3. Add it to the Components table here, and to Motion if it moves.
4. Log the decision in `docs/DECISIONS.md`.
5. `npm run check` must pass.

## Enforcement

`npm run check` = typecheck + `check:tokens` + `check:design`.

`check:design` scans `src/screens` and `src/app` and fails on:

- importing `ScrollView`, `FlatList`, `Text`, `Pressable`, `Switch`,
  `TextInput`, `SafeAreaView` or `StyleSheet` from `react-native`,
- `useSafeAreaInsets` (only `Page` handles insets),
- `borderRadius`, `fontSize`, `fontFamily`, `fontWeight`, `letterSpacing`,
  `boxShadow`,
- a non-zero numeric `height`, `minHeight`, `maxHeight`, `width` or `minWidth`,
- `<Text>` with `size=` or `variant=` (use `t=`),
- a `*Screen.tsx` that doesn't render `<Page>` or `<FlowPage>`.

`check:tokens` fails on raw colors anywhere outside `src/theme`, and on raw
numbers for spacing, radius and font size.

A line can opt out with `// design-ok: <reason>` or `// tokens-ok: <reason>`.
Every opt-out is logged in `docs/DECISIONS.md`.
