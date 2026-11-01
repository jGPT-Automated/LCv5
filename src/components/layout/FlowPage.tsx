import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, IconButton, Tap } from '@/components/ui/controls';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { color, layout, radius, size, space } from '@/theme';

type Action = { label: string; onPress: () => void; disabled?: boolean; icon?: ReactNode };

/**
 * The frame for sign-in and onboarding (docs/DESIGN.md, Flow frame). No tab
 * bar and no page title: a top bar with back, progress and Skip; an
 * illustration; a headline with one or two lines under it; the step's own
 * controls; and the actions pinned to the bottom.
 */
export function FlowPage({
  art,
  step,
  onBack,
  skip,
  title,
  lead,
  children,
  primary,
  secondary,
}: {
  /** Illustration, given the height it should fill. */
  art?: (height: number) => ReactNode;
  step?: { n: number; total: number };
  onBack?: () => void;
  skip?: Action;
  /** Headline. A trailing period is drawn in orange, as on the website. */
  title: string;
  lead?: string;
  children?: ReactNode;
  primary: Action;
  secondary?: Action;
}) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const artH = Math.round(Math.min(height, 900) * (children ? 0.3 : 0.42));
  const dot = title.endsWith('.');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: color.bg }}>
      <View style={{ paddingTop: Math.max(insets.top, layout.statusBar) }}>
        <View style={{ height: size.header, paddingHorizontal: space.gutter, flexDirection: 'row', alignItems: 'center', gap: space.l }}>
          <View style={{ width: size.compact }}>
            {onBack ? (
              <IconButton label="Back" onPress={onBack}>
                <Icon name="chevronLeft" size={14} />
              </IconButton>
            ) : null}
          </View>
          <View style={{ flex: 1, flexDirection: 'row', gap: space.xs }}>
            {step
              ? Array.from({ length: step.total }, (_, k) => (
                  <View
                    key={k}
                    style={{ flex: 1, height: size.progress, borderRadius: radius.pill, backgroundColor: k < step.n ? color.orange : color.track }}
                  />
                ))
              : null}
          </View>
          <View style={{ minWidth: size.compact, alignItems: 'flex-end' }}>
            {skip ? (
              <Tap onPress={skip.onPress} hitSlop={8}>
                <Text t="section" tint={color.muted}>
                  {skip.label}
                </Text>
              </Tap>
            ) : null}
          </View>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: space.x5 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {art ? art(artH) : null}
        <View style={{ paddingHorizontal: space.gutter, paddingTop: art ? 0 : space.x5, gap: space.l }}>
          <Text t="splash">
            {dot ? title.slice(0, -1) : title}
            {dot ? (
              <Text t="splash" tint={color.orange}>
                .
              </Text>
            ) : null}
          </Text>
          {lead ? (
            <Text t="lead" tint={color.muted}>
              {lead}
            </Text>
          ) : null}
          {children ? <View style={{ marginTop: space.l, gap: space.xxl }}>{children}</View> : null}
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: space.gutter, paddingTop: space.l, paddingBottom: Math.max(insets.bottom, space.x5), gap: space.m }}>
        <Button label={primary.label} kind="orange" size="large" feedback="commit" onPress={primary.onPress} disabled={primary.disabled} icon={primary.icon} />
        {secondary ? <Button label={secondary.label} kind="ghost" size="large" onPress={secondary.onPress} disabled={secondary.disabled} icon={secondary.icon} /> : null}
      </View>
    </KeyboardAvoidingView>
  );
}
