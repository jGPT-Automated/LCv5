import { router, type Href } from 'expo-router';
import { View } from 'react-native';

import { Tap } from '@/components/ui/controls';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { color, radius, size, space } from '@/theme';

/** Back control for pushed pages. Lives only in the header (docs/DESIGN.md). */
export function BackButton({ label, fallback }: { label: string; fallback: Href }) {
  return (
    <Tap
      onPress={() => (router.canGoBack() ? router.back() : router.replace(fallback))}
      label={'Back to ' + label}
      hitSlop={8}
      style={{
        height: size.compact,
        paddingLeft: space.m,
        paddingRight: space.xl,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: color.borderStrong,
        backgroundColor: color.pillBg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.xs,
      }}>
      <View>
        <Icon name="chevronLeft" size={14} />
      </View>
      <Text t="eyebrow">{label}</Text>
    </Tap>
  );
}
