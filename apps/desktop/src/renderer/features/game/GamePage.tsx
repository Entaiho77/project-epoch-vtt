import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { hostSession, useSession, useValue } from '../../data/realtime';
import {
  cloneCharacterToGame,
  createCharacter,
  setLevelUpPending,
  useGameCharacter,
  usePlayerCharacters,
} from '../../data/characters';
import type { Character, Game, Role } from '@epoch/shared-types';
import { useLibrary, withHomebrewOptions } from '../../data/homebrew';
import { roleOf } from '../../permissions';
import { getSystem, isClassAndLevel } from '@epoch/systems/registry';
import { Button } from '../../components/ui/Button';
import icoSettings from '../../assets/icons/icon-settings.png';
import icoLibrary from '../../assets/icons/icon-library.png';
import icoLobby from '../../assets/icons/icon-lobby.png';
import { RoleBadge } from '../../components/ui/Badge';
import { GameSettingsModal } from './GameSettingsModal';
import { CharacterBuilder } from '../builder/CharacterBuilder';
import { Dnd5eCharacterBuilder } from '../builder5e/Dnd5eCharacterBuilder';
import { BoardScreen } from '../board/BoardScreen';
import { RollLogProvider } from '../rolllog/rollLog';
import { VoiceButton } from '../voice/VoiceButton';
import styles from './GamePage.module.css';

export function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user, displayName } = useAuth();
  const session = useSession();
  const { value: game, loading } = useValue<Game>(
    gameId ? `games/${gameId}` : null,
  );
  const { character, loading: charLoading } = useGameCharacter(
    gameId ?? null,
    user?.uid ?? null,
  );
  const otherChars = usePlayerCharacters(user?.uid ?? null);
  // The GM's account-wide library, read live for homebrew player options (races/classes/etc.).
  const { library } = useLibrary(game?.gmUid ?? game?.createdBy ?? null);
  const [showSettings, setShowSettings] = useState(false);
  const [wantsNewChar, setWantsNewChar] = useState(false);
  // Toolbar rebalance (2026-10-09): the board's rare/infrequent buttons (bulk creature art,
  // ambient audio, grid, maps) portal into this header slot, next to Library/Settings, instead
  // of a separate bar — Matthew's point was they belong in the "same bar as lobby and settings."
  // BoardScreen keeps owning the data (activeMap/bulkArtPool/creatureArt) and just teleports its
  // already-built buttons here via createPortal, so nothing needs to be recomputed in this file.
  const [headerToolsEl, setHeaderToolsEl] = useState<HTMLDivElement | null>(null);
  // Characters this player owns in OTHER games (available to import).
  // Must stay above the early returns below: hooks have to run on every render.
  const importable = useMemo(
    () => otherChars.filter((c) => c.gameId !== game?.id),
    [otherChars, game?.id],
  );

  // GM: open the live P2P session automatically on entering the game, instead of requiring a
  // detour back through the lobby's "Host session" button first — players couldn't join until
  // the GM remembered that extra step. Guarded on session.role === 'idle' so this only fires
  // once per app-session and never fights a session already in progress (hosting, connecting,
  // or already open). A failure here (e.g. no invite code yet) is silent: the lobby's own
  // "Host session" button still works as a fallback.
  useEffect(() => {
    if (!game || !user || session.role !== 'idle') return;
    const myRole = roleOf(game, user.uid);
    if (myRole !== 'gm') return;
    void hostSession(game.id, { uid: user.uid, displayName }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.id, user?.uid, session.role]);

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

  // Session.role is the source of truth during a live session on this game;
  // fall back to the persisted membership for offline browsing.
  const role: Role | undefined =
    (session.role === 'gm' || session.role === 'player') && session.gameId === gameId
      ? session.role
      : roleOf(game, user.uid);
  if (!role) {
    return (
      <div className={styles.center}>
        <p>You&apos;re not a member of this game.</p>
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

  // Player without a completed character → prompt to create or select one.
  const needsCharacter =
    role === 'player' && !charLoading && (!character || !character.buildComplete);

  let content: ReactNode;
  let isBoard = false;
  if (!system) {
    content = <p className={styles.muted}>Unknown system “{game.systemId}”.</p>;
  } else if (role === 'gm') {
    content = (
      <BoardScreen system={system} game={game} role={role} uid={user.uid} headerPortal={headerToolsEl} />
    );
    isBoard = true;
  } else if (charLoading) {
    content = <p className={styles.muted}>Loading your character…</p>;
  } else if (needsCharacter && !wantsNewChar) {
    content = (
      <CharacterPrompt
        importable={importable}
        systemId={game.systemId}
        gameId={game.id}
        startingLevel={game.startingLevel}
        onCreateNew={() => setWantsNewChar(true)}
      />
    );
  } else if (needsCharacter && wantsNewChar) {
    const Builder = isClassAndLevel(system) ? Dnd5eCharacterBuilder : CharacterBuilder;
    content = (
      <Builder
        system={system}
        gameId={game.id}
        ownerUserId={user.uid}
        onFinish={async (c) => {
          const created = await createCharacter(c);
          if ((game.startingLevel ?? 1) > 1) await setLevelUpPending(created.id, true);
          setWantsNewChar(false);
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
        headerPortal={headerToolsEl}
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
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => navigate('/')}
          title="Back to lobby"
          aria-label="Back to lobby"
        >
          <img src={icoLobby} alt="" aria-hidden="true" />
        </button>
        <div className={styles.titleBlock}>
          <span className={styles.glyph} style={{ color: game.systemColor }} aria-hidden="true">
            {game.systemGlyph}
          </span>
          <span className={styles.gameName}>{game.name}</span>
          <span className={styles.systemLabel}>{game.systemName}</span>
        </div>
        {isBoard && <div className={styles.headerTools} ref={setHeaderToolsEl} />}
        <div className={styles.headerRight}>
          {session.roomCode && session.gameId === game.id && (
            <span className={styles.systemLabel}>Room {session.roomCode}</span>
          )}
          {session.role !== 'idle' && session.gameId === game.id && (
            <VoiceButton uid={user.uid} members={game.members} gameId={game.id} role={role === 'gm' ? 'gm' : 'player'} />
          )}
          <RoleBadge role={role} />
          {role === 'gm' && (
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => navigate(`/game/${game.id}/customize`)}
              title="My library"
              aria-label="My library"
            >
              <img src={icoLibrary} alt="" aria-hidden="true" />
            </button>
          )}
          {!needsCharacter && (
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => setShowSettings(true)}
              title="Settings"
              aria-label="Settings"
            >
              <img src={icoSettings} alt="" aria-hidden="true" />
            </button>
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

function CharacterPrompt({
  importable,
  systemId,
  gameId,
  startingLevel,
  onCreateNew,
}: {
  importable: Character[];
  systemId: string;
  gameId: string;
  startingLevel?: number;
  onCreateNew: () => void;
}) {
  const compatible = importable.filter((c) => c.systemId === systemId);
  return (
    <div className={styles.center}>
      <div className={styles.placeholder}>
        <h2 style={{ margin: 0 }}>Choose your character</h2>
        <p className={styles.muted}>
          Create a new character for this session, or bring one from a previous game.
        </p>
        <Button onClick={onCreateNew}>Create new character</Button>
        {compatible.length > 0 && (
          <>
            <p className={styles.muted} style={{ marginTop: 'var(--space-4)' }}>
              Or use an existing character:
            </p>
            {compatible.map((c) => (
              <Button
                key={c.id}
                variant="secondary"
                onClick={async () => {
                  const cloned = await cloneCharacterToGame(c, gameId);
                  if ((startingLevel ?? 1) > 1) await setLevelUpPending(cloned.id, true);
                }}
              >
                {c.name} (Lv {c.play.level})
              </Button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
