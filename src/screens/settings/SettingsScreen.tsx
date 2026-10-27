import { useState } from 'react';
import { View } from 'react-native';

import { Page } from '@/components/layout/Page';
import { PageScroll } from '@/components/layout/PageScroll';
import { Segmented, Switch } from '@/components/ui/controls';
import { Card, Group, Row, Section } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import type { Load, MeTier } from '@/mock/data';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme';

/** Settings. "Preview data" switches the sample data so every state can be reviewed. */
export function SettingsScreen() {
  const { meTier, setMeTier, load, setLoad } = useApp();
  const [opt, setOpt] = useState({ autoCheckIn: true, publicProfile: true, gameAlerts: true, friendAlerts: false });
  const flip = (k: keyof typeof opt) => (v: boolean) => setOpt((o) => ({ ...o, [k]: v }));

  return (
    <Page title="Settings" back={{ label: 'Me', fallback: '/me' }}>
      <PageScroll>
        <Section title="Privacy" first>
          <Group>
            <Row
              title="Public profile"
              subtitle="Your first name, tier and ELO show on court lists"
              trailing={<Switch on={opt.publicProfile} onChange={flip('publicProfile')} label="Public profile" />}
            />
            <Row
              title="Auto check-in"
              subtitle="Check in when you arrive at a saved court"
              divider={false}
              trailing={<Switch on={opt.autoCheckIn} onChange={flip('autoCheckIn')} label="Auto check-in" />}
            />
          </Group>
        </Section>
        <Section title="Notifications">
          <Group>
            <Row
              title="Games at my courts"
              subtitle="When someone posts a game"
              trailing={<Switch on={opt.gameAlerts} onChange={flip('gameAlerts')} label="Games at my courts" />}
            />
            <Row
              title="Friends on court"
              subtitle="When a friend checks in"
              divider={false}
              trailing={<Switch on={opt.friendAlerts} onChange={flip('friendAlerts')} label="Friends on court" />}
            />
          </Group>
        </Section>
        <Section title="Account">
          <Group>
            <Row
              title="LocalPlus"
              trailing={
                <Text t="caption" tint={color.muted}>
                  Free
                </Text>
              }
            />
            <Row title="Sign out" divider={false} />
          </Group>
        </Section>
        <Section title="Preview data">
          <Card>
            <View style={{ gap: space.l }}>
              <Text t="meta" tint={color.muted}>
                Sample data for reviewing the design. Changes every screen.
              </Text>
              <Text t="eyebrow" tint={color.muted}>
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
              <Text t="eyebrow" tint={color.muted}>
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
              />
            </View>
          </Card>
        </Section>
      </PageScroll>
    </Page>
  );
}
