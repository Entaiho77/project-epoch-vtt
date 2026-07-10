import { useState } from 'react';
import {
  saveHomebrewMonster,
  type HomebrewAttack,
  type HomebrewEquipment,
  type HomebrewFeature,
  type HomebrewMonster,
  type HomebrewSize,
} from '../../../data/homebrew';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

const SIZES: HomebrewSize[] = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
const TYPES = [
  'beast', 'undead', 'humanoid', 'dragon', 'fiend', 'celestial', 'construct', 'elemental',
  'fey', 'giant', 'monstrosity', 'ooze', 'plant', 'swarm', 'aberration',
];
const DAMAGE_TYPES = [
  'acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'piercing',
  'poison', 'psychic', 'radiant', 'slashing', 'thunder',
];
const CONDITIONS = [
  'blinded', 'charmed', 'deafened', 'exhaustion', 'frightened', 'grappled', 'incapacitated',
  'invisible', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained', 'stunned', 'unconscious',
];
const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

/** Object-keyed map (never an array) from a row list, dropping rows without a name. */
function toMap<T extends { name: string }>(rows: T[]): Record<string, T> {
  return Object.fromEntries(
    rows.filter((r) => r.name.trim()).map((r, i) => [`e${i}`, r]),
  );
}

const label: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 2, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' };
const checkGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '2px 12px' };

/**
 * DM form to create/edit a library monster. Repeatable sections (attacks, traits, actions,
 * legendary actions) are edited as rows and stored as object-keyed maps. On Save, writes to
 * users/$uid/library/monsters (owner-only per the security rules).
 */
export function HomebrewMonsterForm({
  uid,
  existing,
  equipment,
  onClose,
}: {
  uid: string;
  existing?: HomebrewMonster;
  /** The DM's library equipment, selectable as loot on this monster. */
  equipment: HomebrewEquipment[];
  onClose: () => void;
}) {
  const [name, setName] = useState(existing?.name ?? '');
  const [size, setSize] = useState<HomebrewSize>(existing?.size ?? 'Medium');
  const [type, setType] = useState(existing?.type ?? 'humanoid');
  const [alignment, setAlignment] = useState(existing?.alignment ?? 'unaligned');
  const [hp, setHp] = useState(String(existing?.hp ?? 10));
  const [ac, setAc] = useState(String(existing?.ac ?? 12));
  const [speed, setSpeed] = useState(String(existing?.speed ?? 30));
  const [cr, setCr] = useState(existing?.cr ?? '1');
  const [scores, setScores] = useState<Record<string, string>>(() =>
    Object.fromEntries(ABILITIES.map((a) => [a, String(existing?.[a] ?? 10)])),
  );
  const [resistances, setResistances] = useState<string[]>(existing?.damageResistances ?? []);
  const [immunities, setImmunities] = useState<string[]>(existing?.damageImmunities ?? []);
  const [vulnerabilities, setVulnerabilities] = useState<string[]>(existing?.damageVulnerabilities ?? []);
  const [conditionImmunities, setConditionImmunities] = useState<string[]>(existing?.conditionImmunities ?? []);
  const [attacks, setAttacks] = useState<HomebrewAttack[]>(Object.values(existing?.attacks ?? {}));
  const [traits, setTraits] = useState<HomebrewFeature[]>(Object.values(existing?.traits ?? {}));
  const [actions, setActions] = useState<HomebrewFeature[]>(Object.values(existing?.actions ?? {}));
  const [legendary, setLegendary] = useState<HomebrewFeature[]>(Object.values(existing?.legendaryActions ?? {}));
  const [loot, setLoot] = useState<string[]>(Object.keys(existing?.loot ?? {}));
  // Case-insensitive filter for the loot equipment list (helpful once a DM has many items).
  const [lootSearch, setLootSearch] = useState('');
  const [busy, setBusy] = useState(false);

  const toggle = (list: string[], set: (v: string[]) => void, val: string) =>
    set(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);

  async function save() {
    if (!name.trim()) return;
    setBusy(true);
    const monster: Omit<HomebrewMonster, 'id'> & { id?: string } = {
      ...(existing?.id ? { id: existing.id } : {}),
      name: name.trim(),
      size,
      type,
      alignment: alignment.trim(),
      hp: Number(hp) || 0,
      ac: Number(ac) || 0,
      speed: Number(speed) || 0,
      cr: cr.trim() || '0',
      str: Number(scores.str) || 10,
      dex: Number(scores.dex) || 10,
      con: Number(scores.con) || 10,
      int: Number(scores.int) || 10,
      wis: Number(scores.wis) || 10,
      cha: Number(scores.cha) || 10,
      damageResistances: resistances,
      damageImmunities: immunities,
      damageVulnerabilities: vulnerabilities,
      conditionImmunities,
      attacks: toMap(attacks),
      traits: toMap(traits),
      actions: toMap(actions),
      legendaryActions: toMap(legendary),
      ...(loot.length ? { loot: Object.fromEntries(loot.map((id) => [id, true as const])) } : {}),
    };
    try {
      await saveHomebrewMonster(uid, monster);
      onClose();
    } catch {
      setBusy(false);
    }
  }

  const checkboxGroup = (title: string, options: string[], selected: string[], set: (v: string[]) => void) => (
    <div>
      <span className={s.label}>{title}</span>
      <div style={checkGrid}>
        {options.map((opt) => (
          <label key={opt} className={s.itemMeta} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(selected, set, opt)} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );

  const attackRows = (
    <div>
      <span className={s.label}>Attacks</span>
      {attacks.map((a, i) => (
        <div key={i} className={s.row} style={{ alignItems: 'center', gap: 4 }}>
          <input className={s.input} placeholder="Name" value={a.name} style={{ flex: 2 }}
            onChange={(e) => setAttacks(attacks.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
          <input className={s.input} type="number" placeholder="+hit" value={a.toHit} style={{ width: 60 }}
            onChange={(e) => setAttacks(attacks.map((x, j) => (j === i ? { ...x, toHit: Number(e.target.value) || 0 } : x)))} />
          <input className={s.input} placeholder="2d6+4" value={a.damageDice} style={{ width: 80 }}
            onChange={(e) => setAttacks(attacks.map((x, j) => (j === i ? { ...x, damageDice: e.target.value } : x)))} />
          <input className={s.input} placeholder="type" value={a.damageType} style={{ width: 90 }}
            onChange={(e) => setAttacks(attacks.map((x, j) => (j === i ? { ...x, damageType: e.target.value } : x)))} />
          <button className={s.place} onClick={() => setAttacks(attacks.filter((_, j) => j !== i))} aria-label="Remove attack">×</button>
        </div>
      ))}
      <button className={s.place} onClick={() => setAttacks([...attacks, { name: '', toHit: 0, damageDice: '1d6', damageType: 'bludgeoning' }])}>
        + Add attack
      </button>
    </div>
  );

  const featureRows = (title: string, rows: HomebrewFeature[], set: (v: HomebrewFeature[]) => void) => (
    <div>
      <span className={s.label}>{title}</span>
      {rows.map((r, i) => (
        <div key={i} className={s.section} style={{ gap: 4, marginBottom: 6 }}>
          <div className={s.row} style={{ alignItems: 'center', gap: 4 }}>
            <input className={s.input} placeholder="Name" value={r.name} style={{ flex: 1 }}
              onChange={(e) => set(rows.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
            <button className={s.place} onClick={() => set(rows.filter((_, j) => j !== i))} aria-label={`Remove ${title}`}>×</button>
          </div>
          <textarea className={s.input} placeholder="Description" value={r.description} rows={2}
            onChange={(e) => set(rows.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} />
        </div>
      ))}
      <button className={s.place} onClick={() => set([...rows, { name: '', description: '' }])}>+ Add {title.toLowerCase()}</button>
    </div>
  );

  const lootQuery = lootSearch.trim().toLowerCase();
  const filteredEquipment = lootQuery
    ? equipment.filter((eq) => eq.name.toLowerCase().includes(lootQuery))
    : equipment;

  return (
    <Modal
      open
      onClose={onClose}
      title={existing ? `Edit ${existing.name}` : 'New Homebrew Monster'}
      width={560}
      footer={
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => void save()} disabled={!name.trim() || busy}>{busy ? 'Saving…' : 'Save'}</Button>
        </div>
      }
    >
      <div className={s.section}>
        <input className={s.input} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className={s.row}>
          <label style={label}>Size
            <select className={s.input} value={size} onChange={(e) => setSize(e.target.value as HomebrewSize)}>
              {SIZES.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </label>
          <label style={label}>Type
            <select className={s.input} value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </label>
        </div>
        <label style={label}>Alignment
          <input className={s.input} value={alignment} onChange={(e) => setAlignment(e.target.value)} />
        </label>

        <div className={s.row}>
          <label style={label}>HP<input className={s.input} type="number" value={hp} onChange={(e) => setHp(e.target.value)} /></label>
          <label style={label}>AC<input className={s.input} type="number" value={ac} onChange={(e) => setAc(e.target.value)} /></label>
          <label style={label}>Speed<input className={s.input} type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} /></label>
          <label style={label}>CR<input className={s.input} value={cr} onChange={(e) => setCr(e.target.value)} placeholder="1/4" /></label>
        </div>

        <div>
          <span className={s.label}>Ability scores</span>
          <div className={s.row}>
            {ABILITIES.map((a) => (
              <label key={a} style={label}>{a.toUpperCase()}
                <input className={s.input} type="number" style={{ width: 56 }} value={scores[a]}
                  onChange={(e) => setScores({ ...scores, [a]: e.target.value })} />
              </label>
            ))}
          </div>
        </div>

        {checkboxGroup('Damage resistances', DAMAGE_TYPES, resistances, setResistances)}
        {checkboxGroup('Damage immunities', DAMAGE_TYPES, immunities, setImmunities)}
        {checkboxGroup('Damage vulnerabilities', DAMAGE_TYPES, vulnerabilities, setVulnerabilities)}
        {checkboxGroup('Condition immunities', CONDITIONS, conditionImmunities, setConditionImmunities)}

        {attackRows}
        {featureRows('Traits', traits, setTraits)}
        {featureRows('Actions', actions, setActions)}
        {featureRows('Legendary Actions', legendary, setLegendary)}

        <div>
          <span className={s.label}>Loot</span>
          {equipment.length === 0 ? (
            <p className={s.hint}>No homebrew equipment yet. Create items in the Equipment tab, then attach them here.</p>
          ) : (
            <>
              <input
                className={s.input}
                placeholder="Search equipment..."
                value={lootSearch}
                onChange={(e) => setLootSearch(e.target.value)}
              />
              {filteredEquipment.length === 0 ? (
                <p className={s.hint}>No equipment matches your search.</p>
              ) : (
                <div style={checkGrid}>
                  {filteredEquipment.map((eq) => (
                    <label key={eq.id} className={s.itemMeta} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input type="checkbox" checked={loot.includes(eq.id)} onChange={() => toggle(loot, setLoot, eq.id)} />
                      {eq.name}
                    </label>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
