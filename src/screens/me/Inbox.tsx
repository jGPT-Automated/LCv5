import { useState } from 'react';
import { View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Button, EmptyRow } from '@/components/ui/controls';
import { Card } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { players } from '@/mock/data';
import { color, space } from '@/theme';

/**
 * Things that need you: score confirmations, friend requests, game invites.
 * Acting on one removes it and leaves a one-line note of what happened.
 */
type Item =
  | { id: string; kind: 'score'; who: string; score: string; detail: string }
  | { id: string; kind: 'friend'; who: string; note: string }
  | { id: string; kind: 'invite'; who: string; game: string; when: string };

const SEED: Item[] = [
  { id: 's1', kind: 'score', who: 'DW', score: '17–21', detail: '1v1 · Ranked · Rancho Park · Today' },
  { id: 'f1', kind: 'friend', who: 'SK', note: 'Plays at Rancho Park' },
  { id: 'i1', kind: 'invite', who: 'MR', game: 'Thursday run', when: 'Thu 7 PM · Rancho Park' },
  { id: 'f2', kind: 'friend', who: 'AO', note: 'Plays at Venice Beach' },
];

export function useInbox() {
  const [items, setItems] = useState<Item[]>(SEED);
  const [done, setDone] = useState<string[]>([]);
  const resolve = (id: string, what: string) => {
    setItems((x) => x.filter((i) => i.id !== id));
    setDone((x) => [what, ...x].slice(0, 3));
  };
  return { items, done, resolve };
}

const who = (i: string) => players.find((p) => p.i === i) ?? { i, n: i, elo: null, s: 0, seen: 0 };

export function Inbox({ items, done, resolve }: ReturnType<typeof useInbox>) {
  return (
    <View style={{ gap: space.m, marginTop: space.xs }}>
      {items.length === 0 ? <EmptyRow>Nothing needs you right now</EmptyRow> : null}
      {items.map((it) => {
        const p = who(it.who);
        const view =
          it.kind === 'score'
            ? {
                eyebrow: 'Confirm score',
                title: 'You vs ' + p.n + ' · ' + it.score,
                sub: it.detail,
                yes: ['Approve', 'Score approved with ' + p.n],
                no: ['Dispute', 'Score disputed with ' + p.n],
              }
            : it.kind === 'friend'
              ? {
                  eyebrow: 'Friend request',
                  title: p.n,
                  sub: it.note,
                  yes: ['Accept', p.n + ' added to friends'],
                  no: ['Decline', 'Request from ' + p.n + ' declined'],
                }
              : {
                  eyebrow: 'Game invite',
                  title: it.game,
                  sub: p.n + ' invited you · ' + it.when,
                  yes: ['Join', 'Joined ' + it.game],
                  no: ['Skip', 'Skipped ' + it.game],
                };
        return (
          <Card key={it.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.l }}>
              <Avatar p={p} size="m" />
              <View style={{ flex: 1, minWidth: 0, gap: space.xxxs }}>
                <Text t="micro" tint={it.kind === 'score' ? color.orangeInk : color.muted}>
                  {view.eyebrow}
                </Text>
                <Text t="rowTitle" numberOfLines={1}>
                  {view.title}
                </Text>
                <Text t="rowSub" tint={color.muted} numberOfLines={1}>
                  {view.sub}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: space.m, marginTop: space.l }}>
              <Button label={view.yes[0]} kind="light" size="compact" grow feedback="success" onPress={() => resolve(it.id, view.yes[1])} />
              <Button label={view.no[0]} kind="ghost" size="compact" grow onPress={() => resolve(it.id, view.no[1])} />
            </View>
          </Card>
        );
      })}
      {done.map((m, k) => (
        <Text key={m + k} t="meta" tint={color.dim}>
          {m}
        </Text>
      ))}
    </View>
  );
}
