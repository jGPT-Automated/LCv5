import { useState } from 'react';
import { View } from 'react-native';

import { PeopleStrip } from '@/components/court/PeopleStrip';
import { RunCard } from '@/components/court/RunCard';
import { Page } from '@/components/layout/Page';
import { PageScroll } from '@/components/layout/PageScroll';
import { Pager } from '@/components/layout/Pager';
import { Button } from '@/components/ui/controls';
import { Dialog } from '@/components/ui/Dialog';
import { Icon } from '@/components/ui/Icon';
import { Row, Section } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { courts, NOW_HOUR, players, TODAY, type CourtId } from '@/mock/data';
import { hourLabel, type PlayerView } from '@/mock/model';
import { balance, emptyRun, LIST_SIZE, runKey, type Run } from '@/mock/runs';
import { ME } from '@/mock/social';
import { useApp } from '@/state/AppState';
import { usePeople } from '@/state/usePeople';
import { color, size, space } from '@/theme';

import { CourtHero } from './CourtHero';
import { PartnerPicker } from './PartnerPicker';

const time = (h: number) => {
  const lb = hourLabel(7 + h);
  return lb.t + ' ' + lb.ap;
};

/**
 * Home: the live view of your court. Who's here now, who's coming, and the
 * open run for this hour (or the next one you pick). Everything else about a
 * court — feed, players, the week — is on its court page.
 */
export function DashboardScreen() {
  const app = useApp();
  const { mine, homeIndex, setHomeIndex, checkedAt } = app;
  const idx = Math.min(homeIndex, mine.length - 1);
  const court = mine[idx];
  const here = checkedAt === court;

  return (
    <Page
      title="Home"
      action={
        <Button
          label={here ? 'Check out' : 'Check in'}
          kind={here ? 'dark' : 'orange'}
          size="compact"
          feedback="commit"
          icon={here ? undefined : <Icon name="check" size={12} tint={color.onBright} />}
          onPress={() => (here ? app.checkOut() : app.checkIn(court))}
        />
      }>
      <Pager count={mine.length} index={idx} onIndex={setHomeIndex} render={(i) => <CourtHero id={mine[i]} />} />
      <Live key={court} court={court} />
    </Page>
  );
}

function Live({ court }: { court: CourtId }) {
  const app = useApp();
  const { d, runs } = app;
  const { get } = usePeople();
  const [hour, setHour] = useState(NOW_HOUR);
  const [picking, setPicking] = useState(false);
  const [reporting, setReporting] = useState(false);

  const view = d.view(court);
  const hereNow = d.livePeople(court).map(view);
  const coming = d.crowd(court, TODAY, NOW_HOUR + 1).map(view).filter((p) => !hereNow.some((h) => h.i === p.i));

  const pb = courts[court].sport === 'pb';
  const run: Run = runs[runKey(court, TODAY, hour)] ?? emptyRun(court);
  const scheduled = d.gameAt(court, TODAY, hour);
  const later = [NOW_HOUR, NOW_HOUR + 1, NOW_HOUR + 2].filter((h) => h < 17);

  // Who's in this run, as players on screen.
  const inRun = run.kind === 'list' ? run.ids.includes(ME) : [...run.court, ...run.line].some((p) => p.includes(ME));
  let card: { status: string; note?: string; sides: [(PlayerView | null)[], (PlayerView | null)[]]; vs?: string; line?: PlayerView[][]; live: boolean };
  if (run.kind === 'list') {
    const full = run.ids.length >= LIST_SIZE;
    if (full) {
      const [a, b] = balance(run.ids, d.you.elo);
      card = { status: 'Teams locked', note: '5v5 · balanced by ELO', sides: [a.map(get), b.map(get)], vs: 'vs', live: true };
    } else {
      // Spots fill down the left column, then the right.
      const spots: (PlayerView | null)[] = Array.from({ length: LIST_SIZE }, (_, k) => (run.ids[k] ? get(run.ids[k]) : null));
      card = {
        status: run.ids.length + ' of ' + LIST_SIZE + ' in',
        note: 'Teams are set when it fills',
        sides: [spots.slice(0, LIST_SIZE / 2), spots.slice(LIST_SIZE / 2)],
        live: inRun,
      };
    }
  } else {
    const pairs = run.court.length === 2 ? run.court : null;
    const onCourt = !!pairs;
    card = {
      status: onCourt ? 'On court' : 'Waiting for two pairs',
      note: onCourt && run.streak > 1 ? 'Winners stay · ' + run.streak + ' straight' : 'Winners stay',
      sides: pairs ? [pairs[0].map(get), pairs[1].map(get)] : [[null, null], [null, null]],
      vs: 'vs',
      line: run.line.map((p) => p.map(get)),
      live: onCourt,
    };
  }

  const partners = [...hereNow, ...coming, ...players.filter((p) => app.friendships[p.i] === 'friend').map((p) => get(p.i))]
    .filter((p, k, all) => !p.me && all.findIndex((x) => x.i === p.i) === k)
    .filter((p) => !(run.kind === 'pairs' && [...run.court, ...run.line].some((pair) => pair.includes(p.i))));

  return (
    <PageScroll top={space.xl}>
      <Section title={'Here now · ' + hereNow.length} first>
        {hereNow.length ? (
          <PeopleStrip people={hereNow} />
        ) : (
          <Text t="subhead" tint={color.muted}>
            Nobody yet
          </Text>
        )}
        {coming.length ? (
          <Text t="footnote" tint={color.muted} style={{ marginTop: space.l }}>
            {coming.length + ' coming by ' + time(NOW_HOUR + 1) + ' · ' + coming.slice(0, 3).map((p) => p.n).join(', ')}
          </Text>
        ) : null}
      </Section>

      <Section title={hour === NOW_HOUR ? 'Open run · now' : 'Open run · ' + time(hour)}>
        {scheduled ? (
          <Text t="subhead" tint={color.muted}>
            {scheduled.title + ' is scheduled at ' + time(hour) + '.'}
          </Text>
        ) : (
          <View style={{ gap: space.l }}>
            <RunCard title={(pb ? 'Doubles' : 'Open run') + ' · ' + time(hour)} status={card.status} note={card.note} live={card.live} sides={card.sides} vs={card.vs} line={card.line} />
            <View style={{ flexDirection: 'row', gap: space.m }}>
              {inRun ? (
                run.kind === 'list' ? (
                  <Button label="Leave run" kind="ghost" size="large" grow onPress={() => app.leaveRun(court, TODAY, hour)} />
                ) : run.line.some((p) => p.includes(ME)) ? (
                  <Button label="Leave line" kind="ghost" size="large" grow onPress={() => app.leaveRun(court, TODAY, hour)} />
                ) : null
              ) : (
                <Button
                  label={pb ? 'Join with partner' : 'Join run'}
                  kind="orange"
                  size="large"
                  grow
                  feedback="commit"
                  disabled={run.kind === 'list' && run.ids.length >= LIST_SIZE}
                  onPress={() => (pb ? setPicking(true) : app.joinRun(court, TODAY, hour))}
                />
              )}
              {run.kind === 'pairs' && run.court.length === 2 ? <Button label="Report winner" kind="ghost" size="large" grow onPress={() => setReporting(true)} /> : null}
            </View>
          </View>
        )}
      </Section>

      <Section title="Next hours">
        {later.map((h, k) => {
          const g = d.gameAt(court, TODAY, h);
          const r = runs[runKey(court, TODAY, h)] ?? emptyRun(court);
          const pairsIn = r.kind === 'pairs' ? r.line.length + (r.court.length ? 2 : 0) : 0;
          const count = r.kind === 'list' ? r.ids.length + ' of ' + LIST_SIZE + ' in' : pairsIn ? pairsIn + (pairsIn === 1 ? ' pair' : ' pairs') : 'No pairs yet';
          return (
            <Row
              key={h}
              tone={h === hour ? 'highlight' : undefined}
              divider={k < later.length - 1}
              onPress={() => setHour(h)}
              leading={
                <View style={{ width: size.dateBlock }}>
                  <Text t="headline">{h === NOW_HOUR ? 'Now' : time(h)}</Text>
                </View>
              }
              title={g ? g.title : 'Open run'}
              subtitle={g ? g.fmt + ' · scheduled' : count}
            />
          );
        })}
      </Section>

      <PartnerPicker
        open={picking}
        people={partners}
        onClose={() => setPicking(false)}
        onPick={(i) => {
          app.joinRun(court, TODAY, hour, i);
          setPicking(false);
        }}
      />
      {run.kind === 'pairs' && run.court.length === 2 ? (
        <Dialog
          open={reporting}
          onClose={() => setReporting(false)}
          title="Who won?"
          body="Winners stay on. The next pair in line steps on."
          actions={[
            ...run.court.map((pair, side) => ({
              label: pair.map((i) => (i === ME ? 'You' : get(i).n)).join(' + '),
              kind: 'light' as const,
              onPress: () => {
                app.reportWinner(court, TODAY, hour, side as 0 | 1);
                setReporting(false);
              },
            })),
            { label: 'Cancel', onPress: () => setReporting(false) },
          ]}
        />
      ) : null}
    </PageScroll>
  );
}
