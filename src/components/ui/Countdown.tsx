import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { color, size, space } from '@/theme';

import { Text } from './Text';

/** Time left on a decision: an orange ring that empties, a label, the time. */
export function Countdown({ label, value, left }: { label: string; value: string; /** 0–1 of the window remaining. */ left: number }) {
  const r = 16;
  const c = size.large / 2;
  const a = Math.max(0.001, Math.min(0.999, left)) * Math.PI * 2 - Math.PI / 2;
  const d = `M${c} ${c - r} A${r} ${r} 0 ${left > 0.5 ? 1 : 0} 1 ${c + Math.cos(a) * r} ${c + Math.sin(a) * r}`;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.xl }}>
      <Svg width={size.large} height={size.large}>
        <Circle cx={c} cy={c} r={r} stroke={color.track} strokeWidth={3.5} fill="none" />
        <Path d={d} stroke={color.orange} strokeWidth={3.5} strokeLinecap="round" fill="none" />
      </Svg>
      <View>
        <Text t="caption" weight="medium" tint={color.muted}>
          {label}
        </Text>
        <Text t="statL" upper={false}>
          {value}
        </Text>
      </View>
    </View>
  );
}
