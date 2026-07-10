import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SystemDefinition } from '@solryn/shared-types';
import type { MapDef, Token } from '@solryn/shared-types';
import { addToken } from '../../../data/board';
import {
  deleteCreature,
  saveCreature,
  setSavedCreatureImage,
  useMyCreatures,
} from '../../../data/creatures';
import { homebrewToBestiaryEntry, type HomebrewMonster } from '../../../data/homebrew';
import { firstFreeCell, gridDimensions, sizeToSquares } from '../boardGeometry';
import { Button } from '../../../components/ui/Button';
import { TokenArtUpload } from '../../../components/ui/TokenArtUpload';
import s from './drawers.module.css';

const CREATURE_COLOR = '#b05a5a';
const TRAP_COLOR = '#8a7d52';

type Category = 'creature' | 'trap';

export function AddCreatureDrawer({
  system,
  homebrewMonsters,
  gameId,
  uid,
  activeMap,
  tokens,
}: {
  system: SystemDefinition;
  /** The GM's library monsters (from useLibrary in BoardScreen). Editing happens on the
   *  Customization page, not here. */
  homebrewMonsters: HomebrewMonster[];
  gameId: string;
  uid: string;
  activeMap?: MapDef;
  tokens: Token[];
}) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'bestiary' | 'homebrew' | 'mine' | 'build'>('bestiary');
  const [category, setCategory] = useState<Category>('creature');
  const [name, setName] = useState('');
  const [hp, setHp] = useState('5');
  const [dr, setDr] = useState('0');
  const [damage, setDamage] = useState('1d6');
  const [init, setInit] = useState('0');
  const [detectionDC, setDetectionDC] = useState('13');
  const [trigger, setTrigger] = useState('Entering the space');
  const [effect, setEffect] = useState('1d6');
  const [disarmDC, setDisarmDC] = useState('13');
  const [save, setSave] = useState(true);

  // Bestiary filters — independent and exclusive (only one active at a time). Activating one
  // clears the others; "Clear" resets to the full list. All live, no search button.
  const [nameQuery, setNameQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dmgFilter, setDmgFilter] = useState('');

  const myCreatures = useMyCreatures(uid);

  // Distinct creature types + attack damage types actually present, for the selectors.
  const { creatureTypes, damageTypes } = useMemo(() => {
    const types = new Set<string>();
    const dmg = new Set<string>();
    for (const b of system.bestiary) {
      const t = b.stats?.type;
      if (typeof t === 'string' && t) types.add(t);
      for (const a of b.attacks ?? []) if (a.damageType) dmg.add(a.damageType);
    }
    return {
      creatureTypes: [...types].sort(),
      damageTypes: [...dmg].sort(),
    };
  }, [system.bestiary]);

  const q = nameQuery.trim().toLowerCase();
  const filteredBestiary = q
    ? system.bestiary.filter((b) => b.name.toLowerCase().includes(q))
    : typeFilter
      ? system.bestiary.filter((b) => b.stats?.type === typeFilter)
      : dmgFilter
        ? system.bestiary.filter((b) => (b.attacks ?? []).some((a) => a.damageType === dmgFilter))
        : system.bestiary;
  const filterActive = Boolean(q || typeFilter || dmgFilter);
  const clearFilters = () => {
    setNameQuery('');
    setTypeFilter('');
    setDmgFilter('');
  };

  // Spawning needs a map; managing homebrew (create/edit) does not. So we no longer early-return
  // the whole drawer without a map — place() is a no-op instead, and the spawn tabs show a hint.
  const grid = activeMap ? gridDimensions(activeMap.width, activeMap.height, activeMap.gridSize) : null;
  const center = grid ? { col: Math.floor(grid.cols / 2), row: Math.floor(grid.rows / 2) } : null;

  function place(token: Omit<Token, 'id' | 'mapId' | 'col' | 'row'>) {
    if (!activeMap || !grid || !center) return;
    // Drop onto the nearest free cell to centre so multiple creatures don't pile up on
    // one square (which would hide all but the topmost). Click-cycling is the safety net
    // if a rapid burst places faster than tokens sync back.
    const occupied = new Set(
      tokens.filter((t) => t.mapId === activeMap!.id).map((t) => `${t.col},${t.row}`),
    );
    const cell = firstFreeCell(occupied, center.col, center.row, grid.cols, grid.rows);
    void addToken(gameId, { ...token, mapId: activeMap!.id, col: cell.col, row: cell.row });
  }

  function placeStatBlock(
    blockName: string,
    cat: Category,
    stats: Record<string, number | string>,
    creatureId?: string,
    /** Creature size category (e.g. "Large"); sets a multi-square token footprint. */
    sizeCategory?: string,
  ) {
    const isTrap = cat === 'trap';
    const hpVal = Number(stats.hp);
    // Large/Huge/Gargantuan creatures get a 2×2/3×3/4×4 footprint; everything else stays 1×1
    // (default, so we only stamp `size` when it exceeds one square). Traps are always 1×1.
    const squares = isTrap ? 1 : sizeToSquares(sizeCategory);
    place({
      kind: isTrap ? 'trap' : 'creature',
      name: blockName,
      color: isTrap ? TRAP_COLOR : CREATURE_COLOR,
      visible: !isTrap, // traps start hidden until the GM reveals/springs them
      stats,
      ...(creatureId ? { creatureId } : {}),
      ...(squares > 1 ? { size: squares } : {}),
      // Keep the original category string for visual radius (Tiny/Small render smaller than Medium).
      ...(!isTrap && sizeCategory ? { sizeCategory } : {}),
      ...(isTrap ? { trapState: 'hidden' as const } : {}),
      ...(!isTrap && Number.isFinite(hpVal) && hpVal > 0
        ? { hp: { current: hpVal, max: hpVal } }
        : {}),
    });
  }

  function build() {
    const stats: Record<string, number | string> =
      category === 'creature'
        ? { hp: Number(hp) || 0, dr: Number(dr) || 0, damage, initiativeMod: Number(init) || 0 }
        : {
            detectionDC: Number(detectionDC) || 0,
            trigger,
            effect,
            disarmDC: Number(disarmDC) || 0,
          };
    const blockName = name.trim() || (category === 'trap' ? 'Trap' : 'Creature');
    placeStatBlock(blockName, category, stats);
    if (save) void saveCreature(uid, { name: blockName, category, stats });
    setName('');
  }

  return (
    <div>
      <div className={s.tabs}>
        {(['bestiary', 'homebrew', 'mine', 'build'] as const).map((t) => (
          <button
            key={t}
            className={`${s.tab} ${tab === t ? s.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'bestiary' ? 'Bestiary' : t === 'homebrew' ? 'Homebrew' : t === 'mine' ? 'Saved' : 'Build'}
          </button>
        ))}
      </div>

      {!activeMap && (
        <p className={s.hint}>Add a map to place creatures on the board.{tab === 'homebrew' ? ' Homebrew monsters live in your library.' : ''}</p>
      )}

      {tab === 'homebrew' && (
        <div className={s.section}>
          <div className={s.row} style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <span className={s.itemMeta}>Your library monsters</span>
            <button className={s.place} onClick={() => navigate(`/game/${gameId}/customize`)}>Edit in Library</button>
          </div>
          <div className={s.list}>
            {homebrewMonsters.length === 0 && (
              <p className={s.hint}>No library monsters yet. Create them in your Library, then spawn them here like any bestiary creature.</p>
            )}
            {homebrewMonsters.map((hb) => (
              <div key={hb.id} className={s.item}>
                <span className={s.itemMain}>
                  <span className={s.itemName}>{hb.name}</span>
                  <span className={s.itemMeta}>
                    {hb.size} {hb.type} · HP {hb.hp} · AC {hb.ac} · CR {hb.cr}
                    {hb.loot ? ` · ${Object.keys(hb.loot).length} loot` : ''}
                  </span>
                </span>
                <button
                  className={s.place}
                  onClick={() => {
                    const entry = homebrewToBestiaryEntry(hb);
                    placeStatBlock(entry.name, 'creature', entry.stats, entry.id, entry.size);
                  }}
                >
                  Spawn
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'bestiary' && (
        <div className={s.section}>
          {/* Three independent filters, one at a time. Each clears the others when used. */}
          <input
            className={s.input}
            placeholder="Search name…"
            value={nameQuery}
            onChange={(e) => {
              setNameQuery(e.target.value);
              setTypeFilter('');
              setDmgFilter('');
            }}
          />
          <div className={s.row}>
            <select
              className={s.input}
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setNameQuery('');
                setDmgFilter('');
              }}
            >
              <option value="">All types</option>
              {creatureTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              className={s.input}
              value={dmgFilter}
              onChange={(e) => {
                setDmgFilter(e.target.value);
                setNameQuery('');
                setTypeFilter('');
              }}
            >
              <option value="">All damage</option>
              {damageTypes.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className={s.row} style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <span className={s.itemMeta}>
              {filteredBestiary.length} of {system.bestiary.length}
            </span>
            {filterActive && (
              <button className={s.place} onClick={clearFilters}>
                Clear
              </button>
            )}
          </div>

          <div className={s.list}>
            {filteredBestiary.length === 0 && (
              <p className={s.hint}>No creatures match.</p>
            )}
            {filteredBestiary.map((b) => (
            <div key={b.id} className={s.item}>
              <span className={s.itemMain}>
                <span className={s.itemName}>{b.name}</span>
                <span className={s.itemMeta}>
                  {b.category === 'trap'
                    ? `DC ${b.stats.detectionDC ?? '—'}`
                    : b.stats.ac !== undefined
                      ? `HP ${b.stats.hp ?? '—'} · AC ${b.stats.ac}` // 5e creatures have AC, not DR
                      : `HP ${b.stats.hp ?? '—'} · DR ${b.stats.dr ?? '—'}`}
                </span>
              </span>
              <button
                className={s.place}
                onClick={() => placeStatBlock(b.name, b.category as Category, b.stats, b.id, b.size)}
              >
                + Place
              </button>
            </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'mine' && (
        <div className={s.list}>
          {myCreatures.length === 0 && (
            <p className={s.hint}>Nothing saved yet. Build one and tick “Save”.</p>
          )}
          {myCreatures.map((c) => (
            <div key={c.id} className={s.section} style={{ gap: 'var(--space-2)' }}>
              <div className={s.item}>
                <span className={s.itemMain}>
                  <span className={s.itemName}>{c.name}</span>
                  <span className={s.itemMeta}>{c.category}</span>
                </span>
                <button className={s.place} onClick={() => placeStatBlock(c.name, c.category, c.stats, c.id)}>
                  + Place
                </button>
                <button
                  className={s.place}
                  style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}
                  onClick={() => void deleteCreature(uid, c.id)}
                  aria-label={`Delete ${c.name}`}
                >
                  ×
                </button>
              </div>
              <TokenArtUpload
                scope={uid}
                imageUrl={c.imageUrl}
                label="art"
                size={44}
                onChange={(url) => void setSavedCreatureImage(uid, c.id, url)}
                onClear={() => void setSavedCreatureImage(uid, c.id, null)}
              />
            </div>
          ))}
        </div>
      )}

      {tab === 'build' && (
        <div className={s.section}>
          <div className={s.tabs}>
            {(['creature', 'trap'] as const).map((c) => (
              <button
                key={c}
                className={`${s.tab} ${category === c ? s.tabActive : ''}`}
                onClick={() => setCategory(c)}
              >
                {c === 'creature' ? 'Creature' : 'Trap'}
              </button>
            ))}
          </div>

          <input
            className={s.input}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {category === 'creature' ? (
            <div className={s.row}>
              <label className={s.itemMeta}>
                HP
                <input className={s.input} type="number" value={hp} onChange={(e) => setHp(e.target.value)} />
              </label>
              <label className={s.itemMeta}>
                DR
                <input className={s.input} type="number" value={dr} onChange={(e) => setDr(e.target.value)} />
              </label>
              <label className={s.itemMeta}>
                Damage
                <input className={s.input} value={damage} onChange={(e) => setDamage(e.target.value)} />
              </label>
              <label className={s.itemMeta}>
                Init
                <input className={s.input} type="number" value={init} onChange={(e) => setInit(e.target.value)} />
              </label>
            </div>
          ) : (
            <>
              <div className={s.row}>
                <label className={s.itemMeta}>
                  Spot DC
                  <input className={s.input} type="number" value={detectionDC} onChange={(e) => setDetectionDC(e.target.value)} />
                </label>
                <label className={s.itemMeta}>
                  Disarm DC
                  <input className={s.input} type="number" value={disarmDC} onChange={(e) => setDisarmDC(e.target.value)} />
                </label>
              </div>
              <input className={s.input} placeholder="Trigger" value={trigger} onChange={(e) => setTrigger(e.target.value)} />
              <input className={s.input} placeholder="Effect / damage" value={effect} onChange={(e) => setEffect(e.target.value)} />
            </>
          )}

          <label className={s.toggleRow}>
            <span>Save to my creatures</span>
            <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} />
          </label>
          <Button onClick={build} full>
            Place on board
          </Button>
          {category === 'trap' && (
            <p className={s.hint}>Traps are placed hidden — reveal or spring them from the token card.</p>
          )}
        </div>
      )}
    </div>
  );
}
