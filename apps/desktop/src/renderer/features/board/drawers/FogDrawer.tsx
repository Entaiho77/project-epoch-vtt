import type { MapDef } from '@solryn/shared-types';
import { clearFog, coverAllFog } from '../../../data/board';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

export function FogDrawer({
  gameId,
  activeMap,
}: {
  gameId: string;
  activeMap?: MapDef;
}) {
  if (!activeMap) return <p className={s.hint}>Add a map first.</p>;
  return (
    <div className={s.section}>
      <span className={s.label}>Fog of war</span>
      <p className={s.hint}>
        While this drawer is open, click or drag squares on the board to reveal or
        re-cover them. You see fog dimmed; players see it solid.
      </p>
      <div className={s.row}>
        <Button variant="secondary" size="sm" onClick={() => void coverAllFog(gameId, activeMap)}>
          Cover all
        </Button>
        <Button variant="secondary" size="sm" onClick={() => void clearFog(gameId, activeMap.id)}>
          Clear all
        </Button>
      </div>
    </div>
  );
}
