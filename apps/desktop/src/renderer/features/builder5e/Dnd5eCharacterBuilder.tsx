import { useMemo, useState } from 'react';
import type { SystemDefinition } from '@solryn/shared-types';
import type { Character } from '@solryn/shared-types';
import { computeModifier } from '@solryn/engine';
import { StepFrame } from '../builder/StepFrame';
import { TextField } from '../../components/ui/TextField';
import {
  ABILITY_IDS,
  STANDARD_ARRAY,
  effectiveScores,
  pcDerived,
  type AbilityId,
} from '@solryn/systems/dnd5e/character';
import { getSpellsForClass, spells as spellList } from '@solryn/systems/dnd5e/spells';
import {
  POINT_BUY_BUDGET,
  POINT_BUY_MAX,
  POINT_BUY_MIN,
  pointBuyCost,
  pointBuyRemaining,
  rollAbilityScores,
  type AbilityScoreMethod,
} from '@solryn/systems/dnd5e/abilityScores';
import s from '../builder/steps/steps.module.css';

/**
 * 5e character builder — its own step set on the SHARED StepFrame shell (Solryn's builder is
 * untouched). Scope (Phase B/C): Human Fighter, standard array, level 1. Selected by GamePage
 * when the system's progression mode is 'class-and-level'.
 */

interface Draft {
  name: string;
  /** How ability scores are generated; all three write into `abilities`. */
  method: AbilityScoreMethod;
  abilities: Partial<Record<AbilityId, number>>;
  /** Roll-method pool (six 4d6-drop-lowest values) to assign from. */
  rolledValues?: number[];
  raceId?: string;
  subraceId?: string;
  /** Half-Elf's flexible +1s (stat id → amount). */
  ancestryChoices: Record<string, number>;
  /** Half-Elf's Skill Versatility picks (separate from the class skill step). */
  raceSkillIds: string[];
  classId?: string;
  backgroundId?: string;
  chosenSkillIds: string[];
  /** Cantrips picked (level-0 spells). */
  cantripIds: string[];
  /** Leveled spells picked (known casters' known list / Wizard's starting spellbook). */
  spellIds: string[];
}

type StepKind = 'abilities' | 'race' | 'class' | 'skills' | 'background' | 'spells' | 'finish';

const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
// Long option lists (skills, abilities, spells) laid out in a responsive multi-column grid.
// auto-fill + a 170px MIN track keeps every column wide enough to fit the longest option labels
// ("Investigation", "Animal Handling", "Sleight of Hand") on one line without breaking words, while
// only packing as many columns as fit — so the grid never bleeds into the "Why this matters" panel.
// (Plain repeat(3, …) can't satisfy both: 3 columns in the ~494px action column are too narrow for
// these names, forcing either mid-word wrapping or overflow.)
const grid3: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.5rem', minWidth: 0 };
// Method selector pills — same visual language as the sheet's Combat/Spellbook tabs (teal accent
// when active, muted outline when not). Inline because steps.module.css has no tab classes.
const methodTabRow: React.CSSProperties = { display: 'flex', gap: '0.5rem' };
const methodTab = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: '8px 10px',
  borderRadius: 'var(--radius-sm)',
  border: `1px solid ${active ? 'var(--accent-teal)' : 'var(--border-hairline)'}`,
  background: active ? 'var(--teal-tint)' : 'var(--surface-raised)',
  color: active ? 'var(--accent-teal)' : 'var(--text-muted)',
  fontWeight: active ? 700 : 500,
  fontSize: 'var(--text-sm)',
  cursor: 'pointer',
});
/** SRD: a Wizard starts with six 1st-level spells in their spellbook. */
const WIZARD_START_SPELLS = 6;

export function Dnd5eCharacterBuilder({
  system,
  gameId,
  ownerUserId,
  onFinish,
}: {
  system: SystemDefinition;
  gameId: string;
  ownerUserId: string;
  onFinish: (character: Omit<Character, 'id'>) => Promise<void>;
}) {
  const [draft, setDraft] = useState<Draft>({
    name: '',
    method: 'standard',
    abilities: {},
    ancestryChoices: {},
    raceSkillIds: [],
    chosenSkillIds: [],
    cantripIds: [],
    spellIds: [],
  });
  const [step, setStep] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState('');

  const rule = system.modifierRule;

  // Selected race + its sub-choices (subrace, Half-Elf flexible bonus, Half-Elf skills).
  const race = system.ancestries.find((a) => a.id === draft.raceId);
  const subrace = race?.subraces?.find((sr) => sr.id === draft.subraceId);
  const flexBonus = race?.bonuses.find((b) => b.kind === 'choice');
  const flex = flexBonus?.kind === 'choice' ? flexBonus : undefined; // Half-Elf +1 to N abilities
  const raceSkillChoose = race?.raceSkillChoices?.choose ?? 0;
  const raceSkillFrom =
    race?.raceSkillChoices?.from === 'any' ? system.skills.map((sk) => sk.id) : (race?.raceSkillChoices?.from ?? []);
  // All proficient skills at finish = class picks + Half-Elf race picks (racial fixed grants
  // like Elf Perception are added automatically by pcDerived).
  const allChosenSkills = [...new Set([...draft.chosenSkillIds, ...draft.raceSkillIds])];

  const usedValues = Object.values(draft.abilities).filter((v): v is number => v !== undefined);
  const assignedAll = ABILITY_IDS.every((id) => draft.abilities[id] !== undefined);
  // Point-buy budget (only meaningful for the pointbuy method; abilities are direct scores there).
  const pbRemaining = pointBuyRemaining(draft.abilities as Record<string, number>);
  const abilitiesComplete = draft.method === 'pointbuy' ? assignedAll && pbRemaining >= 0 : assignedAll;

  // Switch the generation method, resetting the score state to that method's starting point.
  const setMethod = (method: AbilityScoreMethod) =>
    setDraft((d) => ({
      ...d,
      method,
      abilities:
        method === 'pointbuy'
          ? (Object.fromEntries(ABILITY_IDS.map((id) => [id, POINT_BUY_MIN])) as Partial<Record<AbilityId, number>>)
          : {},
      ...(method === 'roll' ? { rolledValues: rollAbilityScores() } : { rolledValues: undefined }),
    }));

  // Spellcasting (caster classes only): a spell step slots in before 'finish'. Counts come
  // from the class's level-1 table; leveled picks are the known list / Wizard starting book.
  const selectedClass = (system.classes ?? []).find((c) => c.id === draft.classId);
  // Skill step reads the SELECTED class's list (not a fixed class) — 'any' expands to all skills.
  const skillChoose = selectedClass?.skillChoices.choose ?? 2;
  const skillFrom =
    selectedClass?.skillChoices.from === 'any'
      ? system.skills.map((sk) => sk.id)
      : (selectedClass?.skillChoices.from ?? []);
  const casterModel = selectedClass?.spellcasting?.type; // undefined for martials
  const isCaster = !!casterModel;
  const lvl1 = selectedClass?.levels.find((l) => l.level === 1);
  const cantripCount = lvl1?.cantripsKnown ?? 0;
  const leveledCount =
    casterModel === 'known' ? (lvl1?.spellsKnown ?? 0) : casterModel === 'spellbook' ? WIZARD_START_SPELLS : 0;
  const classSpells = selectedClass ? getSpellsForClass(selectedClass.id, spellList) : [];
  const cantripOptions = classSpells.filter((sp) => sp.level === 0);
  const leveledOptions = classSpells.filter((sp) => sp.level === 1);

  const steps: StepKind[] = isCaster
    ? ['abilities', 'race', 'class', 'skills', 'background', 'spells', 'finish']
    : ['abilities', 'race', 'class', 'skills', 'background', 'finish'];
  const meta: Record<StepKind, { title: string; instruction: string }> = {
    abilities: { title: 'Assign ability scores', instruction: 'Place the standard array (15/14/13/12/10/8) — each value once.' },
    race: { title: 'Choose a race', instruction: 'Pick your race. Its bonuses apply to your scores right away.' },
    class: { title: 'Choose a class', instruction: 'Pick your class. It sets your hit die, proficiencies, and features.' },
    skills: { title: 'Choose skills', instruction: `Pick ${skillChoose} skill proficiencies from your class list.` },
    background: { title: 'Choose a background', instruction: 'Your background grants two more skill proficiencies, tools, and a feature.' },
    spells: { title: 'Choose spells', instruction: 'Pick your cantrips and starting spells.' },
    finish: { title: 'Name & finish', instruction: 'Name your character. Starter gear is equipped automatically.' },
  };
  const kind = steps[Math.min(step, steps.length - 1)];

  const canNext = (() => {
    switch (kind) {
      case 'abilities':
        return abilitiesComplete;
      case 'race': {
        if (!draft.raceId) return false;
        if (race?.subraces?.length && !draft.subraceId) return false;
        if (flex && Object.keys(draft.ancestryChoices).length !== flex.count) return false;
        if (raceSkillChoose && draft.raceSkillIds.length !== raceSkillChoose) return false;
        return true;
      }
      case 'class':
        return !!draft.classId;
      case 'skills':
        return draft.chosenSkillIds.length === skillChoose;
      case 'background':
        return !!draft.backgroundId;
      case 'spells':
        return draft.cantripIds.length === cantripCount && draft.spellIds.length === leveledCount;
      case 'finish':
        return draft.name.trim().length > 0;
    }
  })();

  // The chosen class's thematic starting kit (falls back to a longsword if a class lacks one).
  const kit = (system.classes ?? []).find((c) => c.id === draft.classId)?.starterKit ?? {
    weaponIds: ['longsword'],
  };

  // Live preview of the finished combat numbers (built once enough is chosen).
  const preview = useMemo(() => {
    if (!assignedAll || !draft.classId) return null;
    const scores = effectiveScores(draft.abilities as Record<string, number>, race, subrace, draft.ancestryChoices);
    const character = {
      id: 'preview',
      gameId,
      ownerUserId,
      systemId: system.id,
      name: draft.name,
      buildComplete: false,
      definition: { ancestryId: draft.raceId ?? '', subraceId: draft.subraceId, ancestryChoices: draft.ancestryChoices, classId: draft.classId, backgroundId: draft.backgroundId, coreScores: scores, chosenSkillIds: allChosenSkills, knownSpellIds: [] },
      play: { level: 1, reputation: system.creation.startingReputation, pools: {}, skills: {}, equippedWeaponIds: kit.weaponIds, ...(kit.armorId ? { equippedArmorId: kit.armorId } : {}) },
    } as Character;
    return pcDerived(system, character);
  }, [assignedAll, draft, race, subrace, allChosenSkills, system, gameId, ownerUserId, kit]);

  async function finish() {
    if (!preview) return;
    setFinishing(true);
    setError('');
    const scores = effectiveScores(draft.abilities as Record<string, number>, race, subrace, draft.ancestryChoices);
    // Wizard's leveled picks seed the spellbook; every other caster's picks are "known".
    // Cantrips are always known. Slots start full (max for the class/level).
    const knownSpellIds = casterModel === 'spellbook' ? draft.cantripIds : [...draft.cantripIds, ...draft.spellIds];
    const spellbookSpellIds = casterModel === 'spellbook' ? draft.spellIds : undefined;
    const maxSlots = preview.spell?.maxSlots ?? {};
    const base: Omit<Character, 'id'> = {
      gameId,
      ownerUserId,
      systemId: system.id,
      name: draft.name.trim() || 'New Hero',
      buildComplete: true,
      definition: {
        ancestryId: draft.raceId ?? '',
        ...(draft.subraceId ? { subraceId: draft.subraceId } : {}),
        ...(Object.keys(draft.ancestryChoices).length ? { ancestryChoices: draft.ancestryChoices } : {}),
        classId: draft.classId,
        ...(draft.backgroundId ? { backgroundId: draft.backgroundId } : {}),
        abilityScoreMethod: draft.method,
        coreScores: scores,
        chosenSkillIds: allChosenSkills,
        knownSpellIds,
        ...(spellbookSpellIds?.length ? { spellbookSpellIds } : {}),
      },
      play: {
        level: 1,
        reputation: system.creation.startingReputation,
        pools: { hp: { current: preview.maxHp } },
        skills: {},
        equippedWeaponIds: kit.weaponIds,
        ...(kit.armorId ? { equippedArmorId: kit.armorId } : {}),
        ...(isCaster && Object.keys(maxSlots).length ? { spellSlots: maxSlots } : {}),
      },
    };
    try {
      await onFinish(base);
    } catch (e) {
      setError((e as Error).message);
      setFinishing(false);
    }
  }

  function next() {
    if (!canNext || finishing) return;
    if (step === steps.length - 1) void finish();
    else setStep(step + 1);
  }

  const nav = {
    stepNumber: step + 1,
    totalSteps: steps.length,
    title: meta[kind].title,
    instruction: meta[kind].instruction,
    onNext: next,
    nextLabel: finishing ? 'Creating…' : step === steps.length - 1 ? 'Finish character' : `Next: ${meta[steps[step + 1]].title}`,
    nextDisabled: !canNext || finishing,
    onBack: step > 0 ? () => setStep(step - 1) : undefined,
  };

  const teaching = <p className={s.teachText}>All nine SRD races (with subraces), all twelve classes, standard array. Spellcasting arrives in a later phase.</p>;

  return (
    <StepFrame {...nav} teaching={teaching}>
      {kind === 'abilities' && (
        <div className={s.statList}>
          {/* Method selector — all three write the same {ability → score} map. */}
          <div style={methodTabRow}>
            {([['standard', 'Standard Array'], ['pointbuy', 'Point Buy'], ['roll', 'Roll Stats']] as const).map(([m, label]) => (
              <button key={m} style={methodTab(draft.method === m)} onClick={() => setMethod(m)}>
                {label}
              </button>
            ))}
          </div>

          {draft.method === 'pointbuy' ? (
            <>
              <p className={s.teachText}>
                Point buy — <strong>{pbRemaining}</strong> of {POINT_BUY_BUDGET} points left. Each score {POINT_BUY_MIN}–{POINT_BUY_MAX}.
              </p>
              {ABILITY_IDS.map((id) => {
                const val = draft.abilities[id] ?? POINT_BUY_MIN;
                const canInc = val < POINT_BUY_MAX && pointBuyCost(val + 1) - pointBuyCost(val) <= pbRemaining;
                const canDec = val > POINT_BUY_MIN;
                return (
                  <div key={id} className={s.statRow}>
                    <span className={s.statName}>{id}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <button disabled={!canDec} onClick={() => setDraft((d) => ({ ...d, abilities: { ...d.abilities, [id]: val - 1 } }))}>−</button>
                      <strong>{val}</strong>
                      <button disabled={!canInc} onClick={() => setDraft((d) => ({ ...d, abilities: { ...d.abilities, [id]: val + 1 } }))}>+</button>
                    </span>
                    <span className={s.statMod}>{sign(computeModifier(val, rule))} mod</span>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {draft.method === 'standard' && (
                <p className={s.teachText}>Assign 15 / 14 / 13 / 12 / 10 / 8 — each value once.</p>
              )}
              {draft.method === 'roll' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                  <span className={s.teachText}>Rolled (4d6 drop lowest): {(draft.rolledValues ?? []).join(', ')}</span>
                  <button className={s.place} onClick={() => setDraft((d) => ({ ...d, abilities: {}, rolledValues: rollAbilityScores() }))}>
                    Reroll
                  </button>
                </div>
              )}
              {ABILITY_IDS.map((id) => {
                const val = draft.abilities[id];
                const pool = draft.method === 'roll' ? (draft.rolledValues ?? []) : STANDARD_ARRAY;
                // Distinct values still available — count-aware so duplicate rolled values work.
                const remainingOf = (v: number) => pool.filter((x) => x === v).length - usedValues.filter((x) => x === v).length;
                const options = [...new Set(pool)].sort((a, b) => b - a).filter((v) => remainingOf(v) + (v === val ? 1 : 0) > 0);
                return (
                  <div key={id} className={s.statRow}>
                    <span className={s.statName}>{id}</span>
                    <select
                      value={val ?? ''}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, abilities: { ...d.abilities, [id]: e.target.value ? Number(e.target.value) : undefined } }))
                      }
                    >
                      <option value="">—</option>
                      {options.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                    <span className={s.statMod}>{val !== undefined ? `${sign(computeModifier(val, rule))} mod` : '—'}</span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {kind === 'race' && (
        <div className={s.statList}>
          {system.ancestries.map((a) => (
            <button
              key={a.id}
              className={[s.statRow, draft.raceId === a.id ? s.active : ''].filter(Boolean).join(' ')}
              // Switching races clears any stale sub-choices.
              onClick={() => setDraft((d) => ({ ...d, raceId: a.id, subraceId: undefined, ancestryChoices: {}, raceSkillIds: [] }))}
            >
              <span className={s.statName}>{a.name}</span>
              <span className={s.statMod}>{a.bonusSummary}</span>
            </button>
          ))}

          {/* Subrace / draconic ancestry picker — appears once a race with options is chosen. */}
          {race?.subraces?.length ? (
            <>
              <p className={s.teachText}>
                {race.id === 'dragonborn' ? 'Choose a draconic ancestry (sets your breath weapon):' : 'Choose a subrace:'}
              </p>
              {race.subraces.map((sr) => (
                <button
                  key={sr.id}
                  className={[s.statRow, draft.subraceId === sr.id ? s.active : ''].filter(Boolean).join(' ')}
                  onClick={() => setDraft((d) => ({ ...d, subraceId: sr.id }))}
                >
                  <span className={s.statName}>{sr.name}</span>
                  <span className={s.statMod}>{sr.description}</span>
                </button>
              ))}
            </>
          ) : null}

          {/* Half-Elf: +1 to two chosen abilities. */}
          {flex ? (
            <>
              <p className={s.teachText}>
                +{flex.amount} to {flex.count} abilities ({Object.keys(draft.ancestryChoices).length}/{flex.count}):
              </p>
              <div style={grid3}>
              {(flex.from ?? ABILITY_IDS).map((stat) => {
                const picked = draft.ancestryChoices[stat] != null;
                const full = Object.keys(draft.ancestryChoices).length >= flex.count;
                return (
                  <label key={stat} className={[s.statRow, picked ? s.active : ''].filter(Boolean).join(' ')}>
                    <input
                      type="checkbox"
                      checked={picked}
                      disabled={!picked && full}
                      onChange={() =>
                        setDraft((d) => {
                          const next = { ...d.ancestryChoices };
                          if (picked) delete next[stat];
                          else next[stat] = flex.amount;
                          return { ...d, ancestryChoices: next };
                        })
                      }
                    />
                    <span className={s.statName}>{stat}</span>
                  </label>
                );
              })}
              </div>
            </>
          ) : null}

          {/* Half-Elf Skill Versatility: choose N skills from any. */}
          {raceSkillChoose ? (
            <>
              <p className={s.teachText}>
                Choose {raceSkillChoose} skill proficiencies ({draft.raceSkillIds.length}/{raceSkillChoose}):
              </p>
              <div style={grid3}>
              {raceSkillFrom.map((sid) => {
                const sk = system.skills.find((x) => x.id === sid);
                const checked = draft.raceSkillIds.includes(sid);
                const full = draft.raceSkillIds.length >= raceSkillChoose;
                return (
                  <label key={sid} className={[s.statRow, checked ? s.active : ''].filter(Boolean).join(' ')}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={!checked && full}
                      onChange={() =>
                        setDraft((d) => ({
                          ...d,
                          raceSkillIds: checked ? d.raceSkillIds.filter((x) => x !== sid) : [...d.raceSkillIds, sid],
                        }))
                      }
                    />
                    <span className={s.statName}>{sk?.name ?? sid}</span>
                    <span className={s.statMod}>{sk?.attribute}</span>
                  </label>
                );
              })}
              </div>
            </>
          ) : null}
        </div>
      )}

      {kind === 'class' && (
        <div className={s.statList}>
          {(system.classes ?? []).map((cl) => {
            const caster = cl.spellcasting;
            return (
              <button
                key={cl.id}
                className={[s.statRow, draft.classId === cl.id ? s.active : ''].filter(Boolean).join(' ')}
                // Switching class clears skill + spell picks (a different list applies).
                onClick={() => setDraft((d) => ({ ...d, classId: cl.id, chosenSkillIds: [], cantripIds: [], spellIds: [] }))}
              >
                <span className={s.statName}>
                  {cl.name}
                  {caster && <span className={s.statMod}> ({caster.type} caster)</span>}
                </span>
                <span className={s.statMod}>Hit die {cl.hitDie} · saves {cl.savingThrows.join('/')}</span>
              </button>
            );
          })}
        </div>
      )}

      {kind === 'skills' && (
        <div className={s.statList} style={grid3}>
          {skillFrom.map((sid) => {
            const sk = system.skills.find((x) => x.id === sid);
            const checked = draft.chosenSkillIds.includes(sid);
            const full = draft.chosenSkillIds.length >= skillChoose;
            return (
              <label key={sid} className={[s.statRow, checked ? s.active : ''].filter(Boolean).join(' ')}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={!checked && full}
                  onChange={() =>
                    setDraft((d) => ({
                      ...d,
                      chosenSkillIds: checked ? d.chosenSkillIds.filter((x) => x !== sid) : [...d.chosenSkillIds, sid],
                    }))
                  }
                />
                <span className={s.statName}>{sk?.name ?? sid}</span>
                <span className={s.statMod}>{sk?.attribute}</span>
              </label>
            );
          })}
        </div>
      )}

      {kind === 'background' && (
        <div className={s.statList}>
          {(system.backgrounds ?? []).map((bg) => {
            const skills = bg.skillProficiencies.map((sid) => system.skills.find((s2) => s2.id === sid)?.name ?? sid).join(', ');
            const tools = [...(bg.toolProficiencies ?? []), ...(bg.languages ? [`${bg.languages} language${bg.languages > 1 ? 's' : ''}`] : [])].join(', ');
            const selected = draft.backgroundId === bg.id;
            return (
              <button
                key={bg.id}
                className={[s.statRow, selected ? s.active : ''].filter(Boolean).join(' ')}
                style={{ flexDirection: 'column', alignItems: 'stretch', gap: 2 }}
                onClick={() => setDraft((d) => ({ ...d, backgroundId: bg.id }))}
              >
                <span className={s.statName}>{bg.name}</span>
                <span className={s.statMod}>Skills: {skills}{tools ? ` · ${tools}` : ''}</span>
                {selected && bg.feature && (
                  <span className={s.statMod} style={{ marginTop: 4 }}>
                    <strong>{bg.feature.name}:</strong> {bg.feature.description}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {kind === 'spells' && (
        <div className={s.statList}>
          {cantripCount > 0 && (
            <>
              <p className={s.teachText}>Cantrips ({draft.cantripIds.length}/{cantripCount}):</p>
              <div style={grid3}>
              {cantripOptions.map((sp) => {
                const checked = draft.cantripIds.includes(sp.id);
                const full = draft.cantripIds.length >= cantripCount;
                return (
                  <label key={sp.id} className={[s.statRow, checked ? s.active : ''].filter(Boolean).join(' ')}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={!checked && full}
                      onChange={() =>
                        setDraft((d) => ({ ...d, cantripIds: checked ? d.cantripIds.filter((x) => x !== sp.id) : [...d.cantripIds, sp.id] }))
                      }
                    />
                    <span className={s.statName}>{sp.name}</span>
                    <span className={s.statMod}>{sp.school}</span>
                  </label>
                );
              })}
              </div>
            </>
          )}
          {leveledCount > 0 && (
            <>
              <p className={s.teachText}>
                {casterModel === 'spellbook' ? `Spellbook — pick ${leveledCount} 1st-level spells` : `Spells known — pick ${leveledCount}`} ({draft.spellIds.length}/{leveledCount}):
              </p>
              <div style={grid3}>
              {leveledOptions.map((sp) => {
                const checked = draft.spellIds.includes(sp.id);
                const full = draft.spellIds.length >= leveledCount;
                return (
                  <label key={sp.id} className={[s.statRow, checked ? s.active : ''].filter(Boolean).join(' ')}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={!checked && full}
                      onChange={() =>
                        setDraft((d) => ({ ...d, spellIds: checked ? d.spellIds.filter((x) => x !== sp.id) : [...d.spellIds, sp.id] }))
                      }
                    />
                    <span className={s.statName}>{sp.name}</span>
                    <span className={s.statMod}>{sp.school}{sp.concentration ? ' · conc' : ''}</span>
                  </label>
                );
              })}
              </div>
            </>
          )}
          {casterModel === 'prepared' && (
            <p className={s.teachText}>
              As a prepared caster you don't lock in leveled spells now — you prepare them each day from the full {selectedClass?.name} spell list (daily prep arrives with casting).
            </p>
          )}
          {cantripCount === 0 && leveledCount === 0 && (
            <p className={s.teachText}>You gain spellcasting at a later level — nothing to choose yet.</p>
          )}
        </div>
      )}

      {kind === 'finish' && (
        <div className={s.statList}>
          <TextField label="Name" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Your hero's name" />
          {preview && (
            <div className={s.breakdown}>
              <div>AC {preview.ac} · HP {preview.maxHp} · Prof +{preview.proficiencyBonus}</div>
              {preview.attacks.map((a) => (
                <div key={a.name}>{a.name}: {sign(a.attackBonus)} to hit, {a.dice} {a.damageType}</div>
              ))}
              <div>
                Gear:{' '}
                {[
                  ...kit.weaponIds.map((id) => system.equipment.weapons.find((w) => w.id === id)?.name ?? id),
                  kit.armorId ? (system.equipment.armor.find((a) => a.id === kit.armorId)?.name ?? kit.armorId) : 'no armor',
                ].join(', ')}{' '}
                (equipped)
              </div>
              {preview.cls?.spellcasting && (
                <div style={{ color: 'var(--accent-amber)' }}>
                  Spellcasting isn't implemented yet — this class is playable for martial combat;
                  its spells arrive in a later phase.
                </div>
              )}
            </div>
          )}
          {error && <p style={{ color: 'var(--accent-red)' }}>{error}</p>}
        </div>
      )}
    </StepFrame>
  );
}
