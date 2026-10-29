import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { MapArt } from '@/components/art/Art';
import { Page } from '@/components/layout/Page';
import { PageScroll } from '@/components/layout/PageScroll';
import { Button, Segmented } from '@/components/ui/controls';
import { Field } from '@/components/ui/Field';
import { ListRow } from '@/components/ui/ListRow';
import { Card, Group, Section } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import type { SportKey } from '@/mock/data';
import { color, size, space } from '@/theme';

/**
 * Add a court that isn't on LocalCheck yet. It's reviewed before it shows
 * for everyone; whoever adds it is its first local.
 */
export function AddCourtScreen() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [where, setWhere] = useState('');
  const [sport, setSport] = useState<SportKey>('bb');
  const [setting, setSetting] = useState<'outdoor' | 'indoor'>('outdoor');
  const [lights, setLights] = useState(false);
  const ready = name.trim().length > 1 && where.trim().length > 2;

  if (sent)
    return (
      <Page title="Add court" back={{ label: 'Explore', fallback: '/explore' }}>
        <MapArt height={size.artBanner} focus={[0.5, 0.55]} />
        <PageScroll top={0}>
          <View style={{ gap: space.l }}>
            <Text t="hero">
              {name.trim()}
              <Text t="hero" tint={color.orange}>
                .
              </Text>
            </Text>
            <Text t="lead" tint={color.muted}>
              Sent for review. It shows on Explore once approved, with you as its first local.
            </Text>
            <Button label="Done" kind="light" size="large" onPress={() => router.back()} />
          </View>
        </PageScroll>
      </Page>
    );

  return (
    <Page title="Add court" back={{ label: 'Explore', fallback: '/explore' }}>
      <PageScroll>
        <Card>
          <Text t="itemTitle">Be its first local</Text>
          <Text t="meta" tint={color.muted} style={{ marginTop: space.xs }}>
            Courts you add show your name as the first local.
          </Text>
        </Card>
        <Section title="Court">
          <View style={{ gap: space.xxl }}>
            <Field label="Name" value={name} onChange={setName} placeholder="Rancho Park" />
            <Field label="Where" value={where} onChange={setWhere} placeholder="Address or cross streets" />
          </View>
        </Section>
        <Section title="Sport">
          <Segmented<SportKey>
            options={[
              ['bb', 'Basketball'],
              ['pb', 'Pickleball'],
            ]}
            value={sport}
            onChange={setSport}
          />
        </Section>
        <Section title="Details">
          <Segmented<'outdoor' | 'indoor'>
            options={[
              ['outdoor', 'Outdoor'],
              ['indoor', 'Indoor'],
            ]}
            value={setting}
            onChange={setSetting}
          />
          <View style={{ marginTop: space.m }}>
            <Group>
              <ListRow title="Lights" subtitle="Playable after dark" toggle={{ on: lights, onChange: setLights }} last />
            </Group>
          </View>
        </Section>
        <View style={{ marginTop: space.x5 }}>
          <Button label="Submit court" kind="light" size="large" disabled={!ready} feedback="success" onPress={() => setSent(true)} />
        </View>
      </PageScroll>
    </Page>
  );
}
