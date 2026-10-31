# LC+ design-system audit — 2026-10-31

Scope: source review of `src/theme`, all shared component files and their screen
consumers; visual inspection of the saved Home and Me/Settings web captures.
No live native rendering, gesture or screen-reader testing was performed.

## Findings

| Area | Evidence | Assessment / next correction |
| --- | --- | --- |
| Theme | `src/theme/tokens.ts`, `type.ts`, `index.ts` | A single system already exists. Preserve its brand and extend it; no replacement theme is needed. |
| Token checks | `scripts/check-tokens.mjs` | Existing literal-color/spacing checks are useful but do not establish shared-component reuse, contrast or hierarchy. Add a separate primitive/typography boundary check. |
| Text | `Text.tsx`, `type.ts` | Shared fonts and typed sizes are in place; font scaling is inherited. A very fine 7.5–64pt size list leaves excessive discretion at call sites. Add role-based presets incrementally; stop adding tiny labels. |
| Contrast | `tokens.ts`: `faint`, `dim`, `surface`, `bg` | Calculated opaque pairs: faint/bg 3.53:1; faint/surface 3.21:1; dim/surface 4.00:1. These pairs are insufficient for ordinary informational text. Audit actual usage before adjusting semantic ink tokens. |
| Actions | `controls.tsx` | Named button kinds and shared press feedback exist. Arbitrary height/padding props permit drift. Missing common loading behavior, accessible role/state forwarding and required icon labels should be fixed in the shared controls. |
| Selection | `Segmented`, Home's local underline tabs | Shared segmented styling exists, but selection semantics are missing. Home's underline tabs are a distinct pattern; extract that pattern when reused, rather than copying its map/render logic. |
| Headers | `PageHeader`, Home, Settings | Explore/Me use PageHeader. Home has meaningful live/detail variants. Home detail and Settings duplicate the back-pill layout. Extract shared detail chrome before another page adds its own. |
| Settings rows | Local `Group`, `Toggle`, `Row` | Visual grouping is coherent but isolated; the custom toggle lacks switch semantics. Promote grouped rows/toggle through a shared implementation when extending this area. |
| Avatars | `Avatar`, `AvatarStack` | Identity is already reused. Named sizes exist, but dimensions/radii remain in the component. Keep new player representations on this API; the owner's avatar design feedback is still open. |
| Sheet / overlay | `Sheet.tsx`, `Overlay.tsx`, `CourtDrawer` | One shared presentation boundary exists. Motion and shadows are local, bottom padding is fixed, and Sheet has known compiler/lint errors. Fix this boundary before extending modal flows; native scrolling/back behavior remains unverified. |
| Safe areas | `Screen`, `TabBar`, Settings | Shared screen wrapper exists, but top minimums, fixed tab height and sheet bottom padding need iOS/Android and large-text checks. Do not propagate these constants as device guarantees. |
| Court views | Court route delegates to `HomeScreen`; Explore uses `CourtCard` / `CourtDrawer` | Strong existing reuse. Add court behavior through these components instead of independently rebuilding detail/list views. |
| Decoration | `Glow`, feature-local SVGs and shadow strings | Existing brand decoration is centralized in part. Repeated shadow/motion treatment belongs in tokens; decorative illustrations can remain feature-local. Avoid expanding decoration at the expense of the primary task. |

The saved captures support preserving the overall dark palette, display/body
type pairing, restrained borders, list rhythm and contextual orange. They also
show dense, small secondary labels. They do not establish accessibility or
current native behavior.

## Priorities

1. Enforce reuse and document reference pages now, without a visual redesign.
2. Improve shared text roles, contrast and accessible control semantics together.
3. Consolidate detail headers, settings rows, and repeated motion/elevation.
4. Verify shared screen/sheet/tab behavior on both platforms and at large text.

Known debt is not permission to repeat it. Track remediation in separate chunks;
the contract must remain explicit about what is already implemented versus
required for new or modified controls.
