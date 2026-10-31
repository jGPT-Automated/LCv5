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

These override anything above where they conflict.

1. **UI data remains mock.** All product data is in `src/mock/`; backend integration requires owner authorization. Hosted EAS previews are authorized for the separate LC+ project only (D13). Keep the LocalCheck_Expo repository, project and services untouched.
2. **Tokens only.** Colors, spacing, radius and type sizes come from `src/theme`. `npm run check:tokens` fails on raw values. Add a token before adding a one-off value, and log it in `docs/DECISIONS.md`.
3. **Use the shared pieces.** `Text`, `Button`, `Segmented`, `Avatar`, `Sheet`, `Glow`, `PageHeader`, `Screen` live in `src/components`. Don't restyle them inline per screen.
   **Design contract:** Before changing a screen, component, visual token,
   interaction or navigation pattern, read `docs/DESIGN_SYSTEM.md`. Name the
   closest existing page and reused components in the PR. Extend shared owners
   rather than copying them. Read `docs/DESIGN_SYSTEM_AUDIT.md` when touching an
   existing pattern so known defects are not copied as precedent. UI changes
   need a reference-page comparison and iOS/Android verification evidence;
   explicitly mark unavailable verification pending.
4. **One chunk per PR.** Each PR updates `docs/ROADMAP.md` (status), its `docs/chunks/NN-*.md` file, and `docs/DECISIONS.md` for any choice made.
5. **Before pushing:** `npm run check` (typecheck + token check) and `npm run export:web` must pass.
6. **Copy rules:** plain language, no emoji, no exclamation marks, first names only for other players.

## Layout

- `src/app/` routes only (Expo Router). Screens live in `src/features/<area>/`.
- `src/components/ui/` shared primitives, `src/components/nav/` header, tab bar, page frame.
- `src/mock/` mock data and pure helpers that derive what screens show.
- `src/state/AppState.tsx` in-memory app state (resets on reload).
- `docs/` roadmap, decisions, per-chunk records.
