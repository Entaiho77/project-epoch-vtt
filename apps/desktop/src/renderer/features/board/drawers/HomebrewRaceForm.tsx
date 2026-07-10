import { useState } from 'react';
import {
  saveHomebrewRace,
  type HomebrewRace,
  type HomebrewSize,
  type HomebrewTrait,
} from '../../../data/homebrew';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const SIZES: HomebrewSize[] = ['Small', 'Medium', 'Large'];
const label: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 2, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' };
const check: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 4 };

type BonusRow = { ability: string; amount: string };
type TraitRow = { name: string; description: string };

/** GM form to create/edit a homebrew race: size/speed, up to six ability bonuses, optional
 *  darkvision, and repeatable named traits. */
export function HomebrewRaceForm({
  uid,
  existing,
  onClose,
}: {
  uid: string;
  existing?: HomebrewRace;
  onClose: () => void;
}) {
  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [size, setSize] = useState<HomebrewSize>(existing?.size ?? 'Medium');
  const [speed, setSpeed] = useState(existing?.speed != null ? String(existing.speed) : '30');
  const [bonuses, setBonuses] = useState<BonusRow[]>(
    Object.entries(existing?.abilityBonuses ?? {}).map(([ability, amount]) => ({ ability: ability.toUpperCase(), amount: String(amount) })),
  );
  const [hasDarkvision, setHasDarkvision] = useState(!!existing?.darkvision);
  const [darkvision, setDarkvision] = useState(existing?.darkvision ? String(existing.darkvision) : '60');
  const [traits, setTraits] = useState<TraitRow[]>(
    Object.values(existing?.traits ?? {}).map((t) => ({ name: t.name, description: t.description })),
  );
  const [busy, setBusy] = useState(false);

  const addBonus = () => bonuses.length < 6 && setBonuses([...bonuses, { ability: 'STR', amount: '1' }]);
  const setBonus = (i: number, patch: Partial<BonusRow>) => setBonuses(bonuses.map((b, j) => (j === i ? { ...b, ...patch } : b)));
  const removeBonus = (i: number) => setBonuses(bonuses.filter((_, j) => j !== i));

  const addTrait = () => setTraits([...traits, { name: '', description: '' }]);
  const setTrait = (i: number, patch: Partial<TraitRow>) => setTraits(traits.map((t, j) => (j === i ? { ...t, ...patch } : t)));
  const removeTrait = (i: number) => setTraits(traits.filter((_, j) => j !== i));

  const valid = !!name.trim();

  async function save() {
    if (!valid) return;
    setBusy(true);
    const abilityBonuses: Record<string, number> = {};
    for (const b of bonuses) {
      const amt = Number(b.amount) || 0;
      if (amt !== 0) abilityBonuses[b.ability] = amt;
    }
    const traitMap: Record<string, HomebrewTrait> = {};
    traits
      .filter((t) => t.name.trim())
      .forEach((t, i) => {
        traitMap[`trait-${i}`] = { name: t.name.trim(), description: t.description.trim() };
      });
    const race: Omit<HomebrewRace, 'id'> & { id?: string } = {
      ...(existing?.id ? { id: existing.id } : {}),
      name: name.trim(),
      description: description.trim(),
      size,
      speed: Number(speed) || 0,
      abilityBonuses,
      ...(hasDarkvision ? { darkvision: Number(darkvision) || 0 } : {}),
      traits: traitMap,
    };
    try {
      await saveHomebrewRace(uid, race);
      onClose();
    } catch {
      setBusy(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={existing ? `Edit ${existing.name}` : 'New race'}
      width={560}
      footer={
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => void save()} disabled={!valid || busy}>{busy ? 'Saving…' : 'Save'}</Button>
        </div>
      }
    >
      <div className={s.section}>
        <input className={s.input} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea className={s.input} placeholder="Description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className={s.row}>
          <label style={label}>Size
            <select className={s.input} value={size} onChange={(e) => setSize(e.target.value as HomebrewSize)}>
              {SIZES.map((sz) => <option key={sz} value={sz}>{sz}</option>)}
            </select>
          </label>
          <label style={label}>Speed (ft)
            <input className={s.input} type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} />
          </label>
        </div>

        <div>
          <span className={s.label}>Ability score bonuses</span>
          {bonuses.map((b, i) => (
            <div key={i} className={s.row} style={{ alignItems: 'flex-end' }}>
              <select className={s.input} value={b.ability} onChange={(e) => setBonus(i, { ability: e.target.value })}>
                {ABILITIES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <input className={s.input} type="number" value={b.amount} onChange={(e) => setBonus(i, { amount: e.target.value })} style={{ maxWidth: 80 }} />
              <button className={s.place} onClick={() => removeBonus(i)} aria-label="Remove bonus">×</button>
            </div>
          ))}
          {bonuses.length < 6 && <button className={s.place} onClick={addBonus}>+ Add bonus</button>}
        </div>

        <label className={s.itemMeta} style={check}>
          <input type="checkbox" checked={hasDarkvision} onChange={(e) => setHasDarkvision(e.target.checked)} />
          Darkvision
        </label>
        {hasDarkvision && (
          <label style={label}>Darkvision range (ft)
            <input className={s.input} type="number" value={darkvision} onChange={(e) => setDarkvision(e.target.value)} />
          </label>
        )}

        <div>
          <span className={s.label}>Traits</span>
          {traits.map((t, i) => (
            <div key={i} className={s.section} style={{ gap: 4, marginBottom: 'var(--space-2)' }}>
              <div className={s.row} style={{ alignItems: 'center' }}>
                <input className={s.input} placeholder="Trait name" value={t.name} onChange={(e) => setTrait(i, { name: e.target.value })} />
                <button className={s.place} onClick={() => removeTrait(i)} aria-label="Remove trait">×</button>
              </div>
              <textarea className={s.input} placeholder="Trait description" rows={2} value={t.description} onChange={(e) => setTrait(i, { description: e.target.value })} />
            </div>
          ))}
          <button className={s.place} onClick={addTrait}>+ Add trait</button>
        </div>
      </div>
    </Modal>
  );
}
