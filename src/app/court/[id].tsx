import { useLocalSearchParams } from 'expo-router';

import { HomeScreen } from '@/screens/home/HomeScreen';
import { courtIds, type CourtId } from '@/mock/data';

/** Court page: the Home layout for a single court, opened from Explore. */
export default function CourtPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const courtId = (courtIds as string[]).includes(id) ? (id as CourtId) : 'vb';
  return <HomeScreen courtId={courtId} />;
}
