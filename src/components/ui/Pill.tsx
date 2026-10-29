import { View } from 'react-native';

import { color, radius, space } from '@/theme';

import { Text } from './Text';

const TONE = {
  orange: { border: color.orangeLine, ink: color.orangeInk, bg: color.orangeSoft },
  neutral: { border: color.controlStrong, ink: color.inkSub, bg: 'transparent' },
  quiet: { border: color.border, ink: color.muted, bg: 'transparent' },
} as const;

/** A short status label, e.g. "Final", "Waiting on you", "Disputed". */
export function Pill({ label, tone = 'neutral' }: { label: string; tone?: keyof typeof TONE }) {
  const t = TONE[tone];
  return (
    <View style={{ flexDirection: 'row' }}>
      <View
        style={{
          paddingVertical: space.xxs,
          paddingHorizontal: space.m,
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: t.border,
          backgroundColor: t.bg,
        }}>
        <Text t="micro" tint={t.ink}>
          {label}
        </Text>
      </View>
    </View>
  );
}
