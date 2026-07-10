import { useEffect, useMemo, useState } from 'react';
import type { Dnd5eSpell, SystemDefinition } from '@solryn/shared-types';
import type { Character } from '@solryn/shared-types';
import { attackAdvantage, autoCritAgainst, combineAdvantage, describeRoll, effectsFor, getCombatResolver, rollDice } from '@solryn/engine';
import { equipInventoryItem, removeInventoryItem, restoreSpellSlots, setConcentrating, setFeatResource, setLevelUpPending, setPoolCurrent, setSpellSlot, setSubclass } from '../../data/characters';
import { xpProgress } from '@solryn/systems/dnd5e/xp';
import { pcDerived, ABILITY_IDS } from '@solryn/systems/dnd5e/character';
import { spells as allSpells, getSpellsForClass } from '@solryn/systems/dnd5e/spells';
import { concentrationOnCast, spellCastLog, spellDamage } from '@solryn/systems/dnd5e/spellCast';
import type { CampaignRules } from '../../data/homebrew';
import { LevelUpModal } from './LevelUpModal';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { ResourceTracker } from '../sheet/ResourceTracker';
import { useRollLog } from '../rolllog/rollLog';
import s from '../board/drawers/drawers.module.css';

const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
const row: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' };
// The app's standard body text (stat panel / roll log): full-size, primary color, sans. Used to
// override the smaller/darker .hint/.itemMeta classes for spell text without touching shared CSS.
const bodyText: React.CSSProperties = { fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-primary)' };
// Secondary metadata (school tags, casting line): same body size, muted color.
const metaBase: React.CSSProperties = { fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-muted)' };

const spellById = (id: string): Dnd5eSpell | undefined => allSpells.find((sp) => sp.id === id);
const levelLabel = (lvl: number) => (lvl === 0 ? 'Cantrips' : `Level ${lvl}`);

/** Fold a flat damage add into a dice string's modifier (GWM/Sharpshooter +10). "1d8+3" → "1d8+13".
 *  Kept in the modifier (not a bonus die) so it correctly does NOT double on a crit. */
function addFlatDamage(dice: string, add: number): string {
  const m = dice.match(/^(\d*d\d+)\s*([+-]\d+)?$/i);
  if (!m) return dice;
  const base = (m[2] ? parseInt(m[2], 10) : 0) + add;
  return base === 0 ? m[1] : `${m[1]}${base > 0 ? '+' : ''}${base}`;
}

/** Group spells by level, ascending (cantrips first). */
function byLevel(list: Dnd5eSpell[]): [number, Dnd5eSpell[]][] {
  const m = new Map<number, Dnd5eSpell[]>();
  for (const sp of list) (m.get(sp.level) ?? m.set(sp.level, []).get(sp.level)!).push(sp);
  return [...m.entries()].sort((a, b) => a[0] - b[0]);
}

/**
 * The 5e play sheet (in-game drawer) — selected by system for class-and-level characters; the
 * Solryn CharacterQuickView is untouched. Casters get two tabs (Combat / Spellbook); non-casters
 * see the single combat sheet with no tabs and no spell section. Attacks and attack spells route
 * through the shared attackRollVsAc resolver; save/utility spells post via the ability-roll path.
 */
export function Dnd5eSheet({
  system,
  character,
  target,
  startingLevel,
  rules,
  attackerConditions,
}: {
  system: SystemDefinition;
  character: Character;
  /** The current click-to-target token (AC + conditions used when present); undefined → manual AC. */
  target?: { id: string; name: string; ac?: number; conditions?: Record<string, true> };
  /** GM-set starting level (5e). When the character is below it with a pending level-up, the sheet
   *  auto-opens the level-up flow and re-arms it each level until the character reaches it. */
  startingLevel?: number;
  /** Campaign rules (crit threshold/formula for attacks; feats/startingHp for the level-up flow). */
  rules?: CampaignRules;
  /** The viewer's own token conditions (the attacker's) for advantage/disadvantage + can't-act. */
  attackerConditions?: Record<string, true>;
}) {
  const { postRoll } = useRollLog();
  const resolver = getCombatResolver(system);
  const d = pcDerived(system, character);
  const hpCurrent = character.play.pools?.hp?.current ?? d.maxHp;
  const xp = character.play.xp ?? 0;
  const xpProg = xpProgress(xp, character.play.level);

  const [tab, setTab] = useState<'combat' | 'spellbook'>('combat');
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [detailSpell, setDetailSpell] = useState<Dnd5eSpell | null>(null);
  const [targetAc, setTargetAc] = useState(13);
  const [advantage, setAdvantage] = useState<'advantage' | 'disadvantage' | undefined>();
  const [sneak, setSneak] = useState(false);
  const [powerAttack, setPowerAttack] = useState(false);
  const [lucky, setLucky] = useState(false);
  // Per-spell chosen slot level for upcasting (defaults to the spell's own level).
  const [slotChoice, setSlotChoice] = useState<Record<string, number>>({});
  const [spellQuery, setSpellQuery] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');

  // Start-above-1 catch-up: a freshly-built character (pending level-up) below the game's starting
  // level chains the normal level-up flow — auto-opening it, and re-arming it after each level —
  // until it reaches that level. Pure reuse of the milestone flow; no leveling logic of its own.
  const targetLevel = Math.min(20, Math.max(1, startingLevel ?? 1));
  const catchingUp = !!character.play.levelUpPending && character.play.level < targetLevel;
  useEffect(() => {
    if (catchingUp) setLevelUpOpen(true);
    // character.play.level in the deps re-opens the flow for the next level after each apply.
  }, [catchingUp, character.play.level]);
  // After a level-up is applied (level already bumped, pending cleared), re-arm if still short.
  const onLevelUpDone = () => {
    setLevelUpOpen(false);
    if (character.play.level + 1 < targetLevel) void setLevelUpPending(character.id, true);
  };

  // A targeted token with a known AC drives the roll (AC read from its stat block, name shown
  // in the log); otherwise fall back to the typed Target AC.
  const usingTarget = target != null && typeof target.ac === 'number';
  const attackLabel = (name: string) =>
    usingTarget ? `${character.name} → ${target!.name} — ${name}` : `${character.name} — ${name}`;

  // Campaign crit rules: the effective weapon crit threshold is the lower of the campaign rule and
  // the character's own (Champion's Improved/Superior Critical), and crit damage uses the campaign
  // formula. These fall back to standard 5e (nat-20 / double dice) when no rules are supplied.
  const critThreshold = Math.min(rules?.critThreshold ?? 20, d.critThreshold);
  const critFormula = rules?.critFormula;
  const critFormulaCustom = rules?.critFormulaCustom;

  // Token conditions: advantage/disadvantage from attacker + target, plus auto-crit (melee within
  // 5 ft, assumed) and can't-act. Manual advantage takes precedence when the player sets it.
  const targetEffects = effectsFor(system.tokenConditions, target?.conditions);
  const attackerEffects = effectsFor(system.tokenConditions, attackerConditions);
  const conditionAdvantage = attackAdvantage(attackerEffects, targetEffects, true);
  const autoCrit = autoCritAgainst(targetEffects, true);
  const attackerCantAct = !!attackerEffects.cantAct;
  const targetResists = !!targetEffects.resistAllDamage;

  // Great Weapon Master / Sharpshooter: −5 to hit, +10 damage when the toggle is on.
  const pa = powerAttack && d.powerAttack ? d.powerAttack : undefined;
  const rollAttack = (atk: (typeof d.attacks)[number]) => {
    const line = resolver.resolveAttack({
      label: attackLabel(atk.name),
      dice: pa ? addFlatDamage(atk.dice, pa.damage) : atk.dice,
      damageType: atk.damageType,
      attackBonus: atk.attackBonus + (pa?.toHit ?? 0),
      targetAc: usingTarget ? target!.ac : targetAc,
      advantage: combineAdvantage(advantage, conditionAdvantage),
      critThreshold: autoCrit ? 1 : critThreshold,
      ...(critFormula ? { critFormula } : {}),
      ...(critFormulaCustom ? { critFormulaCustom } : {}),
      // Sneak Attack: manual — player enables when it applies (adv / ally adjacent). Doubles on a crit.
      ...(sneak && d.sneakAttackDice ? { bonusDamage: { dice: d.sneakAttackDice, label: 'Sneak Attack' } } : {}),
    }).logText;
    postRoll(targetResists ? `${line} · target resists — halve the damage` : line);
  };

  // Dragonborn breath weapon — plain damage roll + save note, via the same path as monster
  // abilities: never through the attack resolver, so it isn't a to-hit roll.
  const rollBreath = () => {
    if (!d.breath) return;
    const r = rollDice(d.breath.dice);
    const shape = d.breath.shape === 'cone' ? `${d.breath.size} ft cone` : `${d.breath.size} ft line`;
    const line = `${describeRoll(`${character.name} — Breath Weapon`, r, { type: d.breath.damageType })} · ${shape} · DC ${d.breath.dc} DEX save for half (${Math.floor(r.total / 2)})`;
    postRoll(line);
  };

  // --- Spellcasting (caster only) -------------------------------------------
  const known = character.definition.knownSpellIds ?? [];
  const book = character.definition.spellbookSpellIds ?? [];
  const prepared = character.play.preparedSpellIds ?? [];
  const model = d.spell?.model;

  // Warlock Pact Magic: all slots are a single level (the pact level); casting always spends one
  // of those, and there's no upcast choice. maxSlots is already a single {pactLevel: count} record.
  const isWarlock = d.cls?.id === 'warlock';
  const pactLevel = isWarlock ? Number(Object.keys(d.spell?.maxSlots ?? {})[0]) : undefined;

  const damageAt = (sp: Dnd5eSpell, slotLevel: number) => spellDamage(sp, slotLevel, character.play.level);
  const currentSlots = (level: number) => character.play.spellSlots?.[level] ?? d.spell?.maxSlots[level] ?? 0;

  const castSpell = (sp: Dnd5eSpell, slotLevel: number) => {
    // Build the log line via the shared resolvers (attack / save / utility), then spend a slot.
    postRoll(
      spellCastLog(sp, {
        casterName: character.name,
        ...(usingTarget && sp.attackType ? { targetName: target!.name } : {}),
        targetAc: usingTarget ? target!.ac : targetAc,
        advantage: combineAdvantage(advantage, conditionAdvantage),
        saveDc: d.spell!.saveDc,
        attackBonus: d.spell!.attackBonus,
        dice: damageAt(sp, slotLevel),
        resolver,
        // Spell attacks crit on the campaign threshold (Champion doesn't apply) with the campaign
        // formula; a paralyzed/unconscious target within 5 ft auto-crits.
        critThreshold: autoCrit ? 1 : (rules?.critThreshold ?? 20),
        ...(critFormula ? { critFormula } : {}),
        ...(critFormulaCustom ? { critFormulaCustom } : {}),
      }),
    );
    // Concentration: casting a concentration spell breaks any previous one (logged) and becomes
    // the active one. Non-concentration spells leave play.concentrating alone.
    const conc = concentrationOnCast(character.play.concentrating, sp, character.name);
    if (conc) {
      if (conc.breakLog) postRoll(conc.breakLog);
      void setConcentrating(character.id, conc.concentrating);
    }
    // Spend a slot for leveled spells (cantrips are at-will). Persists to Firebase.
    if (sp.level > 0) {
      void setSpellSlot(character.id, slotLevel, Math.max(0, currentSlots(slotLevel) - 1));
    }
  };
  const endConcentration = () => void setConcentrating(character.id, null);

  // Combat-tab castable list: cantrips (always known) + the leveled list for the model. Prepared
  // casters have no daily-prep UI yet (G2), so fall back to the full preparable source.
  const combatSpells = useMemo(() => {
    if (!d.spell) return [] as Dnd5eSpell[];
    const cantripIds = known.filter((id) => spellById(id)?.level === 0);
    let leveledIds: string[];
    if (model === 'known') leveledIds = known.filter((id) => (spellById(id)?.level ?? 0) > 0);
    else if (model === 'spellbook') leveledIds = prepared.length ? prepared : book;
    else
      leveledIds = prepared.length
        ? prepared
        : getSpellsForClass(d.cls?.id ?? '', allSpells).filter((sp) => sp.level > 0).map((sp) => sp.id);
    return [...new Set([...cantripIds, ...leveledIds])]
      .map(spellById)
      .filter((x): x is Dnd5eSpell => !!x);
  }, [d.spell, model, known, book, prepared, d.cls?.id]);

  // Spellbook-tab reference list (read-only): the full source of spells for the model.
  const spellbookSpells = useMemo(() => {
    if (!d.spell) return [] as Dnd5eSpell[];
    if (model === 'prepared') return getSpellsForClass(d.cls?.id ?? '', allSpells);
    const ids = model === 'spellbook' ? [...new Set([...book, ...known.filter((id) => spellById(id)?.level === 0)])] : known;
    return ids.map(spellById).filter((x): x is Dnd5eSpell => !!x);
  }, [d.spell, model, known, book, d.cls?.id]);

  const schools = useMemo(
    () => [...new Set(spellbookSpells.map((sp) => sp.school))].sort(),
    [spellbookSpells],
  );
  const q = spellQuery.trim().toLowerCase();
  const filteredBook = spellbookSpells.filter(
    (sp) => (!q || sp.name.toLowerCase().includes(q)) && (!schoolFilter || sp.school === schoolFilter),
  );

  const showCombat = !d.spell || tab === 'combat';

  return (
    <div className={s.section}>
      <span className={s.label}>{character.name} · {d.cls?.name ?? 'Adventurer'} {character.play.level}</span>
      {d.raceName && (
        <span className={s.itemMeta}>
          {d.subraceName ? `${d.subraceName} · ` : ''}{d.raceName} · {d.speed} ft speed
        </span>
      )}

      {/* Level-up available — a GM milestone grant, or catch-up to the game's starting level. */}
      {character.play.levelUpPending && (
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-raised)', border: '1px solid var(--accent-amber)' }}
        >
          <span>
            <strong>Level up available!</strong>{' '}
            {catchingUp ? `Catching up to level ${targetLevel}.` : 'You reached a milestone.'}
          </span>
          <Button size="sm" onClick={() => setLevelUpOpen(true)}>Level up</Button>
        </div>
      )}
      {levelUpOpen && character.play.levelUpPending && (
        <LevelUpModal system={system} character={character} rules={rules} onDone={onLevelUpDone} />
      )}

      {/* Tabs (casters only). Non-casters see the plain combat sheet, no tabs. */}
      {d.spell && (
        <div className={s.tabs}>
          <button className={`${s.tab} ${tab === 'combat' ? s.tabActive : ''}`} onClick={() => setTab('combat')}>
            Combat
          </button>
          <button className={`${s.tab} ${tab === 'spellbook' ? s.tabActive : ''}`} onClick={() => setTab('spellbook')}>
            Spellbook
          </button>
        </div>
      )}

      {showCombat && (
        <>
          {/* Ability scores + modifiers */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {ABILITY_IDS.map((id) => (
              <span key={id} className={s.preview} title={id}>
                <strong>{id}</strong> {d.scores[id] ?? 10} ({sign(d.mods[id] ?? 0)})
              </span>
            ))}
          </div>

          {/* Core combat numbers */}
          <div style={row}><span className={s.itemMeta}>Armor Class</span><strong>{d.ac}</strong></div>
          <div style={row}><span className={s.itemMeta}>Proficiency</span><span>{sign(d.proficiencyBonus)}</span></div>
          <ResourceTracker
            label="HP"
            current={hpCurrent}
            max={d.maxHp}
            onChange={(n) => void setPoolCurrent(character.id, 'hp', n)}
          />

          {/* Experience — progress toward the next level; "Level Up!" appears at the threshold. */}
          <div style={row}>
            <span className={s.itemMeta}>Experience</span>
            <span>{xp.toLocaleString()}{xpProg.atMax ? ' · Level 20 (max)' : ` / ${xpProg.nextThreshold.toLocaleString()} XP`}</span>
          </div>
          {!xpProg.atMax && (
            <div style={{ height: 6, background: 'var(--surface-raised)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${Math.round(xpProg.fraction * 100)}%`, height: '100%', background: 'var(--accent-teal)' }} />
            </div>
          )}
          {xpProg.canLevelUp && !character.play.levelUpPending && (
            <Button size="sm" onClick={() => void setLevelUpPending(character.id, true)}>Level Up!</Button>
          )}

          {/* Saving throws */}
          <span className={s.label}>Saving throws</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {d.saves.map((sv) => (
              <span key={sv.id} className={s.preview} title={sv.proficient ? 'proficient' : undefined}>
                {sv.id} {sign(sv.mod)}{sv.proficient ? ' ●' : ''}
              </span>
            ))}
          </div>

          {/* Skills (proficient) */}
          {d.skills.length > 0 && (
            <>
              <span className={s.label}>Skills</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {d.skills.map((sk) => (
                  <span key={sk.id} className={s.preview}>{sk.name} {sign(sk.mod)}</span>
                ))}
              </div>
            </>
          )}

          {/* Attacks — through attackRollVsAc. AC comes from the current target when one is set
              (right-click a creature on the board); otherwise the typed Target AC is the fallback. */}
          <span className={s.label}>Attacks</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {usingTarget ? (
              <span className={s.itemMeta}>
                Target: <strong>{target!.name}</strong> (AC {target!.ac})
              </span>
            ) : (
              <label className={s.itemMeta} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                {target ? `${target.name} (no AC) — ` : ''}Target AC
                <input type="number" value={targetAc} onChange={(e) => setTargetAc(Number(e.target.value) || 0)} style={{ width: 56 }} />
              </label>
            )}
            <select
              className={s.itemMeta}
              value={advantage ?? 'normal'}
              onChange={(e) => setAdvantage(e.target.value === 'normal' ? undefined : (e.target.value as 'advantage' | 'disadvantage'))}
              aria-label="Roll mode"
            >
              <option value="normal">Normal</option>
              <option value="advantage">Advantage</option>
              <option value="disadvantage">Disadvantage</option>
            </select>
            {d.sneakAttackDice && (
              <label className={s.itemMeta} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }} title="Adds Sneak Attack dice on a hit — enable when it applies (advantage or an ally adjacent).">
                <input type="checkbox" checked={sneak} onChange={(e) => setSneak(e.target.checked)} />
                Sneak Attack ({d.sneakAttackDice})
              </label>
            )}
            {d.powerAttack && (
              <label className={s.itemMeta} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }} title="Great Weapon Master / Sharpshooter: take −5 to hit for +10 damage (heavy/ranged weapons).">
                <input type="checkbox" checked={powerAttack} onChange={(e) => setPowerAttack(e.target.checked)} />
                Power Attack ({sign(d.powerAttack.toHit)}/{sign(d.powerAttack.damage)})
              </label>
            )}
          </div>
          {!usingTarget && (
            <p className={s.hint}>Right-click a creature on the board to attack its AC automatically.</p>
          )}
          {attackerCantAct && (
            <p className={s.hint} style={{ color: 'var(--accent-red)' }}>Incapacitated — can’t take actions.</p>
          )}
          {d.attacks.map((atk) => (
            <div key={atk.name} style={row}>
              <span className={s.itemMeta} style={bodyText}>{atk.name}: {sign(atk.attackBonus)} to hit, {atk.dice} {atk.damageType}</span>
              <Button size="sm" disabled={attackerCantAct} onClick={() => rollAttack(atk)}>Roll</Button>
            </div>
          ))}

          {/* Concentration banner — the one active concentration spell + a manual End + the
              damage-triggered CON-save reminder (the save itself is rolled manually). */}
          {d.spell && character.play.concentrating && (
            <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-raised)', border: '1px solid var(--accent-teal)' }}>
              <div style={row}>
                <span style={bodyText}>Concentrating: <strong>{character.play.concentrating.spellName}</strong></span>
                <Button size="sm" variant="ghost" onClick={endConcentration}>End</Button>
              </div>
              <p className={s.hint} style={{ margin: 0 }}>Take damage? Roll a CON save to maintain concentration.</p>
            </div>
          )}

          {/* Spells — cast alongside weapons, grouped by level (cantrips first). */}
          {d.spell && combatSpells.length > 0 && (
            <>
              <span className={s.label}>Spells</span>
              {byLevel(combatSpells).map(([lvl, list]) => (
                <div key={lvl}>
                  <p className={s.hint} style={{ marginBottom: 2 }}>{levelLabel(lvl)}{lvl > 0 ? ' (1 slot)' : ' · at-will'}</p>
                  {list.map((sp) => {
                    // Warlock always casts leveled spells with a pact slot (its single level); no
                    // upcast choice. Other casters pick the slot (default = the spell's own level).
                    const chosen = lvl === 0 ? 0 : isWarlock ? pactLevel! : (slotChoice[sp.id] ?? lvl);
                    // Upcast options: slot levels ≥ the spell's level that the class has (none for Warlock).
                    const upcasts = lvl === 0 || isWarlock ? [] : Object.keys(d.spell!.maxSlots).map(Number).filter((L) => L >= lvl);
                    const noSlot = lvl > 0 && currentSlots(chosen) <= 0;
                    const dmg = damageAt(sp, chosen);
                    return (
                      <div key={sp.id} style={row}>
                        <span style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                          <span className={s.itemMeta} style={{ ...bodyText, overflowWrap: 'anywhere' }}>
                            {sp.name}
                            {sp.concentration ? ' (concentration)' : ''}
                            {dmg ? ` — ${dmg} ${sp.damageType ?? ''}` : ''}
                            {sp.attackType ? ' · spell attack' : sp.save ? ` · ${sp.save} save` : ''}
                          </span>
                          <span className={s.itemMeta} style={metaBase}>{sp.school} · {sp.castingTime} · {sp.range}</span>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                          {upcasts.length > 1 && (
                            <select
                              className={s.itemMeta}
                              value={chosen}
                              onChange={(e) => setSlotChoice((c) => ({ ...c, [sp.id]: Number(e.target.value) }))}
                              aria-label="Slot level"
                              title="Cast using a higher-level slot (upcast)"
                            >
                              {upcasts.map((L) => (
                                <option key={L} value={L} disabled={currentSlots(L) <= 0}>
                                  Lv{L} ({currentSlots(L)})
                                </option>
                              ))}
                            </select>
                          )}
                          <Button size="sm" disabled={noSlot} onClick={() => castSpell(sp, chosen)}>
                            {noSlot ? 'No slot' : 'Cast'}
                          </Button>
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}

          {/* Spell slots — max from the class table; current persists on the character. */}
          {d.spell && (
            <>
              <span className={s.label}>Spellcasting</span>
              <div style={row}>
                <span className={s.itemMeta}>
                  {d.spell.ability} · Save DC {d.spell.saveDc} · Attack {sign(d.spell.attackBonus)}
                </span>
                <span style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {isWarlock && (
                    <Button size="sm" variant="ghost" onClick={() => void restoreSpellSlots(character.id, d.spell!.maxSlots)}>
                      Short Rest
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => void restoreSpellSlots(character.id, d.spell!.maxSlots)}>
                    Long Rest
                  </Button>
                </span>
              </div>
              {Object.keys(d.spell.maxSlots).length === 0 ? (
                <p className={s.hint}>No spell slots at this level yet.</p>
              ) : (
                Object.entries(d.spell.maxSlots).map(([lvl, max]) => {
                  const level = Number(lvl);
                  const current = character.play.spellSlots?.[level] ?? max;
                  return (
                    <div key={lvl} style={row}>
                      {/* Warlock: a single Pact Magic row (all slots at the pact level). */}
                      <span className={s.itemMeta}>{isWarlock ? `Pact Magic · Level ${lvl} slots` : `Level ${lvl} slots`}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Button size="sm" variant="ghost" onClick={() => void setSpellSlot(character.id, level, Math.max(0, current - 1))}>
                          −
                        </Button>
                        <strong>{current}/{max}</strong>
                        <Button size="sm" variant="ghost" onClick={() => void setSpellSlot(character.id, level, Math.min(max, current + 1))}>
                          +
                        </Button>
                      </span>
                    </div>
                  );
                })
              )}
              {isWarlock && (
                <p className={s.hint}>Pact Magic: all slots are the same level and recover on a short (or long) rest.</p>
              )}
            </>
          )}

          {/* Class features — the base class features unlocked up to this level. Works identically
              for SRD and homebrew classes (both feed pcDerived via cumulativeFeatures). */}
          {d.cls && d.classFeatures.length > 0 && (
            <>
              <span className={s.label}>{d.cls.name} features</span>
              {d.classFeatures.map((f) => (
                <p key={f} className={s.hint} style={{ margin: 0 }}>• {f}</p>
              ))}
            </>
          )}

          {/* Subclass — its features (merged into pcDerived), or a picker when the character has
              reached its subclass level but hasn't chosen (covers L1/L2 classes the level-up flow
              never prompts). */}
          {d.subclassName ? (
            <>
              <span className={s.label}>{d.subclassName}</span>
              {d.subclassFeatures.map((f) => (
                <p key={f} className={s.hint} style={{ margin: 0 }}>• {f}</p>
              ))}
            </>
          ) : (
            d.cls?.subclassLevel != null &&
            character.play.level >= d.cls.subclassLevel &&
            (system.subclasses ?? []).some((su) => su.classId === d.cls!.id) && (
              <>
                <span className={s.label}>Choose your subclass</span>
                {(system.subclasses ?? [])
                  .filter((su) => su.classId === d.cls!.id)
                  .map((su) => (
                    <div key={su.id} style={row}>
                      <span style={bodyText}>{su.name}</span>
                      <Button size="sm" onClick={() => void setSubclass(character.id, su.id)}>Choose</Button>
                    </div>
                  ))}
              </>
            )
          )}

          {/* Background — name + its narrative feature. Its skill proficiencies already appear
              in the Skills list above (via pcDerived). */}
          {d.backgroundName && (
            <>
              <span className={s.label}>Background</span>
              <div style={row}><span style={bodyText}><strong>{d.backgroundName}</strong></span></div>
              {d.backgroundFeature && (
                <p className={s.hint} style={{ margin: 0 }}>
                  <strong>{d.backgroundFeature.name}:</strong> {d.backgroundFeature.description}
                </p>
              )}
            </>
          )}

          {/* Feats — passive effects are already folded into the numbers above (AC/HP/scores/speed);
              this lists them for reference, with active trackers for resource feats (Lucky, Healer). */}
          {d.feats.length > 0 && (
            <>
              <span className={s.label}>Feats</span>
              {d.feats.map((f) => (
                <div key={f.id}>
                  <div style={row}>
                    <span style={bodyText}><strong>{f.name}</strong></span>
                  </div>
                  <p className={s.hint} style={{ margin: 0 }}>{f.description}</p>
                  {f.note && <p className={s.hint} style={{ margin: 0, fontStyle: 'italic' }}>{f.note}</p>}
                </div>
              ))}
              {d.featResources.map((r) => (
                <div key={r.id} style={row}>
                  <span className={s.itemMeta}>{r.name}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Button size="sm" variant="ghost" onClick={() => void setFeatResource(character.id, r.id, Math.max(0, r.current - 1))}>
                      −
                    </Button>
                    <strong>{r.current}/{r.max}</strong>
                    <Button size="sm" variant="ghost" onClick={() => void setFeatResource(character.id, r.id, Math.min(r.max, r.current + 1))}>
                      +
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => void setFeatResource(character.id, r.id, r.max)} title="Restore on a long rest">
                      Rest
                    </Button>
                  </span>
                </div>
              ))}
            </>
          )}

          {/* Racial traits that affect play: resistances, breath weapon (rollable), Lucky toggle,
              and text notes for passive/flavor traits. */}
          {(d.resistances.length > 0 || d.breath || d.lucky || d.raceTraits.length > 0) && (
            <>
              <span className={s.label}>Racial traits</span>
              {d.resistances.length > 0 && (
                <div style={row}>
                  <span className={s.itemMeta}>Damage resistance</span>
                  <strong>{d.resistances.join(', ')}</strong>
                </div>
              )}
              {d.breath && (
                <div style={row}>
                  <span className={s.itemMeta}>
                    Breath Weapon: {d.breath.dice} {d.breath.damageType}, {d.breath.shape === 'cone' ? `${d.breath.size} ft cone` : `${d.breath.size} ft line`} · DC {d.breath.dc} DEX
                  </span>
                  <Button size="sm" onClick={rollBreath}>Roll</Button>
                </div>
              )}
              {d.lucky && (
                <label
                  className={s.itemMeta}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}
                  title="Halfling Lucky: when you roll a natural 1 on an attack, check, or save, reroll and use the new roll."
                >
                  <input type="checkbox" checked={lucky} onChange={(e) => setLucky(e.target.checked)} />
                  Lucky (reroll natural 1s)
                </label>
              )}
              {d.raceTraits.map((t, i) => (
                <p key={i} className={s.hint}>{t}</p>
              ))}
            </>
          )}

          {/* Inventory — looted equipment (Phase B1). Equipped toggle is stored for Phase B2 to
              consume; no mechanical effect yet. Players can discard items. */}
          {(() => {
            const items = Object.values(character.inventory ?? {}).sort((a, b) => a.name.localeCompare(b.name));
            if (items.length === 0) return null;
            return (
              <>
                <span className={s.label}>Inventory</span>
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBlock: 'var(--space-1)' }}>
                    <div style={row}>
                      <span style={bodyText}>
                        <strong>{item.name}</strong> <span className={s.itemMeta}>· {item.category}{item.equipped ? ' · equipped' : ''}</span>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        <Button size="sm" variant="ghost" onClick={() => void equipInventoryItem(character.id, character.inventory ?? {}, item.id, !item.equipped)}>
                          {item.equipped ? 'Unequip' : 'Equip'}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => void removeInventoryItem(character.id, item.id)} aria-label={`Discard ${item.name}`}>
                          Discard
                        </Button>
                      </span>
                    </div>
                    {item.description && <p className={s.hint} style={{ margin: 0 }}>{item.description}</p>}
                  </div>
                ))}
              </>
            );
          })()}
        </>
      )}

      {/* Spellbook tab — read-only reference: full list, searchable + filterable, with details. */}
      {d.spell && tab === 'spellbook' && (
        <>
          <input
            className={s.input}
            placeholder="Search spells…"
            value={spellQuery}
            onChange={(e) => setSpellQuery(e.target.value)}
          />
          <select className={s.input} value={schoolFilter} onChange={(e) => setSchoolFilter(e.target.value)} aria-label="School">
            <option value="">All schools</option>
            {schools.map((sch) => (
              <option key={sch} value={sch}>{sch}</option>
            ))}
          </select>
          {filteredBook.length === 0 && <p className={s.hint}>No spells match.</p>}
          {/* Compact, scannable rows: name + school tag. Click a spell to see full details. */}
          {byLevel(filteredBook).map(([lvl, list]) => (
            <div key={lvl}>
              <span className={s.label}>{levelLabel(lvl)}</span>
              {list.map((sp) => (
                <button key={sp.id} style={{ ...row, ...bodyText, cursor: 'pointer', background: 'transparent', border: 'none', padding: 'var(--space-1) 0', textAlign: 'left', width: '100%' }} onClick={() => setDetailSpell(sp)}>
                  <span style={{ fontWeight: 600 }}>{sp.name}</span>
                  <span style={metaBase}>{sp.school}{sp.concentration ? ' · conc' : ''}</span>
                </button>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Spell detail popup (Spellbook tab) — dismisses on click-away or Escape (Modal behavior). */}
      {detailSpell && (
        <Modal open onClose={() => setDetailSpell(null)} title={detailSpell.name} width={440}>
          <div className={s.section}>
            <span className={s.itemMeta} style={bodyText}>
              {levelLabel(detailSpell.level) === 'Cantrips' ? 'Cantrip' : `Level ${detailSpell.level}`} · {detailSpell.school}
              {detailSpell.concentration ? ' · concentration' : ''}{detailSpell.ritual ? ' · ritual' : ''}
            </span>
            <div className={s.itemMeta} style={bodyText}>
              {detailSpell.castingTime} · {detailSpell.range} ·{' '}
              {[detailSpell.components.v && 'V', detailSpell.components.s && 'S', detailSpell.components.m && 'M'].filter(Boolean).join(', ') || '—'}
              {' '}· {detailSpell.duration}
            </div>
            <p className={s.hint} style={{ ...bodyText, whiteSpace: 'pre-line' }}>{detailSpell.description}</p>
            {detailSpell.higherLevel && (
              <p className={s.hint} style={{ ...bodyText, whiteSpace: 'pre-line' }}><strong>At higher levels:</strong> {detailSpell.higherLevel}</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
