import { router } from 'expo-router';

import { MapArt } from '@/components/art/Art';
import { FlowPage } from '@/components/layout/FlowPage';

/** First screen for a signed-out person. */
export function WelcomeScreen() {
  return (
    <FlowPage
      art={(h) => <MapArt height={h * 1.25} />}
      title="Find your run."
      lead="Who's at the court now, who's coming later, and who's best."
      primary={{ label: 'Create account', onPress: () => router.push({ pathname: '/sign-in', params: { mode: 'create' } }) }}
      secondary={{ label: 'Sign in', onPress: () => router.push({ pathname: '/sign-in', params: { mode: 'signin' } }) }}
    />
  );
}
