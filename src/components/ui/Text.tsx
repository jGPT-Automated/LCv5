import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { bodyFamily, color, displayFamily, textStyle, tracking, type FontSize, type TextStyleName, type Tracking, type Weight } from '@/theme';

type Variant = 'body' | 'display' | 'label';

export type TextProps = Omit<RNTextProps, 'style'> & {
  /** Named style from docs/DESIGN.md. Screens use only this. */
  t?: TextStyleName;
  /** Low-level overrides, for components in src/components only. */
  variant?: Variant;
  size?: FontSize;
  weight?: Weight;
  track?: Tracking;
  lineHeight?: number;
  /** A token value from `color`, `tier`, `sport`. */
  tint?: string;
  upper?: boolean;
  align?: TextStyle['textAlign'];
  style?: TextStyle;
};

const defaults: Record<Variant, { weight: Weight; upper: boolean }> = {
  body: { weight: 'semi', upper: false },
  display: { weight: 'semi', upper: true },
  label: { weight: 'heavy', upper: true },
};

export function Text({ t, variant, size, weight, track, lineHeight, tint = color.ink, upper, align, style, ...rest }: TextProps) {
  const named: { variant?: Variant; size?: FontSize; weight?: Weight; track?: Tracking; lineHeight?: number } = t ? textStyle[t] : {};
  const v = variant ?? named.variant ?? 'body';
  const sz = size ?? named.size ?? 13;
  const d = defaults[v];
  const w = weight ?? named.weight ?? d.weight;
  const tr = track ?? named.track ?? (v === 'label' ? (sz >= 10 ? 'caps' : 'label') : 'none');
  const lh = lineHeight ?? named.lineHeight;
  return (
    <RNText
      {...rest}
      style={[
        {
          fontFamily: v === 'display' ? displayFamily[w] : bodyFamily[w],
          fontSize: sz,
          color: tint,
          letterSpacing: tracking[tr] * sz,
          textTransform: (upper ?? d.upper) ? 'uppercase' : 'none',
          textAlign: align,
          lineHeight: lh ? lh * sz : undefined,
        },
        style,
      ]}
    />
  );
}
