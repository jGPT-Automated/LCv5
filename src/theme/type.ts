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
