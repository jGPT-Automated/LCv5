# Roadmap

Goal: a UI pass good enough to decide whether to continue the rebuild. Each chunk
is one PR with its own record in `docs/chunks/`. Nothing touches a backend until
the owner says so.

| # | Chunk | Status | Record |
|---|-------|--------|--------|
| 1 | Foundation + first screens: SDK 58 starter, tokens, shared pieces, tab shell, Home (Today / Week / Players), Explore list + map + drawer, court page, Me (Activity / Friends / Inbox), Settings. Web preview on Vercel. | In review | [01-foundation](chunks/01-foundation.md) |
| 2 | Owner review fixes from chunk 1 (Explore card, add-to-list flow, anything else flagged). | Planned | |
| 3 | Schedule: week grid, tap/drag multi-select, New game sheet. | Planned | |
| 4 | Compete: rank card, tiers, leaderboard, Log game sheet. | Planned (owner may design this one) | |
| 5 | Game card and game screen. | Planned | |
| 6 | Feel on a device: run on a phone, tune drawer and carousel gestures, haptics. | Planned | |
| 7+ | Wire real data, read-only first. Only after the owner approves the UI. | Not started | |

Status values: Planned, In progress, In review, Approved.

LC+ hosted Expo Go preview: In progress. A dedicated GitHub branch publishes
both platforms to the separate LC+ EAS project; no native build is requested.

Design-system audit and reuse contract: In review.
See [contract and enforcement](chunks/02-design-contract.md).
