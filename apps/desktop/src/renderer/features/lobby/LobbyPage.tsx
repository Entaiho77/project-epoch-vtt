import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { useUserGames } from '../../data/games';
import { hostSession, joinSession, useSession } from '../../data/realtime';
import type { Game } from '@epoch/shared-types';
import { roleOf } from '../../permissions';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { GameRow } from './GameRow';
import { CreateGameModal } from './CreateGameModal';
import styles from './LobbyPage.module.css';

export function LobbyPage() {
  const { user, displayName, signOut } = useAuth();
  const navigate = useNavigate();
  const uid = user?.uid ?? null;
  const { games, loading } = useUserGames(uid);
  const session = useSession();

  const [showCreate, setShowCreate] = useState(false);
  const [code, setCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joining, setJoining] = useState(false);
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    window.epochApp
      ?.getVersion()
      .then(setVersion)
      .catch(() => {});
  }, []);

  function openGame(game: Game) {
    navigate(`/game/${game.id}`);
  }

  /** GM: open a live session for one of your games, then enter it. */
  async function handleHost(game: Game) {
    if (!user) return;
    setJoinError('');
    try {
      await hostSession(game.id, { uid: user.uid, displayName });
      navigate(`/game/${game.id}`);
    } catch (err) {
      setJoinError((err as Error).message);
    }
  }

  /** Player: join a GM's live session with the code they shared. */
  async function join(roomCode: string) {
    if (!user || !roomCode.trim()) return;
    setJoining(true);
    setJoinError('');
    try {
      const gameId = await joinSession(roomCode, { uid: user.uid, displayName });
      setCode('');
      navigate(`/game/${gameId}`);
    } catch (err) {
      setJoinError((err as Error).message);
    } finally {
      setJoining(false);
    }
  }

  function handleJoin(e: FormEvent) {
    e.preventDefault();
    void join(code);
  }

  const joinStatus = !joining
    ? null
    : session.waitingForApproval
      ? 'Found the game — waiting for the GM to let you in…'
      : 'Looking for the game… this can take up to half a minute.';

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.brandGlyph} aria-hidden="true">
            ✶
          </span>
          Project Epoch VTT
          {version && <span className={styles.version}>v{version}</span>}
        </div>
        <div className={styles.user}>
          {session.roomCode && (
            <span className={styles.userName}>Room {session.roomCode}</span>
          )}
          <Avatar name={displayName} />
          <span className={styles.userName}>{displayName}</span>
          <Button variant="ghost" size="sm" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.sectionHead}>
          <h1 className={styles.h1}>Your games</h1>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button variant="secondary" onClick={() => navigate('/library')}>My Library</Button>
            <Button onClick={() => setShowCreate(true)}>+ Create game</Button>
          </div>
        </div>

        {loading ? (
          <p className={styles.muted}>Loading your games…</p>
        ) : games.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No games yet</p>
            <p className={styles.muted}>
              Create a game to run as GM, or join a friend's session with their room
              code below.
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {uid &&
              games.map((g) => (
                <div key={g.id} style={{ display: 'flex', alignItems: 'stretch', gap: 'var(--space-2)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <GameRow game={g} uid={uid} onOpen={openGame} />
                  </div>
                  {roleOf(g, uid) === 'player' && g.inviteCode && (
                    <Button size="sm" variant="secondary" disabled={joining} onClick={() => void join(g.inviteCode)}>
                      Rejoin
                    </Button>
                  )}
                  {roleOf(g, uid) === 'gm' && (
                    <>
                      <Button size="sm" onClick={() => void handleHost(g)}>
                        Host session
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => navigate(`/game/${g.id}/customize`)}>
                        Library
                      </Button>
                    </>
                  )}
                </div>
              ))}
          </div>
        )}

        <form className={styles.joinRow} onSubmit={handleJoin}>
          <div className={styles.joinField}>
            <TextField
              label="Join a session"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code your GM shared (e.g. SVLT-7K2P)"
              error={joinError || undefined}
            />
            {joinStatus && <p className={styles.muted}>{joinStatus}</p>}
          </div>
          <Button
            type="submit"
            variant="secondary"
            disabled={joining || !code.trim()}
          >
            {joining ? 'Joining…' : 'Join'}
          </Button>
        </form>

      </main>

      <CreateGameModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={openGame}
      />
    </div>
  );
}
