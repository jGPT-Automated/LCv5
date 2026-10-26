import { View } from 'react-native';

import { BookmarkButton, Button, SportTag, Tap } from '@/components/ui/controls';
import { Glow } from '@/components/ui/Glow';
import { LiveDot } from '@/components/ui/LiveDot';
import { Text } from '@/components/ui/Text';
import { courts, type CourtId } from '@/mock/data';
import { useApp } from '@/state/AppState';
import { color, radius, space, sport } from '@/theme';

/** Explore list card: sport, name, area · locals, live count, save, check in. */
export function CourtCard({ id, onOpen }: { id: CourtId; onOpen: () => void }) {
  const { d, mine, checkedAt, toggleSaved, checkIn, checkOut } = useApp();
  const c = courts[id];
  const n = d.liveCount(id);
  const here = checkedAt === id;
  return (
    <Tap
      onPress={onOpen}
      style={{
        flexDirection: 'row',
        gap: space.l,
        paddingVertical: space.xl,
        paddingRight: space.xl,
        paddingLeft: space.xxl,
        borderRadius: radius.card,
        backgroundColor: color.surface,
        borderWidth: 1,
        borderColor: color.border,
        overflow: 'hidden',
      }}>
      <Glow rgb={sport[c.sport].glowRGB} alpha={sport[c.sport].glowAlpha} />
      <View style={{ flex: 1, minWidth: 0, gap: space.sm }}>
        <SportTag sport={c.sport} />
        <Text variant="display" size={22} numberOfLines={1} lineHeight={1}>
          {c.name}
        </Text>
        <Text size={11} weight="medium" tint={color.muted} numberOfLines={1}>
          {c.area + ' · ' + c.locals + ' locals'}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', gap: space.l }}>
        <View
          style={{
            height: 26,
            paddingHorizontal: space.ml,
            borderRadius: radius.pill,
            borderWidth: 1,
            borderColor: n ? color.orangeLine : color.dashed,
            flexDirection: 'row',
            alignItems: 'center',
            gap: space.s,
          }}>
          {n ? <LiveDot /> : null}
          <Text variant="display" size={14} tint={n ? color.orangeInk : color.muted}>
            {String(n)}
          </Text>
          <Text variant="label" size={7.5} tint={color.muted}>
            Live
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: space.s }}>
          <BookmarkButton saved={mine.includes(id)} onPress={() => toggleSaved(id)} />
          <Button
            label={here ? '✓ Here' : 'Check in'}
            kind={here ? 'here' : 'orange'}
            height={34}
            size={9}
            padX={space.l}
            onPress={() => (here ? checkOut() : checkIn(id))}
          />
        </View>
      </View>
    </Tap>
  );
}
