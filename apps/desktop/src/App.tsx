import { useEffect, useState } from 'react';
import { useRelaySession } from './lib/useRelaySession';
import { useCampaigns } from './lib/useCampaigns';

const DEFAULT_RELAY_URL = 'ws://localhost:3001';
const SYSTEMS = [
  { id: 'dnd5e', label: 'D&D 5e (SRD)' },
  { id: 'solryn', label: 'Solryn' },
];

export function App(): JSX.Element {
  const session = useRelaySession();
  const [version, setVersion] = useState('');

  useEffect(() => {
    void window.app.getVersion().then(setVersion);
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <h1>Project Epoch VTT</h1>
        <span className="tagline">Buy once. Host free. Play forever.</span>
        {version && <span className="version">v{version}</span>}
      </header>

      <main className="content">
        {session.role === 'idle' ? (
          <Lobby session={session} />
        ) : (
          <Room session={session} />
        )}
      </main>
    </div>
  );
}

function Lobby({ session }: { session: ReturnType<typeof useRelaySession> }): JSX.Element {
  const [url, setUrl] = useState(DEFAULT_RELAY_URL);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const canHost = name.trim().length > 0 && url.trim().length > 0;
  const canJoin = canHost && code.trim().length === 6;

  return (
    <div className="lobby">
      {session.error && <div className="banner error">{session.error}</div>}

      <label className="field">
        <span>Relay server</span>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={DEFAULT_RELAY_URL} />
      </label>

      <label className="field">
        <span>Your name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aria" />
      </label>

      <div className="lobby-actions">
        <section className="card">
          <h2>Host a game</h2>
          <p>Start a new room as the GM. Players join with the room code you receive.</p>
          <button disabled={!canHost} onClick={() => session.host(url, name)}>
            Host game
          </button>
        </section>

        <section className="card">
          <h2>Join a game</h2>
          <p>Enter the 6-letter room code your GM shared with you.</p>
          <input
            className="code-input"
            value={code}
            maxLength={6}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ABCDEF"
          />
          <button disabled={!canJoin} onClick={() => session.join(url, code, name)}>
            Join game
          </button>
        </section>
      </div>

      <Campaigns />
    </div>
  );
}

function Campaigns(): JSX.Element {
  const { campaigns, loading, create, remove } = useCampaigns();
  const [name, setName] = useState('');
  const [system, setSystem] = useState(SYSTEMS[0].id);

  const submit = async (): Promise<void> => {
    if (!name.trim()) return;
    await create({ name, system });
    setName('');
  };

  return (
    <section className="campaigns">
      <h2>Your campaigns</h2>
      <div className="campaign-new">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void submit()}
          placeholder="New campaign name"
        />
        <select value={system} onChange={(e) => setSystem(e.target.value)}>
          {SYSTEMS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <button disabled={!name.trim()} onClick={() => void submit()}>
          Create
        </button>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : campaigns.length === 0 ? (
        <p className="muted">No campaigns yet. Create one — it persists locally.</p>
      ) : (
        <ul className="campaign-list">
          {campaigns.map((c) => (
            <li key={c.id}>
              <div className="campaign-meta">
                <span className="campaign-name">{c.name}</span>
                <span className="campaign-system">
                  {SYSTEMS.find((s) => s.id === c.system)?.label ?? c.system}
                </span>
              </div>
              <button className="ghost" onClick={() => void remove(c.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Room({ session }: { session: ReturnType<typeof useRelaySession> }): JSX.Element {
  const [draft, setDraft] = useState('');

  const submit = (): void => {
    session.sendChat(draft);
    setDraft('');
  };

  return (
    <div className="room">
      <aside className="sidebar">
        <div className="room-header">
          <span className={`status ${session.status}`}>{session.status}</span>
          <h2>{session.role === 'gm' ? 'Hosting' : 'Playing'}</h2>
        </div>

        {session.roomCode && (
          <div className="roomcode">
            <span className="roomcode-label">Room code</span>
            <span className="roomcode-value">{session.roomCode}</span>
          </div>
        )}

        {session.role === 'gm' && (
          <div className="players">
            <h3>Players ({session.players.length})</h3>
            {session.players.length === 0 ? (
              <p className="muted">Waiting for players…</p>
            ) : (
              <ul>
                {session.players.map((p) => (
                  <li key={p.playerId}>{p.displayName}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <button className="leave" onClick={session.leave}>
          Leave
        </button>
      </aside>

      <section className="chat">
        {session.error && <div className="banner error">{session.error}</div>}
        <div className="chat-log">
          {session.chat.length === 0 ? (
            <p className="muted">No messages yet. Say hello!</p>
          ) : (
            session.chat.map((entry, i) => (
              <div key={i} className="chat-entry">
                <span className="chat-from">{entry.from === 'you' ? 'You' : entry.from.slice(0, 8)}</span>
                <span className="chat-text">{entry.text}</span>
              </div>
            ))
          )}
        </div>
        <div className="chat-input">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Type a message…"
            disabled={session.status !== 'open'}
          />
          <button onClick={submit} disabled={session.status !== 'open' || draft.trim().length === 0}>
            Send
          </button>
        </div>
      </section>
    </div>
  );
}
