import { useMemo, useState } from 'react';
import type { AttackEntry, BestiaryEntry } from '@epoch/shared-types';
import {
  convertDnd5eToSolryn,
  type Dnd5eStatblockInput,
  type SolrynConvertedAttack,
} from '@epoch/systems/solryn/convertFrom5e';
import { crToNumber, saveHomebrewSolrynMonster, type HomebrewMonster } from '../../data/homebrew';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import d from '../board/drawers/drawers.module.css';

/** A pickable 5e source creature — either the SRD bestiary or the GM's own 5e homebrew. */
interface Source {
  key: string;
  name: string;
  toInput: () => Dnd5eStatblockInput;
}

function num(v: unknown, fallback = 10): number {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** Builds the converter's input from an SRD/built-in BestiaryEntry's free-form stats bag. */
function srdToInput(entry: BestiaryEntry): Dnd5eStatblockInput {
  const st = entry.stats;
  return {
    cr: num(st.cr, 0),
    str: num(st.str),
    dex: num(st.dex),
    con: num(st.con),
    int: num(st.int),
    wis: num(st.wis),
    cha: num(st.cha),
    attacks: (entry.attacks ?? []).map((a: AttackEntry) => ({
      name: a.name,
      diceExpr: a.diceExpr,
      damageType: a.damageType,
      note: a.note,
    })),
    hasSpells: (entry.abilities ?? []).some((a) => /spellcasting/i.test(a)),
  };
}

/** Builds the converter's input from a GM's own 5e homebrew monster. */
function homebrewToInput(hb: HomebrewMonster): Dnd5eStatblockInput {
  return {
    cr: crToNumber(hb.cr),
    str: hb.str,
    dex: hb.dex,
    con: hb.con,
    int: hb.int,
    wis: hb.wis,
    cha: hb.cha,
    attacks: Object.values(hb.attacks ?? {}).map((a) => ({
      name: a.name,
      diceExpr: a.damageDice,
      damageType: a.damageType,
    })),
    hasSpells: Object.values(hb.actions ?? {}).some((a) => /spellcasting/i.test(a.name + a.description)),
  };
}

/**
 * GM flow: pick a 5e creature already in the app (SRD bestiary or own 5e homebrew), preview the
 * Solryn conversion (backlog item 6's math — packages/systems/src/solryn/convertFrom5e.ts), tweak
 * the result, then save it as a new Solryn homebrew creature (users/$uid/library/solrynMonsters).
 * Lives in the account-wide Library, not inside a game, because a game is locked to one system —
 * a GM running a Solryn game can't otherwise see their 5e content at all.
 */
export function ConvertToSolrynModal({
  uid,
  srdBestiary,
  homebrewMonsters,
  onClose,
}: {
  uid: string;
  srdBestiary: BestiaryEntry[];
  homebrewMonsters: HomebrewMonster[];
  onClose: () => void;
}) {
  const sources: Source[] = useMemo(
    () => [
      ...srdBestiary.map((e) => ({ key: `srd:${e.id}`, name: e.name, toInput: () => srdToInput(e) })),
      ...homebrewMonsters.map((h) => ({ key: `hb:${h.id}`, name: `${h.name} (homebrew)`, toInput: () => homebrewToInput(h) })),
    ],
    [srdBestiary, homebrewMonsters],
  );

  const [sourceKey, setSourceKey] = useState('');
  const [name, setName] = useState('');
  const [hp, setHp] = useState('');
  const [dr, setDr] = useState('');
  const [speed, setSpeed] = useState('30 ft.');
  const [attacks, setAttacks] = useState<SolrynConvertedAttack[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [tr, setTr] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  function pick(key: string) {
    setSourceKey(key);
    const source = sources.find((s) => s.key === key);
    if (!source) return;
    const result = convertDnd5eToSolryn(source.toInput());
    setName(source.name.replace(/\s*\(homebrew\)$/, ''));
    setHp(String(result.hp));
    setDr(String(result.dr));
    setSpeed('30 ft.'); // the spec has no speed-conversion step — flagged below, GM sets it
    setAttacks(result.attacks);
    setNotes([...result.notes, "Speed isn't part of the conversion spec — set it by hand."]);
    setTr(result.tr);
  }

  function updateAttack(i: number, patch: Partial<SolrynConvertedAttack>) {
    setAttacks((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  async function save() {
    if (!name.trim() || tr === null) return;
    setBusy(true);
    const entry: Omit<BestiaryEntry, 'id'> = {
      name: name.trim(),
      category: 'creature',
      stats: {
        hp: num(hp, 0),
        dr: num(dr, 0),
        speed,
        damage: attacks[0]?.diceExpr ?? '—',
        initiativeMod: 0,
        type: `Converted from 5e (TR ${tr})`,
        soulCore: 'none',
      },
      ...(attacks.length ? { attacks: attacks.map(({ name: n, diceExpr, damageType, note }) => ({ name: n, diceExpr, damageType, note })) } : {}),
      ...(notes.length ? { abilities: notes.map((n) => `Conversion note: ${n}`) } : {}),
    };
    await saveHomebrewSolrynMonster(uid, entry);
    setBusy(false);
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Convert a 5e monster to Solryn"
      width={560}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={busy || !sourceKey || !name.trim()}>
            {busy ? 'Saving…' : 'Save to Solryn library'}
          </Button>
        </>
      }
    >
      <div className={d.section}>
        <span className={d.label}>Source (5e bestiary or your own 5e homebrew)</span>
        <select className={d.select} value={sourceKey} onChange={(e) => pick(e.target.value)}>
          <option value="">— pick a creature —</option>
          {sources.map((s) => (
            <option key={s.key} value={s.key}>{s.name}</option>
          ))}
        </select>
      </div>

      {sourceKey && tr !== null && (
        <>
          <div className={d.section}>
            <span className={d.label}>Converted stats (TR {tr}) — edit before saving</span>
            <input className={d.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <div style={{ display: 'flex', gap: 8 }}>
              <input className={d.input} value={hp} onChange={(e) => setHp(e.target.value)} placeholder="HP" />
              <input className={d.input} value={dr} onChange={(e) => setDr(e.target.value)} placeholder="DR" />
              <input className={d.input} value={speed} onChange={(e) => setSpeed(e.target.value)} placeholder="Speed" />
            </div>
          </div>

          {attacks.length > 0 && (
            <div className={d.section}>
              <span className={d.label}>Attacks</span>
              {attacks.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <input className={d.input} value={a.name} onChange={(e) => updateAttack(i, { name: e.target.value })} placeholder="Name" />
                  <input className={d.input} value={a.diceExpr} onChange={(e) => updateAttack(i, { diceExpr: e.target.value })} placeholder="Dice" />
                  <input className={d.input} value={a.damageType} onChange={(e) => updateAttack(i, { damageType: e.target.value })} placeholder="Type" />
                </div>
              ))}
            </div>
          )}

          {notes.length > 0 && (
            <div className={d.section}>
              <span className={d.label}>Notes</span>
              {notes.map((n, i) => (
                <p key={i} className={d.hint}>{n}</p>
              ))}
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
