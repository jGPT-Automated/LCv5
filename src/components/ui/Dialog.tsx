import type { ReactNode } from 'react';
import { View } from 'react-native';

import { color, space } from '@/theme';

import { Button } from './controls';
import { useOverlay } from './Overlay';
import { Sheet } from './Sheet';
import { Text } from './Text';

export type DialogAction = { label: string; kind?: 'orange' | 'light' | 'ghost'; onPress: () => void; disabled?: boolean };

/**
 * A decision in a bottom sheet: a short question as the title, what will
 * happen in the body, then the actions. Destructive actions name the thing
 * ("Delete account"), never "OK" (docs/COPY.md).
 */
export function Dialog({
  open,
  onClose,
  title,
  body,
  children,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  body?: string;
  children?: ReactNode;
  actions: DialogAction[];
}) {
  useOverlay(
    <Sheet open={open} onClose={onClose}>
      <View style={{ gap: space.xxl, paddingTop: space.m }}>
        <View style={{ gap: space.m }}>
          <Text t="sheetTitle">{title}</Text>
          {body ? (
            <Text t="lead" tint={color.muted}>
              {body}
            </Text>
          ) : null}
        </View>
        {children}
        <View style={{ gap: space.m }}>
          {actions.map((a) => (
            <Button key={a.label} label={a.label} kind={a.kind ?? 'ghost'} size="large" onPress={a.onPress} disabled={a.disabled} />
          ))}
        </View>
      </View>
    </Sheet>,
  );
  return null;
}
