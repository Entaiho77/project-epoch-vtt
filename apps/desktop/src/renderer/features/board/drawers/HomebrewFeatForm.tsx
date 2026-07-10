import { useState } from 'react';
import { saveHomebrewFeat, type HomebrewFeat } from '../../../data/homebrew';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const label: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 2, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' };
const check: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 4 };

/** GM form to create/edit a homebrew feat: optional ability prerequisite, spellcasting requirement,
 *  a fixed ability bonus, and a display-only flag for narrative feats. */
export function HomebrewFeatForm({
  uid,
  existing,
  onClose,
}: {
  uid: string;
  existing?: HomebrewFeat;
  onClose: () => void;
}) {
  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [hasPrereq, setHasPrereq] = useState(!!existing?.prerequisiteAbility);
  const [prereqAbility, setPrereqAbility] = useState(existing?.prerequisiteAbility ?? 'STR');
  const [prereqScore, setPrereqScore] = useState(existing?.prerequisiteScore != null ? String(existing.prerequisiteScore) : '13');
  const [requiresSpellcasting, setRequiresSpellcasting] = useState(existing?.requiresSpellcasting ?? false);
  const existingBonus = Object.entries(existing?.abilityBonus ?? {})[0];
  const [hasBonus, setHasBonus] = useState(!!existingBonus);
  const [bonusAbility, setBonusAbility] = useState((existingBonus?.[0] ?? 'STR').toUpperCase());
  const [bonusAmount, setBonusAmount] = useState(existingBonus ? String(existingBonus[1]) : '1');
  const [displayOnly, setDisplayOnly] = useState(existing?.displayOnly ?? false);
  const [busy, setBusy] = useState(false);

  const valid = !!name.trim();

  async function save() {
    if (!valid) return;
    setBusy(true);
    const feat: Omit<HomebrewFeat, 'id'> & { id?: string } = {
      ...(existing?.id ? { id: existing.id } : {}),
      name: name.trim(),
      description: description.trim(),
      ...(hasPrereq ? { prerequisiteAbility: prereqAbility, prerequisiteScore: Number(prereqScore) || 0 } : {}),
      ...(requiresSpellcasting ? { requiresSpellcasting: true } : {}),
      ...(hasBonus ? { abilityBonus: { [bonusAbility]: Number(bonusAmount) || 0 } } : {}),
      displayOnly,
    };
    try {
      await saveHomebrewFeat(uid, feat);
      onClose();
    } catch {
      setBusy(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={existing ? `Edit ${existing.name}` : 'New feat'}
      width={520}
      footer={
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => void save()} disabled={!valid || busy}>{busy ? 'Saving…' : 'Save'}</Button>
        </div>
      }
    >
      <div className={s.section}>
        <input className={s.input} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea className={s.input} placeholder="Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />

        <label className={s.itemMeta} style={check}>
          <input type="checkbox" checked={hasPrereq} onChange={(e) => setHasPrereq(e.target.checked)} />
          Ability score prerequisite
        </label>
        {hasPrereq && (
          <div className={s.row}>
            <label style={label}>Ability
              <select className={s.input} value={prereqAbility} onChange={(e) => setPrereqAbility(e.target.value)}>
                {ABILITIES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
            <label style={label}>Minimum score
              <input className={s.input} type="number" value={prereqScore} onChange={(e) => setPrereqScore(e.target.value)} />
            </label>
          </div>
        )}

        <label className={s.itemMeta} style={check}>
          <input type="checkbox" checked={requiresSpellcasting} onChange={(e) => setRequiresSpellcasting(e.target.checked)} />
          Requires spellcasting
        </label>

        <label className={s.itemMeta} style={check}>
          <input type="checkbox" checked={hasBonus} onChange={(e) => setHasBonus(e.target.checked)} />
          Ability score bonus
        </label>
        {hasBonus && (
          <div className={s.row}>
            <label style={label}>Ability
              <select className={s.input} value={bonusAbility} onChange={(e) => setBonusAbility(e.target.value)}>
                {ABILITIES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
            <label style={label}>Bonus
              <input className={s.input} type="number" value={bonusAmount} onChange={(e) => setBonusAmount(e.target.value)} />
            </label>
          </div>
        )}

        <label className={s.itemMeta} style={check}>
          <input type="checkbox" checked={displayOnly} onChange={(e) => setDisplayOnly(e.target.checked)} />
          Display only (narrative — no mechanical effect)
        </label>
      </div>
    </Modal>
  );
}
