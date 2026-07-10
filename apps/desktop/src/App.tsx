import { useEffect, useState } from 'react';
import { useRelaySession, type RelaySession } from './lib/useRelaySession';
import { useCampaigns } from './lib/useCampaigns';
import { useCampaignChildren, type ChildApi } from './lib/useCampaignChildren';
import { useTabletop } from './lib/useTabletop';
import { MapCanvas, type CanvasMode } from './components/MapCanvas';
import type { Campaign, Character, Scene } from './shared/persistence';

const DEFAULT_RELAY_URL = 'ws://localhost:3001';
const SYSTEMS = [
  { id: 'dnd5e', label: 'D&D 5e (SRD)' },
  { id: 'solryn', label: 'Solryn' },
];

// Deferred access to window.db so these stable refs are safe at module load.
const charactersApi: ChildApi<Character> = {
  list: (id) => window.db.listCharacters(id),
  create: (input) => window.db.createCharacter(input),
  remove: (id) => window.db.deleteCharacter(id),
};
const scenesApi: ChildApi<Scene> = {
  list: (id) => window.db.listScenes(id),
  create: (input) => window.db.createScene(input),
  remove: (id) => window.db.deleteScene(id),
};

export function App(): JSX.Element {
  const session = useRelaySession();
  const [version, setVersion] = useState('');
  const [relayUrl, setRelayUrl] = useState(DEFAULT_RELAY_URL);
  const [gmName, setGmName] = useState('');

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
          <Lobby
            session={session}
            relayUrl={relayUrl}
            setRelayUrl={setRelayUrl}
            gmName={gmName}
            setGmName={setGmName}
          />
        ) : (
          <SessionScreen session={session} />
        )}
      </main>
    </div>
  );
}

function Lobby({
  session,
  relayUrl,
  setRelayUrl,
  gmName,
  setGmName,
}: {
  session: RelaySession;
  relayUrl: string;
  setRelayUrl: (v: string) => void;
  gmName: string;
  setGmName: (v: string) => void;
}): JSX.Element {
  const [code, setCode] = useState('');

  const canHost = gmName.trim().length > 0 && relayUrl.trim().length > 0;
  const canJoin = canHost && code.trim().length === 6;

  return (
    <div className="lobby">
      {session.error && <div className="banner error">{session.error}</div>}

      <label className="field">
        <span>Relay server</span>
        <input value={relayUrl} onChange={(e) => setRelayUrl(e.target.value)} placeholder={DEFAULT_RELAY_URL} />
      </label>

      <label className="field">
        <span>Your name</span>
        <input value={gmName} onChange={(e) => setGmName(e.target.value)} placeholder="e.g. Aria" />
      </label>

      <div className="lobby-actions">
        <section className="card">
          <h2>Host a game</h2>
          <p>Start a room as the GM, or open a campaign below to host with its maps.</p>
          <button disabled={!canHost} onClick={() => session.host(relayUrl, gmName)}>
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
          <button disabled={!canJoin} onClick={() => session.join(relayUrl, code, gmName)}>
            Join game
          </button>
        </section>
      </div>

      <Campaigns
        onHostSession={(campaignId) => session.host(relayUrl, gmName.trim() || 'GM', campaignId)}
        canHost={relayUrl.trim().length > 0}
      />
    </div>
  );
}

function Campaigns({
  onHostSession,
  canHost,
}: {
  onHostSession: (campaignId: string) => void;
  canHost: boolean;
}): JSX.Element {
  const { campaigns, loading, create, remove } = useCampaigns();
  const [name, setName] = useState('');
  const [system, setSystem] = useState(SYSTEMS[0].id);
  const [selected, setSelected] = useState<Campaign | null>(null);

  // Keep the open detail view in sync if its campaign is deleted/renamed elsewhere.
  const openCampaign = selected ? campaigns.find((c) => c.id === selected.id) ?? null : null;
  if (openCampaign) {
    return (
      <CampaignDetail
        campaign={openCampaign}
        onBack={() => setSelected(null)}
        onHostSession={() => onHostSession(openCampaign.id)}
        canHost={canHost}
      />
    );
  }

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
              <div className="campaign-actions">
                <button onClick={() => setSelected(c)}>Open</button>
                <button className="ghost" onClick={() => void remove(c.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CampaignDetail({
  campaign,
  onBack,
  onHostSession,
  canHost,
}: {
  campaign: Campaign;
  onBack: () => void;
  onHostSession: () => void;
  canHost: boolean;
}): JSX.Element {
  return (
    <section className="campaigns">
      <div className="detail-header">
        <button className="ghost" onClick={onBack}>
          ← Campaigns
        </button>
        <div className="campaign-meta">
          <span className="campaign-name">{campaign.name}</span>
          <span className="campaign-system">
            {SYSTEMS.find((s) => s.id === campaign.system)?.label ?? campaign.system}
          </span>
        </div>
        <button className="host-session" disabled={!canHost} onClick={onHostSession}>
          Host Session
        </button>
      </div>

      <div className="detail-grid">
        <ChildList title="Characters" noun="character" campaignId={campaign.id} api={charactersApi} />
        <ChildList title="Scenes" noun="scene" campaignId={campaign.id} api={scenesApi} />
      </div>
    </section>
  );
}

function ChildList<T extends { id: string; name: string }>({
  title,
  noun,
  campaignId,
  api,
}: {
  title: string;
  noun: string;
  campaignId: string;
  api: ChildApi<T>;
}): JSX.Element {
  const { items, loading, add, remove } = useCampaignChildren<T>(campaignId, api);
  const [name, setName] = useState('');

  const submit = async (): Promise<void> => {
    if (!name.trim()) return;
    await add(name);
    setName('');
  };

  return (
    <div className="child-list">
      <h3>
        {title} <span className="count">{loading ? '' : items.length}</span>
      </h3>
      <div className="child-new">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void submit()}
          placeholder={`New ${noun} name`}
        />
        <button disabled={!name.trim()} onClick={() => void submit()}>
          Add
        </button>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="muted">No {noun}s yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.name}</span>
              <button className="ghost" onClick={() => void remove(item.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SessionScreen({ session }: { session: RelaySession }): JSX.Element {
  const tabletop = useTabletop(session);
  const [mode, setMode] = useState<CanvasMode>('select');

  return (
    <div className="session">
      <aside className="session-side">
        <div className="room-header">
          <span className={`status ${session.status}`}>{session.status}</span>
          <h2>{tabletop.isGm ? 'Hosting' : 'Playing'}</h2>
        </div>

        {session.roomCode && (
          <div className="roomcode">
            <span className="roomcode-label">Room code</span>
            <span className="roomcode-value">{session.roomCode}</span>
          </div>
        )}

        {tabletop.isGm ? (
          <GmControls tabletop={tabletop} players={session.players} />
        ) : (
          <div className="players">
            <h3>Scene</h3>
            <p className="muted">{tabletop.scene ? tabletop.scene.name : 'Waiting for the GM…'}</p>
          </div>
        )}

        <ChatPanel session={session} />

        <button className="leave" onClick={session.leave}>
          Leave
        </button>
      </aside>

      <section className="session-main">
        <div className="session-bar">
          <span className="scene-name">{tabletop.scene ? tabletop.scene.name : 'No scene'}</span>
          {tabletop.isGm && tabletop.scene && (
            <div className="tools">
              <div className="seg">
                <button className={mode === 'select' ? 'on' : ''} onClick={() => setMode('select')}>
                  Move
                </button>
                <button className={mode === 'fog-add' ? 'on' : ''} onClick={() => setMode('fog-add')}>
                  Fog
                </button>
                <button className={mode === 'fog-erase' ? 'on' : ''} onClick={() => setMode('fog-erase')}>
                  Reveal
                </button>
              </div>
              <button onClick={tabletop.importMap}>Upload map</button>
              <div className="seg">
                <button
                  className={tabletop.scene.scale === 'battle' ? 'on' : ''}
                  onClick={() => tabletop.setScale('battle')}
                >
                  Battle
                </button>
                <button
                  className={tabletop.scene.scale === 'area' ? 'on' : ''}
                  onClick={() => tabletop.setScale('area')}
                >
                  Area
                </button>
              </div>
            </div>
          )}
        </div>
        <MapCanvas tabletop={tabletop} mode={mode} />
      </section>
    </div>
  );
}

function GmControls({
  tabletop,
  players,
}: {
  tabletop: ReturnType<typeof useTabletop>;
  players: RelaySession['players'];
}): JSX.Element {
  return (
    <>
      <div className="side-block">
        <h3>Active scene</h3>
        {tabletop.scenes.length === 0 ? (
          <p className="muted">No scenes in this campaign yet.</p>
        ) : (
          <select
            value={tabletop.scene?.id ?? ''}
            onChange={(e) => tabletop.selectScene(e.target.value)}
          >
            <option value="" disabled>
              Choose a scene…
            </option>
            {tabletop.scenes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="side-block">
        <h3>Characters</h3>
        {tabletop.characters.length === 0 ? (
          <p className="muted">No characters. Drag onto the map to place.</p>
        ) : (
          <ul className="drag-list">
            {tabletop.characters.map((c) => {
              const placed = tabletop.tokens.some((t) => t.characterId === c.id);
              return (
                <li
                  key={c.id}
                  draggable={!placed && !!tabletop.scene}
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', c.id)}
                  className={placed ? 'placed' : ''}
                  title={placed ? 'Already on the map' : 'Drag onto the map'}
                >
                  {c.name}
                  {placed && <span className="tag">on map</span>}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="side-block">
        <h3>Players ({players.length})</h3>
        {players.length === 0 ? (
          <p className="muted">Waiting for players…</p>
        ) : (
          <ul>
            {players.map((p) => (
              <li key={p.playerId}>{p.displayName}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function ChatPanel({ session }: { session: RelaySession }): JSX.Element {
  const [draft, setDraft] = useState('');

  const submit = (): void => {
    session.sendChat(draft);
    setDraft('');
  };

  return (
    <div className="side-chat">
      <h3>Chat</h3>
      <div className="chat-log">
        {session.chat.length === 0 ? (
          <p className="muted">No messages yet.</p>
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
          placeholder="Message…"
          disabled={session.status !== 'open'}
        />
        <button onClick={submit} disabled={session.status !== 'open' || draft.trim().length === 0}>
          Send
        </button>
      </div>
    </div>
  );
}
