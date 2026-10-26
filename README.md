# LocalCheck v5 (UI pass)

A clean rebuild of the LocalCheck app UI on Expo SDK 58, built from the official
`create-expo-app` default template. **UI only:** every screen runs on mock data,
with no backend and no connection to the existing LocalCheck_Expo app or its services.

The source design is `LCPhoneV5` from the Claude Design handoff (LocalCheck_Final).

## Run it

```bash
npm install
npm run web          # dev server in the browser
npm run export:web   # static build in dist/ (what Vercel serves)
npm run check        # typecheck + design-token check
```

## Preview on Vercel

Import this repo in Vercel. `vercel.json` sets everything: it runs
`npx expo export --platform web` and serves `dist/` as a single-page app.
No environment variables are needed.

The web preview shows layout, color, type and flow. It does **not** show how
swipes and the drawer feel on a phone; that needs a device build in a later chunk.

## Docs

- `docs/ROADMAP.md` chunks and their status
- `docs/DECISIONS.md` decisions log
- `docs/chunks/` one record per chunk
- `AGENTS.md` rules for anyone (human or agent) working here
