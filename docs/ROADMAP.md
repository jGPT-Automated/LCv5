# Roadmap

Goal: a UI pass good enough to decide whether to continue the rebuild. Each chunk
is one PR with its own record in `docs/chunks/`. Nothing touches a backend until
the owner says so.

| # | Chunk | Status | Record |
|---|-------|--------|--------|
| 1 | Foundation + first screens: SDK 58 starter, tokens, shared pieces, tab shell, Home, Explore, court page, Me, Settings. | Approved (merged, PR #1) | [01-foundation](chunks/01-foundation.md) |
| 2 | Design system: DESIGN.md, one page frame, shared components with intentional motion, design check in CI, every screen migrated. | In review | [02-design-system](chunks/02-design-system.md) |
| 2b | Explore card redesign and the add-a-court-to-list flow. | Planned | |
| 3 | Schedule: week grid, tap/drag multi-select, New game sheet. | Planned | |
| 4 | Compete: rank card, tiers, leaderboard, Log game sheet. | Planned (owner may design this one) | |
| 5 | Game card and game screen. | Planned | |
| 6 | Feel on a device: run on a phone, tune drawer and carousel gestures, haptics. | Planned | |
| 7+ | Wire real data, read-only first. Only after the owner approves the UI. | Not started | |

Status values: Planned, In progress, In review, Approved.
