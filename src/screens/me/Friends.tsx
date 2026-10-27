import { View } from 'react-native';

import { PlayerRow } from '@/components/court/PlayerRow';
import { EmptyRow } from '@/components/ui/controls';
import { players } from '@/mock/data';
import { ago, tierOf } from '@/mock/model';
import { useApp } from '@/state/AppState';
import { tier } from '@/theme';

/** Friends: who's on court now first, then by last seen. */
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
          <PlayerRow
            key={p.i}
            p={p}
            subtitle={p.live ? 'On court now · Rancho Park' : 'Seen ' + ago(p.seen)}
            value={p.elo ?? '–'}
            valueLabel={t ? tier[t].name : 'Unranked'}
          />
        );
      })}
    </View>
  );
}
