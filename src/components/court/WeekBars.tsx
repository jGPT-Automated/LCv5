import { View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { color, radius, size, space } from '@/theme';

/** Your minutes on court per day this week. Today is white, other days grey. */
export function WeekBars({ minutes, labels, today }: { minutes: number[]; labels: string[]; today: number }) {
  const max = Math.max(...minutes, 1);
  return (
    <View>
      <View style={{ flexDirection: 'row', gap: space.s, height: size.weekChart, alignItems: 'flex-end' }}>
        {minutes.map((m, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: Math.max(3, Math.round((m / max) * size.weekChart)),
              borderRadius: radius.button,
              backgroundColor: m ? (i === today ? color.ink : color.barPast) : color.chip,
            }}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: space.s, marginTop: space.s }}>
        {labels.map((l, i) => (
          <Text key={l + i} t="micro" align="center" tint={i === today ? color.ink : color.faint} style={{ flex: 1 }}>
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}
