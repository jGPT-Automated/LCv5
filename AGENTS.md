This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## LocalCheck v5 project rules

These override anything above where they conflict. Read `docs/DESIGN.md` before writing any UI.

### How work happens
1. **Chunks, signed off first.** Propose a chunk (what, why, files, how it will be checked) and wait for the owner's yes before building. One chunk per PR.
2. **Questions get answers, not actions.** When the owner asks a question, answer it with sources. Don't start work in the same turn unless asked.
3. **Verify, don't assume.** Check claims against code, docs or a run, and cite the source. If something is unverified, say so plainly.
4. **Sub-agents run on Haiku or Sonnet, set explicitly** (`model: "haiku"` or `model: "sonnet"`). Never leave the model unset. Give them a narrow, read-only brief.

### How UI is built
5. **Screens only compose shared components.** No header, scroll frame, font, radius or size of their own. `Page` owns the header; it never scrolls.
6. **Missing a component? Build it in `src/components/`,** following "Adding or changing a component" in `docs/DESIGN.md`. Never inline in a screen.
7. **Motion lives in components,** on the moments listed in `docs/DESIGN.md` Motion. Routine taps get an instant dim.
8. **Tokens only.** Values come from `src/theme`.
9. **Copy:** plain language, no emoji, no exclamation marks, first names only for other players.

### Data
10. **No backend yet.** Data comes from `src/mock/` until the owner explicitly approves wiring. No network calls, keys or env vars.

### Before pushing
11. `npm run check` (typecheck, token check, design check) must pass. CI runs it on every PR; a failing check marks the PR red.
12. Update `docs/ROADMAP.md`, the chunk record in `docs/chunks/`, and `docs/DECISIONS.md` for any decision.

## Layout

- `src/app/` routes only (Expo Router); each renders a screen from `src/screens/`.
- `src/screens/<area>/` screen bodies and their private pieces.
- `src/components/layout/` page frame, pager, tab bar. `ui/` shared primitives. `court/` court and player displays.
- `src/theme/` tokens. `src/state/` app state. `src/mock/` sample data and helpers.
- `docs/` design system, roadmap, decisions, chunk records.
