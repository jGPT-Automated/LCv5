import { router } from 'expo-router';
import { View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Row, RowValue } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import type { PlayerView } from '@/mock/model';
import { color, size, space } from '@/theme';

/**
 * One player in a list: optional rank, avatar, name, a line of context and a
 * number on the right. Used on Players, Compete, Friends and the NOW list.
 */
export function PlayerRow({
  p,
  rank,
  rankTint = color.faint,
  subtitle,
  subtitleTint,
  value,
  valueLabel,
  trailing,
  wash,
  onPress,
}: {
  p: PlayerView;
  rank?: number | string;
  rankTint?: string;
  subtitle: string;
  subtitleTint?: string;
  value?: string | number;
  valueLabel?: string;
  trailing?: React.ReactNode;
  wash?: string;
  /** Defaults to opening the player's profile (or Me for you). */
  onPress?: () => void;
}) {
  return (
    <Row
      onPress={onPress ?? (() => openPlayer(p.i, !!p.me))}
      tone={p.me ? 'you' : undefined}
      wash={p.me ? undefined : wash}
      leading={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.l }}>
          {rank !== undefined ? (
            <View style={{ width: size.rankLabel }}>
              <Text t="statS" tint={rankTint}>
                {String(rank)}
              </Text>
            </View>
          ) : null}
          <Avatar p={p} size="m" />
        </View>
      }
      title={p.me ? 'You' : p.n}
      subtitle={subtitle}
      subtitleTint={subtitleTint ?? (p.live ? color.orangeInk : color.dim)}
      trailing={trailing ?? (value !== undefined ? <RowValue value={value} label={valueLabel} /> : null)}
    />
  );
}

/** Open a player's profile; your own name goes to Me. */
export function openPlayer(i: string, me?: boolean) {
  if (me) router.navigate('/me');
  else router.push({ pathname: '/player/[id]', params: { id: i } });
}
