import { Page } from '@/components/layout/Page';
import { PageScroll } from '@/components/layout/PageScroll';
import { EmptyRow } from '@/components/ui/controls';

/** Placeholder for a tab whose screen is built in a later chunk. */
export function LaterScreen({ title, note }: { title: string; note: string }) {
  return (
    <Page title={title}>
      <PageScroll>
        <EmptyRow>{note}</EmptyRow>
      </PageScroll>
    </Page>
  );
}
