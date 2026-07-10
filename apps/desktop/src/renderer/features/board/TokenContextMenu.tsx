import { useEffect, useState } from 'react';
import type { TokenCondition } from '@solryn/shared-types';
import type { Token } from '@solryn/shared-types';
import { removeToken, setExclusiveCondition, setTokenCondition, updateToken } from '../../data/board';
import styles from './TokenContextMenu.module.css';

/**
 * Right-click menu for board tokens. Positioned at the cursor; dismisses on click-away (the
 * backdrop) or Escape.
 *
 * - "Set as target" (character/creature, target-vs-defense systems) points attacks at this token.
 * - "Conditions" (any member) toggles status conditions on/off — each is a colored token indicator
 *   with mechanized combat effects. Exhaustion is a single exclusive level (1–6).
 * - "Remove token" (GM only) deletes just the token; the player's character is untouched.
 */
export function TokenContextMenu({
  token,
  x,
  y,
  gameId,
  targetingEnabled,
  isTarget,
  onSetTarget,
  canRemove,
  conditions,
  onClose,
}: {
  token: Token;
  x: number;
  y: number;
  gameId: string;
  /** Whether this system's combat uses targeting (5e AC / Solryn DR) → offer "Set as target". */
  targetingEnabled: boolean;
  /** Whether this token is already the current target (toggles the label to "Clear target"). */
  isTarget: boolean;
  /** Set/clear this token as the attack target (does not change selection). */
  onSetTarget: () => void;
  /** GM → offer "Remove token". */
  canRemove: boolean;
  /** The active system's token conditions (empty/undefined → no Conditions submenu). */
  conditions?: TokenCondition[];
  onClose: () => void;
}) {
  const [showConditions, setShowConditions] = useState(false);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Only attackable tokens can be targeted (traps/party have no defense).
  const canTarget = targetingEnabled && (token.kind === 'character' || token.kind === 'creature');
  const canCondition = !!conditions?.length && token.kind !== 'party';
  const active = token.conditions ?? {};

  const simple = (conditions ?? []).filter((c) => !c.group);
  // Exclusive groups (e.g. Exhaustion), keyed by group id.
  const groups = new Map<string, TokenCondition[]>();
  for (const c of conditions ?? []) {
    if (c.group) groups.set(c.group, [...(groups.get(c.group) ?? []), c]);
  }

  const toggle = (c: TokenCondition) => void setTokenCondition(gameId, token.id, c.id, !active[c.id]);
  const toggleInGroup = (group: TokenCondition[], c: TokenCondition) =>
    void setExclusiveCondition(gameId, token.id, group.map((g) => g.id), active[c.id] ? null : c.id);

  const setTarget = () => {
    onSetTarget();
    onClose();
  };
  const remove = () => {
    void removeToken(gameId, token.id);
    onClose();
  };
  // GM visibility toggle: hidden tokens are dimmed for the GM and not rendered for players.
  const hidden = token.visible === false;
  const toggleVisible = () => {
    void updateToken(gameId, token.id, { visible: hidden });
    onClose();
  };

  // Keep the menu on-screen when the cursor is near the right/bottom edge.
  const left = Math.min(x, window.innerWidth - 260);
  const top = Math.min(y, window.innerHeight - (showConditions ? 360 : 140));
  const chip = (on: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '3px 6px',
    borderRadius: 4,
    cursor: 'pointer',
    background: on ? 'rgba(255,255,255,0.12)' : 'transparent',
    fontWeight: on ? 700 : 400,
  });
  const swatch = (color: string): React.CSSProperties => ({
    width: 12,
    height: 12,
    borderRadius: 2,
    background: color,
    border: '1px solid rgba(255,255,255,0.4)',
    flexShrink: 0,
  });

  return (
    <>
      <div
        className={styles.backdrop}
        onMouseDown={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
      <div className={styles.menu} style={{ left, top }} role="menu">
        <div className={styles.header}>{token.name}</div>
        {canTarget && (
          <button className={styles.item} role="menuitem" onClick={setTarget}>
            {isTarget ? 'Clear target' : 'Set as target'}
          </button>
        )}

        {canCondition && (
          <>
            <button className={styles.item} role="menuitem" onClick={() => setShowConditions((v) => !v)}>
              {showConditions ? '▾' : '▸'} Conditions
            </button>
            {showConditions && (
              <div style={{ maxHeight: 260, overflowY: 'auto', padding: '2px 4px' }}>
                {simple.map((c) => {
                  const on = !!active[c.id];
                  return (
                    <div key={c.id} role="menuitemcheckbox" aria-checked={on} title={c.description} style={chip(on)} onClick={() => toggle(c)}>
                      <span style={swatch(c.color)} />
                      <span>{on ? '☑' : '☐'} {c.name}</span>
                    </div>
                  );
                })}
                {[...groups.values()].map((group) => (
                  <div key={group[0].group} style={{ marginTop: 4, borderTop: '1px solid var(--border-hairline)', paddingTop: 4 }}>
                    <span className={styles.hint} style={{ display: 'block', margin: '0 6px 2px' }}>
                      {group[0].group === 'exhaustion' ? 'Exhaustion' : group[0].group} (one level)
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '0 6px' }}>
                      {group.map((c) => {
                        const on = !!active[c.id];
                        return (
                          <button
                            key={c.id}
                            title={c.description}
                            onClick={() => toggleInGroup(group, c)}
                            style={{
                              width: 26,
                              padding: '2px 0',
                              borderRadius: 4,
                              cursor: 'pointer',
                              border: '1px solid rgba(255,255,255,0.35)',
                              background: on ? c.color : 'transparent',
                              color: on ? '#fff' : 'var(--text-primary)',
                              fontWeight: on ? 700 : 400,
                            }}
                          >
                            {c.level}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {canRemove && (
          <button className={styles.item} role="menuitem" onClick={toggleVisible}>
            {hidden ? 'Show token' : 'Hide token'}
          </button>
        )}

        {canRemove && (
          <button className={styles.item} role="menuitem" onClick={remove}>
            Remove token
          </button>
        )}
        {canRemove && token.kind === 'character' && (
          <p className={styles.hint}>
            Remove takes the token only — the player keeps their character and can rejoin.
          </p>
        )}
      </div>
    </>
  );
}
