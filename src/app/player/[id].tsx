import { useLocalSearchParams } from 'expo-router';

import { PlayerScreen } from '@/screens/player/PlayerScreen';

export default function Player() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PlayerScreen id={id} />;
}
