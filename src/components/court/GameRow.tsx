import { View } from 'react-native';

import { Button } from '@/components/ui/controls';
import { Row } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { color, size, space } from '@/theme';

/** A scheduled game: date block, title, format and spots, Join. */
export function GameRow({
  day,
  time,
  title,
  detail,
  joined,
  onToggle,
}: {
  day: string;
  time: string;
  title: string;
  detail: string;
  joined: boolean;
  onToggle: () => void;
}) {
  return (
    <Row
      leading={
        <View style={{ width: size.dateBlock, borderRightWidth: 1, borderRightColor: color.divider }}>
          <Text t="micro" tint={color.muted}>
            {day}
          </Text>
          <Text t="statS">{time}</Text>
        </View>
      }
      title={
        <Text t="itemTitle" numberOfLines={1}>
          {title}
        </Text>
      }
      subtitle={detail}
      trailing={
        <View style={{ marginLeft: space.xs }}>
          <Button label={joined ? 'Joined' : 'Join'} kind={joined ? 'light' : 'outline'} size="compact" onPress={onToggle} />
        </View>
      }
    />
  );
}
