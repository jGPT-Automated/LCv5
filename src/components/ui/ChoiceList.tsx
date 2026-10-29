import type { ReactNode } from 'react';
import { View } from 'react-native';

import { haptic } from '@/lib/haptics';
import { color, radius, size, space } from '@/theme';

import { Tap } from './controls';
import { Icon } from './Icon';
import { Text } from './Text';

export type Choice<K extends string> = { key: K; title: string; detail?: string; leading?: ReactNode; trailing?: string };

/**
 * Pick one from a short list: a grouped card of rows with a check on the
 * chosen one. Used for visibility, sport, home court and similar choices.
 */
export function ChoiceList<K extends string>({ choices, value, onChange }: { choices: Choice<K>[]; value: K | null; onChange: (k: K) => void }) {
  return (
    <View
      accessibilityRole="radiogroup"
      style={{ borderRadius: radius.card, borderWidth: 1, borderColor: color.border, backgroundColor: color.surface, overflow: 'hidden' }}>
      {choices.map((c, k) => {
        const on = c.key === value;
        return (
          <Tap
            key={c.key}
            role="radio"
            selected={on}
            onPress={() => {
              if (!on) haptic.select();
              onChange(c.key);
            }}
            style={{
              minHeight: size.row,
              paddingHorizontal: space.xl,
              paddingVertical: space.l,
              flexDirection: 'row',
              alignItems: 'center',
              gap: space.l,
              borderTopWidth: k ? 1 : 0,
              borderTopColor: color.line,
              backgroundColor: on ? color.highlight : 'transparent',
            }}>
            {c.leading}
            <View style={{ flex: 1, minWidth: 0, gap: space.xxxs }}>
              <Text t="rowTitle">{c.title}</Text>
              {c.detail ? (
                <Text t="meta" tint={color.muted}>
                  {c.detail}
                </Text>
              ) : null}
            </View>
            {c.trailing ? (
              <Text t="rowSub" tint={color.muted}>
                {c.trailing}
              </Text>
            ) : null}
            <View
              style={{
                width: size.dot * 3,
                height: size.dot * 3,
                borderRadius: radius.pill,
                borderWidth: on ? 0 : 1.5,
                borderColor: color.controlStrong,
                backgroundColor: on ? color.orange : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {on ? <Icon name="check" size={10} tint={color.onBright} /> : null}
            </View>
          </Tap>
        );
      })}
    </View>
  );
}
