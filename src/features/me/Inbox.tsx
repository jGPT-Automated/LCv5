import { useState } from 'react';
import { View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Button, EmptyRow } from '@/components/ui/controls';
import { Text } from '@/components/ui/Text';
import { players } from '@/mock/data';
import { color, radius, space } from '@/theme';

/**
 * Inbox items that need an action from you. Mock only: actions just remove the
 * item and show what happened, nothing is sent anywhere.
 */
type Item =
  | { id: string; kind: 'friend'; who: string; note: string }
  | { id: string; kind: 'score'; who: string; score: string; detail: string }
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
        let eyebrow: string, title: string, sub: string, actions: [string, 'light' | 'ghost', string][];
        if (it.kind === 'score') {
          eyebrow = 'Confirm score';
          title = 'You vs ' + p.n + ' · ' + it.score;
          sub = it.detail;
          actions = [
            ['Approve', 'light', 'Score approved with ' + p.n],
            ['Dispute', 'ghost', 'Score disputed with ' + p.n],
          ];
        } else if (it.kind === 'friend') {
          eyebrow = 'Friend request';
          title = p.n;
          sub = it.note;
          actions = [
            ['Accept', 'light', p.n + ' added to friends'],
            ['Decline', 'ghost', 'Request from ' + p.n + ' declined'],
          ];
        } else {
          eyebrow = 'Game invite';
          title = it.game;
          sub = p.n + ' invited you · ' + it.when;
          actions = [
            ['Join', 'light', 'Joined ' + it.game],
            ['Skip', 'ghost', 'Skipped ' + it.game],
          ];
        }
        return (
          <View
            key={it.id}
            style={{ padding: space.xl, gap: space.l, borderRadius: radius.panel, borderWidth: 1, borderColor: color.border, backgroundColor: color.surface }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.l }}>
              <Avatar p={p} size="m" />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text variant="label" size={8} tint={it.kind === 'score' ? color.orangeInk : color.muted}>
                  {eyebrow}
                </Text>
                <Text size={13} numberOfLines={1} style={{ marginTop: space.xs }}>
                  {title}
                </Text>
                <Text size={10.5} weight="medium" tint={color.muted} numberOfLines={1} style={{ marginTop: space.xxxs }}>
                  {sub}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: space.m }}>
              {actions.map(([l, k, msg]) => (
                <Button key={l} label={l} kind={k} height={38} size={9.5} grow onPress={() => resolve(it.id, msg)} />
              ))}
            </View>
          </View>
        );
      })}
      {done.map((m, k) => (
        <Text key={m + k} size={11} weight="medium" tint={color.dim}>
          {m}
        </Text>
      ))}
    </View>
  );
}
