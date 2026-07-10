import { useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { useSession, useValue } from '../../data/realtime';
import { createCharacter, setLevelUpPending, useGameCharacter } from '../../data/characters';
import type { Game } from '@solryn/shared-types';
import { useLibrary, withHomebrewOptions } from '../../data/homebrew';
import { roleOf } from '../../permissions';
import { getSystem, isClassAndLevel } from '@solryn/systems/registry';
import { Button } from '../../components/ui/Button';
import { RoleBadge } from '../../components/ui/Badge';
import { GameSettingsModal } from './GameSettingsModal';
import { CharacterBuilder } from '../builder/CharacterBuilder';
import { Dnd5eCharacterBuilder } from '../builder5e/Dnd5eCharacterBuilder';
import { BoardScreen } from '../board/BoardScreen';
import { RollLogProvider } from '../rolllog/rollLog';
import styles from './GamePage.module.css';

export function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const session = useSession();
  const { value: game, loading } = useValue<Game>(
    gameId ? `games/${gameId}` : null,
  );
  const { character, loading: charLoading } = useGameCharacter(
    gameId ?? null,
    user?.uid ?? null,
  );
  // The GM's account-wide library, read live for homebrew player options (races/classes/etc.).
  const { library } = useLibrary(game?.gmUid ?? game?.createdBy ?? null);
  const [showSettings, setShowSettings] = useState(false);

  if (loading) return <div className={styles.center}>Loading game…</div>;
  if (!game || !user) {
    return (
      <div className={styles.center}>
        <p>This game could not be found.</p>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Back to lobby
        </Button>
      </div>
    );
  }

  const role = roleOf(game, user.uid);
  if (!role) {
    return (
      <div className={styles.center}>
        <p>You’re not a member of this game.</p>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Back to lobby
        </Button>
      </div>
    );
  }

  // Fold this game's GM-authored homebrew player options (races/classes/backgrounds/feats) into
  // the system so the builder, level-up, pcDerived, and sheet see them alongside SRD content.
  const baseSystem = getSystem(game.systemId);
  const system = baseSystem
    ? withHomebrewOptions(baseSystem, library?.playerOptions)
    : undefined;

  // Player without a completed character → the builder. Otherwise → the board.
  const building =
    role === 'player' && !charLoading && (!character || !character.buildComplete);

  let content: ReactNode;
  let isBoard = false;
  if (!system) {
    content = <p className={styles.muted}>Unknown system “{game.systemId}”.</p>;
  } else if (role === 'gm') {
    content = <BoardScreen system={system} game={game} role={role} uid={user.uid} />;
    isBoard = true;
  } else if (charLoading) {
    content = <p className={styles.muted}>Loading your character…</p>;
  } else if (building) {
    // Class-and-level systems (5e) use their own builder on the shared shell; Solryn keeps its.
    const Builder = isClassAndLevel(system) ? Dnd5eCharacterBuilder : CharacterBuilder;
    content = (
      <Builder
        system={system}
        gameId={game.id}
        ownerUserId={user.uid}
        onFinish={async (c) => {
          const created = await createCharacter(c);
          // Start-above-1: flag a level-up so the sheet chains the level-up flow up to the
          // game's starting level (the player just built at level 1). Owner-written.
          if ((game.startingLevel ?? 1) > 1) await setLevelUpPending(created.id, true);
        }}
      />
    );
  } else {
    content = (
      <BoardScreen
        system={system}
        game={game}
        role={role}
        uid={user.uid}
        character={character ?? undefined}
      />
    );
    isBoard = true;
  }

  return (
    <RollLogProvider
      gameId={game.id}
      uid={user.uid}
      // Player rolls are attributed to their character; GM rolls (incl. monsters) get no
      // prefix. Character-less player → account display name, never blank.
      byName={
        role === 'gm'
          ? ''
          : (character?.name ?? game.members[user.uid]?.displayName ?? 'Someone')
      }
      log={game.rollLog}
      canClear={role === 'gm'}
    >
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')} aria-label="Back to lobby">
          ‹ Lobby
        </button>
        <div className={styles.titleBlock}>
          <span className={styles.glyph} style={{ color: game.systemColor }} aria-hidden="true">
            {game.systemGlyph}
          </span>
          <span className={styles.gameName}>{game.name}</span>
          <span className={styles.systemLabel}>{game.systemName}</span>
        </div>
        <div className={styles.headerRight}>
          {session.roomCode && session.gameId === game.id && (
            <span className={styles.systemLabel}>Room {session.roomCode}</span>
          )}
          <RoleBadge role={role} />
          {!building && (
            <Button variant="secondary" size="sm" onClick={() => setShowSettings(true)}>
              Settings
            </Button>
          )}
        </div>
      </header>

      <main className={isBoard ? styles.bodyBoard : styles.bodyFlow}>{content}</main>

      <GameSettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        game={game}
        role={role}
        currentUid={user.uid}
        characterId={character?.id}
        is5e={!!system && isClassAndLevel(system)}
        system={system}
        onExit={() => navigate('/')}
      />
    </div>
    </RollLogProvider>
  );
}
