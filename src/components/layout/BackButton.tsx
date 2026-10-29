import { router, type Href } from 'expo-router';

import { Tap } from '@/components/ui/controls';
import { BackMark } from '@/components/ui/Icon';

/**
 * Back control for pushed pages, in the header where the logo sits on tab
 * pages: the bracket mark with an orange chevron, as in the current app.
 */
export function BackButton({ label, fallback }: { label: string; fallback: Href }) {
  return (
    <Tap onPress={() => (router.canGoBack() ? router.back() : router.replace(fallback))} label={'Back to ' + label} hitSlop={12}>
      <BackMark />
    </Tap>
  );
}
