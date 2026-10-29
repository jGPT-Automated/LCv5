import { View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Tap } from '@/components/ui/controls';
import { Text } from '@/components/ui/Text';
import type { PlayerView } from '@/mock/model';
import { color, radius, size, space } from '@/theme';

import { openPlayer } from './PlayerRow';

type Side = { people: PlayerView[]; score: number; won: boolean; elo?: { now: number; delta: number } };

/**
 * The inside of a game card, laid out as in the current app: "1V1 AT COURT",
 * the date, both scores with the winner in orange, ELO change under each,
 * a bar splitting the points, and the players at the bottom.
 */
export function GameBoard({ title, date, a, b }: { title: string; date: string; a: Side; b: Side }) {
  const total = a.score + b.score || 1;
  const aWide = a.score / total;
  return (
    <View>
      <Text t="cardTitle" align="center">
        {title}
      </Text>
      <Text t="section" tint={color.muted} align="center" style={{ marginTop: space.m }}>
        {date}
      </Text>
      <View style={{ flexDirection: 'row', marginTop: space.xl }}>
        {[a, b].map((s, k) => (
          <View key={k} style={{ flex: 1, alignItems: 'center', gap: space.m }}>
            <Text t="statXL" upper={false} tint={s.won ? color.orange : color.faint}>
              {String(s.score)}
            </Text>
            {s.elo ? (
              <View style={{ flexDirection: 'row', gap: space.s, paddingVertical: space.xxs, paddingHorizontal: space.ml, borderRadius: radius.pill, borderWidth: 1, borderColor: color.borderStrong }}>
                <Text t="caption" weight="medium" tint={color.muted}>
                  {String(s.elo.now)}
                </Text>
                <Text t="caption" tint={s.elo.delta > 0 ? color.orangeInk : color.inkSub}>
                  {(s.elo.delta > 0 ? '+' : '−') + Math.abs(s.elo.delta)}
                </Text>
              </View>
            ) : null}
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', height: size.progress, borderRadius: radius.pill, overflow: 'hidden', marginTop: space.xl, backgroundColor: color.track }}>
        <View style={{ flex: aWide, backgroundColor: a.won ? color.orange : color.track }} />
        <View style={{ flex: 1 - aWide, backgroundColor: b.won ? color.orange : color.track }} />
      </View>
      <View style={{ flexDirection: 'row', marginTop: space.xl }}>
        {[a, b].map((s, k) => (
          <View key={k} style={{ flex: 1, gap: space.m, borderLeftWidth: k ? 1 : 0, borderLeftColor: color.divider, paddingLeft: k ? space.l : 0, paddingRight: k ? 0 : space.l }}>
            {s.people.map((p) => (
              <Tap
                key={p.i}
                onPress={() => openPlayer(p.i, !!p.me)}
                style={{ flexDirection: k ? 'row-reverse' : 'row', alignItems: 'center', gap: space.l }}>
                <Avatar p={p} size="l" />
                <Text t="lead" weight="semi" tint={s.won ? color.ink : color.muted} numberOfLines={1} style={{ flexShrink: 1 }}>
                  {p.me ? 'You' : p.n}
                </Text>
              </Tap>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
