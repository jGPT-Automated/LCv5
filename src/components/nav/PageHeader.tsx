import type { ReactNode } from 'react';
import { View } from 'react-native';

import { LogoMark } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { layout, space } from '@/theme';

/** Logo, page title on the left, one action on the right. Same on every tab. */
export function PageHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <View
      style={{
        height: layout.headerHeight,
        paddingLeft: space.gutter,
        paddingRight: space.xxl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: space.l,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.ml }}>
        <LogoMark />
        <Text variant="display" size={24} track="title">
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}
