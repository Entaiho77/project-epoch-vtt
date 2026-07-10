import { useEffect, useState } from 'react';
import {
  saveRules,
  useRules,
  type CampaignRules,
  type CritFormula,
  type HouseRule,
  type StartingHp,
} from '../../data/homebrew';
import { evalFormula } from '@solryn/engine';
import d from '../board/drawers/drawers.module.css';
import s from './CustomizePage.module.css';

const CRIT_FORMULAS: { id: CritFormula; label: string; desc: string }[] = [
  { id: 'double_dice', label: 'Double Dice', desc: 'Roll damage dice twice, keep modifier once (1d6+2 → 2d6+2)' },
  { id: 'max_plus_roll', label: 'Max Die + Roll', desc: 'Take max on one die, roll the other (1d6+2 → 6+1d6+2)' },
  { id: 'roll_then_double', label: 'Roll Then Double', desc: 'Roll normally then double the total (1d6+2 → (1d6+2)×2)' },
  { id: 'max_then_double', label: 'Max Then Double', desc: 'Max all dice then double (1d6+2 → (6+2)×2)' },
  { id: 'custom', label: 'Custom Formula', desc: 'Write your own expression over the variables below' },
];
const STARTING_HP: { id: StartingHp; label: string }[] = [
  { id: 'max', label: 'Max' },
  { id: 'average', label: 'Average' },
  { id: 'rolled', label: 'Rolled' },
];

// Ready-made custom formulas shown in the "How do I write a formula?" helper. Clicking one fills
// the input (and the live preview updates immediately) so the DM has a starting point.
const CUSTOM_EXAMPLES: { formula: string; desc: string }[] = [
  { formula: '(MAX_DICE + MOD) * 2', desc: 'Max all dice, then double everything' },
  { formula: '(ROLL_DICE + MOD) * 2', desc: 'Roll normally, then double everything' },
  { formula: 'MAX_DICE + ROLL_DICE + MOD', desc: 'Add max roll to actual roll, plus modifier' },
  { formula: 'ROLL_DICE * 3', desc: 'Triple the dice roll (ignore modifier)' },
];

const label: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 2, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' };
const radio: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: 6, cursor: 'pointer' };
const toggleRow: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', paddingBlock: 2 };
const mono: React.CSSProperties = { fontFamily: 'ui-monospace, monospace' };
const helpToggle: React.CSSProperties = { background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer', fontSize: 'var(--text-sm)', textAlign: 'left', width: 'fit-content' };
const exampleBtn: React.CSSProperties = { ...mono, background: 'none', border: '1px solid var(--border-hairline)', borderRadius: 4, padding: '1px 6px', cursor: 'pointer', color: 'var(--accent-teal)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' };

/** A labelled on/off toggle. */
function Toggle({ title, desc, value, onChange }: { title: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={toggleRow}>
      <span>
        <span>{title}</span>
        {desc && <span className={d.itemMeta} style={{ display: 'block' }}>{desc}</span>}
      </span>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

/**
 * The Rules tab editor. Reads/writes the DM's campaign rules (users/$uid/library/rules) and
 * auto-saves on every change (no Save button). The custom crit formula gets a live preview
 * evaluated with the safe engine evaluator (never eval()).
 */
export function RulesEditor({ uid }: { uid: string }) {
  const { rules: live, loading } = useRules(uid);
  const [draft, setDraft] = useState<CampaignRules | null>(null);
  // House rules edited as an ordered array; persisted back to an object-keyed map.
  const [houseRules, setHouseRules] = useState<HouseRule[]>([]);
  // Collapsed-by-default "How do I write a formula?" helper under the custom crit formula.
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (!loading && draft === null) {
      setDraft(live);
      setHouseRules(Object.values(live.houseRules ?? {}));
    }
  }, [loading, live, draft]);

  if (!draft) return <p className={d.hint}>Loading rules…</p>;

  // Persist a patch immediately (auto-save). House rules are rebuilt into a keyed map on write.
  const commit = (next: CampaignRules, rows: HouseRule[] = houseRules) => {
    const houseMap: Record<string, HouseRule> = {};
    rows.filter((h) => h.title.trim() || h.description.trim()).forEach((h, i) => {
      houseMap[`hr-${i}`] = { title: h.title.trim(), description: h.description.trim() };
    });
    void saveRules(uid, { ...next, houseRules: houseMap });
  };
  const patch = (p: Partial<CampaignRules>) => {
    const next = { ...draft, ...p };
    setDraft(next);
    commit(next);
  };
  const setRows = (rows: HouseRule[]) => {
    setHouseRules(rows);
    commit(draft, rows);
  };

  // Live preview of the custom crit formula with the example 1d6+2 (ROLL_DICE=4, MAX_DICE=6, MOD=2).
  const preview = draft.critFormula === 'custom'
    ? evalFormula(draft.critFormulaCustom ?? '', { ROLL_DICE: 4, MAX_DICE: 6, MOD: 2 })
    : null;

  const clamp = (v: string, lo: number, hi: number, fallback: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(lo, Math.min(hi, Math.round(n))) : fallback;
  };

  return (
    <div className={s.section}>
      {/* --- Combat Rules --- */}
      <span className={s.sectionTitle}>Combat Rules</span>

      <label style={label}>Crit threshold
        <input
          className={d.input}
          type="number"
          min={15}
          max={20}
          value={draft.critThreshold}
          onChange={(e) => patch({ critThreshold: clamp(e.target.value, 15, 20, 20) })}
          style={{ maxWidth: 90 }}
        />
        <span className={d.hint}>Natural roll of {draft.critThreshold} or higher is a critical hit.</span>
      </label>

      <div>
        <span className={d.label}>Crit damage formula</span>
        {CRIT_FORMULAS.map((f) => (
          <label key={f.id} style={radio}>
            <input
              type="radio"
              name="critFormula"
              checked={draft.critFormula === f.id}
              onChange={() => patch({ critFormula: f.id })}
            />
            <span>
              <strong>{f.label}</strong>
              <span className={d.itemMeta} style={{ display: 'block' }}>{f.desc}</span>
            </span>
          </label>
        ))}
        {draft.critFormula === 'custom' && (
          <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <input
              className={d.input}
              placeholder="e.g. (MAX_DICE + MOD) * 2"
              value={draft.critFormulaCustom ?? ''}
              onChange={(e) => patch({ critFormulaCustom: e.target.value })}
            />
            <span className={d.hint}>
              Example with 1d6+2:{' '}
              {preview == null ? (
                <span style={{ color: 'var(--accent-red)' }}>Invalid formula — check your syntax and variables.</span>
              ) : (
                <strong>{Math.max(0, Math.round(preview))}</strong>
              )}
            </span>

            {/* Collapsible "how to" — collapsed by default. */}
            <button type="button" onClick={() => setHelpOpen((o) => !o)} aria-expanded={helpOpen} style={helpToggle}>
              {helpOpen ? '▼' : '▶'} How do I write a formula?
            </button>
            {helpOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingLeft: 'var(--space-2)' }}>
                <div>
                  <p className={d.hint} style={{ margin: 0 }}><strong>Variables you can use:</strong></p>
                  <ul style={{ margin: '2px 0 0', paddingLeft: '1.1rem' }}>
                    <li className={d.hint}><span style={mono}>ROLL_DICE</span> — what you actually rolled on the dice (e.g. 4 on a d6)</li>
                    <li className={d.hint}><span style={mono}>MAX_DICE</span> — the highest number the dice could roll (e.g. 6 on a d6)</li>
                    <li className={d.hint}><span style={mono}>MOD</span> — the flat bonus added to damage (e.g. +2 in 1d6+2)</li>
                  </ul>
                </div>
                <div>
                  <p className={d.hint} style={{ margin: 0 }}><strong>Example formulas</strong> (click one to use it):</p>
                  <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: 4 }}>
                    <tbody>
                      {CUSTOM_EXAMPLES.map((ex) => (
                        <tr key={ex.formula}>
                          <td style={{ padding: '2px 8px 2px 0', verticalAlign: 'top' }}>
                            <button type="button" style={exampleBtn} onClick={() => patch({ critFormulaCustom: ex.formula })}>
                              {ex.formula}
                            </button>
                          </td>
                          <td className={d.itemMeta} style={{ padding: '2px 0', verticalAlign: 'top' }}>{ex.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className={d.hint} style={{ margin: 0 }}>
                  If your formula has an error, the roller automatically falls back to double dice so combat never breaks.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <label style={label}>Death save failures
        <input
          className={d.input}
          type="number"
          min={1}
          max={5}
          value={draft.deathSaveFailures}
          onChange={(e) => patch({ deathSaveFailures: clamp(e.target.value, 1, 5, 3) })}
          style={{ maxWidth: 90 }}
        />
        <span className={d.hint}>Failures needed to die.</span>
      </label>

      {/* --- Character Rules --- */}
      <span className={s.sectionTitle} style={{ marginTop: 'var(--space-3)' }}>Character Rules</span>

      <div>
        <span className={d.label}>Starting HP</span>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          {STARTING_HP.map((h) => (
            <label key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <input type="radio" name="startingHp" checked={draft.startingHp === h.id} onChange={() => patch({ startingHp: h.id })} />
              {h.label}
            </label>
          ))}
        </div>
      </div>

      <Toggle title="Flanking" desc="Grants advantage when two allies are adjacent to one enemy" value={draft.flanking} onChange={(v) => patch({ flanking: v })} />
      <Toggle title="Multiclassing" value={draft.multiclassing} onChange={(v) => patch({ multiclassing: v })} />
      <Toggle title="Feats" value={draft.feats} onChange={(v) => patch({ feats: v })} />
      <Toggle title="Inspiration" value={draft.inspiration} onChange={(v) => patch({ inspiration: v })} />
      <Toggle title="Encumbrance" value={draft.encumbrance} onChange={(v) => patch({ encumbrance: v })} />

      {/* --- House Rules --- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-3)' }}>
        <span className={s.sectionTitle}>House Rules</span>
        <button className={d.place} onClick={() => setRows([...houseRules, { title: '', description: '' }])}>+ Add</button>
      </div>
      <span className={d.hint}>Display-only — shown on the board's Rules panel for the whole table.</span>
      {houseRules.map((h, i) => (
        <div key={i} className={d.section} style={{ gap: 4, marginBottom: 'var(--space-2)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <input
              className={d.input}
              placeholder="Title"
              value={h.title}
              onChange={(e) => setRows(houseRules.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
            />
            <button className={d.place} onClick={() => setRows(houseRules.filter((_, j) => j !== i))} aria-label="Remove house rule">×</button>
          </div>
          <textarea
            className={d.input}
            placeholder="Description"
            rows={2}
            value={h.description}
            onChange={(e) => setRows(houseRules.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))}
          />
        </div>
      ))}
    </div>
  );
}
