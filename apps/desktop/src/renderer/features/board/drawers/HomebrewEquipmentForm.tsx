import { useState } from 'react';
import {
  saveHomebrewEquipment,
  type ArmorType,
  type EquipmentCategory,
  type HomebrewEquipment,
  type WeaponRange,
} from '../../../data/homebrew';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

const CATEGORIES: EquipmentCategory[] = ['weapon', 'armor', 'tool', 'other'];
const DAMAGE_TYPES = [
  'acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'piercing',
  'poison', 'psychic', 'radiant', 'slashing', 'thunder',
];
const WEAPON_PROPERTIES = ['finesse', 'versatile', 'thrown', 'two-handed', 'light', 'heavy', 'loading'];
const ARMOR_TYPES: ArmorType[] = ['light', 'medium', 'heavy', 'shield'];

const label: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 2, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' };
const checkGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '2px 12px' };

/** GM form to create/edit a homebrew equipment item. Weapon/armor fields render only for that
 *  category; on Save, only the relevant fields are persisted (undefineds pruned before write). */
export function HomebrewEquipmentForm({
  uid,
  existing,
  onClose,
}: {
  uid: string;
  existing?: HomebrewEquipment;
  onClose: () => void;
}) {
  const [name, setName] = useState(existing?.name ?? '');
  const [category, setCategory] = useState<EquipmentCategory>(existing?.category ?? 'weapon');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [weight, setWeight] = useState(existing?.weight !== undefined ? String(existing.weight) : '');
  const [value, setValue] = useState(existing?.value ?? '');
  // Weapon
  const [damageDice, setDamageDice] = useState(existing?.damageDice ?? '1d8');
  const [damageType, setDamageType] = useState(existing?.damageType ?? 'slashing');
  const [weaponRange, setWeaponRange] = useState<WeaponRange>(existing?.weaponRange ?? 'melee');
  const [properties, setProperties] = useState<string[]>(existing?.properties ?? []);
  const [versatileDamageDice, setVersatileDamageDice] = useState(existing?.versatileDamageDice ?? '1d10');
  // Armor
  const [armorType, setArmorType] = useState<ArmorType>(existing?.armorType ?? 'light');
  const [baseAc, setBaseAc] = useState(existing?.baseAc !== undefined ? String(existing.baseAc) : '11');
  const [stealthDisadvantage, setStealthDisadvantage] = useState(existing?.stealthDisadvantage ?? false);
  const [busy, setBusy] = useState(false);

  const toggleProp = (p: string) =>
    setProperties(properties.includes(p) ? properties.filter((x) => x !== p) : [...properties, p]);

  async function save() {
    if (!name.trim()) return;
    setBusy(true);
    const equipment: Omit<HomebrewEquipment, 'id'> & { id?: string } = {
      ...(existing?.id ? { id: existing.id } : {}),
      name: name.trim(),
      category,
      description: description.trim(),
      weight: weight.trim() ? Number(weight) || 0 : undefined,
      value: value.trim() || undefined,
      ...(category === 'weapon'
        ? {
            damageDice: damageDice.trim(),
            damageType,
            weaponRange,
            properties: properties.length ? properties : undefined,
            versatileDamageDice: properties.includes('versatile') ? versatileDamageDice.trim() : undefined,
          }
        : {}),
      ...(category === 'armor'
        ? {
            armorType,
            baseAc: Number(baseAc) || 0,
            stealthDisadvantage,
          }
        : {}),
    };
    try {
      await saveHomebrewEquipment(uid, equipment);
      onClose();
    } catch {
      setBusy(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={existing ? `Edit ${existing.name}` : 'New equipment'}
      width={520}
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
          <label style={label}>Category
            <select className={s.input} value={category} onChange={(e) => setCategory(e.target.value as EquipmentCategory)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>)}
            </select>
          </label>
          <label style={label}>Weight (lb)
            <input className={s.input} type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </label>
          <label style={label}>Value
            <input className={s.input} value={value} onChange={(e) => setValue(e.target.value)} placeholder="50 gp" />
          </label>
        </div>
        <textarea className={s.input} placeholder="Description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />

        {category === 'weapon' && (
          <>
            <div className={s.row}>
              <label style={label}>Damage dice
                <input className={s.input} value={damageDice} onChange={(e) => setDamageDice(e.target.value)} placeholder="1d8" />
              </label>
              <label style={label}>Damage type
                <select className={s.input} value={damageType} onChange={(e) => setDamageType(e.target.value)}>
                  {DAMAGE_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>
              <label style={label}>Range
                <select className={s.input} value={weaponRange} onChange={(e) => setWeaponRange(e.target.value as WeaponRange)}>
                  <option value="melee">Melee</option>
                  <option value="ranged">Ranged</option>
                </select>
              </label>
            </div>
            <div>
              <span className={s.label}>Properties</span>
              <div style={checkGrid}>
                {WEAPON_PROPERTIES.map((p) => (
                  <label key={p} className={s.itemMeta} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input type="checkbox" checked={properties.includes(p)} onChange={() => toggleProp(p)} />
                    {p}
                  </label>
                ))}
              </div>
            </div>
            {properties.includes('versatile') && (
              <label style={label}>Versatile damage (two-handed)
                <input className={s.input} value={versatileDamageDice} onChange={(e) => setVersatileDamageDice(e.target.value)} placeholder="1d10" />
              </label>
            )}
          </>
        )}

        {category === 'armor' && (
          <div className={s.row}>
            <label style={label}>Armor type
              <select className={s.input} value={armorType} onChange={(e) => setArmorType(e.target.value as ArmorType)}>
                {ARMOR_TYPES.map((a) => <option key={a} value={a}>{a[0].toUpperCase() + a.slice(1)}</option>)}
              </select>
            </label>
            <label style={label}>Base AC
              <input className={s.input} type="number" value={baseAc} onChange={(e) => setBaseAc(e.target.value)} />
            </label>
            <label className={s.itemMeta} style={{ display: 'flex', alignItems: 'center', gap: 4, alignSelf: 'flex-end' }}>
              <input type="checkbox" checked={stealthDisadvantage} onChange={(e) => setStealthDisadvantage(e.target.checked)} />
              Stealth disadvantage
            </label>
          </div>
        )}
      </div>
    </Modal>
  );
}
