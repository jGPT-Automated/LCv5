import { View } from 'react-native';

import { haptic } from '@/lib/haptics';
import { color, radius, size, space } from '@/theme';

import { Tap } from './controls';
import { Icon } from './Icon';
import { Text } from './Text';

/** A number with minus and plus, for scores. Holds within min and max. */
export function Stepper({ value, onChange, min = 0, max = 99, label }: { value: number; onChange: (v: number) => void; min?: number; max?: number; label: string }) {
  const set = (v: number) => {
    const n = Math.max(min, Math.min(max, v));
    if (n !== value) haptic.select();
    onChange(n);
  };
  const btn = (dir: -1 | 1) => (
    <Tap
      onPress={() => set(value + dir)}
      disabled={dir < 0 ? value <= min : value >= max}
      label={(dir < 0 ? 'Lower ' : 'Raise ') + label}
      hitSlop={6}
      style={{
        width: size.button,
        height: size.button,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: color.control,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: (dir < 0 ? value <= min : value >= max) ? 0.35 : 1,
      }}>
      <Icon name={dir < 0 ? 'minus' : 'plus'} size={16} />
    </Tap>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.l }} accessibilityLabel={label + ' ' + value}>
      {btn(-1)}
      <View style={{ minWidth: size.large, alignItems: 'center' }}>
        <Text t="statXL" upper={false}>
          {String(value)}
        </Text>
      </View>
      {btn(1)}
    </View>
  );
}
