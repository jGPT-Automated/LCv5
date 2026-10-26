import { View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { EmptyRow } from '@/components/ui/controls';
import { Text } from '@/components/ui/Text';
import { players } from '@/mock/data';
import { ago, tierOf } from '@/mock/model';
import { useApp } from '@/state/AppState';
import { color, space, tier } from '@/theme';

/** Friends list: who's on court now first, then by last seen. */
export function Friends() {
  const { d } = useApp();
  const live = new Set(d.livePeople('rc').map((p) => p.i));
  const list = players
    .filter((p) => p.friend)
    .map((p) => ({ ...p, rank: d.rankOf[p.i], live: live.has(p.i) }))
    .sort((a, b) => (a.live ? 0 : a.seen) - (b.live ? 0 : b.seen));
  if (!list.length) return <EmptyRow>No friends yet</EmptyRow>;
  return (
    <View>
      {list.map((p) => {
        const t = tierOf(p.elo);
        return (
          <View
            key={p.i}
            style={{ flexDirection: 'row', alignItems: 'center', gap: space.l, minHeight: 58, borderBottomWidth: 1, borderBottomColor: color.line }}>
            <Avatar p={p} size="m" />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text size={13}>{p.n}</Text>
              <Text size={10} weight="medium" tint={p.live ? color.orangeInk : color.dim} numberOfLines={1} style={{ marginTop: space.xxxs }}>
                {p.live ? 'On court now · Rancho Park' : 'Seen ' + ago(p.seen)}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text variant="display" size={17} track="tight">
                {p.elo ?? '–'}
              </Text>
              <Text variant="label" size={7.5} tint={t ? tier[t].ink : color.faint} style={{ marginTop: space.xxs }}>
                {t ? tier[t].name : 'Unranked'}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
