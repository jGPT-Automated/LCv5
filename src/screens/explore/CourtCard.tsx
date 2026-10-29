import { View } from 'react-native';

import { LiveDot } from '@/components/ui/LiveDot';
import { Card, Dot } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { courts, type CourtId } from '@/mock/data';
import { courtDistance, courtPlace } from '@/mock/model';
import { useApp } from '@/state/AppState';
import { color, space, sport } from '@/theme';

/**
 * Explore list card. Which court and where on the left; how many are on court
 * now and how many locals, large, on the right. No buttons: tapping opens the
 * court's drawer, where Check in and Save live.
 */
export function CourtCard({ id, onOpen }: { id: CourtId; onOpen: () => void }) {
  const { d, checkedAt } = useApp();
  const c = courts[id];
  const n = d.liveCount(id);
  return (
    <Card
      onPress={onOpen}
      label={c.name + ', ' + n + ' on court'}
      glow={{ rgb: sport[c.sport].glowRGB, alpha: sport[c.sport].glowAlpha }}
      edge={checkedAt === id ? color.orangeEdge : undefined}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xxl }}>
        <View style={{ flex: 1, minWidth: 0, gap: space.xs }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s }}>
            <Dot tint={sport[c.sport].dot} small />
            <Text t="caption2" tint={sport[c.sport].ink}>
              {sport[c.sport].label}
            </Text>
          </View>
          <Text t="title2" numberOfLines={2}>
            {c.name}
          </Text>
          <Text t="footnote" tint={color.muted} numberOfLines={1}>
            {courtPlace(id) + ' · ' + courtDistance(id)}
          </Text>
        </View>
        <Count value={n} label="Live" live={n > 0} />
        <Count value={c.locals} label="Locals" />
      </View>
    </Card>
  );
}

function Count({ value, label, live }: { value: number; label: string; live?: boolean }) {
  return (
    <View style={{ alignItems: 'center', minWidth: space.x5 * 2 }}>
      <Text t="largeTitle" upper={false} tint={live ? color.orangeInk : value ? color.ink : color.faint}>
        {String(value)}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }}>
        {live ? <LiveDot /> : null}
        <Text t="caption2" tint={color.muted}>
          {label}
        </Text>
      </View>
    </View>
  );
}
