import type { ReactNode } from 'react';
import { View } from 'react-native';

import { color, radius, space } from '@/theme';

import { Tap } from './controls';
import { Text } from './Text';

/**
 * A card with a status band across the top ("Waiting on Dre", "Final",
 * "Not sent"), as in the current app's game cards. `tone` colors the band text.
 */
export function StatusCard({ status, tone = 'quiet', onPress, children }: { status: string; tone?: 'orange' | 'quiet'; onPress?: () => void; children: ReactNode }) {
  const body = (
    <>
      <View style={{ paddingVertical: space.ml, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: color.border, backgroundColor: color.menu }}>
        <Text t="section" tint={tone === 'orange' ? color.orangeInk : color.muted}>
          {status}
        </Text>
      </View>
      <View style={{ padding: space.x3 }}>{children}</View>
    </>
  );
  const style = { borderRadius: radius.hero, borderWidth: 1, borderColor: color.borderStrong, backgroundColor: color.surface, overflow: 'hidden' as const };
  if (onPress)
    return (
      <Tap onPress={onPress} style={style}>
        {body}
      </Tap>
    );
  return <View style={style}>{body}</View>;
}
