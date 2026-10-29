# Copy

How LocalCheck talks. Every label, button, empty state and dialog follows
this. Sources are listed at the end; the research behind them is in
`docs/research/flows.md`.

## Voice

- Plain words a player would say: court, run, check in, game, score.
  Never "geofence", "session", "entity", "verification".
- Talk to "you". No "we".
- No exclamation marks, no emoji.
- First names only for other players. Last initials only on profiles.

## Data before sentences

A number says more than a sentence about the number. Prefer the data point.

| Instead of | Write |
|------------|-------|
| "No one has checked in here yet. Check in first." | `0` with the label `Live now` |
| "There are 9 people going at 6 PM." | `9 going` |
| "You have no plans scheduled for this day." | `0 plans this day` |
| "This game will be approved automatically in 2 days." | `Auto-approves in 2d 21h` |

Sentences are for the few places that explain a choice: onboarding leads,
dialog bodies, settings that need a line under them. One or two short lines.

## Headlines and labels

- **Headlines** (onboarding, sheet titles, page heroes) are short and end
  in an orange period: "Find your run." "Your court." "Auto check-in."
- **Section labels** name what's below: "Your plans · 1", "Needs you · 4".
  A count after a middle dot when it helps.
- **Rows**: the title is the thing ("Beat Marcus", "Rancho Park"), the line
  under it is the context ("1v1 · Ranked · Rancho Park · Today").

## Buttons

- Start with a verb: Check in, Join, Approve, Post game, Send dispute,
  Use location, Turn on alerts.
- Name the thing for destructive actions: "Delete account", "Remove friend".
  Never "OK" or "Yes".
- One dismiss word per kind: **Cancel** in dialogs, **Not now** for
  permission and upsell screens, **Done** to close a picker.
- The state after a press reads as a state: "Checked in", "Saved",
  "Requested", "Challenge sent".

## Empty states

One short line, data-first where it fits, no call to action in the text.
The action, if any, is a separate button.

- `0 plans this day` · `No runs posted` · `All caught up` · `No activity yet`

## Errors

Say how to fix it, next to the field it's about.

- "Enter an email like name@example.com"
- "Use at least 8 characters"
- "Scores can't be tied"

## Dialogs

- Title: the question or the action. "Delete account?" "Dispute score"
- Body: what will happen, in one or two lines. "Your profile, games, friends
  and check-ins are removed. This can't be undone."

## Permissions

Each permission gets its own screen, asked when it's needed, with a reason
and a way to skip (Apple HIG, Privacy).

- Location (While Using): "Use your location to see nearby courts and check in with one tap."
- Location (Always), for auto check-in: "Checks you in when you get to your court and out when you leave. Needs location set to Always."
- Notifications: "Only what needs you. Change these in Settings."

System purpose strings (in `app.json`) are full sentences about what the
app does with it, per Apple's guidance.

## Capitals

The display face (Oswald) and the small tracked labels (eyebrows, section
labels, buttons) render in capitals through the type styles; that's the
LocalCheck look from the website. Everything you read as a sentence is
sentence case. Write all copy in sentence case in code; the style handles
the capitals.

## Sources

- Apple Human Interface Guidelines, Writing: developer.apple.com/design/human-interface-guidelines/writing
- Apple HIG, Onboarding: developer.apple.com/design/human-interface-guidelines/onboarding
- Apple HIG, Privacy: developer.apple.com/design/human-interface-guidelines/privacy
- Material Design, Writing: m1.material.io/style/writing.html
- Material Design, Empty states: m2.material.io/design/communication/empty-states.html
- Owner direction (2026-10-29): data points over sentences ("0 check-ins", "0 live right now").
