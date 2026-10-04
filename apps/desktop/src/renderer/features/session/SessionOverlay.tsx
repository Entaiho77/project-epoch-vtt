import { useNavigate } from 'react-router-dom';
import { answerJoinRequest, clearSessionError, restartHosting, useSession } from '../../data/realtime';
import { Button } from '../../components/ui/Button';
import styles from './SessionOverlay.module.css';

/**
 * Shown above every screen during a live session:
 *  - GM: "<name> wants to join" cards to allow or deny, and a notice if hosting dropped.
 *  - Player: "Offline — waiting to reconnect…" while the connection to the GM is down
 *    (it reconnects by itself).
 *  - Anyone: why a session ended (GM left, you were removed), with a way back to the lobby.
 */
export function SessionOverlay() {
  const session = useSession();
  const navigate = useNavigate();

  const playerReconnecting =
    session.role === 'player' && session.wasOpen && session.status !== 'open';
  const hostingDropped =
    session.role === 'gm' && (session.status === 'error' || session.status === 'closed');

  return (
    <>
      {playerReconnecting && (
        <div className={styles.banner} role="status">
          <span className={styles.dot} aria-hidden="true" />
          Offline — waiting to reconnect…
        </div>
      )}

      {session.role === 'idle' && session.error && (
        <div className={styles.banner} role="alert">
          {session.error}
          <Button
            size="sm"
            onClick={() => {
              clearSessionError();
              navigate('/');
            }}
          >
            Back to lobby
          </Button>
        </div>
      )}

      {hostingDropped && (
        <div className={styles.banner} role="alert">
          Hosting stopped{session.error ? `: ${session.error}` : '.'}
          <Button size="sm" onClick={() => void restartHosting()}>
            Host again
          </Button>
        </div>
      )}

      {session.role === 'gm' && session.joinRequests.length > 0 && (
        <div className={styles.requests} aria-live="polite">
          {session.joinRequests.map((r) => (
            <div key={r.peerKey} className={styles.card} role="dialog" aria-label={`${r.displayName} wants to join`}>
              <span className={styles.title}>{r.displayName} wants to join</span>
              {r.warning && <span className={styles.warning}>⚠ {r.warning}</span>}
              <div className={styles.actions}>
                <Button size="sm" variant="secondary" onClick={() => void answerJoinRequest(r.peerKey, false)}>
                  Deny
                </Button>
                <Button size="sm" onClick={() => void answerJoinRequest(r.peerKey, true)}>
                  Let them in
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
