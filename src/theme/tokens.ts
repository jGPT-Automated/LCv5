/**
 * LocalCheck v5 design tokens.
 *
 * Every color, spacing step, radius and text style in the app comes from this
 * file. Values are taken from the LCPhoneV5 design file; near-duplicate values
 * in that file were merged into one token (see docs/DECISIONS.md, D3).
 *
 * `npm run check:tokens` fails if a screen or component uses a raw hex/rgba
 * color, or a raw number for padding, margin, gap or border radius.
 */

export const color = {
  // Surfaces, darkest to lightest
  bg: '#0d0d10',
  field: '#111115',
  surface: '#18181d',
  sheet: '#19191f',
  menu: '#1b1b21',
  chip: '#24242c',
  segOn: '#2a2a32',
  track: '#2a2a31',
  grabber: '#3a3a44',
  barPast: '#4a4a55',
  quiet: '#17171c',

  // Ink, brightest to dimmest
  ink: '#f2f2f6',
  inkSoft: '#e5e5ea',
  inkSub: '#d1d1d9',
  inkMid: '#b8b8c2',
  muted: '#9a9aa7',
  dim: '#777783',
  faint: '#686873',
  ghost: '#62626e',
  onBright: '#0d0d10',

  // Brand orange. Reserved for live, check-in and "you" markers.
  orange: '#fc4c02',
  orangeInk: '#ff7b4b',
  orangeSoft: 'rgba(252,76,2,0.08)',
  orangeHalo: 'rgba(252,76,2,0.12)',
  orangeRing: 'rgba(252,76,2,0.15)',
  orangeLine: 'rgba(252,76,2,0.4)',
  orangeEdge: 'rgba(252,76,2,0.55)',
  orangeGlow: 'rgba(252,76,2,0.7)',

  // Hairlines and outlines on dark surfaces (ink at low alpha)
  line: 'rgba(242,242,246,0.06)',
  divider: 'rgba(242,242,246,0.075)',
  border: 'rgba(242,242,246,0.09)',
  borderStrong: 'rgba(242,242,246,0.13)',
  control: 'rgba(242,242,246,0.16)',
  controlStrong: 'rgba(242,242,246,0.22)',
  dashed: 'rgba(242,242,246,0.14)',
  highlight: 'rgba(242,242,246,0.045)',
  futureBar: 'rgba(242,242,246,0.05)',
  futureBarDrawer: 'rgba(242,242,246,0.14)',
  dashedToday: 'rgba(242,242,246,0.45)',
  inkFaintText: 'rgba(242,242,246,0.34)',
  darkFaintText: 'rgba(13,13,16,0.6)',
  darkSubText: 'rgba(13,13,16,0.72)',

  scrim: 'rgba(0,0,0,0.5)',
  scrimHeavy: 'rgba(0,0,0,0.6)',
  tabBar: 'rgba(13,13,16,0.94)',
  pillBg: 'rgba(19,19,23,0.9)',
  inset: 'rgba(12,12,15,0.38)',
  shadow: 'rgba(0,0,0,0.5)',
  /** Hairline light along the top edge of raised surfaces (cards, sheets). */
  topHighlight: 'rgba(255,255,255,0.03)',
} as const;

/** Heat scale for planned visits (empty → busiest). */
export const heat = ['#212128', 'rgba(252,76,2,0.2)', 'rgba(252,76,2,0.38)', 'rgba(252,76,2,0.62)', '#fc4c02'] as const;

export const sport = {
  bb: {
    label: 'Basketball',
    ink: '#d8c8b6',
    dot: '#d8b58d',
    border: 'rgba(211,181,147,0.38)',
    glow: 'rgba(172,122,83,0.16)',
    glowRGB: '172,122,83',
    glowAlpha: 0.16,
  },
  pb: {
    label: 'Pickleball',
    ink: '#bdd7cf',
    dot: '#9ccfbe',
    border: 'rgba(141,199,183,0.34)',
    glow: 'rgba(67,137,120,0.17)',
    glowRGB: '67,137,120',
    glowAlpha: 0.17,
  },
} as const;

export type Tier = 'elite' | 'contender' | 'open';

/** ELO tiers. `ring` is the avatar ring, `ink` the label color, `glow` the card wash. */
export const tier = {
  elite: { name: 'Elite', ring: '#ba8653', ink: '#d9b48c', glow: 'rgba(186,134,83,0.16)', top: '#483c35', edge: 'rgba(186,134,83,0.4)', glowRGB: '186,134,83' },
  contender: {
    name: 'Contender',
    ring: '#8490a4',
    ink: '#b3bccb',
    glow: 'rgba(132,144,164,0.14)',
    top: '#3b3e49',
    edge: 'rgba(132,144,164,0.4)',
    glowRGB: '132,144,164',
  },
  open: {
    name: 'Open',
    ring: '#657067',
    ink: '#97a49a',
    glow: 'rgba(101,112,103,0.14)',
    top: '#34363a',
    edge: 'rgba(101,112,103,0.4)',
    glowRGB: '101,112,103',
  },
} as const;

/** Spacing scale in points. Named by size, not by use. */
export const space = {
  xxxs: 2,
  xxs: 3,
  xs: 4,
  xsm: 5,
  s: 6,
  sm: 7,
  m: 8,
  ml: 10,
  l: 12,
  xl: 14,
  xxl: 16,
  x3: 18,
  gutter: 20,
  x4: 22,
  x5: 24,
} as const;

export const radius = {
  bar: 2,
  button: 4,
  heat: 5,
  seg: 7,
  control: 8,
  segWrap: 9,
  tile: 10,
  empty: 11,
  row: 12,
  panel: 13,
  card: 16,
  hero: 18,
  profile: 22,
  sheet: 25,
  pill: 999,
} as const;

export const font = {
  display: 'Oswald_600SemiBold',
  displayBold: 'Oswald_700Bold',
  displayMedium: 'Oswald_500Medium',
  body: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  bodyHeavy: 'Inter_800ExtraBold',
} as const;

/** Insets and limits that aren't element sizes (heights live in `size`). */
export const layout = {
  statusBar: 54,
  maxWebWidth: 430,
  /** Space under sheet content for the home indicator. */
  sheetBottom: 34,
  /** Extra scroll room so the earliest timeline rows can reach the focus line. */
  timelineTail: 330,
} as const;

/** Fixed heights and widths. Screens use these instead of numbers (docs/DESIGN.md). */
export const size = {
  dot: 6,
  dotSm: 5,
  compact: 36,
  button: 44,
  large: 50,
  field: 42,
  segment: 32,
  tab: 42,
  row: 56,
  empty: 48,
  cell: 34,
  header: 52,
  tabBar: 84,
  barChart: 40,
  barChartSm: 34,
  weekChart: 56,
  progress: 4,
  menu: 236,
  /** Width of the day/time label column in grids. */
  gridLabel: 28,
  /** Width of the date block in game rows. */
  dateBlock: 58,
  /** Width of a time label in timeline rows. */
  timeLabel: 36,
  /** Width of a rank number in leaderboard rows. */
  rankLabel: 22,
} as const;
