import { useLocalSearchParams } from 'expo-router';

import { SignInScreen } from '@/screens/onboarding/SignInScreen';

export default function SignIn() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  return <SignInScreen mode={mode === 'signin' ? 'signin' : 'create'} />;
}
