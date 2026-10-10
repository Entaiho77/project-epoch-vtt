import { useState } from 'react';
import {
  crToNumber,
  proficiencyBonusForCr,
  saveHomebrewEquipment,
  saveHomebrewMonster,
  type HomebrewAbility,
  type HomebrewAttack,
  type HomebrewEquipment,
  type HomebrewFeature,
  type HomebrewMonster,
  type HomebrewSize,
  type HomebrewSpeeds,
  type HomebrewSpellcasting,
} from '../../../data/homebrew';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { spells as allSpells } from '@epoch/systems/dnd5e/spells';
import { generateLootPool } from '@epoch/systems/dnd5e/lootTables';
import type { GeneratedLootItem } from '@epoch/shared-types';
import s from './drawers.module.css';

const SPELL_NAMES = allSpells.map((sp) => sp.name).sort((a, b) => a.localeCompare(b));

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
const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const satisfies readonly HomebrewAbility[];
const SKILLS = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight',
  'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance', 'Persuasion',
  'Religion', 'Sleight of Hand', 'Stealth', 'Survival',
];
const SPEED_TYPES = ['fly', 'swim', 'climb', 'burrow'] as const;
const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** Object-keyed map (never an array) from a row list, dropping rows without a name. */
function toMap<T extends { name: string }>(rows: T[]): Record<string, T> {
  return Object.fromEntries(
    rows.filter((r) => r.name.trim()).map((r, i) => [`e${i}`, r]),
  );
}

const label: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 2, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' };
const checkGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '2px 12px' };
const mechRow: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 4 };
const sectionHeading: React.CSSProperties = { fontSize: 'var(--text-sm)', fontWeight: 600, marginTop: 'var(--space-3)', display: 'block' };

/**
 * DM form to create/edit a library monster. Repeatable sections (attacks, traits, actions,
 * bonus actions, reactions, legendary/lair/regional/mythic actions) are edited as rows and
 * stored as object-keyed maps. The mechanical fields on each feature row (save DC/ability,
 * recharge, uses, legendary cost, extra damage line, healing) are optional and additive — a
 * row with none of them filled in behaves exactly like a plain name+description entry.
 *
 * On Save, writes to users/$uid/library/monsters (owner-only per the security rules).
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
  const [initiative, setInitiative] = useState(existing?.initiative != null ? String(existing.initiative) : '');
  const [speed, setSpeed] = useState(String(existing?.speed ?? 30));
  const [otherSpeeds, setOtherSpeeds] = useState<Record<keyof Omit<HomebrewSpeeds, 'hover'>, string>>(() => ({
    fly: existing?.otherSpeeds?.fly != null ? String(existing.otherSpeeds.fly) : '',
    swim: existing?.otherSpeeds?.swim != null ? String(existing.otherSpeeds.swim) : '',
    climb: existing?.otherSpeeds?.climb != null ? String(existing.otherSpeeds.climb) : '',
    burrow: existing?.otherSpeeds?.burrow != null ? String(existing.otherSpeeds.burrow) : '',
  }));
  const [hover, setHover] = useState(existing?.otherSpeeds?.hover ?? false);
  // Which extra movement types are shown as rows — only the ones that actually apply, picked
  // from the "+ Add movement type" dropdown, rather than six always-visible fields.
  const [extraSpeedTypes, setExtraSpeedTypes] = useState<Array<typeof SPEED_TYPES[number]>>(() =>
    SPEED_TYPES.filter((t) => existing?.otherSpeeds?.[t] != null && existing.otherSpeeds[t] !== 0),
  );
  const [cr, setCr] = useState(existing?.cr ?? '1');
  const [proficiencyBonus, setProficiencyBonus] = useState(existing?.proficiencyBonus != null ? String(existing.proficiencyBonus) : '');
  const [lore, setLore] = useState(existing?.lore ?? '');
  const [scores, setScores] = useState<Record<string, string>>(() =>
    Object.fromEntries(ABILITIES.map((a) => [a, String(existing?.[a] ?? 10)])),
  );
  const [savingThrows, setSavingThrows] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      ABILITIES.map((a) => [a, existing?.savingThrows?.[a] != null ? String(existing.savingThrows[a]) : '']),
    ),
  );
  const [skillRows, setSkillRows] = useState<{ name: string; bonus: string }[]>(() =>
    Object.entries(existing?.skills ?? {}).map(([skillName, bonus]) => ({ name: skillName, bonus: String(bonus) })),
  );
  const [senses, setSenses] = useState(existing?.senses ?? '');
  const [languages, setLanguages] = useState(existing?.languages ?? '');
  const [resistances, setResistances] = useState<string[]>(existing?.damageResistances ?? []);
  const [resistanceNote, setResistanceNote] = useState(existing?.damageResistanceNote ?? '');
  const [immunities, setImmunities] = useState<string[]>(existing?.damageImmunities ?? []);
  const [immunityNote, setImmunityNote] = useState(existing?.damageImmunityNote ?? '');
  const [vulnerabilities, setVulnerabilities] = useState<string[]>(existing?.damageVulnerabilities ?? []);
  const [vulnerabilityNote, setVulnerabilityNote] = useState(existing?.damageVulnerabilityNote ?? '');
  const [conditionImmunities, setConditionImmunities] = useState<string[]>(existing?.conditionImmunities ?? []);
  const [attacks, setAttacks] = useState<HomebrewAttack[]>(Object.values(existing?.attacks ?? {}));
  const [traits, setTraits] = useState<HomebrewFeature[]>(Object.values(existing?.traits ?? {}));
  const [actions, setActions] = useState<HomebrewFeature[]>(Object.values(existing?.actions ?? {}));
  const [bonusActions, setBonusActions] = useState<HomebrewFeature[]>(Object.values(existing?.bonusActions ?? {}));
  const [reactions, setReactions] = useState<HomebrewFeature[]>(Object.values(existing?.reactions ?? {}));
  const [legendary, setLegendary] = useState<HomebrewFeature[]>(Object.values(existing?.legendaryActions ?? {}));
  const [legendaryActionCount, setLegendaryActionCount] = useState(
    existing?.legendaryActionCount != null ? String(existing.legendaryActionCount) : '3',
  );
  const [lairActions, setLairActions] = useState<HomebrewFeature[]>(Object.values(existing?.lairActions ?? {}));
  const [regionalEffects, setRegionalEffects] = useState<HomebrewFeature[]>(Object.values(existing?.regionalEffects ?? {}));
  const [mythicActions, setMythicActions] = useState<HomebrewFeature[]>(Object.values(existing?.mythicActions ?? {}));
  const [hasSpellcasting, setHasSpellcasting] = useState(!!existing?.spellcasting);
  const [spellAbility, setSpellAbility] = useState<string>(existing?.spellcasting?.ability ?? '');
  const [spellSaveDc, setSpellSaveDc] = useState(existing?.spellcasting?.saveDc != null ? String(existing.spellcasting.saveDc) : '');
  const [spellAttackBonus, setSpellAttackBonus] = useState(existing?.spellcasting?.attackBonus != null ? String(existing.spellcasting.attackBonus) : '');
  // One row per spell — `perDay` blank means at-will, a number means that many times per day.
  // Picked from the real SRD spell list instead of typed freehand.
  const [spellRows, setSpellRows] = useState<{ name: string; perDay: string }[]>(() => [
    ...Object.keys(existing?.spellcasting?.atWill ?? {}).map((name) => ({ name, perDay: '' })),
    ...Object.entries(existing?.spellcasting?.perDay ?? {}).map(([name, n]) => ({ name, perDay: String(n) })),
  ]);
  const [spellNotes, setSpellNotes] = useState(existing?.spellcasting?.notes ?? '');
  const [loot, setLoot] = useState<string[]>(Object.keys(existing?.loot ?? {}));
  // Case-insensitive filter for the loot equipment list (helpful once a DM has many items).
  const [lootSearch, setLootSearch] = useState('');
  // Suggested loot from the CR-based loot generator (data/lootTables.ts) — a preview the DM
  // checks through and saves, rather than having to hand-build equipment first.
  const [suggestedLoot, setSuggestedLoot] = useState<GeneratedLootItem[] | null>(null);
  const [suggestedLootGold, setSuggestedLootGold] = useState(0);
  const [checkedSuggestions, setCheckedSuggestions] = useState<Set<number>>(new Set());
  const [savingSuggestions, setSavingSuggestions] = useState(false);
  // Equipment created from a suggestion this session — merged into the picker below so a
  // newly-added item shows up (checked) immediately, without waiting for the parent's
  // `equipment` prop to refetch.
  const [sessionEquipment, setSessionEquipment] = useState<HomebrewEquipment[]>([]);
  const [busy, setBusy] = useState(false);

  const toggle = (list: string[], set: (v: string[]) => void, val: string) =>
    set(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);

  async function save() {
    if (!name.trim()) return;
    setBusy(true);

    const otherSpeedsOut: HomebrewSpeeds = {};
    if (Number(otherSpeeds.fly) > 0) { otherSpeedsOut.fly = Number(otherSpeeds.fly); if (hover) otherSpeedsOut.hover = true; }
    if (Number(otherSpeeds.swim) > 0) otherSpeedsOut.swim = Number(otherSpeeds.swim);
    if (Number(otherSpeeds.climb) > 0) otherSpeedsOut.climb = Number(otherSpeeds.climb);
    if (Number(otherSpeeds.burrow) > 0) otherSpeedsOut.burrow = Number(otherSpeeds.burrow);

    const savingThrowsOut = Object.fromEntries(
      ABILITIES.filter((a) => savingThrows[a]?.trim()).map((a) => [a, Number(savingThrows[a]) || 0]),
    );
    const skillsOut = Object.fromEntries(
      skillRows.filter((r) => r.name.trim()).map((r) => [r.name.trim(), Number(r.bonus) || 0]),
    );

    let spellcasting: HomebrewSpellcasting | undefined;
    if (hasSpellcasting) {
      const atWill = Object.fromEntries(
        spellRows.filter((r) => r.name && !r.perDay.trim()).map((r) => [r.name, true as const]),
      );
      const perDay = Object.fromEntries(
        spellRows.filter((r) => r.name && r.perDay.trim()).map((r) => [r.name, Number(r.perDay) || 1]),
      );
      // 5e's real formula: spell save DC = 8 + proficiency bonus + ability modifier; spell
      // attack bonus = proficiency bonus + ability modifier. Used as the default whenever the
      // DM leaves the field blank, same treatment as proficiency bonus's own CR default.
      const pb = proficiencyBonus.trim() ? Number(proficiencyBonus) : proficiencyBonusForCr(cr);
      const abilityMod = spellAbility ? Math.floor((Number(scores[spellAbility]) - 10) / 2) : 0;
      spellcasting = {
        ...(spellAbility ? { ability: spellAbility as HomebrewAbility } : {}),
        saveDc: spellSaveDc.trim() ? Number(spellSaveDc) || 0 : 8 + pb + abilityMod,
        attackBonus: spellAttackBonus.trim() ? Number(spellAttackBonus) || 0 : pb + abilityMod,
        ...(Object.keys(atWill).length ? { atWill } : {}),
        ...(Object.keys(perDay).length ? { perDay } : {}),
        ...(spellNotes.trim() ? { notes: spellNotes.trim() } : {}),
      };
    }

    const monster: Omit<HomebrewMonster, 'id'> & { id?: string } = {
      ...(existing?.id ? { id: existing.id } : {}),
      name: name.trim(),
      size,
      type,
      alignment: alignment.trim(),
      hp: Number(hp) || 0,
      ac: Number(ac) || 0,
      ...(initiative.trim() ? { initiative: Number(initiative) || 0 } : {}),
      speed: Number(speed) || 0,
      ...(Object.keys(otherSpeedsOut).length ? { otherSpeeds: otherSpeedsOut } : {}),
      cr: cr.trim() || '0',
      ...(proficiencyBonus.trim() ? { proficiencyBonus: Number(proficiencyBonus) || 0 } : {}),
      str: Number(scores.str) || 10,
      dex: Number(scores.dex) || 10,
      con: Number(scores.con) || 10,
      int: Number(scores.int) || 10,
      wis: Number(scores.wis) || 10,
      cha: Number(scores.cha) || 10,
      ...(Object.keys(savingThrowsOut).length ? { savingThrows: savingThrowsOut } : {}),
      ...(Object.keys(skillsOut).length ? { skills: skillsOut } : {}),
      ...(senses.trim() ? { senses: senses.trim() } : {}),
      ...(languages.trim() ? { languages: languages.trim() } : {}),
      damageResistances: resistances,
      damageImmunities: immunities,
      damageVulnerabilities: vulnerabilities,
      conditionImmunities,
      ...(resistances.length && resistanceNote.trim() ? { damageResistanceNote: resistanceNote.trim() } : {}),
      ...(immunities.length && immunityNote.trim() ? { damageImmunityNote: immunityNote.trim() } : {}),
      ...(vulnerabilities.length && vulnerabilityNote.trim() ? { damageVulnerabilityNote: vulnerabilityNote.trim() } : {}),
      attacks: toMap(attacks),
      traits: toMap(traits),
      actions: toMap(actions),
      bonusActions: toMap(bonusActions),
      reactions: toMap(reactions),
      legendaryActions: toMap(legendary),
      ...(Object.keys(toMap(legendary)).length ? { legendaryActionCount: Number(legendaryActionCount) || 3 } : {}),
      lairActions: toMap(lairActions),
      regionalEffects: toMap(regionalEffects),
      mythicActions: toMap(mythicActions),
      ...(spellcasting ? { spellcasting } : {}),
      ...(lore.trim() ? { lore: lore.trim() } : {}),
      ...(loot.length ? { loot: Object.fromEntries(loot.map((id) => [id, true as const])) } : {}),
    };
    try {
      await saveHomebrewMonster(uid, monster);
      onClose();
    } catch {
      setBusy(false);
    }
  }

  // A multi-select dropdown with removable tags, instead of a wall of checkboxes — picking one
  // closes the dropdown (native <select> behavior) and adds a chip; clicking a chip's × removes
  // it. No layout shift from an always-rendered grid of mostly-unchecked boxes.
  const checkboxGroup = (title: string, options: string[], selected: string[], set: (v: string[]) => void) => {
    const remaining = options.filter((opt) => !selected.includes(opt));
    return (
      <div>
        <span className={s.label}>{title}</span>
        {selected.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
            {selected.map((tag) => (
              <span key={tag} className={s.itemMeta} style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '2px 4px 2px 8px',
                borderRadius: 999, border: '1px solid var(--border-hairline)', background: 'var(--surface-raised)',
              }}>
                {tag}
                <button className={s.place} aria-label={`Remove ${tag}`} onClick={() => toggle(selected, set, tag)} style={{ lineHeight: 1, padding: '0 4px' }}>×</button>
              </span>
            ))}
          </div>
        )}
        {remaining.length > 0 && (
          <select className={s.input} value="" style={{ width: 200 }}
            onChange={(e) => { if (e.target.value) toggle(selected, set, e.target.value); }}>
            <option value="">+ Add {title.toLowerCase()}…</option>
            {remaining.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        )}
      </div>
    );
  };

  // A damage list (resistances/immunities/vulnerabilities) plus its qualifier, e.g. "from
  // nonmagical attacks" — shown only once at least one type is checked, since an empty list
  // has nothing to qualify.
  const damageGroup = (
    title: string,
    options: string[],
    selected: string[],
    set: (v: string[]) => void,
    note: string,
    setNote: (v: string) => void,
  ) => (
    <div>
      {checkboxGroup(title, options, selected, set)}
      {selected.length > 0 && (
        <input
          className={s.input}
          placeholder='Qualifier, e.g. "from nonmagical attacks" (optional)'
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ marginTop: 4 }}
        />
      )}
    </div>
  );

  const attackRows = (
    <div>
      <span className={s.label}>Attacks</span>
      {attacks.map((a, i) => {
        const upd = (patch: Partial<HomebrewAttack>) => setAttacks(attacks.map((x, j) => (j === i ? { ...x, ...patch } : x)));
        return (
          <div key={i} className={s.section} style={{ gap: 4, marginBottom: 6 }}>
            <div className={s.row} style={{ alignItems: 'center', gap: 4 }}>
              <input className={s.input} placeholder="Name" value={a.name} style={{ flex: 2, minWidth: 0 }}
                onChange={(e) => upd({ name: e.target.value })} />
              {/* Removal is its own clear, unsqueezed column — not sharing space with the text
               *  inputs — so it isn't cramped the way it was when every field (including this
               *  button) competed for room in one flex row. */}
              <button className={s.place} style={{ flexShrink: 0, minWidth: 28, marginLeft: 'auto' }}
                onClick={() => setAttacks(attacks.filter((_, j) => j !== i))} aria-label="Remove attack">×</button>
            </div>
            <div className={s.row} style={{ alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <input className={s.input} type="number" placeholder="+hit" value={a.toHit} style={{ width: 60 }}
                onChange={(e) => upd({ toHit: Number(e.target.value) || 0 })} />
              <input className={s.input} placeholder="Range, e.g. reach 5 ft." value={a.range ?? ''} style={{ width: 150 }}
                onChange={(e) => upd({ range: e.target.value || undefined })} />
              <input className={s.input} placeholder="2d6+4" value={a.damageDice} style={{ width: 80 }}
                onChange={(e) => upd({ damageDice: e.target.value })} />
              <select className={s.input} value={a.damageType} style={{ width: 110 }}
                onChange={(e) => upd({ damageType: e.target.value })}>
                {DAMAGE_TYPES.map((dt) => <option key={dt} value={dt}>{dt}</option>)}
              </select>
            </div>
            <div className={s.row} style={{ alignItems: 'center', gap: 4 }}>
              <span className={s.hint} style={{ width: 60 }}>plus:</span>
              <input className={s.input} placeholder="1d6 (extra dice, optional)" value={a.damageDice2 ?? ''} style={{ width: 120 }}
                onChange={(e) => upd({ damageDice2: e.target.value || undefined })} />
              <select className={s.input} value={a.damageType2 ?? ''} style={{ width: 110 }}
                onChange={(e) => upd({ damageType2: e.target.value || undefined })}>
                <option value="">--</option>
                {DAMAGE_TYPES.map((dt) => <option key={dt} value={dt}>{dt}</option>)}
              </select>
            </div>
          </div>
        );
      })}
      <button className={s.place} onClick={() => setAttacks([...attacks, { name: '', toHit: 0, damageDice: '1d6', damageType: 'bludgeoning' }])}>
        + Add attack
      </button>
    </div>
  );

  /** Repeatable feature section (traits/actions/bonus actions/reactions/legendary/lair/regional/
   *  mythic). `showCost` adds the legendary-action-point-cost field. Every mechanical field is
   *  optional — leaving them blank is identical to the old name+description-only row. */
  const featureRows = (
    title: string,
    rows: HomebrewFeature[],
    set: (v: HomebrewFeature[]) => void,
    opts?: { showCost?: boolean },
  ) => (
    <div>
      <span className={s.label}>{title}</span>
      {rows.map((r, i) => {
        const upd = (patch: Partial<HomebrewFeature>) => set(rows.map((x, j) => (j === i ? { ...x, ...patch } : x)));
        return (
          <div key={i} className={s.section} style={{ gap: 4, marginBottom: 8 }}>
            <div className={s.row} style={{ alignItems: 'center', gap: 4 }}>
              <input className={s.input} placeholder="Name" value={r.name} style={{ flex: 1, minWidth: 0 }}
                onChange={(e) => upd({ name: e.target.value })} />
              {opts?.showCost && (
                <input className={s.input} type="number" placeholder="Costs" title="Legendary action point cost (1 if blank)" value={r.cost ?? ''} style={{ width: 60, flexShrink: 0 }}
                  onChange={(e) => upd({ cost: e.target.value ? Number(e.target.value) || undefined : undefined })} />
              )}
              {/* Its own unsqueezed slot, same fix as the attack rows — not sharing space with
               *  the name/cost fields, which is what made it cramped before. */}
              <button className={s.place} style={{ flexShrink: 0, minWidth: 28, marginLeft: opts?.showCost ? 0 : 'auto' }}
                onClick={() => set(rows.filter((_, j) => j !== i))} aria-label={`Remove ${title}`}>×</button>
            </div>
            <textarea className={s.input} placeholder="Description" value={r.description} rows={2}
              onChange={(e) => upd({ description: e.target.value })} />
            <div style={mechRow}>
              <input className={s.input} placeholder="To hit, e.g. +5" value={r.toHit ?? ''} style={{ width: 90 }}
                onChange={(e) => upd({ toHit: e.target.value || undefined })} />
              <input className={s.input} placeholder="Range, e.g. reach 5 ft." value={r.range ?? ''} style={{ width: 140 }}
                onChange={(e) => upd({ range: e.target.value || undefined })} />
              <input className={s.input} placeholder="Damage, e.g. 5 (1d4+3) piercing" value={r.damage ?? ''} style={{ width: 190 }}
                onChange={(e) => upd({ damage: e.target.value || undefined })} />
              <input className={s.input} placeholder="Plus (2nd damage line)" value={r.damage2 ?? ''} style={{ width: 150 }}
                onChange={(e) => upd({ damage2: e.target.value || undefined })} />
              <input className={s.input} placeholder="Healing, e.g. equal to damage dealt" value={r.healing ?? ''} style={{ width: 170 }}
                onChange={(e) => upd({ healing: e.target.value || undefined })} />
            </div>
            <div style={mechRow}>
              <label style={{ ...label, flexDirection: 'row', alignItems: 'center', gap: 4 }}>Save
                <select className={s.input} value={r.saveAbility ?? ''} style={{ width: 70 }}
                  onChange={(e) => upd({ saveAbility: (e.target.value || undefined) as HomebrewAbility | undefined })}>
                  <option value="">--</option>
                  {ABILITIES.map((a) => <option key={a} value={a}>{a.toUpperCase()}</option>)}
                </select>
              </label>
              <input className={s.input} type="number" placeholder="DC" value={r.saveDc ?? ''} style={{ width: 60 }}
                onChange={(e) => upd({ saveDc: e.target.value ? Number(e.target.value) || undefined : undefined })} />
              <select className={s.input} value={r.saveEffect ?? ''} style={{ width: 110 }}
                onChange={(e) => upd({ saveEffect: (e.target.value || undefined) as 'half' | 'none' | undefined })}>
                <option value="">on fail only</option>
                <option value="half">half on success</option>
                <option value="none">none on success</option>
              </select>
              <input className={s.input} placeholder="Recharge, e.g. 5-6" value={r.recharge ?? ''} style={{ width: 110 }}
                onChange={(e) => upd({ recharge: e.target.value || undefined })} />
              <input className={s.input} placeholder="Uses, e.g. 3/Day" value={r.uses ?? ''} style={{ width: 110 }}
                onChange={(e) => upd({ uses: e.target.value || undefined })} />
            </div>
          </div>
        );
      })}
      <button className={s.place} onClick={() => set([...rows, { name: '', description: '' }])}>+ Add {title.toLowerCase()}</button>
    </div>
  );

  const allEquipment = sessionEquipment.length ? [...equipment, ...sessionEquipment] : equipment;
  const lootQuery = lootSearch.trim().toLowerCase();
  const filteredEquipment = lootQuery
    ? allEquipment.filter((eq) => eq.name.toLowerCase().includes(lootQuery))
    : allEquipment;

  function suggestLoot() {
    const pool = generateLootPool([{ name: name.trim() || 'Monster', cr: crToNumber(cr) }], equipment);
    setSuggestedLoot(pool.items);
    setSuggestedLootGold(pool.gold);
    setCheckedSuggestions(new Set(pool.items.map((_, i) => i)));
  }

  // Saves each checked suggestion as a new library equipment item (so it shows up in the
  // DM's Equipment tab too, not just on this monster) and attaches it as loot. A suggestion
  // that happens to match something already in the library by name is reused instead of
  // creating a duplicate.
  async function addCheckedSuggestions() {
    if (!suggestedLoot) return;
    setSavingSuggestions(true);
    const newLootIds: string[] = [];
    const newEquipment: HomebrewEquipment[] = [];
    for (const i of checkedSuggestions) {
      const item = suggestedLoot[i];
      const existingMatch = [...equipment, ...sessionEquipment].find((eq) => eq.name.toLowerCase() === item.name.toLowerCase());
      if (existingMatch) {
        newLootIds.push(existingMatch.id);
        continue;
      }
      const { id: _droppedId, revealDescription: _droppedReveal, rarity: _droppedRarity, ...rest } = item;
      const id = await saveHomebrewEquipment(uid, rest);
      newLootIds.push(id);
      newEquipment.push({ ...rest, id });
    }
    setSessionEquipment([...sessionEquipment, ...newEquipment]);
    setLoot([...new Set([...loot, ...newLootIds])]);
    setSuggestedLoot(null);
    setSavingSuggestions(false);
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={existing ? `Edit ${existing.name}` : 'New Homebrew Monster'}
      width={720}
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
          <label style={label}>Initiative<input className={s.input} type="number" value={initiative} onChange={(e) => setInitiative(e.target.value)} placeholder="uses DEX" /></label>
          <label style={label}>CR<input className={s.input} value={cr} onChange={(e) => setCr(e.target.value)} placeholder="1/4" /></label>
          <label style={label}>Prof. bonus<input className={s.input} type="number" value={proficiencyBonus} onChange={(e) => setProficiencyBonus(e.target.value)} placeholder={`+${proficiencyBonusForCr(cr)} (from CR table)`} /></label>
        </div>

        <span className={s.label}>Speed</span>
        <div className={s.row} style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={label}>Walk<input className={s.input} type="number" style={{ width: 70 }} value={speed} onChange={(e) => setSpeed(e.target.value)} /></label>
          {extraSpeedTypes.map((t) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <label style={label}>{cap(t)}<input className={s.input} type="number" style={{ width: 70 }} value={otherSpeeds[t]} onChange={(e) => setOtherSpeeds({ ...otherSpeeds, [t]: e.target.value })} /></label>
              {t === 'fly' && (
                <label className={s.itemMeta} style={{ display: 'flex', alignItems: 'center', gap: 4, alignSelf: 'center' }}>
                  <input type="checkbox" checked={hover} onChange={(e) => setHover(e.target.checked)} /> hover
                </label>
              )}
              <button className={s.place} aria-label={`Remove ${t} speed`} style={{ alignSelf: 'center' }}
                onClick={() => { setExtraSpeedTypes(extraSpeedTypes.filter((x) => x !== t)); setOtherSpeeds({ ...otherSpeeds, [t]: '' }); }}>
                ×
              </button>
            </div>
          ))}
          {extraSpeedTypes.length < SPEED_TYPES.length && (
            <select className={s.input} value="" style={{ width: 170, alignSelf: 'center' }}
              onChange={(e) => { const t = e.target.value as typeof SPEED_TYPES[number]; if (t) setExtraSpeedTypes([...extraSpeedTypes, t]); }}>
              <option value="">+ Add movement type…</option>
              {SPEED_TYPES.filter((t) => !extraSpeedTypes.includes(t)).map((t) => (
                <option key={t} value={t}>{cap(t)}</option>
              ))}
            </select>
          )}
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

        <div>
          <span className={s.label}>Saving throws (leave blank unless proficient)</span>
          <div className={s.row}>
            {ABILITIES.map((a) => (
              <label key={a} style={label}>{a.toUpperCase()}
                <input className={s.input} type="number" style={{ width: 56 }} value={savingThrows[a]} placeholder="--"
                  onChange={(e) => setSavingThrows({ ...savingThrows, [a]: e.target.value })} />
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className={s.label}>Skills</span>
          {skillRows.map((r, i) => (
            <div key={i} className={s.row} style={{ alignItems: 'center', gap: 4 }}>
              <select className={s.input} value={r.name} style={{ flex: 1 }}
                onChange={(e) => setSkillRows(skillRows.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}>
                <option value="">Select a skill…</option>
                {SKILLS.map((sk) => <option key={sk} value={sk}>{sk}</option>)}
              </select>
              <input className={s.input} type="number" placeholder="bonus" value={r.bonus} style={{ width: 70 }}
                onChange={(e) => setSkillRows(skillRows.map((x, j) => (j === i ? { ...x, bonus: e.target.value } : x)))} />
              <button className={s.place} onClick={() => setSkillRows(skillRows.filter((_, j) => j !== i))} aria-label="Remove skill">×</button>
            </div>
          ))}
          <button className={s.place} onClick={() => setSkillRows([...skillRows, { name: '', bonus: '' }])}>+ Add skill</button>
        </div>

        <div className={s.row}>
          <label style={{ ...label, flex: 1 }}>Senses
            <input className={s.input} value={senses} onChange={(e) => setSenses(e.target.value)} placeholder="e.g. truesight 120 ft., passive Perception 13" />
          </label>
          <label style={{ ...label, flex: 1 }}>Languages
            <input className={s.input} value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="e.g. Common, Draconic, or None" />
          </label>
        </div>

        {damageGroup('Damage resistances', DAMAGE_TYPES, resistances, setResistances, resistanceNote, setResistanceNote)}
        {damageGroup('Damage immunities', DAMAGE_TYPES, immunities, setImmunities, immunityNote, setImmunityNote)}
        {damageGroup('Damage vulnerabilities', DAMAGE_TYPES, vulnerabilities, setVulnerabilities, vulnerabilityNote, setVulnerabilityNote)}
        {checkboxGroup('Condition immunities', CONDITIONS, conditionImmunities, setConditionImmunities)}

        {attackRows}

        <span style={sectionHeading}>Features</span>
        {featureRows('Traits', traits, setTraits)}
        {featureRows('Actions', actions, setActions)}
        {featureRows('Bonus Actions', bonusActions, setBonusActions)}
        {featureRows('Reactions', reactions, setReactions)}

        <span style={sectionHeading}>Legendary creature (leave empty for a non-legendary monster)</span>
        {legendary.length > 0 && (
          <label style={label}>Legendary actions per round
            <input className={s.input} type="number" style={{ width: 70 }} value={legendaryActionCount} onChange={(e) => setLegendaryActionCount(e.target.value)} />
          </label>
        )}
        {featureRows('Legendary Actions', legendary, setLegendary, { showCost: true })}
        {featureRows('Lair Actions', lairActions, setLairActions)}
        {featureRows('Regional Effects', regionalEffects, setRegionalEffects)}
        {featureRows('Mythic Actions', mythicActions, setMythicActions)}

        <span style={sectionHeading}>Spellcasting</span>
        <label className={s.itemMeta} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input type="checkbox" checked={hasSpellcasting} onChange={(e) => setHasSpellcasting(e.target.checked)} />
          This creature casts spells
        </label>
        {hasSpellcasting && (() => {
          // Same CR-table default used for the monster's own proficiency bonus (above),
          // applied to 5e's real spellcasting formulas: DC = 8 + prof + ability mod;
          // attack bonus = prof + ability mod. Shown as the placeholder so leaving these
          // blank still saves the correct computed number, not a guess.
          const pb = proficiencyBonus.trim() ? Number(proficiencyBonus) || 0 : proficiencyBonusForCr(cr);
          const abilityMod = spellAbility ? Math.floor((Number(scores[spellAbility]) - 10) / 2) : 0;
          return (
            <div className={s.section} style={{ gap: 4 }}>
              <div className={s.row}>
                <label style={label}>Ability
                  <select className={s.input} value={spellAbility} onChange={(e) => setSpellAbility(e.target.value)}>
                    <option value="">--</option>
                    {ABILITIES.map((a) => <option key={a} value={a}>{a.toUpperCase()}</option>)}
                  </select>
                </label>
                <label style={label}>Spell save DC
                  <input className={s.input} type="number" style={{ width: 70 }} value={spellSaveDc} onChange={(e) => setSpellSaveDc(e.target.value)} placeholder={`${8 + pb + abilityMod}`} />
                </label>
                <label style={label}>Spell attack bonus
                  <input className={s.input} type="number" style={{ width: 70 }} value={spellAttackBonus} onChange={(e) => setSpellAttackBonus(e.target.value)} placeholder={`${pb + abilityMod >= 0 ? '+' : ''}${pb + abilityMod}`} />
                </label>
              </div>
              <span className={s.hint}>Blank DC/attack bonus uses 8 + proficiency + ability mod (DC) or proficiency + ability mod (attack), once an ability is picked above.</span>

              <span className={s.label}>Spells</span>
              {spellRows.map((r, i) => (
                <div key={i} className={s.row} style={{ alignItems: 'center', gap: 4 }}>
                  <select className={s.input} value={r.name} style={{ flex: 1, minWidth: 0 }}
                    onChange={(e) => setSpellRows(spellRows.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}>
                    <option value="">Select a spell…</option>
                    {SPELL_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <input className={s.input} type="number" placeholder="At will" title="Times per day — leave blank for at-will" value={r.perDay} style={{ width: 90, flexShrink: 0 }}
                    onChange={(e) => setSpellRows(spellRows.map((x, j) => (j === i ? { ...x, perDay: e.target.value } : x)))} />
                  <span className={s.hint} style={{ flexShrink: 0 }}>/day</span>
                  <button className={s.place} style={{ flexShrink: 0 }} onClick={() => setSpellRows(spellRows.filter((_, j) => j !== i))} aria-label="Remove spell">×</button>
                </div>
              ))}
              <button className={s.place} onClick={() => setSpellRows([...spellRows, { name: '', perDay: '' }])}>+ Add spell</button>

              <label style={label}>Notes
                <textarea className={s.input} value={spellNotes} onChange={(e) => setSpellNotes(e.target.value)} rows={2} placeholder="Anything else — components, caster level, etc." />
              </label>
            </div>
          );
        })()}

        <label style={label}>Lore
          <textarea className={s.input} value={lore} onChange={(e) => setLore(e.target.value)} rows={3} placeholder="Flavor text, shown in the creature's detail view." />
        </label>

        <div>
          <span className={s.label}>Loot</span>
          <div className={s.row} style={{ alignItems: 'center', marginBottom: 6 }}>
            <Button variant="secondary" onClick={suggestLoot}>Suggest loot for CR {cr || '0'}…</Button>
            <span className={s.hint}>Generates from the loot tables so you don't have to hand-build equipment first.</span>
          </div>

          {suggestedLoot && (
            <div className={s.section} style={{ gap: 4, marginBottom: 8 }}>
              <span className={s.hint}>Also rolled {suggestedLootGold} gp (not attachable here — gold is handed out at loot time, not stored on the monster). Uncheck anything you don't want, then add the rest to your library.</span>
              {suggestedLoot.length === 0 ? (
                <p className={s.hint}>Nothing rolled this time — try again, or at a different CR.</p>
              ) : (
                <div style={checkGrid}>
                  {suggestedLoot.map((item, i) => (
                    <label key={i} className={s.itemMeta} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input type="checkbox" checked={checkedSuggestions.has(i)}
                        onChange={() => setCheckedSuggestions((prev) => {
                          const next = new Set(prev);
                          if (next.has(i)) next.delete(i); else next.add(i);
                          return next;
                        })} />
                      {item.name}{item.rarity ? ` (${item.rarity})` : ''}
                    </label>
                  ))}
                </div>
              )}
              <div className={s.row} style={{ gap: 4 }}>
                <Button onClick={() => void addCheckedSuggestions()} disabled={savingSuggestions || checkedSuggestions.size === 0}>
                  {savingSuggestions ? 'Adding…' : `Add ${checkedSuggestions.size} checked to library + loot`}
                </Button>
                <Button variant="secondary" onClick={() => setSuggestedLoot(null)}>Discard</Button>
              </div>
            </div>
          )}

          {allEquipment.length === 0 ? (
            <p className={s.hint}>No homebrew equipment yet. Suggest some above, or create items in the Equipment tab, then attach them here.</p>
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
