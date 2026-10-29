# Research: flows, onboarding, wording, backend

Collected 2026-10-29 to ground chunk 3. Web research by Haiku sub-agents
(web only, no repo access), checked by the lead agent where noted.
"Unverified" means a source excerpt only, or no source found.

## Onboarding and permissions

1. Ask for a permission when the feature needs it, not at launch. Apple:
   "Ideally, wait to request permission until people actually use an app
   feature that requires access." (HIG, Privacy)
2. Ask for While Using by default. Always is for time-sensitive responses
   to location changes, like auto check-in. (Apple Core Location,
   "Requesting authorization")
3. A screen before a permission prompt has one button ("Continue" or
   similar) and no other actions. (HIG, Privacy)
4. Keep onboarding "fast, fun, and optional"; postpone nonessential setup.
   (HIG, Onboarding)
5. Prefer tips in context over a tutorial. (Nielsen Norman Group, Mobile
   app onboarding; HIG, Onboarding)
6. Offer Sign in with Apple when offering another third-party sign-in.
   (App Store Review Guideline 4.8; full text not scraped, check before
   shipping)
7. Account deletion must be available in the app if accounts can be
   created. (Guideline 5.1.1(v))
8. Give App Review a working demo account. (developer.apple.com/distribute/app-review)

Background location needs a development build; Expo Go can't grant it.
(docs.expo.dev/versions/latest/sdk/location, read by the lead agent)

How this shaped the build: welcome → account → name → location (While
Using) → home court → auto check-in (Always) → alerts. Each permission
step has its own illustration, a reason, the request, and Not now.

## Wording

See `docs/COPY.md` for the rules. Sources: Apple HIG Writing, Material
Design Writing and Empty states. Mailchimp and Polaris pages were not
verified.

## Reference layouts

- Schedule: Playtomic open matches (a public match others can join) and
  Luma (one-tap accept, visible guest list). Screen layouts unverified.
- Score approve/dispute: no reference app verified; our own design (a
  pending state on the game with Approve and Dispute).
- Inbox: Luma splits notifications by role. A combined "Needs you" list is
  our own design.
- Settings: HIG Lists and tables (grouped lists, chevrons on drill-in rows).

## Backend: Neon

Owner asked whether to build on Neon. Findings (lead agent read the Neon
pages for points 1 and 3):

1. Neon Auth is "Managed Better Auth". The overview page doesn't mention
   React Native, Expo or Sign in with Apple.
2. Neon Data API is PostgREST-style with JWT and Row Level Security.
3. Neon Realtime is in beta, lists Next.js/TanStack integrations (no React
   Native), and has no RLS yet: "Not yet ... we aim to add it by GA".

Owner decision (2026-10-29): keep the current backend for now; finish the
UI first. Not wired.

## Visual references

- localchecksports.com: dark topographic map, an orange route converging
  on a court, rings around it, court lines in card corners, data points
  ("0 LIVE NOW", "22 LOCALS").
- Main app splash: low-poly players lit in orange on black.
- Owner's Dribbble collection (Jesse-Taste): dark data dashboards, big
  numerals, one accent color, generous space.
- PanelUI: semantic color roles; native controls only where muscle memory
  matters (switch, picker, sheet).
