import type { ReactNode } from 'react';
import { View } from 'react-native';

import { color, size, space } from '@/theme';

import { Switch, Tap } from './controls';
import { Icon } from './Icon';
import { Text } from './Text';

/**
 * A settings-style row inside a `Group`: a title, an optional line under it,
 * and one trailing element. Pick exactly one of `value` (with a chevron when
 * tappable), `toggle`, or `trailing`. `danger` is for destructive rows.
 */
export function ListRow({
  title,
  subtitle,
  value,
  toggle,
  trailing,
  onPress,
  danger,
  last,
  leading,
}: {
  title: string;
  subtitle?: string;
  value?: string;
  toggle?: { on: boolean; onChange: (v: boolean) => void };
  trailing?: ReactNode;
  onPress?: () => void;
  danger?: boolean;
  /** The last row in a group draws no divider. */
  last?: boolean;
  leading?: ReactNode;
}) {
  const body = (
    <>
      {leading}
      <View style={{ flex: 1, minWidth: 0, gap: space.xxxs }}>
        <Text t="rowTitle" tint={danger ? color.orangeInk : color.ink}>
          {title}
        </Text>
        {subtitle ? (
          <Text t="meta" tint={color.muted}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text t="caption" weight="medium" tint={color.muted} numberOfLines={1} style={{ maxWidth: '45%' }}>
          {value}
        </Text>
      ) : null}
      {toggle ? <Switch on={toggle.on} onChange={toggle.onChange} label={title} /> : null}
      {trailing}
      {onPress && !toggle ? <Icon name="chevronRight" size={12} tint={color.faint} /> : null}
    </>
  );
  const style = {
    minHeight: size.row,
    paddingVertical: space.l,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: space.l,
    borderBottomWidth: last ? 0 : 1,
    borderBottomColor: color.line,
  };
  if (onPress && !toggle)
    return (
      <Tap onPress={onPress} style={style}>
        {body}
      </Tap>
    );
  return <View style={style}>{body}</View>;
}
