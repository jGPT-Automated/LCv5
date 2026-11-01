import { router } from 'expo-router';
import { useState } from 'react';

import { AlertArt, MapArt, RadiusArt } from '@/components/art/Art';
import { FlowPage } from '@/components/layout/FlowPage';
import { ChoiceList } from '@/components/ui/ChoiceList';
import { Segmented } from '@/components/ui/controls';
import { Field } from '@/components/ui/Field';
import { Group, StatStrip } from '@/components/ui/surfaces';
import { ListRow } from '@/components/ui/ListRow';
import { courtIds, courts, type CourtId, type SportKey } from '@/mock/data';
import { courtDistance, courtPlace } from '@/mock/model';
import { askBackgroundLocation, askLocation, askNotifications } from '@/lib/permissions';
import { useApp } from '@/state/AppState';

/**
 * Account setup after sign-up, one decision per step:
 * name → location (While Using) → home court → auto check-in (Always) → alerts.
 * Each permission is asked on its own step, after saying what it's for, and
 * can be skipped (Apple HIG, Onboarding and Privacy).
 */
const TOTAL = 5;

export function OnboardingScreen() {
  const app = useApp();
  const [step, setStep] = useState(1);
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [username, setUsername] = useState('');
  const [sport, setSport] = useState<SportKey>('bb');
  const [home, setHome] = useState<CourtId | null>(null);
  const [alerts, setAlerts] = useState({ friends: true, invites: true, reviews: true });

  const next = () => setStep((s) => s + 1);
  const back = () => (step > 1 ? setStep(step - 1) : router.canGoBack() ? router.back() : router.replace('/welcome'));
  const nameOk = first.trim().length > 0 && /^[a-z0-9_.]{3,20}$/.test(username);
  const userErr = username && !/^[a-z0-9_.]{3,20}$/.test(username) ? '3–20 lowercase letters, numbers, _ or .' : undefined;

  const finish = (push: boolean) => {
    app.setPrefs({ push, alerts });
    app.signIn();
    router.replace('/');
  };

  if (step === 1)
    return (
      <FlowPage
        step={{ n: 1, total: TOTAL }}
        onBack={back}
        title="Your name."
        lead="Players see your first name and last initial."
        primary={{
          label: 'Continue',
          disabled: !nameOk,
          onPress: () => {
            app.setProfile({ first: first.trim(), last: last.trim().charAt(0), username });
            next();
          },
        }}>
        <Field label="First name" value={first} onChange={setFirst} placeholder="Jordan" autoComplete="given-name" />
        <Field label="Last name" value={last} onChange={setLast} placeholder="Davis" autoComplete="family-name" hint="Only the initial shows" />
        <Field
          label="Username"
          value={username}
          onChange={(v) => setUsername(v.toLowerCase())}
          prefix="@"
          placeholder="jordand"
          autoComplete="username"
          hint="Friends find you by this"
          error={userErr}
        />
      </FlowPage>
    );

  if (step === 2)
    return (
      <FlowPage
        step={{ n: 2, total: TOTAL }}
        onBack={back}
        art={(h) => <MapArt height={h} focus={[0.5, 0.5]} />}
        title="Courts near you."
        lead="Use your location to see nearby courts and check in with one tap."
        primary={{
          label: 'Use location',
          onPress: async () => {
            const ok = await askLocation();
            app.setPrefs({ location: ok ? 'whenInUse' : 'denied' });
            next();
          },
        }}
        secondary={{ label: 'Not now', onPress: next }}
      />
    );

  if (step === 3) {
    const list = courtIds.filter((c) => courts[c].sport === sport).sort((a, b) => parseFloat(courtDistance(a)) - parseFloat(courtDistance(b)));
    return (
      <FlowPage
        step={{ n: 3, total: TOTAL }}
        onBack={back}
        title="Your court."
        lead="Your home court opens first. Save more anytime."
        primary={{
          label: 'Continue',
          disabled: !home,
          onPress: () => {
            if (!home) return;
            app.setProfile({ sport, home });
            if (!app.mine.includes(home)) app.toggleSaved(home);
            next();
          },
        }}>
        <Segmented<SportKey>
          options={[
            ['bb', 'Basketball'],
            ['pb', 'Pickleball'],
          ]}
          value={sport}
          onChange={(s) => {
            setSport(s);
            setHome(null);
          }}
        />
        <ChoiceList<CourtId>
          value={home}
          onChange={setHome}
          choices={list.map((c) => ({
            key: c,
            title: courts[c].name,
            detail: courtPlace(c) + ' · ' + courts[c].locals + ' locals',
            trailing: courtDistance(c),
          }))}
        />
      </FlowPage>
    );
  }

  if (step === 4)
    return (
      <FlowPage
        step={{ n: 4, total: TOTAL }}
        onBack={back}
        art={(h) => <RadiusArt height={h} />}
        title="Auto check-in."
        lead="Checks you in when you get to your court and out when you leave. Needs location set to Always."
        primary={{
          label: 'Allow always',
          onPress: async () => {
            const ok = await askBackgroundLocation();
            app.setPrefs({ autoCheckIn: ok, location: ok ? 'always' : app.prefs.location });
            next();
          },
        }}
        secondary={{
          label: 'Not now',
          onPress: () => {
            app.setPrefs({ autoCheckIn: false });
            next();
          },
        }}>
        <StatStrip
          framed
          align="start"
          items={[
            { value: '150 m', label: 'Radius' },
            { value: '5 min', label: 'Before it posts' },
            { value: 'Hide', label: 'Anytime' },
          ]}
        />
      </FlowPage>
    );

  return (
    <FlowPage
      step={{ n: 5, total: TOTAL }}
      onBack={back}
      art={(h) => <AlertArt height={h} />}
      title="Game alerts."
      lead="Only what needs you. Change these in Settings."
      primary={{
        label: 'Turn on alerts',
        onPress: async () => finish(await askNotifications()),
      }}
      secondary={{ label: 'Not now', onPress: () => finish(false) }}>
      <Group>
        <ListRow title="Friends on court" toggle={{ on: alerts.friends, onChange: (v) => setAlerts({ ...alerts, friends: v }) }} />
        <ListRow title="Game invites" toggle={{ on: alerts.invites, onChange: (v) => setAlerts({ ...alerts, invites: v }) }} />
        <ListRow title="Score reviews" last toggle={{ on: alerts.reviews, onChange: (v) => setAlerts({ ...alerts, reviews: v }) }} />
      </Group>
    </FlowPage>
  );
}
