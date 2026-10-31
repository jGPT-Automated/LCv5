# LC+ design contract

Read this before adding or changing a screen, shared component, visual token,
interaction, or navigation pattern. Extend the existing LC+ system in place.

## Start with an existing page

Before coding, name the closest existing screen and the pieces being reused in
the PR. Match its hierarchy, edges, spacing, control treatment, and behavior.
Choose references by task, not by whichever screenshot looks interesting.

| Need | Reference | Reuse |
| --- | --- | --- |
| Standard tab page | Explore and Me | `Screen`, `PageHeader`, existing tab navigation |
| Court detail and live activity | Home with `courtId` | `HomeScreen`; the court route already delegates to it |
| Court list item | Explore | `CourtCard`, `SportTag`, `BookmarkButton`, `Button` |
| Player identity | Players and Friends | `Avatar`, `AvatarStack`, `tier` tokens |
| Compact filters | Me and Players | `Segmented` |
| Secondary section title | Explore | `SectionLabel` |
| No results or no activity | Existing empty rows | `EmptyRow`; explain the state and next useful action |
| Court drawer | Explore | `CourtDrawer` and `Sheet`; repair shared behavior centrally |
| Grouped preferences | Settings | Its group/row structure; extract shared rows before another page needs them |

References establish structure, not proof that every current detail is correct.
The open issues in [the audit](DESIGN_SYSTEM_AUDIT.md) are not precedents to copy.
The existing screenshots in `docs/chunks/01-screens/` are historical web captures,
not evidence of current iOS or Android behavior or owner approval of every detail.

## One visual source of truth

- `src/theme/index.ts` is the theme entry point; `tokens.ts` and `type.ts` own
  palette, spacing, radii, font families, tracking, type sizes, and layout values.
- Use the existing brand: dark canvas, slightly raised surfaces, Oswald display
  text, Inter body text, restrained borders, and orange for live/check-in/you.
  Sport and tier colors retain their existing meanings.
- Use `Text` for visible text and `Icon` for icons. Match the text role on the
  reference page. Keep paragraphs in body case; display and short labels use
  their existing variants. New explanatory text should be at least 12pt; dense
  metadata must remain legible. Existing sub-10pt labels are audit debt.
- Use `space` and `radius` by name. Standard tab headers use `PageHeader` and
  its gutter; normal body sections follow Explore/Me's `space.xxl` inset.
  Preserve intentional header/body differences instead of inventing new edges.
- Keep related content closer together than separate sections. Align labels,
  content, and actions to shared edges. Use rows and separators for lists;
  add a card only when it groups a distinct object or task.
- Keep one visually dominant action per context. Use the existing `Button`
  kinds for their established purpose; a new feature does not get its own
  accent, shadow, typeface, button geometry, or header treatment.
- Identity belongs to the shared component: typography, colors, radii,
  selected/disabled/pressed appearance, and interaction. Call-site overrides
  are for layout (flex, alignment, external spacing), not a private restyle.
- Put repeated motion, elevation and control-size decisions into the existing
  theme/component API when extending them. These categories are not fully
  centralized today; do not multiply the existing local definitions.

## Component boundaries

| Component | Owns | Callers supply |
| --- | --- | --- |
| `Screen`, `PageHeader`, tab navigation | Screen chrome and standard layout | Title, content, contextual action |
| `Text` | Font mapping, casing, tracking, font scaling | Content, existing variant/size, semantic token tint |
| `Button`, `IconButton`, `BookmarkButton` | Action appearance and interaction states | Label/icon, existing kind, handler, state |
| `Tap` | Low-level press feedback | Composite content and layout; use a named control when one exists |
| `Segmented` | Compact mutually exclusive selection | Options, value, change handler |
| `Avatar`, `AvatarStack` | Player identity and tier/live/friend markers | Player data and named size |
| `Sheet`, `Overlay` | Presentation, dismissal and gesture boundary | Content and open/close state |
| `HourBars`, `CourtCard`, `CourtDrawer` | Repeated court presentation | Court/state data and callbacks |

Extend a matching component before adding another. If a missing pattern is
needed on two pages, extract one shared component and migrate both callers in
that change. Feature-specific views stay with their feature until reuse is real.
Use semantic variants and named sizes for new APIs; keep existing callers
working. Before selecting a new native control, consult the version-matched
Expo UI guidance and integrate it through one shared wrapper.

## Interaction and accessibility

- A tappable element gives pressed feedback. Actions expose a role and an
  accessible name; icon-only controls need an explicit name. Selection, checked,
  disabled and busy states must be announced where applicable.
- Provide a usable touch target (44pt on iOS, 48dp on Android); hit slop must
  not create overlapping targets. Visual button size alone is not the target.
- Preserve system font scaling. Let content wrap/reflow and rows grow before
  truncating useful labels. Test long court/player names and large text.
- Informational text targets at least 4.5:1 contrast, or 3:1 for qualifying
  large text. Muted and inactive navigation labels still need to be readable;
  inactive selection is not the same as a disabled control.
- Keep app identity shared across platforms. Adapt safe areas, system back,
  permissions and native controls to each platform through shared components.
- A sheet owns drag/scroll coordination and dismissal. Feature screens must
  not implement a competing sheet or hardcode device bottom insets.
- Include empty, populated, disabled and selected states where meaningful;
  add loading, error and retry states when asynchronous behavior is introduced.
  Mock-only screens must not imply a real action succeeded.

## Adding a pattern or changing the system

In the PR, state the user need, closest existing component/page, and the exact
gap. Prefer extending that component. If a new pattern is necessary, define its
API, tokens, applicable states, accessibility and intended consumers here, and
record the reason in `docs/DECISIONS.md`. Update affected consumers together.
Owner direction controls visual changes; routine reuse needs no extra approval.
Do not add a token solely to legitimize an arbitrary one-off design.

## Required review and checks

1. Run `npm run check` and `npm run lint`; run `npm run export:web` before push.
   Report existing failures explicitly; do not mark them passing or suppress
   them to satisfy the contract.
2. Compare the changed screen beside its reference using the same viewport,
   text-size setting and data state. Check alignment, hierarchy, density,
   action placement and shared component appearance.
3. For UI/interaction changes, attach iOS and Android evidence and state which
   flows and states were checked. A web export is not native verification.
   If a platform cannot be run, mark that verification pending.
4. Record the reference, reused components, intentional differences and any
   system extension in the PR template. Update the chunk record and roadmap.

Automation checks tokens, primitive boundaries and typography ownership. It
cannot prove good hierarchy, useful flows, readable rendered text, or correct
gestures. Those require the comparison and runtime checks above.

## Guidance used

- Expo design-system skill: adopt the existing theme, extend shared primitives,
  and fix repeated defects at their source.
- [React Native accessibility](https://reactnative.dev/docs/accessibility)
- [WCAG contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [Expo SDK 58 UI](https://docs.expo.dev/versions/v58.0.0/sdk/ui/)
