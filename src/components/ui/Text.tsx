import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { bodyFamily, color, displayFamily, tracking, type FontSize, type Tracking, type Weight } from '@/theme';

type Variant = 'body' | 'display' | 'label';

export type TextProps = Omit<RNTextProps, 'style'> & {
  /** body: Inter. display: Oswald, uppercase. label: Inter heavy, uppercase, tracked. */
  variant?: Variant;
  size: FontSize;
  weight?: Weight;
  /** A token value from `color`, `tier`, `sport`. */
  tint?: string;
  track?: Tracking;
  upper?: boolean;
  align?: TextStyle['textAlign'];
  lineHeight?: number;
  style?: TextStyle;
};

const defaults: Record<Variant, { weight: Weight; upper: boolean }> = {
  body: { weight: 'semi', upper: false },
  display: { weight: 'semi', upper: true },
  label: { weight: 'heavy', upper: true },
};

export function Text({ variant = 'body', size, weight, tint = color.ink, track, upper, align, lineHeight, style, ...rest }: TextProps) {
  const d = defaults[variant];
  const w = weight ?? d.weight;
  const t = track ?? (variant === 'label' ? (size >= 10 ? 'caps' : 'label') : 'none');
  return (
    <RNText
      {...rest}
      style={[
        {
          fontFamily: variant === 'display' ? displayFamily[w] : bodyFamily[w],
          fontSize: size,
          color: tint,
          letterSpacing: tracking[t] * size,
          textTransform: (upper ?? d.upper) ? 'uppercase' : 'none',
          textAlign: align,
          lineHeight: lineHeight ? lineHeight * size : undefined,
        },
        style,
      ]}
    />
  );
}
