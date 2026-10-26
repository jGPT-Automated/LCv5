import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { PageHeader } from '@/components/nav/PageHeader';
import { Screen } from '@/components/nav/Screen';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyRow, Segmented, Tap } from '@/components/ui/controls';
import { Glow } from '@/components/ui/Glow';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { days, me, TODAY } from '@/mock/data';
import { record, tierOf } from '@/mock/model';
import { useApp } from '@/state/AppState';
import { color, radius, space, tier } from '@/theme';

import { Friends } from './Friends';
import { Inbox, useInbox } from './Inbox';

type MeTab = 'activity' | 'friends' | 'inbox';

export function MeScreen() {
  const { d, meTier } = useApp();
  const [tab, setTab] = useState<MeTab>('activity');
  const inbox = useInbox();

  const you = d.you;
  const t = tierOf(you.elo);
  const rank = d.rankOf[you.i];
  const ranked = !!t;
  const progress = !t ? 40 : t === 'open' ? ((you.elo as number) - 1000) / 1.5 : t === 'contender' ? ((you.elo as number) - 1150) / 1.5 : 100;
  const next = !t
    ? '2 of 5 placement games'
    : t === 'open'
      ? 1150 - (you.elo as number) + ' to Contender'
      : t === 'contender'
        ? 1300 - (you.elo as number) + ' to Elite'
        : (rank <= 5 ? 'Top 5 · ' : '') + 'Highest tier';
  const stats: [string, string | number][] = [
    ['ELO', you.elo ?? '–'],
    ['Rank', rank ? '#' + rank : '–'],
    ['Record', t ? record(you.elo as number) : '2–1'],
    ['Check-ins', me.checkIns],
  ];
  const weekMax = Math.max(...me.weekMinutes);
  const tierInk = t ? tier[t].ink : color.muted;

  return (
    <Screen
      scroll
      header={
        <PageHeader
          title="Me"
          right={
            <Tap onPress={() => router.push('/settings')} hitSlop={10}>
              <Icon name="gear" size={20} tint={color.muted} />
            </Tap>
          }
        />
      }>
      {/* Profile card */}
      <View
        style={{
          marginTop: space.s,
          marginHorizontal: space.xxl,
          borderRadius: radius.profile,
          borderWidth: 1,
          borderColor: t ? tier[t].edge : color.border,
          backgroundColor: color.surface,
          overflow: 'hidden',
        }}>
        <Glow rgb={t ? tier[t].glowRGB : '242,242,246'} alpha={t ? 0.16 : 0.04} rx="80%" ry="90%" stop={0.65} />
        <CourtLines />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xxl, padding: space.x3, paddingBottom: space.xxl }}>
          <Avatar p={{ ...you, rank }} size="xl" />
          <View style={{ flexShrink: 1, gap: space.s }}>
            <Text variant="display" size={28} track="snug" lineHeight={0.95}>
              {me.name}
              <Text variant="display" size={28} tint={color.orange}>
                .
              </Text>
            </Text>
            <Text variant="label" size={9} track="widest" tint={tierInk}>
              {t ? tier[t].name + (rank <= 5 ? ' · Top 5' : '') : 'Unranked'}
            </Text>
            <Text size={11} weight="medium" tint={color.muted}>
              {rank && ranked ? '#' + rank + ' at Rancho Park' : 'Rancho Park'}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: color.divider, backgroundColor: color.inset }}>
          {stats.map(([k, v], j) => (
            <View
              key={k}
              style={{ flex: 1, paddingVertical: space.l, alignItems: 'center', gap: space.xsm, borderLeftWidth: j ? 1 : 0, borderLeftColor: color.divider }}>
              <Text variant="display" size={20} track="tight">
                {String(v)}
              </Text>
              <Text variant="label" size={7.5} tint={color.muted}>
                {k}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* This week */}
      <View
        style={{
          marginTop: space.l,
          marginHorizontal: space.xxl,
          padding: space.xl,
          borderRadius: radius.card,
          borderWidth: 1,
          borderColor: color.border,
          backgroundColor: color.surface,
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text variant="label" size={10}>
            This week
          </Text>
          <Text size={10.5} tint={color.muted}>
            1h 40m on court
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: space.s, marginTop: space.l, height: 56, alignItems: 'flex-end' }}>
          {me.weekMinutes.map((m, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: Math.max(3, Math.round((m / weekMax) * 56)),
                borderRadius: radius.button,
                backgroundColor: m ? (i === TODAY ? color.ink : color.barPast) : color.chip,
              }}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: space.s, marginTop: space.s }}>
          {days.map((l, i) => (
            <Text key={l} variant="label" size={8} track="wide" align="center" tint={i === TODAY ? color.ink : color.faint} style={{ flex: 1 }}>
              {l.charAt(0)}
            </Text>
          ))}
        </View>
        <View style={{ height: 1, backgroundColor: color.divider, marginTop: space.xl, marginBottom: space.l }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text variant="label" size={9} tint={color.muted}>
            {ranked ? 'Tier progress' : 'Placement'}
          </Text>
          <Text size={10.5} tint={color.muted}>
            {next}
          </Text>
        </View>
        <View style={{ height: 4, borderRadius: radius.pill, backgroundColor: color.track, marginTop: space.m, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${Math.min(100, progress)}%`, borderRadius: radius.pill, backgroundColor: t ? tier[t].ring : color.ink }} />
        </View>
      </View>

      {/* Activity / Friends / Inbox */}
      <View style={{ paddingHorizontal: space.gutter, paddingTop: space.x4 }}>
        <Segmented
          options={[
            ['activity', 'Activity'],
            ['friends', 'Friends'],
            ['inbox', inbox.items.length ? `Inbox · ${inbox.items.length}` : 'Inbox'],
          ]}
          value={tab}
          onChange={setTab}
        />
        <View style={{ marginTop: space.s }}>
          {tab === 'activity' ? <Activity ranked={ranked} key={meTier} /> : null}
          {tab === 'friends' ? <Friends /> : null}
          {tab === 'inbox' ? <Inbox {...inbox} /> : null}
        </View>
      </View>
    </Screen>
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
  if (!acts.length) return <EmptyRow>No activity yet</EmptyRow>;
  return (
    <View>
      {acts.map((a, k) => (
        <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: space.l, minHeight: 60, borderBottomWidth: 1, borderBottomColor: color.line }}>
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: radius.segWrap,
              backgroundColor: color.surface,
              borderWidth: 1,
              borderColor: color.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text variant="display" size={14} tint={a.ink}>
              {a.g}
            </Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text size={13}>{a.t}</Text>
            <Text size={10.5} weight="medium" tint={color.dim} numberOfLines={1} style={{ marginTop: space.xxs }}>
              {a.m}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text variant="display" size={16} upper={false}>
              {a.v}
            </Text>
            {a.d ? (
              <Text size={9.5} tint={a.d.startsWith('+') ? color.ink : color.dim} style={{ marginTop: space.xs }}>
                {a.d}
              </Text>
            ) : null}
          </View>
        </View>
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
      <Circle cx={200 + 110 - 130} cy={-60 + 130} r={130} fill="none" stroke="url(#fade)" strokeWidth={1} />
      <Rect x={116} y={46} width={90} height={72} fill="none" stroke="url(#fade)" strokeWidth={1} />
      <Circle cx={200 - 48 - 36} cy={46 + 36} r={36} fill="none" stroke="url(#fade)" strokeWidth={1} />
    </Svg>
  );
}
