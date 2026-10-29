import { font } from './tokens';

/**
 * Type scale. Sizes are the only font sizes the app may use; the `Text`
 * component's `size` prop is typed to this list.
 *
 * Weights map the design's variable-font weights onto the static files we
 * ship: 500/550 → Medium, 600/650 → SemiBold, 700 → Bold, 750/780 → ExtraBold
 * for Inter; 600/630/650 → SemiBold for Oswald (docs/DECISIONS.md, D4).
 */
export const fontSizes = [7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 14, 15, 16, 17, 18, 20, 21, 22, 24, 26, 27, 28, 30, 32, 34, 46, 64] as const;
export type FontSize = (typeof fontSizes)[number];

export type Weight = 'medium' | 'semi' | 'bold' | 'heavy';

export const bodyFamily: Record<Weight, string> = {
  medium: font.body,
  semi: font.bodySemi,
  bold: font.bodyBold,
  heavy: font.bodyHeavy,
};

export const displayFamily: Record<Weight, string> = {
  medium: font.displayMedium,
  semi: font.display,
  bold: font.displayBold,
  heavy: font.displayBold,
};

/** Letter spacing in em, as the design specifies it. */
export const tracking = {
  tightest: -0.04,
  tighter: -0.035,
  tight: -0.03,
  snug: -0.02,
  none: 0,
  slight: 0.02,
  title: 0.03,
  wide: 0.06,
  wider: 0.1,
  label: 0.12,
  caps: 0.14,
  widest: 0.16,
} as const;
export type Tracking = keyof typeof tracking;

type TextStyleDef = { variant: 'body' | 'display' | 'label'; size: FontSize; weight?: Weight; track?: Tracking; lineHeight?: number };

/** Named text styles. Screens pick one of these by name (docs/DESIGN.md, Type). */
export const textStyle = {
  // Apple's iOS text styles (HIG Typography, Large/default size). New and
  // reworked screens use these; the V5 names below are being moved onto them.
  largeTitle: { variant: 'display', size: 34, track: 'tight', lineHeight: 1.2 },
  title1: { variant: 'display', size: 28, track: 'tight', lineHeight: 1.2 },
  title2: { variant: 'display', size: 22, lineHeight: 1.27 },
  title3: { variant: 'display', size: 20, lineHeight: 1.25 },
  headline: { variant: 'body', size: 17, weight: 'semi', lineHeight: 1.3 },
  callout: { variant: 'body', size: 16, weight: 'medium', lineHeight: 1.31 },
  subhead: { variant: 'body', size: 15, weight: 'medium', lineHeight: 1.33 },
  footnote: { variant: 'body', size: 13, weight: 'medium', lineHeight: 1.38 },
  caption1: { variant: 'body', size: 12, weight: 'medium', lineHeight: 1.33 },
  caption2: { variant: 'label', size: 11, weight: 'bold', track: 'wide' },

  /** Onboarding headline only, e.g. "Find your run." */
  splash: { variant: 'display', size: 46, weight: 'bold', track: 'tightest', lineHeight: 0.92 },
  pageTitle: { variant: 'display', size: 24, track: 'title' },
  hero: { variant: 'display', size: 28, track: 'tight', lineHeight: 0.95 },
  sheetTitle: { variant: 'display', size: 30, track: 'tight', lineHeight: 0.95 },
  cardTitle: { variant: 'display', size: 22, lineHeight: 1 },
  itemTitle: { variant: 'display', size: 15 },
  statXL: { variant: 'display', size: 46, track: 'tightest', lineHeight: 0.85 },
  statL: { variant: 'display', size: 26, track: 'tight' },
  stat: { variant: 'display', size: 20, track: 'tight' },
  statS: { variant: 'display', size: 16, track: 'tight' },
  rowTitle: { variant: 'body', size: 13, weight: 'semi' },
  /** Onboarding and empty-page explanations: one or two lines under a headline. */
  lead: { variant: 'body', size: 15, weight: 'medium', lineHeight: 1.4 },
  body: { variant: 'body', size: 13, weight: 'medium' },
  caption: { variant: 'body', size: 12, weight: 'semi' },
  meta: { variant: 'body', size: 11, weight: 'medium' },
  rowSub: { variant: 'body', size: 10.5, weight: 'medium' },
  section: { variant: 'label', size: 10 },
  eyebrow: { variant: 'label', size: 9 },
  micro: { variant: 'label', size: 7.5 },
} as const satisfies Record<string, TextStyleDef>;
export type TextStyleName = keyof typeof textStyle;
