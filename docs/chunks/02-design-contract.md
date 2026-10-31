# Design-system audit and reuse contract

Status: In review

Goal: keep new features consistent with LC+ by reusing the current theme,
shared components and page patterns. No visual redesign or backend work.

Deliverables: `docs/DESIGN_SYSTEM.md`, `docs/DESIGN_SYSTEM_AUDIT.md`, an AGENTS
entry point, a PR review template, and structural guards in `npm run check` and
the Design contract GitHub workflow.

The guard blocks new raw native controls outside designated shared adapters,
detects aliased imports and local typography identity overrides, and limits
Home's two legacy raw Pressable usages. Existing token checks remain active.
The new checks are not a visual, contrast or native accessibility test.

Validation: `npm run check` passed (typecheck, token check, design ownership
check and all 7 guard regression tests). `npm run export:web` passed.
`npm run lint` still reports the 5 existing errors in `Sheet.tsx` (effect state
update and shared-value mutations). No lint suppressions were added.
Native runtime verification is not performed in this chunk, which changes
documentation and tooling without modifying rendered app code.
