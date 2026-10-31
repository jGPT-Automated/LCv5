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
- **D12** (2026-10-28) The isolated Expo Go preview is named `LC+`, with slug and URL scheme `lcplus`. Do not link this checkout to another app's EAS project, publish updates, or replace existing app resources.
# LC+ hosted preview delivery

Owner authorized EAS publishing for LC+ separately from the original app.
Use GitHub Actions and project 4ca1add1-31b6-492a-8c84-f8c1b32264aa,
branch lcplus-preview and environment preview, for iOS and Android. This needs
no native build. Repository-scoped EXPO_TOKEN authenticates the runner.
No original LocalCheck project or repository is changed.

