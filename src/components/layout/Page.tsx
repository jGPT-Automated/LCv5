import { useEffect, type ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/controls';
import { LogoMark } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { courts } from '@/mock/data';
import { useApp } from '@/state/AppState';
import { color, layout, size, space, timing } from '@/theme';

import { BackButton } from './BackButton';

type Back = { label: string; fallback: Parameters<typeof BackButton>[0]['fallback'] };

/**
 * The page frame every screen uses (docs/DESIGN.md, Page frame).
 * The header is fixed and drawn only here; it never scrolls.
 * - Tab page: logo mark, title, one action.
 * - Pushed page (`back`): back button, title, one action. No tab bar.
 * - While checked in, the header on every tab page turns orange with Check out.
 * - `footer`: a page's actions, pinned to the bottom above the home indicator.
 */
export function Page({
  title,
  action,
  back,
  footer,
  children,
}: {
  title: string;
  action?: ReactNode;
  back?: Back;
  /** Actions pinned to the bottom of a pushed page (Approve, Challenge, Log game). */
  footer?: ReactNode;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const { checkedAt, checkOut } = useApp();
  const top = Math.max(insets.top, layout.statusBar);
  const on = !back && !!checkedAt;

  // The one header animation in the motion budget: fading to orange on check-in.
  const t = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    t.value = withTiming(on ? 1 : 0, timing.exit);
  }, [on, t]);
  const bg = useAnimatedStyle(() => ({ backgroundColor: interpolateColor(t.value, [0, 1], [color.bg, color.orange]) }));

  return (
    <View style={{ flex: 1, backgroundColor: color.bg }}>
      <Animated.View style={[{ paddingTop: top }, bg]}>
        <View
          style={{
            height: size.header,
            paddingHorizontal: space.gutter,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: space.l,
          }}>
          {on && checkedAt ? (
            <>
              <View style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: space.ml }}>
                <LogoMark frame={color.onBright} check={color.ink} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text t="pageTitle" tint={color.onBright} lineHeight={1}>
                    Checked in
                  </Text>
                  <Text t="rowSub" tint={color.darkSubText} numberOfLines={1}>
                    {courts[checkedAt].name + ' · since 4:48 PM'}
                  </Text>
                </View>
              </View>
              <Button label="Check out" kind="dark" size="compact" onPress={checkOut} feedback="commit" />
            </>
          ) : (
            <>
              <View style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: space.ml }}>
                {back ? <BackButton label={back.label} fallback={back.fallback} /> : <LogoMark />}
                <Text t="pageTitle" numberOfLines={1} style={{ flexShrink: 1 }}>
                  {title}
                </Text>
              </View>
              {action}
            </>
          )}
        </View>
      </Animated.View>
      <View style={{ flex: 1, paddingBottom: footer ? 0 : back ? insets.bottom : size.tabBar }}>{children}</View>
      {footer ? (
        <View
          style={{
            paddingHorizontal: space.gutter,
            paddingTop: space.l,
            paddingBottom: back ? Math.max(insets.bottom, space.l) : size.tabBar + space.l,
            borderTopWidth: 1,
            borderTopColor: color.divider,
            backgroundColor: color.bg,
            gap: space.m,
          }}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}
