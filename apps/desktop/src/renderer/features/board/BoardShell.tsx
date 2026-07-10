import type { ReactNode } from 'react';
import styles from './BoardShell.module.css';

/**
 * The board's symmetric edge-bar + fly-out drawer shell (§4.4 / §4.8 / §4.11).
 * Config-driven and role-agnostic: GM and player pass different item lists. Drawers open
 * one-at-a-time per side; the board reclaims width when none is open.
 */

// `label` is the full descriptive name (used for title/aria); `short` is the concise
// 1-word caption shown under the glyph. Falls back to `label` when omitted.
export type BarItem =
  | { kind: 'drawer'; id: string; label: string; short?: string; glyph: string; content: ReactNode; wide?: boolean }
  | {
      kind: 'action';
      id: string;
      label: string;
      short?: string;
      glyph: string;
      onClick: () => void;
      active?: boolean;
    }
  | { kind: 'divider'; id: string };

interface BoardShellProps {
  left: BarItem[];
  right: BarItem[];
  openLeft: string | null;
  openRight: string | null;
  onToggle: (side: 'left' | 'right', id: string) => void;
  /** Selection-driven right panel (e.g. the monster card). Reuses the drawer chrome and
   * takes the right slot when present, so it gets the same width/visual treatment. */
  rightPanel?: { title: string; content: ReactNode; onClose: () => void };
  children: ReactNode;
}

export function BoardShell({
  left,
  right,
  openLeft,
  openRight,
  onToggle,
  rightPanel,
  children,
}: BoardShellProps) {
  const openItem = (items: BarItem[], id: string | null) =>
    items.find((i) => i.kind === 'drawer' && i.id === id) as
      | Extract<BarItem, { kind: 'drawer' }>
      | undefined;

  const leftOpen = openItem(left, openLeft);
  const rightOpen = openItem(right, openRight);

  return (
    <div className={styles.shell}>
      <Strip side="left" items={left} openId={openLeft} onToggle={onToggle} />

      {leftOpen && (
        <aside className={`${styles.drawer} ${styles.leftDrawer}`}>
          <DrawerHeader title={leftOpen.label} onClose={() => onToggle('left', leftOpen.id)} />
          <div className={styles.drawerBody}>{leftOpen.content}</div>
        </aside>
      )}

      <div className={styles.board}>{children}</div>

      {rightPanel ? (
        <aside className={`${styles.drawer} ${styles.rightDrawer}`}>
          <DrawerHeader title={rightPanel.title} onClose={rightPanel.onClose} />
          <div className={styles.drawerBody}>{rightPanel.content}</div>
        </aside>
      ) : (
        rightOpen && (
          <aside className={`${styles.drawer} ${styles.rightDrawer} ${rightOpen.wide ? styles.drawerWide : ''}`}>
            <DrawerHeader title={rightOpen.label} onClose={() => onToggle('right', rightOpen.id)} />
            <div className={styles.drawerBody}>{rightOpen.content}</div>
          </aside>
        )
      )}

      <Strip side="right" items={right} openId={openRight} onToggle={onToggle} />
    </div>
  );
}

function Strip({
  side,
  items,
  openId,
  onToggle,
}: {
  side: 'left' | 'right';
  items: BarItem[];
  openId: string | null;
  onToggle: (side: 'left' | 'right', id: string) => void;
}) {
  return (
    <div className={styles.strip}>
      {items.map((item) => {
        if (item.kind === 'divider') return <div key={item.id} className={styles.divider} />;
        const active = item.kind === 'drawer' ? openId === item.id : item.active;
        return (
          <button
            key={item.id}
            type="button"
            className={`${styles.tool} ${active ? styles.toolActive : ''}`}
            title={item.label}
            aria-label={item.label}
            aria-pressed={active}
            onClick={() =>
              item.kind === 'action' ? item.onClick() : onToggle(side, item.id)
            }
          >
            <span className={styles.glyph} aria-hidden="true">
              {item.glyph}
            </span>
            <span className={styles.toolLabel}>{item.short ?? item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function DrawerHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className={styles.drawerHead}>
      <span className={styles.drawerTitle}>{title}</span>
      <button className={styles.drawerClose} onClick={onClose} aria-label="Close">
        ×
      </button>
    </div>
  );
}
