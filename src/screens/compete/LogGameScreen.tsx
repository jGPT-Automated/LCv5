import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { PlayerPicker } from '@/components/court/PlayerPicker';
import { Page } from '@/components/layout/Page';
import { PageScroll } from '@/components/layout/PageScroll';
import { Avatar } from '@/components/ui/Avatar';
import { ChoiceList } from '@/components/ui/ChoiceList';
import { Button, SportTag } from '@/components/ui/controls';
import { Dialog } from '@/components/ui/Dialog';
import { Icon } from '@/components/ui/Icon';
import { PlayedDays } from '@/components/ui/PlayedDays';
import { ScoreField } from '@/components/ui/ScoreField';
import { SelectField } from '@/components/ui/SelectField';
import { StatusCard } from '@/components/ui/StatusCard';
import { Section } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { courts, dayNums, days, players, TODAY, type CourtId } from '@/mock/data';
import { courtDistance } from '@/mock/model';
import { ME, type Format } from '@/mock/social';
import { useApp } from '@/state/AppState';
import { usePeople } from '@/state/usePeople';
import { color, space } from '@/theme';

type Slot = { side: 'a' | 'b'; k: number };

const PAST = Array.from({ length: 7 }, (_, k) => 6 - k).map((back) => {
  const d = (TODAY - back + 7) % 7;
  return { label: back === 0 ? 'Today' : days[d].charAt(0) + days[d].slice(1).toLowerCase(), num: dayNums[TODAY] - back, back };
});

/**
 * Log a game, laid out as in the current app: court, the day it was played,
 * the matchup (you vs a player, or teams), the final score, then a review
 * step before it's sent. It counts once the other side approves.
 */
export function LogGameScreen({ opp }: { opp?: string }) {
  const app = useApp();
  const { get, name } = usePeople();
  const [court, setCourt] = useState<CourtId>(app.checkedAt ?? app.profile.home);
  const [day, setDay] = useState(6);
  const [mates, setMates] = useState<(string | null)[]>([]);
  const [opps, setOpps] = useState<(string | null)[]>([opp ?? null]);
  const [picking, setPicking] = useState<Slot | null>(opp ? null : { side: 'b', k: 0 });
  const [score, setScore] = useState(['', '']);
  const [courtOpen, setCourtOpen] = useState(false);
  const [review, setReview] = useState(false);

  const per = opps.length;
  const fmt = (per + 'v' + per) as Format;
  const taken = [...mates, ...opps].filter(Boolean) as string[];
  const pool = players.filter((p) => !app.blocked.includes(p.i) && !taken.includes(p.i)).map((p) => get(p.i));
  const a = Number(score[0]);
  const b = Number(score[1]);
  const ready = mates.every(Boolean) && opps.every(Boolean) && score[0] !== '' && score[1] !== '' && a !== b;
  const result = score[0] === '' || score[1] === '' ? '' : a === b ? "Scores can't be tied" : a > b ? 'Win — positive ELO change' : 'Loss — negative ELO change';

  const setSlot = (s: Slot, i: string | null) => (s.side === 'a' ? setMates : setOpps)((list) => list.map((x, k) => (k === s.k ? i : x)));
  const addPlayer = () => {
    setMates((m) => [...m, null]);
    setOpps((o) => [...o, null]);
  };
  const removePlayer = () => {
    setMates((m) => m.slice(0, -1));
    setOpps((o) => o.slice(0, -1));
    setPicking(null);
  };
  const confirm = () => {
    const id = app.logGame({ court, fmt, ranked: true, a: [ME, ...(mates as string[])], b: opps as string[], score: [a, b] });
    router.replace({ pathname: '/game/[id]', params: { id } });
  };

  const slot = (s: Slot, placeholder: string) => {
    const who = (s.side === 'a' ? mates : opps)[s.k];
    const on = picking?.side === s.side && picking.k === s.k;
    return (
      <SelectField
        key={s.side + s.k}
        value={who ? name(who) : undefined}
        placeholder={on ? 'Selecting…' : placeholder}
        active={on}
        leading={who ? <Avatar p={get(who)} size="s" /> : undefined}
        onPress={() => setPicking(on ? null : s)}
      />
    );
  };

  const title = fmt + ' at ' + courts[court].name + ' · ' + PAST[day].label;

  if (review)
    return (
      <Page
        title="Log game"
        back={{ label: 'Compete', fallback: '/compete' }}
        footer={
          <View style={{ flexDirection: 'row', gap: space.m }}>
            <Button label="Edit" kind="ghost" size="large" grow onPress={() => setReview(false)} />
            <Button label="Confirm" kind="orange" size="large" grow feedback="success" onPress={confirm} />
          </View>
        }>
        <PageScroll top={space.x5}>
          <Text t="hero" align="center">
            Review score
          </Text>
          <Text t="lead" tint={color.muted} align="center" style={{ marginTop: space.m, marginBottom: space.x5 }}>
            Check the matchup, then send it in.
          </Text>
          <StatusCard status="Not sent">
            <Text t="section" tint={color.muted}>
              {title}
            </Text>
            {[
              { ids: [ME, ...(mates as string[])], s: a },
              { ids: opps as string[], s: b },
            ].map((side, k) => (
              <View key={k} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.xl }}>
                <Text t="rowTitle" tint={side.s > (k ? a : b) ? color.ink : color.muted}>
                  {side.ids.map(name).join(' + ')}
                </Text>
                <Text t="statL" upper={false} tint={side.s > (k ? a : b) ? color.ink : color.muted}>
                  {String(side.s)}
                </Text>
              </View>
            ))}
            <Text t="meta" tint={color.muted} align="center" style={{ marginTop: space.x3 }}>
              Ratings move once the other side approves.
            </Text>
          </StatusCard>
        </PageScroll>
      </Page>
    );

  return (
    <Page
      title="Log game"
      back={{ label: 'Back', fallback: '/compete' }}
      footer={<Button label="Log game" kind="light" size="large" disabled={!ready} onPress={() => setReview(true)} />}>
      <PageScroll>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.m }}>
          <SportTag sport={courts[court].sport} />
          <SelectField value={courts[court].name} placeholder="Court" onPress={() => setCourtOpen(true)} />
        </View>

        <Section title="Played" action={<Text t="section" tint={color.muted}>{'Oct ' + PAST[day].num}</Text>}>
          <PlayedDays days={PAST} value={day} onChange={setDay} />
        </Section>

        <Section title={'Matchup · ' + fmt}>
          <View style={{ flexDirection: 'row', gap: space.l }}>
            <View style={{ flex: 1, gap: space.m }}>
              <Text t="eyebrow" tint={color.muted}>
                {per > 1 ? 'Your side' : 'You'}
              </Text>
              <SelectField
                value={app.profile.first}
                placeholder=""
                leading={<Avatar p={get(ME)} size="s" />}
                trailing={
                  <Text t="micro" tint={color.muted}>
                    You
                  </Text>
                }
              />
              {mates.map((_, k) => slot({ side: 'a', k }, 'Teammate ' + (k + 1)))}
            </View>
            <View style={{ flex: 1, gap: space.m }}>
              <Text t="eyebrow" tint={color.muted}>
                {per > 1 ? 'Other side' : 'Opponent'}
              </Text>
              {opps.map((_, k) => slot({ side: 'b', k }, per > 1 ? 'Opponent ' + (k + 1) : 'Select'))}
            </View>
          </View>
          {picking ? (
            <View style={{ marginTop: space.l }}>
              <PlayerPicker
                people={pool}
                onPick={(i) => {
                  setSlot(picking, i);
                  setPicking(null);
                }}
              />
            </View>
          ) : null}
          <View style={{ flexDirection: 'row', gap: space.m, marginTop: space.l }}>
            {per < 5 ? (
              <Button label={'Add player · ' + (per + 1) + 'v' + (per + 1)} kind="ghost" grow icon={<Icon name="plus" size={12} />} onPress={addPlayer} />
            ) : null}
            {per > 1 ? <Button label="Remove" kind="ghost" onPress={removePlayer} /> : null}
          </View>
        </Section>

        <Section title="Final score">
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: space.l }}>
            <ScoreField label={per > 1 ? 'Your team' : name(ME)} value={score[0]} onChange={(v) => setScore([v, score[1]])} />
            <Text t="statL" tint={color.faint}>
              :
            </Text>
            <ScoreField label={per > 1 ? 'Other team' : opps[0] ? name(opps[0]) : 'Opponent'} value={score[1]} onChange={(v) => setScore([score[0], v])} />
          </View>
          {result ? (
            <Text t="section" align="center" tint={a === b ? color.orangeInk : color.ink} style={{ marginTop: space.xl }}>
              {result}
            </Text>
          ) : null}
        </Section>
      </PageScroll>

      <Dialog open={courtOpen} onClose={() => setCourtOpen(false)} title="Court" actions={[{ label: 'Done', kind: 'light', onPress: () => setCourtOpen(false) }]}>
        <ChoiceList<CourtId>
          value={court}
          onChange={setCourt}
          choices={app.mine.map((c) => ({ key: c, title: courts[c].name, trailing: courtDistance(c) }))}
        />
      </Dialog>
    </Page>
  );
}
