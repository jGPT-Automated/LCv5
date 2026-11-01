import { View } from 'react-native';

import { haptic } from '@/lib/haptics';
import { color, radius, size, space } from '@/theme';

import { Tap } from './controls';
import { Text } from './Text';

/** The last seven days, oldest first, for when a game was played. The chosen day is ringed orange. */
export function PlayedDays({ days, value, onChange }: { days: { label: string; num: number }[]; value: number; onChange: (k: number) => void }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {days.map((d, k) => {
        const on = k === value;
        return (
          <Tap
            key={k}
            role="radio"
            selected={on}
            onPress={() => {
              if (!on) haptic.select();
              onChange(k);
            }}
            style={{ flex: 1, alignItems: 'center', gap: space.s }}>
            <Text t="section" tint={on ? color.ink : color.muted}>
              {d.label}
            </Text>
            <View
              style={{
                width: size.large,
                height: size.large,
                borderRadius: radius.pill,
                borderWidth: on ? 2 : 0,
                borderColor: color.orange,
                backgroundColor: on ? color.surface : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text t="statL">{String(d.num)}</Text>
            </View>
          </Tap>
        );
      })}
    </View>
  );
}
