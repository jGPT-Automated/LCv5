import { View } from 'react-native';

import { PageHeader } from '@/components/nav/PageHeader';
import { Screen } from '@/components/nav/Screen';
import { EmptyRow } from '@/components/ui/controls';
import { space } from '@/theme';

/** Placeholder for tabs that are out of scope for this chunk. */
export function LaterScreen({ title, note }: { title: string; note: string }) {
  return (
    <Screen header={<PageHeader title={title} />}>
      <View style={{ padding: space.xxl }}>
        <EmptyRow>{note}</EmptyRow>
      </View>
    </Screen>
  );
}
