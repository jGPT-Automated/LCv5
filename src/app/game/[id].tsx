import { useLocalSearchParams } from 'expo-router';

import { GameScreen } from '@/screens/game/GameScreen';

export default function Game() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <GameScreen id={id} />;
}
