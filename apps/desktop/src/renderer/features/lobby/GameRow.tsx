import type { Game } from '@solryn/shared-types';
import { RoleBadge } from '../../components/ui/Badge';
import { roleOf } from '../../permissions';
import styles from './GameRow.module.css';

interface GameRowProps {
  game: Game;
  uid: string;
  onOpen: (game: Game) => void;
}

export function GameRow({ game, uid, onOpen }: GameRowProps) {
  const role = roleOf(game, uid) ?? 'player';
  const memberCount = Object.keys(game.members ?? {}).length;
  const playerCount = Object.values(game.members ?? {}).filter(
    (m) => m.role === 'player',
  ).length;

  return (
    <button className={styles.row} onClick={() => onOpen(game)}>
      <span
        className={styles.glyph}
        style={{ color: game.systemColor, borderColor: game.systemColor }}
        aria-hidden="true"
      >
        {game.systemGlyph}
      </span>
      <span className={styles.main}>
        <span className={styles.name}>{game.name}</span>
        <span className={styles.meta}>
          {game.systemName} · {playerCount}{' '}
          {playerCount === 1 ? 'player' : 'players'}
          {memberCount !== playerCount ? ' · GM' : ''}
        </span>
      </span>
      <RoleBadge role={role} />
    </button>
  );
}
