import { useState } from 'react';
import { View } from 'react-native';

import { GameBoard } from '@/components/court/GameBoard';
import { Page } from '@/components/layout/Page';
import { PageScroll } from '@/components/layout/PageScroll';
import { Button, EmptyRow, IconButton, Switch } from '@/components/ui/controls';
import { Dialog } from '@/components/ui/Dialog';
import { Field } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { StatusCard } from '@/components/ui/StatusCard';
import { Stepper } from '@/components/ui/Stepper';
import { Text } from '@/components/ui/Text';
import { Timeline, type TimelineItem } from '@/components/ui/Timeline';
import { courts } from '@/mock/data';
import { sideNames, timeLeft } from '@/mock/games';
import { clock, dayLabel, ME, type Match } from '@/mock/social';
import { useApp } from '@/state/AppState';
import { usePeople } from '@/state/usePeople';
import { color, space } from '@/theme';

const DID = { logged: 'logged the game', approved: 'approved the game', disputed: 'disputed the score', revised: 'fixed the score', auto: 'Auto-approved' } as const;

/**
 * A game, laid out as in the current app: time left on top, the game card
 * with its status band, the history as a timeline, and the actions (Approve,
 * Dispute, Hide score) pinned at the bottom.
 */
export function GameScreen({ id }: { id: string }) {
  const app = useApp();
  const { get, name } = usePeople();
  const m = app.matches.find((x) => x.id === id);
  const [disputing, setDisputing] = useState(false);
  const [info, setInfo] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (!m)
    return (
      <Page title="Game score" back={{ label: 'Back', fallback: '/me' }}>
        <PageScroll>
          <EmptyRow>Game not found</EmptyRow>
        </PageScroll>
      </Page>
    );

  const needsYou = m.waitingOn.includes(ME);
  const youLogged = m.loggedBy === ME;
  const left = m.hoursLeft ?? 0;
  const status =
    m.status === 'final'
      ? { label: 'Final', tone: 'orange' as const }
      : m.status === 'disputed'
        ? { label: 'Disputed', tone: 'orange' as const }
        : needsYou
          ? { label: 'Waiting on you', tone: 'orange' as const }
          : { label: 'Waiting on ' + name(m.waitingOn[0] ?? ''), tone: 'quiet' as const };

  const eloFor = (ids: string[]) => {
    if (m.status !== 'final' || !m.ranked || ids.length !== 1) return undefined;
    const p = get(ids[0]);
    const delta = m.delta[ids[0]] ?? 0;
    return p.elo ? { now: p.elo, delta } : undefined;
  };

  const items: TimelineItem[] = [
    { when: dayLabel(m.ago), what: 'Played · ' + courts[m.court].name, state: 'first' },
    ...m.events.map((e) => ({
      when: e.ago === 0 ? 'Now' : clock(e.ago),
      who: e.what === 'auto' ? undefined : name(e.who),
      what: DID[e.what],
      detail: e.what === 'disputed' && m.proposed ? 'Proposed ' + m.proposed[0] + '–' + m.proposed[1] + (e.note ? '. ' + e.note : '') : e.note,
      state: 'done' as const,
    })),
    ...(m.status !== 'final' ? [{ when: '', what: 'Waiting on ' + m.waitingOn.map((i) => (i === ME ? 'you' : name(i))).join(', '), state: 'pending' as const }] : []),
  ];

  return (
    <Page
      title="Game score"
      back={{ label: 'Back', fallback: '/me' }}
      action={
        <IconButton label="How reviews work" onPress={() => setInfo(true)}>
          <Icon name="info" size={18} tint={color.muted} />
        </IconButton>
      }
      footer={
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.l }}>
            <Icon name="eye" size={18} tint={color.muted} />
            <View style={{ flex: 1 }}>
              <Text t="headline">Hide score</Text>
              <Text t="footnote" tint={color.muted}>
                {hidden ? 'Others see only W or L' : 'Score shows in feeds'}
              </Text>
            </View>
            <Switch on={hidden} onChange={setHidden} label="Hide score" />
          </View>
          {needsYou && m.status === 'review' ? (
            <View style={{ flexDirection: 'row', gap: space.m }}>
              <Button label="Dispute" kind="ghost" size="large" grow icon={<Icon name="flag" size={16} />} onPress={() => setDisputing(true)} />
              <Button
                label="Approve score"
                kind="orange"
                size="large"
                grow
                feedback="success"
                icon={<Icon name="check" size={14} tint={color.onBright} />}
                onPress={() => app.approve(m.id)}
              />
            </View>
          ) : null}
          {m.status === 'disputed' && youLogged && m.proposed ? (
            <Button label={'Accept ' + m.proposed[0] + '–' + m.proposed[1]} kind="orange" size="large" feedback="success" onPress={() => app.acceptProposed(m.id)} />
          ) : null}
        </>
      }>
      <PageScroll>
        <StatusCard
          status={status.label}
          tone={status.tone}
          note={m.status === 'final' ? undefined : (m.status === 'disputed' ? 'Voids in ' : 'Auto-approves in ') + timeLeft(left)}>
          <GameBoard
            title={m.fmt + ' at ' + courts[m.court].name}
            date={dayLabel(m.ago)}
            a={{ people: m.a.map(get), score: m.score[0], won: m.score[0] > m.score[1], elo: eloFor(m.a) }}
            b={{ people: m.b.map(get), score: m.score[1], won: m.score[1] > m.score[0], elo: eloFor(m.b) }}
          />
        </StatusCard>
        <View style={{ marginTop: space.x5 }}>
          <Timeline items={items} />
        </View>
      </PageScroll>

      <Dialog
        open={info}
        onClose={() => setInfo(false)}
        title="How reviews work"
        body="The other side has 3 days to approve or dispute. No answer approves it. A disputed score has 7 days to be fixed, or the game voids. Ratings move once it's final."
        actions={[{ label: 'Done', kind: 'light', onPress: () => setInfo(false) }]}
      />
      <DisputeDialog m={m} open={disputing} onClose={() => setDisputing(false)} onSend={(score, note) => app.dispute(m.id, score, note)} />
    </Page>
  );
}

function DisputeDialog({ m, open, onClose, onSend }: { m: Match; open: boolean; onClose: () => void; onSend: (s: [number, number], note: string) => void }) {
  const { name } = usePeople();
  const [a, setA] = useState(m.score[0]);
  const [b, setB] = useState(m.score[1]);
  const [note, setNote] = useState('');
  const changed = a !== m.score[0] || b !== m.score[1];
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Dispute score"
      body={name(m.loggedBy) + ' gets your score to accept, or the game voids in 7 days.'}
      actions={[
        {
          label: 'Send dispute',
          kind: 'orange',
          disabled: !changed,
          onPress: () => {
            onSend([a, b], note.trim());
            onClose();
          },
        },
        { label: 'Cancel', onPress: onClose },
      ]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ alignItems: 'center', gap: space.s }}>
          <Text t="eyebrow" tint={color.muted}>
            {sideNames(m.a, name)}
          </Text>
          <Stepper value={a} onChange={setA} label={sideNames(m.a, name) + ' score'} />
        </View>
        <View style={{ alignItems: 'center', gap: space.s }}>
          <Text t="eyebrow" tint={color.muted}>
            {sideNames(m.b, name)}
          </Text>
          <Stepper value={b} onChange={setB} label={sideNames(m.b, name) + ' score'} />
        </View>
      </View>
      <Field label="What changed" value={note} onChange={setNote} placeholder="Optional" />
    </Dialog>
  );
}
