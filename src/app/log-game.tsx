import { useLocalSearchParams } from 'expo-router';

import { LogGameScreen } from '@/screens/compete/LogGameScreen';

export default function LogGame() {
  const { opp } = useLocalSearchParams<{ opp?: string }>();
  return <LogGameScreen opp={opp} />;
}
