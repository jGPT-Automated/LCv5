import type { ReactNode } from 'react';
import { View } from 'react-native';

import { color, radius, size, space } from '@/theme';

import { Tap } from './controls';
import { Icon } from './Icon';
import { Text } from './Text';

/** A dropdown trigger: the current value (or a placeholder) and a chevron. Without `onPress` it's a fixed value. */
export function SelectField({ value, placeholder, onPress, leading, active, trailing }: { value?: string; placeholder: string; onPress?: () => void; leading?: ReactNode; active?: boolean; trailing?: ReactNode }) {
  return (
    <Tap
      onPress={onPress}
      disabled={!onPress}
      label={value ?? placeholder}
      style={{
        flex: 1,
        height: size.large,
        paddingHorizontal: space.xl,
        borderRadius: radius.row,
        borderWidth: 1,
        borderColor: active ? color.orangeEdge : color.borderStrong,
        backgroundColor: active ? color.orangeSoft : color.surface,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.ml,
      }}>
      {leading}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text t={value ? 'rowTitle' : 'section'} tint={value ? color.ink : color.muted} numberOfLines={1}>
          {value ?? placeholder}
        </Text>
      </View>
      {trailing ?? (onPress ? <Icon name="chevronDown" size={12} tint={color.muted} /> : null)}
    </Tap>
  );
}
