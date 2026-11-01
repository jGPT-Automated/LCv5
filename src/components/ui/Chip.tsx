import type { ReactNode } from 'react';
import { haptic } from '@/lib/haptics';
import { color, radius, size, space } from '@/theme';

import { Tap } from './controls';
import { Text } from './Text';

/** A selectable pill, e.g. picking players or a format. */
export function Chip({ label, on, onPress, leading, disabled }: { label: string; on: boolean; onPress: () => void; leading?: ReactNode; disabled?: boolean }) {
  return (
    <Tap
      role="button"
      selected={on}
      disabled={disabled}
      onPress={() => {
        haptic.select();
        onPress();
      }}
      style={{
        height: size.compact,
        paddingLeft: leading ? space.xs : space.l,
        paddingRight: space.l,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: on ? color.ink : color.control,
        backgroundColor: on ? color.ink : 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.s,
        opacity: disabled ? 0.4 : 1,
      }}>
      {leading}
      <Text t="caption" tint={on ? color.onBright : color.inkSub}>
        {label}
      </Text>
    </Tap>
  );
}
