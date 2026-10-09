import { useMemo, useState } from 'react';
import type { BestiaryEntry, Character, Combatant, MapDef, Token } from '@epoch/shared-types';
import { dnd5eSystem } from '@epoch/systems/dnd5e/index';
import { solrynSystem } from '@epoch/systems/solryn';
import { convertDnd5eToSolryn, type Dnd5eStatblockInput } from '@epoch/systems/solryn/convertFrom5e';
import {
  generateEncounter,
  type EncounterDifficulty,
  type EncounterPoolEntry,
  type GeneratedEncounter,
} from '@epoch/systems/dnd5e/encounterBudget';
import { addToken } from '../../../data/board';
import { creatureCombatant, groupRoll, joinCombat } from '../../../data/combat';
import { firstFreeCell, gridDimensions, sizeToSquares, takenSquares } from '../boardGeometry';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

const CREATURE_COLOR = '#b05a5a';
const DIFFICULTIES: EncounterDifficulty[] = ['easy', 'medium', 'hard', 'deadly'];

/** The SRD bestiary tags a creature's type with a plain standard category ("Beast",
 *  "Humanoid"). The comingled Volume One creatures carry a richer, compound description
 *  ("Magical Beast (Omen Hound, Shadowbound)") in the same field, for flavor/display. Strip
 *  the parenthetical flavor text so both sources bucket into the same filter dimension —
 *  "Magical Beast (Omen Hound, Shadowbound)" -> "Magical Beast". A plain SRD type passes
 *  through unchanged (it has no parenthetical to strip). */
function broadType(type: string): string {
  return type.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

/** This drawer always pulls its creature pool from the 5e bestiary (SRD + comingled Volume
 *  One creatures) regardless of which system the current game is — deliberate, per Matthew's
 *  call: the generator lives in any game's GM toolbar rather than the system-locked Library,
 *  since budgeting against 5e's CR/XP tables is the one piece of math this needs either way.
 *  A Solryn game's own party levels still drive the budget (encounterBudget.ts works off plain
 *  character level for both systems — no CR/TR reversal needed), and each generated member is
 *  placed using its *native* Solryn stats when one exists (a comingled creature), falling back
 *  to convertDnd5eToSolryn() only for a 5e-only SRD creature with no Solryn-side entry. */
export function RandomEncounterDrawer({
  systemId,
  gameId,
  activeMap,
  tokens,
  gameCharacters,
  groupInitiative,
  initiativeOrder,
}: {
  systemId: string;
  gameId: string;
  activeMap?: MapDef;
  tokens: Token[];
  gameCharacters: Character[];
  groupInitiative?: boolean;
  initiativeOrder?: Combatant[];
}) {
  const isSolryn = systemId === 'solryn';

  const creatureTypes = useMemo(() => {
    const types = new Set<string>();
    for (const b of dnd5eSystem.bestiary) {
      const t = b.stats?.type;
      if (typeof t === 'string' && t) types.add(broadType(t));
    }
    return [...types].sort();
  }, []);

  const [primaryType, setPrimaryType] = useState('');
  const [secondaryType, setSecondaryType] = useState('');
  const [difficulty, setDifficulty] = useState<EncounterDifficulty>('medium');
  const [includeMiniboss, setIncludeMiniboss] = useState(false);
  const [result, setResult] = useState<GeneratedEncounter | null>(null);
  const [placing, setPlacing] = useState(false);

  const partyLevels = gameCharacters.map((c) => c.play.level).filter((lvl) => Number.isFinite(lvl));

  function entryToPool(entry: BestiaryEntry): EncounterPoolEntry {
    const cr = Number(entry.stats?.cr);
    const xp = Number(entry.stats?.xp);
    return {
      id: entry.id,
      name: entry.name,
      cr: Number.isFinite(cr) ? cr : 0,
      type: typeof entry.stats?.type === 'string' ? broadType(entry.stats.type) : undefined,
      // Comingled creatures carry their own authored XP reward and no real 5e CR — pass it
      // through directly so they don't silently score 0 and get skipped.
      ...(Number.isFinite(xp) ? { xp } : {}),
    };
  }

  function generate() {
    if (!primaryType) return;
    const selectedTypes = secondaryType ? [primaryType, secondaryType] : [primaryType];
    const pool = dnd5eSystem.bestiary
      .filter((b) => typeof b.stats?.type === 'string' && selectedTypes.includes(broadType(b.stats.type)))
      .map(entryToPool);
    const generated = generateEncounter(pool, partyLevels.length ? partyLevels : [1], difficulty, {
      includeMiniboss,
      ...(secondaryType ? { primaryType } : {}),
    });
    setResult(generated);
  }

  /** Builds this member's placeable stats for the current game's system, preferring a
   *  comingled creature's own native Solryn stats over running the generic converter. */
  function statsFor(memberId: string): { stats: Record<string, number | string>; size?: string } {
    const srdEntry = dnd5eSystem.bestiary.find((b) => b.id === memberId);
    if (!isSolryn) {
      return { stats: srdEntry?.stats ?? {}, size: srdEntry?.size };
    }
    const nativeSolryn = solrynSystem.bestiary.find((b) => b.id === memberId && b.abilityScoresSolryn);
    if (nativeSolryn) {
      return { stats: nativeSolryn.stats, size: nativeSolryn.size };
    }
    // No native Solryn stats (a 5e-only SRD creature) — run it through the item 6 converter.
    const st = srdEntry?.stats ?? {};
    const num = (v: unknown, fallback = 10) => {
      const n = typeof v === 'number' ? v : Number(v);
      return Number.isFinite(n) ? n : fallback;
    };
    const input: Dnd5eStatblockInput = {
      cr: num(st.cr, 0),
      str: num(st.str),
      dex: num(st.dex),
      con: num(st.con),
      int: num(st.int),
      wis: num(st.wis),
      cha: num(st.cha),
      attacks: (srdEntry?.attacks ?? []).map((a) => ({
        name: a.name,
        diceExpr: a.diceExpr,
        damageType: a.damageType,
        note: a.note,
      })),
      hasSpells: (srdEntry?.abilities ?? []).some((a) => /spellcasting/i.test(a)),
    };
    const converted = convertDnd5eToSolryn(input);
    return {
      stats: {
        hp: converted.hp,
        dr: converted.dr,
        speed: '30 ft.',
        damage: converted.attacks[0]?.diceExpr ?? '—',
        initiativeMod: 0,
        type: `Converted from 5e (TR ${converted.tr})`,
        soulCore: 'none',
      },
    };
  }

  async function placeAll() {
    if (!result || !activeMap) return;
    setPlacing(true);
    const grid = gridDimensions(activeMap.width, activeMap.height, activeMap.gridSize);
    const center = { col: Math.floor(grid.cols / 2), row: Math.floor(grid.rows / 2) };
    const occupied = takenSquares(tokens, activeMap.id);

    for (const member of result.members) {
      const { stats, size } = statsFor(member.id);
      const squares = sizeToSquares(size);
      const hpVal = Number(stats.hp);

      for (let i = 0; i < member.count; i++) {
        const cell = firstFreeCell(occupied, center.col, center.row, grid.cols, grid.rows, squares);
        for (let dc = 0; dc < squares; dc++) for (let dr = 0; dr < squares; dr++) {
          occupied.add(`${cell.col + dc},${cell.row + dr}`);
        }
        const token: Omit<Token, 'id'> = {
          kind: 'creature',
          name: member.name,
          color: CREATURE_COLOR,
          visible: false, // arrives hidden, same as every other creature-placement path
          mapId: activeMap.id,
          col: cell.col,
          row: cell.row,
          stats,
          ...(squares > 1 ? { size: squares } : {}),
          ...(Number.isFinite(hpVal) && hpVal > 0 ? { hp: { current: hpVal, max: hpVal } } : {}),
        };
        const id = await addToken(gameId, token);
        const shared = groupInitiative ? groupRoll(initiativeOrder ?? [], member.name) : undefined;
        await joinCombat(gameId, creatureCombatant({ id, name: member.name, stats }, shared));
      }
    }
    setPlacing(false);
    setResult(null);
  }

  return (
    <div className={s.section}>
      <p className={s.hint}>
        Builds a balanced encounter against your party's XP budget from the 5e creature list —
        works the same for a Solryn game (your party's levels still drive the budget; each
        creature is placed with its own Solryn stats, or converted on the fly if it has none).
      </p>

      <div className={s.row}>
        <select className={s.input} value={primaryType} onChange={(e) => setPrimaryType(e.target.value)}>
          <option value="">Pick a creature type…</option>
          {creatureTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select className={s.input} value={secondaryType} onChange={(e) => setSecondaryType(e.target.value)}>
          <option value="">(no second type)</option>
          {creatureTypes.filter((t) => t !== primaryType).map((t) => (
            <option key={t} value={t}>+ {t}</option>
          ))}
        </select>
      </div>

      <div className={s.row}>
        <select className={s.input} value={difficulty} onChange={(e) => setDifficulty(e.target.value as EncounterDifficulty)}>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>{d[0].toUpperCase() + d.slice(1)}</option>
          ))}
        </select>
        <label className={s.toggleRow} style={{ flex: 1 }}>
          <span>Include a leader/miniboss</span>
          <input type="checkbox" checked={includeMiniboss} onChange={(e) => setIncludeMiniboss(e.target.checked)} />
        </label>
      </div>

      <p className={s.itemMeta}>
        Party: {partyLevels.length ? partyLevels.map((l) => `Lv${l}`).join(', ') : 'no characters in this game yet (using Lv1)'}
      </p>

      <Button onClick={generate} disabled={!primaryType} full>
        Generate
      </Button>

      {result && (
        <div className={s.section} style={{ marginTop: 'var(--space-2)' }}>
          {!result.underBudget && (
            <p className={s.hint} style={{ color: 'var(--accent-red)' }}>
              Nothing in this pool fit the party's budget — showing the cheapest option instead.
            </p>
          )}
          <div className={s.list}>
            {result.members.length === 0 && <p className={s.hint}>No creatures of that type in the bestiary.</p>}
            {result.members.map((m) => (
              <div key={`${m.id}-${m.role}`} className={s.item}>
                <span className={s.itemMain}>
                  <span className={s.itemName}>{m.count}× {m.name}</span>
                  <span className={s.itemMeta}>{m.role}{m.cr ? ` · CR ${m.cr}` : ''}</span>
                </span>
              </div>
            ))}
          </div>
          <p className={s.itemMeta}>
            {result.adjustedXp} / {result.budget} XP budget
          </p>
          <Button onClick={() => void placeAll()} disabled={placing || !activeMap || result.members.length === 0} full>
            {placing ? 'Placing…' : !activeMap ? 'Add a map to place' : 'Place on board'}
          </Button>
        </div>
      )}
    </div>
  );
}
