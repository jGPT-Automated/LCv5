import { View } from 'react-native';

import { BookmarkButton, Button, SportTag } from '@/components/ui/controls';
import { Card, LivePill } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { courts, type CourtId } from '@/mock/data';
import { useApp } from '@/state/AppState';
import { color, space, sport } from '@/theme';

/** Explore list card. Layout unchanged from chunk 1; its redesign is the next chunk. */
export function CourtCard({ id, onOpen }: { id: CourtId; onOpen: () => void }) {
  const { d, mine, checkedAt, toggleSaved, checkIn, checkOut } = useApp();
  const c = courts[id];
  const here = checkedAt === id;
  return (
    <Card onPress={onOpen} label={c.name} glow={{ rgb: sport[c.sport].glowRGB, alpha: sport[c.sport].glowAlpha }}>
      <View style={{ flexDirection: 'row', gap: space.l }}>
        <View style={{ flex: 1, minWidth: 0, gap: space.sm }}>
          <SportTag sport={c.sport} />
          <Text t="cardTitle" numberOfLines={1}>
            {c.name}
          </Text>
          <Text t="meta" tint={color.muted} numberOfLines={1}>
            {c.area + ' · ' + c.locals + ' locals'}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', gap: space.l }}>
          <LivePill count={d.liveCount(id)} />
          <View style={{ flexDirection: 'row', gap: space.s }}>
            <BookmarkButton saved={mine.includes(id)} onPress={() => toggleSaved(id)} />
            <Button
              label={here ? '✓ Here' : 'Check in'}
              kind={here ? 'here' : 'orange'}
              size="compact"
              feedback="commit"
              onPress={() => (here ? checkOut() : checkIn(id))}
            />
          </View>
        </View>
      </View>
    </Card>
  );
}
