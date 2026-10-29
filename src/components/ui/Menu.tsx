import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { color, radius, size, space } from '@/theme';

import { Tap } from './controls';
import { Icon } from './Icon';
import { Text } from './Text';

export type MenuItem = { key: string; label: string; leading?: ReactNode; trailing?: string; selected?: boolean; onPress: () => void };

/**
 * A small pull-down list anchored under a trigger, e.g. switching saved
 * courts from the court name. Tapping outside closes it.
 */
export function Menu({
  open,
  onClose,
  title,
  items,
  footer,
  top,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  items: MenuItem[];
  footer?: { label: string; onPress: () => void };
  /** Distance from the top of the page body to the menu. */
  top: number;
}) {
  if (!open) return null;
  return (
    <>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close menu" />
      <View
        style={{
          position: 'absolute',
          left: space.gutter,
          top,
          width: size.menu,
          borderRadius: radius.panel,
          backgroundColor: color.menu,
          borderWidth: 1,
          borderColor: color.borderStrong,
          boxShadow: `inset 0 1px 0 ${color.topHighlight}, 0 14px 36px ${color.shadow}`,
          overflow: 'hidden',
        }}>
        <Text t="micro" tint={color.dim} style={{ paddingHorizontal: space.xl, paddingTop: space.ml, paddingBottom: space.s }}>
          {title}
        </Text>
        {items.map((it) => (
          <Tap key={it.key} onPress={it.onPress} role="radio" selected={it.selected} style={rowStyle}>
            {it.leading}
            <Text t="rowTitle" style={{ flex: 1 }}>
              {it.label}
            </Text>
            {it.trailing ? (
              <Text t="rowSub" tint={color.orangeInk}>
                {it.trailing}
              </Text>
            ) : null}
            {it.selected ? <Icon name="check" size={12} /> : null}
          </Tap>
        ))}
        {footer ? (
          <Tap onPress={footer.onPress} style={rowStyle}>
            <Text t="section" tint={color.inkSub}>
              {footer.label}
            </Text>
          </Tap>
        ) : null}
      </View>
    </>
  );
}

const rowStyle = {
  height: size.button,
  paddingHorizontal: space.xl,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: space.ml,
  borderTopWidth: 1,
  borderTopColor: color.line,
};
