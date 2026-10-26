import { ScrollView, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Segmented } from '@/components/ui/controls';
import { Text } from '@/components/ui/Text';
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
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingTop: space.xl, paddingHorizontal: space.gutter, paddingBottom: space.x5 }}
      showsVerticalScrollIndicator={false}>
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
          let sub: string;
          let val: number;
          let valLabel: string;
          if (sort === 'ranked') {
            sub = (t ? tier[t].name : '') + ' · ' + record(p.elo as number) + (p.live ? ' · On court' : '');
            val = p.elo as number;
            valLabel = 'ELO';
          } else if (sort === 'recent') {
            sub = p.live ? 'On court now' : 'Seen ' + ago(p.seen);
            val = p.s;
            valLabel = 'Visits';
          } else {
            sub = (t ? tier[t].name + ' · ' + p.elo : 'Unranked') + (p.live ? ' · On court' : '');
            val = p.s;
            valLabel = 'Visits';
          }
          return (
            <View
              key={p.i}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: space.l,
                minHeight: 58,
                marginHorizontal: -space.l,
                paddingHorizontal: space.l,
                borderBottomWidth: 1,
                borderBottomColor: color.line,
                backgroundColor: p.me ? color.surface : top && t ? tier[t].glow : 'transparent',
                borderLeftWidth: p.me ? 2 : 0,
                borderLeftColor: color.ink,
              }}>
              <View style={{ width: 22 }}>
                <Text variant="display" size={15} track="tight" tint={top && t ? tier[t].ink : color.faint}>
                  {sort === 'ranked' ? String(p.rank) : ''}
                </Text>
              </View>
              <Avatar p={p} size="m" />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text size={13}>{p.me ? 'You' : p.n}</Text>
                <Text size={10} weight="medium" tint={p.live ? color.orangeInk : color.dim} numberOfLines={1} style={{ marginTop: space.xxxs }}>
                  {sub}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text variant="display" size={17} track="tight">
                  {String(val)}
                </Text>
                <Text variant="label" size={7.5} tint={color.faint} style={{ marginTop: space.xxs }}>
                  {valLabel}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
