import { useState } from 'react';
import { saveHomebrewBackground, type HomebrewBackground } from '../../../data/homebrew';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

const label: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 2, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' };

/** GM form to create/edit a homebrew background: two skill proficiencies + a narrative feature. */
export function HomebrewBackgroundForm({
  uid,
  skills,
  existing,
  onClose,
}: {
  uid: string;
  skills: { id: string; name: string }[];
  existing?: HomebrewBackground;
  onClose: () => void;
}) {
  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [skill1, setSkill1] = useState(existing?.skillProficiencies?.[0] ?? skills[0]?.id ?? '');
  const [skill2, setSkill2] = useState(existing?.skillProficiencies?.[1] ?? skills[1]?.id ?? '');
  const [toolLang, setToolLang] = useState(existing?.toolLanguageProficiencies ?? '');
  const [featureName, setFeatureName] = useState(existing?.featureName ?? '');
  const [featureDescription, setFeatureDescription] = useState(existing?.featureDescription ?? '');
  const [busy, setBusy] = useState(false);

  const valid = name.trim() && skill1 && skill2;

  async function save() {
    if (!valid) return;
    setBusy(true);
    const bg: Omit<HomebrewBackground, 'id'> & { id?: string } = {
      ...(existing?.id ? { id: existing.id } : {}),
      name: name.trim(),
      description: description.trim(),
      skillProficiencies: [skill1, skill2],
      toolLanguageProficiencies: toolLang.trim(),
      featureName: featureName.trim(),
      featureDescription: featureDescription.trim(),
    };
    try {
      await saveHomebrewBackground(uid, bg);
      onClose();
    } catch {
      setBusy(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={existing ? `Edit ${existing.name}` : 'New background'}
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
        <textarea className={s.input} placeholder="Description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className={s.row}>
          <label style={label}>Skill proficiency 1
            <select className={s.input} value={skill1} onChange={(e) => setSkill1(e.target.value)}>
              {skills.map((sk) => <option key={sk.id} value={sk.id}>{sk.name}</option>)}
            </select>
          </label>
          <label style={label}>Skill proficiency 2
            <select className={s.input} value={skill2} onChange={(e) => setSkill2(e.target.value)}>
              {skills.map((sk) => <option key={sk.id} value={sk.id}>{sk.name}</option>)}
            </select>
          </label>
        </div>
        <label style={label}>Tool / language proficiencies
          <input className={s.input} value={toolLang} onChange={(e) => setToolLang(e.target.value)} placeholder="e.g. Thieves' tools, one language" />
        </label>
        <input className={s.input} placeholder="Feature name" value={featureName} onChange={(e) => setFeatureName(e.target.value)} />
        <textarea className={s.input} placeholder="Feature description" rows={2} value={featureDescription} onChange={(e) => setFeatureDescription(e.target.value)} />
      </div>
    </Modal>
  );
}
