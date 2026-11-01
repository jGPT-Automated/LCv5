import { View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { color, radius, space, tier, type Tier } from '@/theme';

/** The three tiers side by side: name, ELO range, how many players. */
export function TierStrip({ items }: { items: { tier: Tier; range: string; count: number }[] }) {
  return (
    <View style={{ flexDirection: 'row', borderRadius: radius.panel, borderWidth: 1, borderColor: color.border, backgroundColor: color.surface }}>
      {items.map((x, j) => (
        <View key={x.tier} style={{ flex: 1, padding: space.l, gap: space.xs, borderLeftWidth: j ? 1 : 0, borderLeftColor: color.divider }}>
          <Text t="itemTitle" tint={tier[x.tier].ink}>
            {tier[x.tier].name}
          </Text>
          <Text t="rowSub" tint={color.muted}>
            {x.range}
          </Text>
          <Text t="rowSub" tint={color.faint}>
            {x.count + ' players'}
          </Text>
        </View>
      ))}
    </View>
  );
}
