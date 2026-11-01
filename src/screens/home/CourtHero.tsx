import { View } from 'react-native';

import { Tap } from '@/components/ui/controls';
import { Icon } from '@/components/ui/Icon';
import { LiveDot } from '@/components/ui/LiveDot';
import { NumberTicker } from '@/components/ui/NumberTicker';
import { Dot } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { courts, type CourtId } from '@/mock/data';
import { useApp } from '@/state/AppState';
import { color, space, sport } from '@/theme';

/**
 * The top of Home and the court page: sport, court name, area and locals on
 * the left; how many are on court right now on the right. The count rolls
 * when someone checks in or out.
 */
export function CourtHero({ id, onMenu }: { id: CourtId; onMenu?: () => void }) {
  const { d } = useApp();
  const c = courts[id];
  const sp = sport[c.sport];
  const n = d.liveCount(id);
  return (
    <View style={{ paddingTop: space.ml, paddingHorizontal: space.gutter, flexDirection: 'row', alignItems: 'flex-end', gap: space.l }}>
      <View style={{ flex: 1, minWidth: 0, gap: space.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
          <Dot tint={sp.dot} />
          <Text t="eyebrow" tint={sp.ink}>
            {sp.label}
          </Text>
        </View>
        <Tap
          onPress={onMenu}
          disabled={!onMenu}
          label={onMenu ? 'Switch court' : undefined}
          style={{ flexDirection: 'row', alignItems: 'center', gap: space.m }}>
          <Text t="hero" style={{ flexShrink: 1 }}>
            {c.name}
            <Text t="hero" tint={color.orange}>
              .
            </Text>
          </Text>
          {onMenu ? <Icon name="chevronDown" size={12} tint={color.muted} /> : null}
        </Tap>
        <Text t="meta" tint={color.muted} numberOfLines={1}>
          {c.area + ' · ' + c.locals + ' locals'}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: space.xs }}>
        <NumberTicker value={n} t="statXL" />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s }}>
          {n ? <LiveDot halo /> : null}
          <Text t="micro" tint={n ? color.orangeInk : color.dim}>
            {n ? 'Live now' : 'On court'}
          </Text>
        </View>
      </View>
    </View>
  );
}
