import { useMemo, useState } from 'react';
import type { SystemDefinition } from '@solryn/shared-types';
import type { Character } from '@solryn/shared-types';
import { applyLevelUp5e } from '../../data/characters';
import { ABILITY_IDS, pcDerived } from '@solryn/systems/dnd5e/character';
import { meetsFeatPrerequisite } from '@solryn/systems/dnd5e/feats';
import { spells as allSpells, getSpellsForClass } from '@solryn/systems/dnd5e/spells';
import { computeLevelUp, levelUpSummary, type LevelUpChoices } from '@solryn/systems/dnd5e/levelUp';
import type { CampaignRules } from '../../data/homebrew';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import s from '../board/drawers/drawers.module.css';

const row: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' };

/**
 * Guided 5e level-up. Opens when play.levelUpPending is true; non-dismissible (onClose is a
 * no-op) until the player finishes — the pending flag persists otherwise. Walks features → HP →
 * ASI → spells, then writes level, HP, scores, spells, and refreshed slots atomically.
 */
export function LevelUpModal({
  system,
  character,
  rules,
  onDone,
}: {
  system: SystemDefinition;
  character: Character;
  /** Campaign rules — startingHp drives the HP gain; feats === false hides the feat option. */
  rules?: CampaignRules;
  onDone: () => void;
}) {
  const featsEnabled = rules?.feats ?? true;
  const summary = useMemo(
    () => levelUpSummary(system, character, rules?.startingHp),
    [system, character, rules?.startingHp],
  );
  const [asiMode, setAsiMode] = useState<'one' | 'two'>('one');
  const [asiA, setAsiA] = useState<string>('');
  const [asiB, setAsiB] = useState<string>('');
  const [newCantripIds, setNewCantripIds] = useState<string[]>([]);
  const [newSpellIds, setNewSpellIds] = useState<string[]>([]);
  const [subclassId, setSubclassId] = useState<string>('');
  // ASI levels let the player take the ASI OR a feat.
  const [asiOrFeat, setAsiOrFeat] = useState<'asi' | 'feat'>('asi');
  const [featId, setFeatId] = useState<string>('');
  const [featAbility, setFeatAbility] = useState<string>('');
  const [busy, setBusy] = useState(false);

  // Feats the character is eligible for (prerequisites met, not already taken).
  const derived = useMemo(() => pcDerived(system, character), [system, character]);
  const owned = new Set(character.play.featIds ?? []);
  // Feats come from the (possibly homebrew-augmented) system, so GM-authored feats appear in the
  // picker alongside SRD ones with the same prerequisite check.
  const allFeats = system.feats ?? [];
  const eligibleFeats = allFeats.filter(
    (f) => !owned.has(f.id) && meetsFeatPrerequisite(f, derived.scores, !!derived.spell),
  );
  const pickedFeat = allFeats.find((f) => f.id === featId);
  const featNeedsAbility = !!pickedFeat?.effects?.abilityChoice;

  // Subclass options (this class's subclasses) when this level is the subclass level.
  const subclassOptions = summary.subclassPending
    ? (system.subclasses ?? []).filter((sub) => sub.classId === character.definition.classId)
    : [];
  // UI-only: which spell level the leveled picker shows ('all' or a specific level).
  const [spellLevelFilter, setSpellLevelFilter] = useState<number | 'all'>('all');

  // Spells the player could add: class list, not already known/booked, within castable level.
  const classSpells = summary.model ? getSpellsForClass(character.definition.classId ?? '', allSpells) : [];
  const have = new Set([...(character.definition.knownSpellIds ?? []), ...(character.definition.spellbookSpellIds ?? [])]);
  const maxSlotLevel = Math.max(0, ...Object.keys(summary.newMaxSlots).map(Number));
  const cantripChoices = classSpells.filter((sp) => sp.level === 0 && !have.has(sp.id));
  const spellChoices = classSpells.filter((sp) => sp.level >= 1 && sp.level <= maxSlotLevel && !have.has(sp.id));

  const asi: Record<string, number> = !summary.isAsi
    ? {}
    : asiMode === 'one'
      ? (asiA ? { [asiA]: 2 } : {})
      : asiA && asiB && asiA !== asiB
        ? { [asiA]: 1, [asiB]: 1 }
        : {};

  // The ASI level is satisfied by either a complete ASI or a valid feat pick.
  const asiPart = Object.keys(asi).length === (asiMode === 'one' ? 1 : 2);
  const featPart = !!featId && (!featNeedsAbility || !!featAbility);
  const asiComplete = !summary.isAsi || (asiOrFeat === 'asi' ? asiPart : featPart);
  const cantripsComplete = newCantripIds.length === summary.cantripsGain;
  const spellsComplete = newSpellIds.length === summary.spellsGain;
  const subclassComplete = !summary.subclassPending || subclassOptions.length === 0 || !!subclassId;
  const canFinish = asiComplete && cantripsComplete && spellsComplete && subclassComplete && !busy && !summary.atMax;

  const takingFeat = summary.isAsi && asiOrFeat === 'feat';

  async function finish() {
    setBusy(true);
    const choices: LevelUpChoices = {
      asi: takingFeat ? {} : asi,
      newCantripIds,
      newSpellIds,
      ...(subclassId ? { subclassId } : {}),
      ...(takingFeat && featId ? { featId, ...(featAbility ? { featAbility } : {}) } : {}),
    };
    const result = computeLevelUp(system, character, summary, choices);
    try {
      await applyLevelUp5e(character.id, result);
      onDone();
    } catch {
      setBusy(false);
    }
  }

  // One unified picker for all new spells (cantrips = level 0 in the same list), filterable by
  // level. Cantrips and leveled spells keep SEPARATE selection buckets + limits (they persist to
  // different places), but read as a single list; each row routes to the right bucket by level.
  const spellPicker = () => {
    const options = [...cantripChoices, ...spellChoices].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    const levels = [...new Set(options.map((sp) => sp.level))].sort((a, b) => a - b);
    const shown = spellLevelFilter !== 'all' ? options.filter((sp) => sp.level === spellLevelFilter) : options;
    const bookLabel = summary.model === 'spellbook' ? 'spellbook' : 'known';
    return (
      <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-1)' }}>
        <p className={s.label}>New spells</p>
        <p className={s.hint} style={{ marginTop: 0 }}>
          {summary.cantripsGain > 0 && `Cantrips ${newCantripIds.length}/${summary.cantripsGain}`}
          {summary.cantripsGain > 0 && summary.spellsGain > 0 && ' · '}
          {summary.spellsGain > 0 && `${bookLabel} ${newSpellIds.length}/${summary.spellsGain}`}
        </p>
        {levels.length > 1 && (
          <select
            className={s.input}
            style={{ marginBottom: 'var(--space-2)' }}
            value={spellLevelFilter === 'all' ? '' : String(spellLevelFilter)}
            onChange={(e) => setSpellLevelFilter(e.target.value === '' ? 'all' : Number(e.target.value))}
            aria-label="Filter by spell level"
          >
            <option value="">All levels</option>
            {levels.map((l) => (
              <option key={l} value={l}>{l === 0 ? 'Cantrips' : `Level ${l}`}</option>
            ))}
          </select>
        )}
        {/* overflow-y makes the box scroll INTERNALLY instead of overflowing over the filter/next section. */}
        <div className={s.list} style={{ maxHeight: 220, overflowY: 'auto' }}>
          {shown.map((sp) => {
            const isCantrip = sp.level === 0;
            const bucket = isCantrip ? newCantripIds : newSpellIds;
            const setBucket = isCantrip ? setNewCantripIds : setNewSpellIds;
            const limit = isCantrip ? summary.cantripsGain : summary.spellsGain;
            const checked = bucket.includes(sp.id);
            const full = bucket.length >= limit;
            return (
              <label key={sp.id} className={`${s.item} ${checked ? s.itemActive ?? '' : ''}`} style={row}>
                <span>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!checked && full}
                    onChange={() => setBucket(checked ? bucket.filter((x) => x !== sp.id) : [...bucket, sp.id])}
                  />{' '}
                  {sp.name}
                </span>
                <span className={s.itemMeta}>{sp.school}{isCantrip ? ' · Cantrip' : ` · L${sp.level}`}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Modal
      open
      onClose={() => {}}
      title={`Level up — ${character.name}`}
      width={520}
      // Anchored footer (outside the scrollable body) so the confirm button never overlaps the list.
      footer={
        <Button onClick={() => void finish()} disabled={!canFinish}>
          {busy ? 'Applying…' : `Become level ${summary.toLevel}`}
        </Button>
      }
    >
      <div className={s.section}>
        <p className={s.label} style={{ fontSize: 'var(--text-lg)' }}>
          You are now level {summary.toLevel} {summary.className}!
        </p>

        {/* New features */}
        {summary.newFeatures.length > 0 && (
          <>
            <span className={s.label}>New features</span>
            {summary.newFeatures.map((f) => (
              <p key={f} className={s.hint} style={{ margin: 0 }}>• {f}</p>
            ))}
          </>
        )}
        {summary.subclassPending && subclassOptions.length > 0 && (
          <>
            <span className={s.label}>Choose your subclass</span>
            {subclassOptions.map((sub) => (
              <label key={sub.id} className={`${s.item} ${subclassId === sub.id ? s.itemActive ?? '' : ''}`} style={{ ...row, alignItems: 'flex-start' }}>
                <span>
                  <input type="radio" checked={subclassId === sub.id} onChange={() => setSubclassId(sub.id)} /> <strong>{sub.name}</strong>
                  {sub.description && <span className={s.itemMeta}> — {sub.description}</span>}
                </span>
              </label>
            ))}
          </>
        )}

        {/* HP */}
        <div style={row}>
          <span className={s.itemMeta}>Hit points</span>
          <strong>+{summary.hpGain} ({rules?.startingHp ?? 'average'})</strong>
        </div>

        {/* Counter changes */}
        {summary.counterChanges.map((c) => (
          <div key={c.name} style={row}>
            <span className={s.itemMeta}>{c.name.replace(/_/g, ' ')}</span>
            <span>{c.from ?? '—'} → <strong>{c.to}</strong></span>
          </div>
        ))}

        {/* ASI — or, at the player's choice, a feat. */}
        {summary.isAsi && (
          <>
            <span className={s.label}>Ability Score Improvement</span>
            {/* Feats can be disabled by a campaign rule — then this level only grants an ASI. */}
            {featsEnabled && (
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <label className={s.itemMeta}>
                  <input type="radio" checked={asiOrFeat === 'asi'} onChange={() => setAsiOrFeat('asi')} /> Ability Score Improvement
                </label>
                <label className={s.itemMeta}>
                  <input type="radio" checked={asiOrFeat === 'feat'} onChange={() => setAsiOrFeat('feat')} /> Take a feat
                </label>
              </div>
            )}

            {asiOrFeat === 'asi' ? (
              <>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <label className={s.itemMeta}>
                    <input type="radio" checked={asiMode === 'one'} onChange={() => { setAsiMode('one'); setAsiB(''); }} /> +2 to one
                  </label>
                  <label className={s.itemMeta}>
                    <input type="radio" checked={asiMode === 'two'} onChange={() => setAsiMode('two')} /> +1 to two
                  </label>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <select className={s.input} value={asiA} onChange={(e) => setAsiA(e.target.value)} aria-label="Ability">
                    <option value="">—</option>
                    {ABILITY_IDS.map((id) => <option key={id} value={id}>{id}</option>)}
                  </select>
                  {asiMode === 'two' && (
                    <select className={s.input} value={asiB} onChange={(e) => setAsiB(e.target.value)} aria-label="Second ability">
                      <option value="">—</option>
                      {ABILITY_IDS.filter((id) => id !== asiA).map((id) => <option key={id} value={id}>{id}</option>)}
                    </select>
                  )}
                </div>
              </>
            ) : (
              <>
                <select
                  className={s.input}
                  value={featId}
                  onChange={(e) => { setFeatId(e.target.value); setFeatAbility(''); }}
                  aria-label="Feat"
                >
                  <option value="">— Choose a feat —</option>
                  {eligibleFeats.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
                {pickedFeat && (
                  <p className={s.hint} style={{ marginTop: 'var(--space-1)' }}>
                    {pickedFeat.description}
                    {pickedFeat.note && <><br />— {pickedFeat.note}</>}
                  </p>
                )}
                {featNeedsAbility && pickedFeat?.effects?.abilityChoice && (
                  <select
                    className={s.input}
                    value={featAbility}
                    onChange={(e) => setFeatAbility(e.target.value)}
                    aria-label="Feat ability increase"
                  >
                    <option value="">— +1 to which ability? —</option>
                    {pickedFeat.effects.abilityChoice.from.map((id) => (
                      <option key={id} value={id}>{id}</option>
                    ))}
                  </select>
                )}
              </>
            )}
          </>
        )}

        {/* Spells — one unified list (cantrips + leveled), filterable by level. */}
        {(summary.cantripsGain > 0 || summary.spellsGain > 0) && spellPicker()}
        {summary.model === 'prepared' && summary.newPreparedCount !== undefined && (
          <p className={s.hint}>
            As a prepared caster you now prepare {summary.newPreparedCount} spells per day from your full class list — no selection needed here.
          </p>
        )}

        {/* Spell slots */}
        {summary.model && Object.keys(summary.newMaxSlots).length > 0 && (
          <p className={s.hint}>
            Spell slots (refreshed): {Object.entries(summary.newMaxSlots).map(([lvl, n]) => `${n}×L${lvl}`).join(', ')}
          </p>
        )}
      </div>
    </Modal>
  );
}
