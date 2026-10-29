import { PlayerBoard, type PlayerSort } from '@/components/court/PlayerBoard';
import { PageScroll } from '@/components/layout/PageScroll';
import type { CourtId } from '@/mock/data';
import { space } from '@/theme';

export type { PlayerSort };

/** Players at a court: the shared board. */
export function PlayersTab({ court, sort, onSort }: { court: CourtId; sort: PlayerSort; onSort: (s: PlayerSort) => void }) {
  return (
    <PageScroll top={space.xl}>
      <PlayerBoard court={court} sort={sort} onSort={onSort} />
    </PageScroll>
  );
}
