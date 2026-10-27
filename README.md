# LocalCheck

Find a court, see who's there and who's coming, check in, and play. Built with
Expo SDK 58 and Expo Router.

## Start here

- `docs/DESIGN.md`: the design system. Every screen is built from it.
- `AGENTS.md`: how work happens in this repo, for people and agents.
- `docs/ROADMAP.md`: chunks and their status. `docs/DECISIONS.md`: decisions.

## Run it

```bash
npm install
npm start            # Expo dev server (iOS, Android, web)
npm run check        # typecheck + token check + design check
npm run export:ios   # compile the iOS bundle
```

## Structure

```
src/app/          routes (Expo Router)
src/screens/      screen bodies
src/components/   shared components: layout/, ui/, court/
src/theme/        design tokens
src/state/        app state
src/mock/         sample data
```

## CI

`.github/workflows/ci.yml` runs `npm run check` and an iOS bundle build on
every pull request.
