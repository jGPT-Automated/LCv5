import { View } from 'react-native';

import { PlayerRow } from '@/components/court/PlayerRow';
import { PageScroll } from '@/components/layout/PageScroll';
import { Segmented } from '@/components/ui/controls';
import { players, type CourtId } from '@/mock/data';
import { ago, record, tierOf } from '@/mock/model';
import { useApp } from '@/state/AppState';
import { color, space, tier } from '@/theme';

export type PlayerSort = 'ranked' | 'recent' | 'all';

/** Players at a court. Ranked: by ELO, top 5 tinted. Recent: by last seen. All: by visits. */
export function PlayersTab({ court, sort, onSort }: { court: CourtId; sort: PlayerSort; onSort: (s: PlayerSort) => void }) {
  const { d, checkedAt } = useApp();
  const view = d.view(court);
  const everyone = [...players, { ...d.you, seen: checkedAt === court ? 0 : 1440 }].map(view);
  const list =
    sort === 'ranked'
      ? everyone.filter((p) => p.elo != null).sort((a, b) => (b.elo as number) - (a.elo as number))
      : sort === 'recent'
        ? [...everyone].sort((a, b) => (a.live ? 0 : a.seen) - (b.live ? 0 : b.seen))
        : [...everyone].sort((a, b) => b.s - a.s);

  return (
    <PageScroll top={space.xl}>
      <Segmented<PlayerSort>
        options={[
          ['ranked', 'Ranked'],
          ['recent', 'Recent'],
          ['all', 'All'],
        ]}
        value={sort}
        onChange={onSort}
      />
      <View style={{ marginTop: space.s }}>
        {list.map((p) => {
          const t = tierOf(p.elo);
          const top = sort === 'ranked' && !!t && !!p.rank && p.rank <= 5;
          const onCourt = p.live ? ' · On court' : '';
          const subtitle =
            sort === 'ranked'
              ? (t ? tier[t].name : '') + ' · ' + record(p.elo as number) + onCourt
              : sort === 'recent'
                ? p.live
                  ? 'On court now'
                  : 'Seen ' + ago(p.seen)
                : (t ? tier[t].name + ' · ' + p.elo : 'Unranked') + onCourt;
          return (
            <PlayerRow
              key={p.i}
              p={p}
              rank={sort === 'ranked' ? p.rank : undefined}
              rankTint={top && t ? tier[t].ink : color.faint}
              wash={top && t ? tier[t].glow : undefined}
              subtitle={subtitle}
              value={sort === 'ranked' ? (p.elo as number) : p.s}
              valueLabel={sort === 'ranked' ? 'ELO' : 'Visits'}
            />
          );
        })}
      </View>
    </PageScroll>
  );
}
