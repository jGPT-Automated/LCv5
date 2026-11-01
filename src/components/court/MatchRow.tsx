import { router } from 'expo-router';
import { View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';
import { Glyph, Row } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { detailLine, headline, statusOf } from '@/mock/games';
import { ME, sideOf, won, type Match } from '@/mock/social';
import { usePeople } from '@/state/usePeople';
import { color, space } from '@/theme';

/**
 * A game in a list. Leading W/L for your games, the score on the right, and a
 * status pill until it's final. Tapping opens the game.
 */
export function MatchRow({ m, name, viewer = ME, divider }: { m: Match; name: (i: string) => string; viewer?: string; divider?: boolean }) {
  const { get } = usePeople();
  const side = sideOf(m, viewer);
  const w = won(m, viewer);
  const score = side === 'b' ? m.score[1] + '–' + m.score[0] : m.score[0] + '–' + m.score[1];
  const st = statusOf(m, name);
  const delta = m.status === 'final' ? m.delta[viewer] : undefined;
  return (
    <Row
      divider={divider}
      onPress={() => router.push({ pathname: '/game/[id]', params: { id: m.id } })}
      leading={
        side ? (
          <Glyph tint={w ? color.ink : color.dim}>{w ? 'W' : 'L'}</Glyph>
        ) : (
          // Not your game: show who won.
          <Avatar p={get((m.score[0] > m.score[1] ? m.a : m.b)[0])} size="m" />
        )
      }
      title={headline(m, name, viewer === ME)}
      subtitle={detailLine(m)}
      subtitleTint={color.dim}
      trailing={
        <View style={{ alignItems: 'flex-end', gap: space.xxs }}>
          <Text t="statS" upper={false}>
            {score}
          </Text>
          {m.status !== 'final' ? (
            <Pill label={st.label} tone={st.tone} />
          ) : delta ? (
            <Text t="rowSub" tint={delta > 0 ? color.ink : color.dim}>
              {(delta > 0 ? '+' : '−') + Math.abs(delta) + ' ELO'}
            </Text>
          ) : null}
        </View>
      }
    />
  );
}
