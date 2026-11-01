import { View } from 'react-native';

import { color, radius, size, space } from '@/theme';

import { Text } from './Text';

export type TimelineItem = { when: string; who?: string; what: string; detail?: string; state: 'first' | 'done' | 'pending' };

/** A game's history as a vertical line: when on the left, a dot, then who did what. */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <View>
      {items.map((it, k) => {
        const last = k === items.length - 1;
        return (
          <View key={k} style={{ flexDirection: 'row', gap: space.xl, minHeight: size.button }}>
            <View style={{ width: size.dateBlock + space.l, alignItems: 'flex-end', paddingTop: space.xxxs }}>
              <Text t="footnote" tint={color.dim}>
                {it.when}
              </Text>
            </View>
            <View style={{ alignItems: 'center', width: size.dot * 2 }}>
              <View
                style={{
                  marginTop: space.xs,
                  width: size.dot * 2,
                  height: size.dot * 2,
                  borderRadius: radius.pill,
                  backgroundColor: it.state === 'first' ? color.orange : it.state === 'done' ? color.dim : 'transparent',
                  borderWidth: it.state === 'pending' ? 2 : 0,
                  borderColor: color.dim,
                }}
              />
              {!last ? <View style={{ flex: 1, width: 1, backgroundColor: color.divider, marginTop: space.xs }} /> : null}
            </View>
            <View style={{ flex: 1, paddingBottom: space.l }}>
              <Text t="subhead" tint={it.state === 'pending' ? color.muted : color.inkSub}>
                {it.who ? (
                  <Text t="subhead" weight="bold" tint={color.ink}>
                    {it.who + ' '}
                  </Text>
                ) : null}
                {it.what}
              </Text>
              {it.detail ? (
                <Text t="footnote" tint={color.muted} style={{ marginTop: space.xxs }}>
                  {it.detail}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
