import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { SplashArt } from '@/components/art/Art';
import { FlowPage } from '@/components/layout/FlowPage';
import { Button, Tap } from '@/components/ui/controls';
import { Dialog } from '@/components/ui/Dialog';
import { Field } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { Rule } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme';

/**
 * Create an account or sign in. Sign in with Apple comes first (App Store
 * guideline 4.8). In the UI pass any valid-looking input continues; nothing
 * is sent anywhere.
 */
export function SignInScreen({ mode: initial }: { mode: 'create' | 'signin' }) {
  const { signIn } = useApp();
  const [mode, setMode] = useState(initial);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tried, setTried] = useState(false);
  const [reset, setReset] = useState(false);
  const [sent, setSent] = useState('');
  const create = mode === 'create';

  const emailErr = tried && !/^\S+@\S+\.\S+$/.test(email) ? 'Enter an email like name@example.com' : undefined;
  const passErr = tried && password.length < 8 ? 'Use at least 8 characters' : undefined;

  // New accounts set up their profile; returning players go straight in.
  const done = () => {
    if (create) router.replace('/onboarding');
    else {
      signIn();
      router.replace('/');
    }
  };
  const submit = () => {
    setTried(true);
    if (/^\S+@\S+\.\S+$/.test(email) && password.length >= 8) done();
  };

  return (
    <FlowPage
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/welcome'))}
      art={(h) => <SplashArt height={h * 0.8} />}
      title={create ? 'Create account.' : 'Welcome back.'}
      primary={{ label: create ? 'Create account' : 'Sign in', onPress: submit }}
      secondary={{ label: create ? 'I have an account' : 'Create an account', onPress: () => setMode(create ? 'signin' : 'create') }}>
      <Button label="Continue with Apple" kind="light" size="large" icon={<Icon name="apple" size={16} tint={color.onBright} />} onPress={done} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.l }}>
        <Rule flex />
        <Text t="eyebrow" tint={color.dim}>
          or
        </Text>
        <Rule flex />
      </View>
      <Field label="Email" value={email} onChange={setEmail} placeholder="name@example.com" keyboard="email-address" autoComplete="email" error={emailErr} />
      <Field
        label="Password"
        value={password}
        onChange={setPassword}
        secure
        autoComplete={create ? 'new-password' : 'current-password'}
        hint={create ? '8 or more characters' : undefined}
        error={passErr}
      />
      {!create ? (
        <Tap onPress={() => setReset(true)} style={{ alignSelf: 'flex-start' }}>
          <Text t="caption" tint={color.muted}>
            {sent ? 'Reset link sent to ' + sent : 'Forgot password?'}
          </Text>
        </Tap>
      ) : null}
      <Dialog
        open={reset}
        onClose={() => setReset(false)}
        title="Reset password"
        body="Get an email with a link to set a new password."
        actions={[
          {
            label: 'Send link',
            kind: 'light',
            disabled: !/^\S+@\S+\.\S+$/.test(email),
            onPress: () => {
              setSent(email);
              setReset(false);
            },
          },
          { label: 'Cancel', onPress: () => setReset(false) },
        ]}>
        <Field label="Email" value={email} onChange={setEmail} placeholder="name@example.com" keyboard="email-address" autoComplete="email" />
      </Dialog>
    </FlowPage>
  );
}
