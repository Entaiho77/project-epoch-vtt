import { useState } from 'react';
import {
  saveHomebrewClass,
  type CasterType,
  type HitDie,
  type HomebrewClass,
  type HomebrewClassFeature,
  type UnarmoredFormula,
} from '../../../data/homebrew';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const CAST_ABILITIES = ['INT', 'WIS', 'CHA'];
const HIT_DICE: HitDie[] = [6, 8, 10, 12];
const ARMORS: { id: string; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'medium', label: 'Medium' },
  { id: 'heavy', label: 'Heavy' },
  { id: 'shields', label: 'Shields' },
];
const label: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 2, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' };
const check: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 4 };
const checkGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '2px 12px' };

type FeatureRow = { level: string; name: string; description: string };

/** GM form to create/edit a homebrew class: hit die, saves, proficiencies, optional spellcasting
 *  and unarmored defense, and level features. Converts to a full 1–20 ClassDefinition on use. */
export function HomebrewClassForm({
  uid,
  skills,
  existing,
  onClose,
}: {
  uid: string;
  skills: { id: string; name: string }[];
  existing?: HomebrewClass;
  onClose: () => void;
}) {
  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [hitDie, setHitDie] = useState<HitDie>(existing?.hitDie ?? 8);
  const [primaryAbility, setPrimaryAbility] = useState(existing?.primaryAbility ?? 'STR');
  const [savingThrows, setSavingThrows] = useState<string[]>(existing?.savingThrows ?? []);
  const [armor, setArmor] = useState<string[]>(existing?.armorProficiencies ?? []);
  const [weaponProficiencies, setWeaponProficiencies] = useState(existing?.weaponProficiencies ?? '');
  const [skillChoiceCount, setSkillChoiceCount] = useState(existing?.skillChoiceCount != null ? String(existing.skillChoiceCount) : '2');
  const [skillChoiceList, setSkillChoiceList] = useState<string[]>(existing?.skillChoiceList ?? []);
  const [hasSpellcasting, setHasSpellcasting] = useState(!!existing?.spellcasting);
  const [spellAbility, setSpellAbility] = useState(existing?.spellcasting?.ability ?? 'INT');
  const [casterType, setCasterType] = useState<CasterType>(existing?.spellcasting?.casterType ?? 'full');
  const [hasUnarmored, setHasUnarmored] = useState(!!existing?.unarmoredDefense);
  const [unarmoredFormula, setUnarmoredFormula] = useState<UnarmoredFormula>(existing?.unarmoredDefense?.formula ?? 'DEX+CON');
  const [subclassLevel, setSubclassLevel] = useState(existing?.subclassLevel != null ? String(existing.subclassLevel) : '3');
  const [startingEquipment, setStartingEquipment] = useState(existing?.startingEquipment ?? '');
  const [features, setFeatures] = useState<FeatureRow[]>(
    Object.values(existing?.features ?? {})
      .sort((a, b) => a.level - b.level)
      .map((f) => ({ level: String(f.level), name: f.name, description: f.description })),
  );
  const [busy, setBusy] = useState(false);

  // Saves: at most two (exactly two required to save).
  const toggleSave = (a: string) =>
    setSavingThrows(
      savingThrows.includes(a)
        ? savingThrows.filter((x) => x !== a)
        : savingThrows.length < 2
          ? [...savingThrows, a]
          : savingThrows,
    );
  const toggleArmor = (a: string) => setArmor(armor.includes(a) ? armor.filter((x) => x !== a) : [...armor, a]);
  const toggleSkill = (id: string) =>
    setSkillChoiceList(skillChoiceList.includes(id) ? skillChoiceList.filter((x) => x !== id) : [...skillChoiceList, id]);

  const addFeature = () => setFeatures([...features, { level: '1', name: '', description: '' }]);
  const setFeature = (i: number, patch: Partial<FeatureRow>) => setFeatures(features.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  const removeFeature = (i: number) => setFeatures(features.filter((_, j) => j !== i));

  const valid = name.trim() && savingThrows.length === 2;

  async function save() {
    if (!valid) return;
    setBusy(true);
    const featureMap: Record<string, HomebrewClassFeature> = {};
    features
      .filter((f) => f.name.trim())
      .forEach((f, i) => {
        featureMap[`f-${i}`] = {
          level: Math.max(1, Math.min(20, Number(f.level) || 1)),
          name: f.name.trim(),
          description: f.description.trim(),
        };
      });
    const cls: Omit<HomebrewClass, 'id'> & { id?: string } = {
      ...(existing?.id ? { id: existing.id } : {}),
      name: name.trim(),
      description: description.trim(),
      hitDie,
      primaryAbility,
      savingThrows,
      armorProficiencies: armor,
      weaponProficiencies: weaponProficiencies.trim(),
      skillChoiceCount: Number(skillChoiceCount) || 0,
      skillChoiceList,
      ...(hasSpellcasting ? { spellcasting: { ability: spellAbility, casterType } } : {}),
      ...(hasUnarmored ? { unarmoredDefense: { formula: unarmoredFormula } } : {}),
      subclassLevel: Number(subclassLevel) || 0,
      startingEquipment: startingEquipment.trim(),
      features: featureMap,
    };
    try {
      await saveHomebrewClass(uid, cls);
      onClose();
    } catch {
      setBusy(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={existing ? `Edit ${existing.name}` : 'New class'}
      width={600}
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
          <label style={label}>Hit die
            <select className={s.input} value={hitDie} onChange={(e) => setHitDie(Number(e.target.value) as HitDie)}>
              {HIT_DICE.map((d) => <option key={d} value={d}>d{d}</option>)}
            </select>
          </label>
          <label style={label}>Primary ability
            <select className={s.input} value={primaryAbility} onChange={(e) => setPrimaryAbility(e.target.value)}>
              {ABILITIES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </label>
          <label style={label}>Subclass level
            <input className={s.input} type="number" min={1} max={20} value={subclassLevel} onChange={(e) => setSubclassLevel(e.target.value)} />
          </label>
        </div>

        <div>
          <span className={s.label}>Saving throws (choose 2) — {savingThrows.length}/2</span>
          <div style={checkGrid}>
            {ABILITIES.map((a) => (
              <label key={a} className={s.itemMeta} style={check}>
                <input
                  type="checkbox"
                  checked={savingThrows.includes(a)}
                  disabled={!savingThrows.includes(a) && savingThrows.length >= 2}
                  onChange={() => toggleSave(a)}
                />
                {a}
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className={s.label}>Armor proficiencies</span>
          <div style={checkGrid}>
            {ARMORS.map((a) => (
              <label key={a.id} className={s.itemMeta} style={check}>
                <input type="checkbox" checked={armor.includes(a.id)} onChange={() => toggleArmor(a.id)} />
                {a.label}
              </label>
            ))}
          </div>
        </div>

        <label style={label}>Weapon proficiencies
          <input className={s.input} value={weaponProficiencies} onChange={(e) => setWeaponProficiencies(e.target.value)} placeholder="e.g. Simple weapons, martial weapons" />
        </label>

        <div>
          <label style={label}>Skill choices
            <input className={s.input} type="number" min={0} value={skillChoiceCount} onChange={(e) => setSkillChoiceCount(e.target.value)} style={{ maxWidth: 80 }} />
          </label>
          <span className={s.label}>Available skills</span>
          <div style={checkGrid}>
            {skills.map((sk) => (
              <label key={sk.id} className={s.itemMeta} style={check}>
                <input type="checkbox" checked={skillChoiceList.includes(sk.id)} onChange={() => toggleSkill(sk.id)} />
                {sk.name}
              </label>
            ))}
          </div>
        </div>

        <label className={s.itemMeta} style={check}>
          <input type="checkbox" checked={hasSpellcasting} onChange={(e) => setHasSpellcasting(e.target.checked)} />
          Spellcasting
        </label>
        {hasSpellcasting && (
          <div className={s.row}>
            <label style={label}>Spellcasting ability
              <select className={s.input} value={spellAbility} onChange={(e) => setSpellAbility(e.target.value)}>
                {CAST_ABILITIES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
            <label style={label}>Caster type
              <select className={s.input} value={casterType} onChange={(e) => setCasterType(e.target.value as CasterType)}>
                <option value="full">Full</option>
                <option value="half">Half</option>
                <option value="third">Third</option>
              </select>
            </label>
          </div>
        )}

        <label className={s.itemMeta} style={check}>
          <input type="checkbox" checked={hasUnarmored} onChange={(e) => setHasUnarmored(e.target.checked)} />
          Unarmored defense
        </label>
        {hasUnarmored && (
          <label style={label}>Formula
            <select className={s.input} value={unarmoredFormula} onChange={(e) => setUnarmoredFormula(e.target.value as UnarmoredFormula)}>
              <option value="DEX+CON">10 + DEX + CON (Barbarian)</option>
              <option value="DEX+WIS">10 + DEX + WIS (Monk)</option>
            </select>
          </label>
        )}

        <label style={label}>Starting equipment
          <textarea className={s.input} rows={2} value={startingEquipment} onChange={(e) => setStartingEquipment(e.target.value)} placeholder="e.g. A martial weapon, a shield, an explorer's pack" />
        </label>

        <div>
          <span className={s.label}>Level features</span>
          {features.map((f, i) => (
            <div key={i} className={s.section} style={{ gap: 4, marginBottom: 'var(--space-2)' }}>
              <div className={s.row} style={{ alignItems: 'center' }}>
                <label style={{ ...label, maxWidth: 70 }}>Level
                  <input className={s.input} type="number" min={1} max={20} value={f.level} onChange={(e) => setFeature(i, { level: e.target.value })} />
                </label>
                <input className={s.input} placeholder="Feature name" value={f.name} onChange={(e) => setFeature(i, { name: e.target.value })} />
                <button className={s.place} onClick={() => removeFeature(i)} aria-label="Remove feature">×</button>
              </div>
              <textarea className={s.input} placeholder="Feature description" rows={2} value={f.description} onChange={(e) => setFeature(i, { description: e.target.value })} />
            </div>
          ))}
          <button className={s.place} onClick={addFeature}>+ Add feature</button>
        </div>
      </div>
    </Modal>
  );
}
