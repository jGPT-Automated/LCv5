import { ScrollView, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Tap } from '@/components/ui/controls';
import { Text } from '@/components/ui/Text';
import type { PlayerView } from '@/mock/model';
import { color, size, space } from '@/theme';

import { openPlayer } from './PlayerRow';

/** Who's here: faces with first names under them, scrolling sideways. Never stacked. */
export function PeopleStrip({ people }: { people: PlayerView[] }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.xl, paddingHorizontal: space.gutter }} style={{ marginHorizontal: -space.gutter }}>
      {people.map((p) => (
        <Tap key={p.i} onPress={() => openPlayer(p.i, !!p.me)} label={p.me ? 'You' : p.n} style={{ alignItems: 'center', gap: space.s, width: size.large + space.m }}>
          <Avatar p={p} size="l" />
          <View>
            <Text t="footnote" tint={p.me ? color.orangeInk : color.inkSub} numberOfLines={1} align="center">
              {p.me ? 'You' : p.n}
            </Text>
          </View>
        </Tap>
      ))}
    </ScrollView>
  );
}
