import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Share, View } from 'react-native';

import { Page } from '@/components/layout/Page';
import { PageScroll } from '@/components/layout/PageScroll';
import { Avatar } from '@/components/ui/Avatar';
import { ChoiceList } from '@/components/ui/ChoiceList';
import { Button, Segmented } from '@/components/ui/controls';
import { Dialog } from '@/components/ui/Dialog';
import { Field } from '@/components/ui/Field';
import { ListRow } from '@/components/ui/ListRow';
import { Card, Group, Section } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { askBackgroundLocation, askNotifications } from '@/lib/permissions';
import { courtIds, courts, players, type CourtId, type Load, type MeTier, type SportKey } from '@/mock/data';
import { courtDistance } from '@/mock/model';
import { useApp, type Visibility } from '@/state/AppState';
import { color, space, sport as sportTokens } from '@/theme';

const VISIBILITY: { key: Visibility; title: string; detail: string }[] = [
  { key: 'everyone', title: 'Everyone', detail: 'Your check-ins, plans and rank are public.' },
  { key: 'friends', title: 'Friends', detail: 'Friends see you. Everyone else sees an anonymous check-in.' },
  { key: 'private', title: 'Only me', detail: 'You count in live numbers but your name, plans and rank stay hidden.' },
];

const LOCATION_LABEL = { always: 'Always', whenInUse: 'While using', denied: 'Off', unasked: 'Not set' } as const;

const SITE = 'https://localchecksports.com';

type Open = null | 'name' | 'sport' | 'home' | 'visibility' | 'blocked' | 'always' | 'plus' | 'password' | 'signout' | 'delete';

export function SettingsScreen() {
  const app = useApp();
  const { profile, prefs, setPrefs, setProfile } = app;
  const [open, setOpen] = useState<Open>(null);
  const close = () => setOpen(null);
  const [first, setFirst] = useState(profile.first);
  const [username, setUsername] = useState(profile.username);
  const [pw, setPw] = useState({ now: '', next: '' });

  const toggleAuto = (on: boolean) => {
    if (on && prefs.location !== 'always') setOpen('always');
    else setPrefs({ autoCheckIn: on });
  };
  const togglePush = async (on: boolean) => {
    if (!on) return setPrefs({ push: false });
    await askNotifications();
    // The preview can't always show the system prompt; keep the switch usable so the design can be reviewed.
    setPrefs({ push: true });
  };
  const signOut = () => {
    close();
    app.signOut();
    router.replace('/welcome');
  };

  return (
    <Page title="Settings" back={{ label: 'Me', fallback: '/me' }}>
      <PageScroll>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.l }}>
            <Avatar p={{ ...app.d.you, rank: app.d.rankOf[app.d.you.i] }} size="l" />
            <View style={{ flex: 1, minWidth: 0, gap: space.xxxs }}>
              <Text t="itemTitle">{profile.first + ' ' + profile.last}</Text>
              <Text t="meta" tint={color.muted}>
                {'@' + profile.username}
              </Text>
            </View>
            <Button label="Edit" kind="ghost" size="compact" onPress={() => setOpen('name')} />
          </View>
        </Card>

        <Section title="Playing">
          <Group>
            <ListRow title="Sport" value={sportTokens[profile.sport].label} onPress={() => setOpen('sport')} />
            <ListRow title="Home court" value={courts[profile.home].name} onPress={() => setOpen('home')} last />
          </Group>
        </Section>

        <Section title="Privacy">
          <Group>
            <ListRow title="Who sees you" value={VISIBILITY.find((v) => v.key === prefs.visibility)?.title} onPress={() => setOpen('visibility')} />
            <ListRow title="Blocked players" value={app.blocked.length ? String(app.blocked.length) : 'None'} onPress={() => setOpen('blocked')} last />
          </Group>
        </Section>

        <Section title="Location">
          <Group>
            <ListRow
              title="Auto check-in"
              subtitle={prefs.autoCheckIn ? 'Within 150 m of a saved court. Posts after 5 min.' : 'Check in by hand.'}
              toggle={{ on: prefs.autoCheckIn, onChange: toggleAuto }}
            />
            <ListRow title="Location access" value={LOCATION_LABEL[prefs.location]} last />
          </Group>
        </Section>

        <Section title="Notifications">
          <Group>
            <ListRow title="Push notifications" toggle={{ on: prefs.push, onChange: togglePush }} last={!prefs.push} />
            {prefs.push ? (
              <>
                <ListRow
                  title="Friends on court"
                  toggle={{ on: prefs.alerts.friends, onChange: (v) => setPrefs({ alerts: { ...prefs.alerts, friends: v } }) }}
                />
                <ListRow title="Game invites" toggle={{ on: prefs.alerts.invites, onChange: (v) => setPrefs({ alerts: { ...prefs.alerts, invites: v } }) }} />
                <ListRow
                  title="Score reviews"
                  last
                  toggle={{ on: prefs.alerts.reviews, onChange: (v) => setPrefs({ alerts: { ...prefs.alerts, reviews: v } }) }}
                />
              </>
            ) : null}
          </Group>
        </Section>

        <Section title="LocalPlus">
          <Group>
            <ListRow title="LocalPlus" value="Free" onPress={() => setOpen('plus')} />
            <ListRow
              title="Invite friends"
              onPress={() => Share.share({ message: 'Find your run on LocalCheck: ' + SITE }).catch(() => {})}
              last
            />
          </Group>
        </Section>

        <Section title="Account">
          <Group>
            <ListRow title="Email" value="jordan@example.com" />
            <ListRow title="Change password" onPress={() => setOpen('password')} />
            <ListRow title="Sign out" onPress={() => setOpen('signout')} />
            <ListRow title="Delete account" danger onPress={() => setOpen('delete')} last />
          </Group>
        </Section>

        <Section title="Support">
          <Group>
            <ListRow title="Help" onPress={() => WebBrowser.openBrowserAsync(SITE + '/support')} />
            <ListRow title="Privacy policy" onPress={() => WebBrowser.openBrowserAsync(SITE + '/privacy')} />
            <ListRow title="Terms" onPress={() => WebBrowser.openBrowserAsync(SITE + '/terms')} last />
          </Group>
        </Section>

        <Section title="Sample data">
          <Card>
            <View style={{ gap: space.l }}>
              <Text t="meta" tint={color.muted}>
                For reviewing the design. Changes every screen.
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
                value={app.load}
                onChange={app.setLoad}
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
                value={app.meTier}
                onChange={app.setMeTier}
              />
              <Button label="Replay onboarding" kind="ghost" onPress={() => router.push('/onboarding')} />
            </View>
          </Card>
        </Section>

        <Text t="meta" tint={color.dim} align="center" style={{ marginTop: space.x5 }}>
          LocalCheck 5.0 · Preview
        </Text>
      </PageScroll>

      <Dialog
        open={open === 'name'}
        onClose={close}
        title="Edit profile"
        actions={[
          {
            label: 'Save',
            kind: 'light',
            disabled: !first.trim() || !/^[a-z0-9_.]{3,20}$/.test(username),
            onPress: () => {
              setProfile({ first: first.trim(), username });
              close();
            },
          },
          { label: 'Cancel', onPress: close },
        ]}>
        <Field label="First name" value={first} onChange={setFirst} />
        <Field label="Username" value={username} onChange={(v) => setUsername(v.toLowerCase())} prefix="@" />
      </Dialog>

      <Dialog open={open === 'sport'} onClose={close} title="Sport" body="Courts, games and rankings follow this." actions={[{ label: 'Done', kind: 'light', onPress: close }]}>
        <ChoiceList<SportKey>
          value={profile.sport}
          onChange={(s) => setProfile({ sport: s })}
          choices={[
            { key: 'bb', title: 'Basketball' },
            { key: 'pb', title: 'Pickleball' },
          ]}
        />
      </Dialog>

      <Dialog open={open === 'home'} onClose={close} title="Home court" body="Opens first on Home." actions={[{ label: 'Done', kind: 'light', onPress: close }]}>
        <ChoiceList<CourtId>
          value={profile.home}
          onChange={(c) => setProfile({ home: c })}
          choices={courtIds.map((c) => ({ key: c, title: courts[c].name, trailing: courtDistance(c) }))}
        />
      </Dialog>

      <Dialog open={open === 'visibility'} onClose={close} title="Who sees you" actions={[{ label: 'Done', kind: 'light', onPress: close }]}>
        <ChoiceList<Visibility> value={prefs.visibility} onChange={(v) => setPrefs({ visibility: v })} choices={VISIBILITY} />
      </Dialog>

      <Dialog
        open={open === 'blocked'}
        onClose={close}
        title="Blocked players"
        body={app.blocked.length ? "They can't see you or invite you." : 'No one blocked.'}
        actions={[{ label: 'Done', kind: 'light', onPress: close }]}>
        {app.blocked.length ? (
          <Group>
            {app.blocked.map((i, k) => (
              <ListRow
                key={i}
                title={players.find((p) => p.i === i)?.n ?? i}
                trailing={<Button label="Unblock" kind="ghost" size="compact" onPress={() => app.unblock(i)} />}
                last={k === app.blocked.length - 1}
              />
            ))}
          </Group>
        ) : null}
      </Dialog>

      <Dialog
        open={open === 'always'}
        onClose={close}
        title="Allow location always"
        body="Auto check-in needs location set to Always, so it works when the app is closed."
        actions={[
          {
            label: 'Allow always',
            kind: 'orange',
            onPress: async () => {
              const ok = await askBackgroundLocation();
              // The preview can't grant Always; turn it on anyway so the design can be reviewed.
              setPrefs({ autoCheckIn: true, location: ok ? 'always' : prefs.location });
              close();
            },
          },
          { label: 'Not now', onPress: close },
        ]}
      />

      <Dialog
        open={open === 'plus'}
        onClose={close}
        title="LocalPlus"
        body="Your full game history, your rank on every leaderboard, and head-to-head records with anyone."
        actions={[
          { label: 'Start free trial', kind: 'light', onPress: close },
          { label: 'Not now', onPress: close },
        ]}
      />

      <Dialog
        open={open === 'password'}
        onClose={close}
        title="Change password"
        actions={[
          { label: 'Save', kind: 'light', disabled: !pw.now || pw.next.length < 8, onPress: close },
          { label: 'Cancel', onPress: close },
        ]}>
        <Field label="Current password" value={pw.now} onChange={(v) => setPw({ ...pw, now: v })} secure />
        <Field label="New password" value={pw.next} onChange={(v) => setPw({ ...pw, next: v })} secure hint="8 or more characters" />
      </Dialog>

      <Dialog
        open={open === 'signout'}
        onClose={close}
        title="Sign out?"
        actions={[
          { label: 'Sign out', kind: 'light', onPress: signOut },
          { label: 'Cancel', onPress: close },
        ]}
      />

      <Dialog
        open={open === 'delete'}
        onClose={close}
        title="Delete account?"
        body="Your profile, games, friends and check-ins are removed. This can't be undone."
        actions={[
          { label: 'Delete account', kind: 'orange', onPress: signOut },
          { label: 'Cancel', onPress: close },
        ]}
      />
    </Page>
  );
}
