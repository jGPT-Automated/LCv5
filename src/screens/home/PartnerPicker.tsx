import { ScrollView, useWindowDimensions, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { MorphingModal, MorphingModalHeader } from '@/components/ui/MorphingModal';
import { Row } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import type { PlayerView } from '@/mock/model';
import { tierOf } from '@/mock/model';
import { color, space, tier } from '@/theme';

/** Pickleball: pick who you're playing with before joining the line. Friends first, then who's here. */
export function PartnerPicker({ open, people, onPick, onClose }: { open: boolean; people: PlayerView[]; onPick: (i: string) => void; onClose: () => void }) {
  const { height } = useWindowDimensions();
  const friends = people.filter((p) => p.friend);
  const others = people.filter((p) => !p.friend);
  const list = (title: string, ps: PlayerView[]) =>
    ps.length ? (
      <View>
        <Text t="caption2" tint={color.muted} style={{ marginBottom: space.xs }}>
          {title}
        </Text>
        {ps.map((p, k) => {
          const t = tierOf(p.elo);
          return (
            <Row
              key={p.i}
              divider={k < ps.length - 1}
              onPress={() => onPick(p.i)}
              leading={<Avatar p={p} size="m" />}
              title={p.n}
              subtitle={(t ? tier[t].name + ' · ' + p.elo : 'Unranked') + (p.live ? ' · Here now' : '')}
              subtitleTint={p.live ? color.orangeInk : color.muted}
            />
          );
        })}
      </View>
    ) : null;
  return (
    <MorphingModal view={open ? 'pick' : null} onClose={onClose} label="Pick your partner">
      <View>
        <MorphingModalHeader title="Who are you playing with?" />
        {/* Long lists scroll inside the card instead of pushing it off screen. */}
        <ScrollView style={{ maxHeight: height * 0.55 }} contentContainerStyle={{ gap: space.xl }}>
          {list('Friends', friends)}
          {list('Here now', others)}
        </ScrollView>
      </View>
    </MorphingModal>
  );
}
