import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Segmented, Tap } from '@/components/ui/controls';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import type { Load, MeTier } from '@/mock/data';
import { useApp } from '@/state/AppState';
import { color, layout, radius, space } from '@/theme';

/**
 * Settings. Rows are mock and do nothing yet.
 * "Preview data" switches the mock data so you can see empty, normal and busy
 * courts, and each player tier, without a backend.
 */
export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { meTier, setMeTier, load, setLoad } = useApp();
  const [toggles, setToggles] = useState({ autoCheckIn: true, publicProfile: true, gameAlerts: true, friendAlerts: false });

  return (
    <View style={{ flex: 1, backgroundColor: color.bg }}>
      <View style={{ paddingTop: Math.max(insets.top, layout.statusBar) }}>
        <View style={{ height: layout.headerHeight, paddingHorizontal: space.xxl, flexDirection: 'row', alignItems: 'center', gap: space.l }}>
          <Tap
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/me'))}
            style={{
              height: 36,
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
            <Icon name="chevronLeft" size={14} />
            <Text variant="label" size={9.5}>
              Me
            </Text>
          </Tap>
          <Text variant="display" size={24} track="title">
            Settings
          </Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: space.xxl, paddingBottom: space.x5 * 2, gap: space.x5 }}>
        <Group title="Privacy">
          <Toggle
            label="Public profile"
            sub="Your first name, tier and ELO show on court lists"
            on={toggles.publicProfile}
            onPress={() => setToggles((t) => ({ ...t, publicProfile: !t.publicProfile }))}
          />
          <Toggle
            label="Auto check-in"
            sub="Check in when you arrive at a saved court"
            on={toggles.autoCheckIn}
            onPress={() => setToggles((t) => ({ ...t, autoCheckIn: !t.autoCheckIn }))}
          />
        </Group>
        <Group title="Notifications">
          <Toggle
            label="Games at my courts"
            sub="When someone posts a game"
            on={toggles.gameAlerts}
            onPress={() => setToggles((t) => ({ ...t, gameAlerts: !t.gameAlerts }))}
          />
          <Toggle
            label="Friends on court"
            sub="When a friend checks in"
            on={toggles.friendAlerts}
            onPress={() => setToggles((t) => ({ ...t, friendAlerts: !t.friendAlerts }))}
          />
        </Group>
        <Group title="Account">
          <Row label="LocalPlus" value="Free" />
          <Row label="Sign out" />
        </Group>
        <Group title="Preview data">
          <View style={{ padding: space.xl, gap: space.l }}>
            <Text size={11} weight="medium" tint={color.muted}>
              Mock data for the design pass. Changes every screen.
            </Text>
            <Text variant="label" size={8.5} tint={color.muted}>
              Court load
            </Text>
            <Segmented<Load>
              options={[
                ['empty', 'Empty'],
                ['normal', 'Normal'],
                ['packed', 'Packed'],
              ]}
              value={load}
              onChange={setLoad}
            />
            <Text variant="label" size={8.5} tint={color.muted}>
              Your tier
            </Text>
            <Segmented<MeTier>
              options={[
                ['unranked', 'None'],
                ['open', 'Open'],
                ['contender', 'Contender'],
                ['top5', 'Top 5'],
              ]}
              value={meTier}
              onChange={setMeTier}
              size={8.5}
            />
          </View>
        </Group>
      </ScrollView>
    </View>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: space.m }}>
      <Text variant="label" size={10} style={{ marginHorizontal: space.xs }}>
        {title}
      </Text>
      <View style={{ borderRadius: radius.card, borderWidth: 1, borderColor: color.border, backgroundColor: color.surface, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
}

function Toggle({ label, sub, on, onPress }: { label: string; sub: string; on: boolean; onPress: () => void }) {
  return (
    <Tap
      onPress={onPress}
      style={{
        minHeight: 64,
        paddingHorizontal: space.xl,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.l,
        borderBottomWidth: 1,
        borderBottomColor: color.line,
      }}>
      <View style={{ flex: 1 }}>
        <Text size={14}>{label}</Text>
        <Text size={11} weight="medium" tint={color.muted} style={{ marginTop: space.xxs }}>
          {sub}
        </Text>
      </View>
      <View
        style={{
          width: 46,
          height: 28,
          padding: space.xxs,
          borderRadius: radius.pill,
          backgroundColor: on ? color.ink : color.grabber,
          alignItems: on ? 'flex-end' : 'flex-start',
        }}>
        <View style={{ width: 22, height: 22, borderRadius: radius.pill, backgroundColor: on ? color.onBright : color.ink }} />
      </View>
    </Tap>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <Tap
      style={{
        height: 54,
        paddingHorizontal: space.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: color.line,
      }}>
      <Text size={14}>{label}</Text>
      {value ? (
        <Text size={12} tint={color.muted}>
          {value}
        </Text>
      ) : null}
    </Tap>
  );
}
