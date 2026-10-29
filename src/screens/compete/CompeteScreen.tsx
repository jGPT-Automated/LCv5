import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { CourtMenu, CourtSwitchButton } from '@/components/court/CourtSwitch';
import { PlayerBoard, type PlayerSort } from '@/components/court/PlayerBoard';
import { TierStrip } from '@/components/court/TierStrip';
import { Page } from '@/components/layout/Page';
import { PageScroll } from '@/components/layout/PageScroll';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/controls';
import { Card, ProgressBar } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { courts, players } from '@/mock/data';
import { tierOf } from '@/mock/model';
import { NewGameSheet, type NewGameAt } from '@/screens/schedule/NewGameSheet';
import { useApp } from '@/state/AppState';
import { color, space, tier, type Tier } from '@/theme';

const TIERS: [Tier, string][] = [
  ['elite', '1300+'],
  ['contender', '1150–1299'],
  ['open', 'Under 1150'],
];

/**
 * Compete, from the V5 design: your rank card with Log game and Ranked game,
 * the three tiers, a key to the avatar marks, and the board for your court.
 */
export function CompeteScreen() {
  const { d, mine, homeIndex } = useApp();
  const court = mine[Math.min(homeIndex, mine.length - 1)];
  const [menu, setMenu] = useState(false);
  const [sort, setSort] = useState<PlayerSort>('ranked');
  const [sheet, setSheet] = useState<NewGameAt | null>(null);

  const you = d.you;
  const t = tierOf(you.elo);
  const rank = d.rankOf[you.i];
  const elo = you.elo ?? 0;
  const pct = !t ? 40 : t === 'open' ? (elo - 1000) / 1.5 : t === 'contender' ? (elo - 1150) / 1.5 : 100;
  const next = !t ? '2 of 5 placement games' : t === 'open' ? 1150 - elo + ' to Contender' : t === 'contender' ? 1300 - elo + ' to Elite' : (rank <= 5 ? 'Top 5 · ' : '') + 'Highest tier';
  const everyone = [...players, you];

  return (
    <Page title="Compete" action={<CourtSwitchButton court={court} onPress={() => setMenu(true)} />}>
      <PageScroll>
        <Card edge={t ? tier[t].edge : color.border} glow={{ rgb: t ? tier[t].glowRGB : color.inkRGB, alpha: t ? 0.16 : 0.04 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.l }}>
            <Avatar p={{ ...you, rank }} size="l" />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text t="cardTitle" numberOfLines={1}>
                {rank ? '#' + rank + ' · ' + courts[court].name : 'Unranked'}
              </Text>
              <Text t="eyebrow" tint={t ? tier[t].ink : color.muted} style={{ marginTop: space.s }}>
                {t ? tier[t].name : 'Play 5 ranked games'}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text t="statL">{you.elo ? String(you.elo) : '–'}</Text>
              <Text t="micro" tint={color.muted} style={{ marginTop: space.xs }}>
                ELO
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.ml, marginTop: space.xl }}>
            <View style={{ flex: 1 }}>
              <ProgressBar pct={pct} fill={t ? tier[t].ring : color.ink} />
            </View>
            <Text t="rowSub" tint={color.muted}>
              {next}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: space.m, marginTop: space.xl }}>
            <Button label="+ Log game" kind="light" grow onPress={() => router.push('/log-game')} />
            <Button label="+ Ranked game" kind="ghost" grow onPress={() => setSheet({ court, d: 3, h: 12, ranked: true })} />
          </View>
        </Card>

        <View style={{ marginTop: space.l }}>
          <TierStrip items={TIERS.map(([k, range]) => ({ tier: k, range, count: everyone.filter((p) => tierOf(p.elo) === k).length }))} />
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.m, columnGap: space.xxl, marginTop: space.l }}>
          {[
            { l: 'Tier ring', p: { i: '', elo: 1200 } },
            { l: 'Top 5', p: { i: '', elo: 1342, rank: 1 } },
            { l: 'Friend', p: { i: '', friend: true } },
            { l: 'On court', p: { i: '', live: true } },
          ].map((k) => (
            <View key={k.l} style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
              <Avatar p={k.p} size="s" />
              <Text t="rowSub" tint={color.muted}>
                {k.l}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: space.x3 }}>
          <PlayerBoard court={court} sort={sort} onSort={setSort} />
        </View>
      </PageScroll>
      <CourtMenu open={menu} onClose={() => setMenu(false)} />
      <NewGameSheet at={sheet} onClose={() => setSheet(null)} />
    </Page>
  );
}
