import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { WeekBars } from '@/components/court/WeekBars';
import { Page } from '@/components/layout/Page';
import { PageScroll } from '@/components/layout/PageScroll';
import { Avatar } from '@/components/ui/Avatar';
import { IconButton, Segmented } from '@/components/ui/controls';
import { Icon } from '@/components/ui/Icon';
import { Card, Glyph, ProgressBar, Row, Rule, StatStrip } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { days, me, TODAY } from '@/mock/data';
import { record, tierOf } from '@/mock/model';
import { useApp } from '@/state/AppState';
import { color, space, tier } from '@/theme';

import { Friends } from './Friends';
import { Inbox, useInbox } from './Inbox';

type MeTab = 'activity' | 'friends' | 'inbox';

export function MeScreen() {
  const { d } = useApp();
  const [tab, setTab] = useState<MeTab>('activity');
  const inbox = useInbox();

  const you = d.you;
  const t = tierOf(you.elo);
  const rank = d.rankOf[you.i];
  const elo = you.elo as number;
  const progress = !t ? 40 : t === 'open' ? (elo - 1000) / 1.5 : t === 'contender' ? (elo - 1150) / 1.5 : 100;
  const next = !t
    ? '2 of 5 placement games'
    : t === 'open'
      ? 1150 - elo + ' to Contender'
      : t === 'contender'
        ? 1300 - elo + ' to Elite'
        : (rank <= 5 ? 'Top 5 · ' : '') + 'Highest tier';

  return (
    <Page
      title="Me"
      action={
        <IconButton label="Settings" onPress={() => router.push('/settings')}>
          <Icon name="gear" size={18} tint={color.muted} />
        </IconButton>
      }>
      <PageScroll>
        <Card flush edge={t ? tier[t].edge : color.border} glow={{ rgb: t ? tier[t].glowRGB : '242,242,246', alpha: t ? 0.16 : 0.04 }}>
          <CourtLines />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xxl, padding: space.x3, paddingBottom: space.xxl }}>
            <Avatar p={{ ...you, rank }} size="xl" />
            <View style={{ flexShrink: 1, gap: space.s }}>
              <Text t="hero">
                {me.name}
                <Text t="hero" tint={color.orange}>
                  .
                </Text>
              </Text>
              <Text t="eyebrow" tint={t ? tier[t].ink : color.muted}>
                {t ? tier[t].name + (rank <= 5 ? ' · Top 5' : '') : 'Unranked'}
              </Text>
              <Text t="meta" tint={color.muted}>
                {t ? '#' + rank + ' at Rancho Park' : 'Rancho Park'}
              </Text>
            </View>
          </View>
          <StatStrip
            items={[
              { value: you.elo ?? '–', label: 'ELO' },
              { value: t ? '#' + rank : '–', label: 'Rank' },
              { value: t ? record(elo) : '2–1', label: 'Record' },
              { value: me.checkIns, label: 'Check-ins' },
            ]}
          />
        </Card>

        <View style={{ marginTop: space.l }}>
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: space.l }}>
              <Text t="section">This week</Text>
              <Text t="rowSub" tint={color.muted}>
                1h 40m on court
              </Text>
            </View>
            <WeekBars minutes={me.weekMinutes} labels={days.map((l) => l.charAt(0))} today={TODAY} />
            <Rule gap={space.l} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: space.m }}>
              <Text t="eyebrow" tint={color.muted}>
                {t ? 'Tier progress' : 'Placement'}
              </Text>
              <Text t="rowSub" tint={color.muted}>
                {next}
              </Text>
            </View>
            <ProgressBar pct={progress} fill={t ? tier[t].ring : color.ink} />
          </Card>
        </View>

        <View style={{ marginTop: space.x5 }}>
          <Segmented<MeTab>
            options={[
              ['activity', 'Activity'],
              ['friends', 'Friends'],
              ['inbox', inbox.items.length ? 'Inbox · ' + inbox.items.length : 'Inbox'],
            ]}
            value={tab}
            onChange={setTab}
          />
          <View style={{ marginTop: space.s }}>
            {tab === 'activity' ? <Activity ranked={!!t} /> : null}
            {tab === 'friends' ? <Friends /> : null}
            {tab === 'inbox' ? <Inbox {...inbox} /> : null}
          </View>
        </View>
      </PageScroll>
    </Page>
  );
}

function Activity({ ranked }: { ranked: boolean }) {
  const acts = [
    { g: 'W', t: 'Beat Marcus', m: (ranked ? '1v1 · Ranked' : '1v1 · Casual') + ' · Today', v: '21–17', d: ranked ? '+14 ELO' : '', ink: color.ink },
    { g: '✓', t: 'Checked in', m: 'Rancho Park · Today', v: '1h 40m', d: '', ink: color.muted },
    { g: 'L', t: 'Lost to Dre', m: (ranked ? '3v3 · Ranked' : '3v3 · Casual') + ' · Mon', v: '15–21', d: ranked ? '−9 ELO' : '', ink: color.dim },
    { g: '+', t: 'Joined Thursday run', m: 'Rancho Park · Thu 7 PM', v: '', d: '', ink: color.muted },
    { g: '✓', t: 'Checked in', m: 'Venice Beach · Sun', v: '55m', d: '', ink: color.muted },
  ];
  return (
    <View>
      {acts.map((a, k) => (
        <Row
          key={k}
          leading={<Glyph tint={a.ink}>{a.g}</Glyph>}
          title={a.t}
          subtitle={a.m}
          subtitleTint={color.dim}
          trailing={
            a.v ? (
              <View style={{ alignItems: 'flex-end' }}>
                <Text t="statS" upper={false}>
                  {a.v}
                </Text>
                {a.d ? (
                  <Text t="rowSub" tint={a.d.startsWith('+') ? color.ink : color.dim}>
                    {a.d}
                  </Text>
                ) : null}
              </View>
            ) : null
          }
        />
      ))}
    </View>
  );
}

/** Faint court lines in the profile card corner, fading out to the left. */
function CourtLines() {
  return (
    <Svg width={200} height={170} style={{ position: 'absolute', top: 0, right: 0 }} pointerEvents="none">
      <Defs>
        <LinearGradient id="fade" x1="1" y1="0" x2="0" y2="0">
          <Stop offset="0" stopColor={color.ink} stopOpacity={0.09} />
          <Stop offset="0.5" stopColor={color.ink} stopOpacity={0.036} />
          <Stop offset="1" stopColor={color.ink} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Circle cx={180} cy={70} r={130} fill="none" stroke="url(#fade)" strokeWidth={1} />
      <Rect x={116} y={46} width={90} height={72} fill="none" stroke="url(#fade)" strokeWidth={1} />
      <Circle cx={116} cy={82} r={36} fill="none" stroke="url(#fade)" strokeWidth={1} />
    </Svg>
  );
}
