import { useEffect, useState } from 'react';
import type { BestiaryEntry, CreatureSave, SystemDefinition } from '@solryn/shared-types';
import type { Token } from '@solryn/shared-types';
import type { CampaignRules, HomebrewEquipment } from '../../../data/homebrew';
import { attackAdvantage, autoCritAgainst, combineAdvantage, computeModifier, describeRoll, effectsFor, getCombatResolver, resolveCheck, rollDice } from '@solryn/engine';
import { resolveSolrynAttack } from '@solryn/systems/solryn/combat';
import { removeToken, updateToken } from '../../../data/board';
import { setCreatureArt, useCreatureArt } from '../../../data/creatures';
import { Button } from '../../../components/ui/Button';
import { TokenArtUpload } from '../../../components/ui/TokenArtUpload';
import { ResourceTracker } from '../../sheet/ResourceTracker';
import { LootDistributionModal } from './LootDistributionModal';
import { useRollLog } from '../../rolllog/rollLog';
import s from './drawers.module.css';

const statRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--space-2)',
};
const interactiveRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--space-3)',
  paddingBlock: 'var(--space-1)',
};
// Name + dice on their own lines, free to wrap — no ellipsis truncation.
const nameCol: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 };
const nameText: React.CSSProperties = { fontWeight: 600, overflowWrap: 'anywhere' };
const abilityRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 'var(--space-3)',
  paddingBlock: 'var(--space-1)',
};

/** First clean dice term in a free-text ability string (e.g. "...66 (12d10) lightning..."). */
function abilityDice(text: string): string | null {
  const m = /(\d+d\d+(?:\s*[+-]\s*\d+)?)/.exec(text);
  return m ? m[1].replace(/\s+/g, '') : null;
}

const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;
type AbilityId = (typeof ABILITIES)[number];

/**
 * A creature's d20 modifier for a save or ability check on `ability`.
 * - check → the ability modifier from the raw score (system modifier rule).
 * - save  → the trained save bonus from stats.saves (e.g. "DEX +6") when present, else the
 *   ability modifier (an untrained save is just the ability mod).
 */
function abilityMod(
  stats: Record<string, number | string>,
  ability: AbilityId,
  rule: SystemDefinition['modifierRule'],
  mode: 'save' | 'check',
): number {
  if (mode === 'save') {
    const m = String(stats.saves ?? '').match(new RegExp(`${ability.toUpperCase()}\\s*([+-]\\d+)`));
    if (m) return parseInt(m[1], 10);
  }
  return computeModifier(Number(stats[ability]) || 10, rule);
}

// The merged creature card: read-only stats + tappable attacks (off the Phase-1
// attacks[]), plus GM token controls. Looked up by id (fallback name). Rendered in a
// proper side panel (BoardShell.rightPanel) — its own title/close come from the drawer
// chrome, so this body has no header of its own.
export function MonsterStatCard({
  system,
  name,
  creatureId,
  extraEntries,
  lootItems,
  token,
  gameId,
  uid,
  target,
  rules,
  onClose,
}: {
  system: SystemDefinition;
  name: string;
  creatureId?: string;
  /** Non-SRD stat blocks (e.g. game homebrew) resolved identically to SRD entries; searched
   *  first so a homebrew id/name wins. Keeps the combat resolver free of any SRD/homebrew branch. */
  extraEntries?: BestiaryEntry[];
  /** Resolved homebrew loot this spawned monster carries (GM-only "Distribute Loot"). */
  lootItems?: HomebrewEquipment[];
  token?: Token;
  gameId?: string;
  /** Present in GM context → enables the bestiary token-art upload (per-GM global). */
  uid?: string;
  /** Current click-to-target token (5e), set via the board right-click menu. Attacks read its
   *  AC when set; otherwise the manual Target AC below is the fallback. */
  target?: { id: string; name: string; ac?: number; dr?: number; conditions?: Record<string, true> };
  /** Campaign crit rules (threshold + damage formula) applied to this creature's attacks. */
  rules?: CampaignRules;
  onClose?: () => void;
}) {
  const { postRoll } = useRollLog();
  const creatureArt = useCreatureArt(uid ?? null);
  // Roll-to-hit systems (5e) need a defender AC; minimal targeting = an entered Target AC
  // (+ optional advantage). Auto-hit systems ignore both. (Token-to-token targeting is a
  // deliberate follow-up.)
  const rollToHit = system.modes.combat.id === 'attack-roll-vs-ac';
  const [targetAc, setTargetAc] = useState(13);
  const [advantage, setAdvantage] = useState<'advantage' | 'disadvantage' | undefined>();
  // Roll-vs-DC controls (5e saves / ability checks): the defender rolls vs an entered DC.
  const [saveAbility, setSaveAbility] = useState<AbilityId>('dex');
  const [saveDc, setSaveDc] = useState(13);
  const [checkMode, setCheckMode] = useState<'save' | 'check'>('save');
  const [lootOpen, setLootOpen] = useState(false);
  // Search homebrew (extraEntries) before the SRD bestiary so a homebrew id/name wins; both are
  // plain BestiaryEntry, so everything below (attacks, abilities, resolver) is source-agnostic.
  const pool = extraEntries && extraEntries.length ? [...extraEntries, ...system.bestiary] : system.bestiary;
  const entry =
    (creatureId ? pool.find((b) => b.id === creatureId) : undefined) ??
    pool.find((b) => b.name === name);

  // Prefill the save panel from the creature's first save-based ability (e.g. a breath
  // weapon's DC + ability), so the GM doesn't retype it. Still editable afterward.
  const firstSave = entry?.saves?.[0];
  useEffect(() => {
    if (firstSave) {
      setSaveDc(firstSave.dc);
      setSaveAbility(firstSave.ability.toLowerCase() as AbilityId);
    }
  }, [entry?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!entry) return <p className={s.hint}>No stat block found for “{name}”.</p>;

  const st = entry.stats;
  const resolver = getCombatResolver(system);
  // Solryn resolves monster attacks the same way player attacks do (auto-hit vs the target's DR),
  // not through the 5e attack-roll-vs-AC path.
  const isSolryn = system.modes.combat.id === 'auto-hit-vs-dr';
  // Token conditions: this creature (the attacker) is `token`, the defender is the current target.
  const attackerEffects = effectsFor(system.tokenConditions, token?.conditions);
  const targetEffects = effectsFor(system.tokenConditions, target?.conditions);
  const conditionAdvantage = attackAdvantage(attackerEffects, targetEffects, true);
  const autoCrit = autoCritAgainst(targetEffects, true);
  const ignoreDr = !!targetEffects.ignoreDrAgainst; // Solryn: stunned/paralyzed/unconscious → ignore DR + auto-crit
  const targetResists = !!targetEffects.resistAllDamage;
  // Resolve against the clicked target's AC when one is set (and it isn't this creature's own
  // token — a creature never attacks itself); otherwise fall back to the typed Target AC.
  const usingTarget = rollToHit && target != null && typeof target.ac === 'number' && target.id !== token?.id;
  const post = (label: string, diceExpr: string, type?: string, attackBonus?: number) => {
    if (isSolryn) {
      // Auto-hit; subtract the target's DR. Stunned/Paralyzed/Unconscious targets → ignore DR + crit.
      const drTargeted = target != null && typeof target.dr === 'number' && target.id !== token?.id;
      const composed = drTargeted ? `${entry.name} → ${target!.name} — ${label}` : `${entry.name} — ${label}`;
      const res = resolveSolrynAttack({
        label: composed,
        dice: diceExpr,
        targetDr: drTargeted ? target!.dr : undefined,
        ...(drTargeted && ignoreDr ? { crit: 'success' as const } : {}),
      });
      postRoll(res.logText + (drTargeted ? '' : ' · No target set — apply DR manually'));
      return;
    }
    const line = resolver.resolveAttack({
      label: usingTarget ? `${entry.name} → ${target!.name} — ${label}` : `${entry.name} — ${label}`,
      dice: diceExpr,
      damageType: type,
      attackBonus,
      targetAc: rollToHit ? (usingTarget ? target!.ac : targetAc) : undefined,
      advantage: rollToHit ? combineAdvantage(advantage, conditionAdvantage) : undefined,
      critThreshold: autoCrit ? 1 : (rules?.critThreshold ?? 20),
      ...(rules?.critFormula ? { critFormula: rules.critFormula } : {}),
      ...(rules?.critFormulaCustom ? { critFormulaCustom: rules.critFormulaCustom } : {}),
    }).logText;
    postRoll(targetResists ? `${line} · target resists — halve the damage` : line);
  };
  // Abilities (breath weapons, traits) are NOT to-hit attacks — roll plain damage, never
  // through the attack resolver, so 5e dice-bearing abilities don't misfire as hit/miss.
  const saveByName = new Map((entry.saves ?? []).map((sv) => [sv.name, sv] as const));
  // Abilities roll plain damage (never the attack resolver). If the ability forces a save,
  // annotate the line: half-on-success shows the halved number, so the GM applies the right
  // amount once the target rolls its save (in the save panel).
  const postAbility = (label: string, diceExpr: string, sv?: CreatureSave) => {
    const r = rollDice(diceExpr);
    let line = describeRoll(`${entry.name} — ${label}`, r);
    if (sv) {
      line += ` · DC ${sv.dc} ${sv.ability} save`;
      line += sv.success === 'half' ? ` for half (${Math.floor(r.total / 2)})` : ' (none on success)';
    }
    postRoll(line);
  };
  const postCheck = () => {
    const modifier = abilityMod(st, saveAbility, system.modifierRule, checkMode);
    const label = `${entry.name} — ${saveAbility.toUpperCase()} ${checkMode}`;
    postRoll(resolveCheck({ label, modifier, dc: saveDc, advantage }).logText);
  };
  const gmControls = token && gameId;

  return (
    <div className={s.section}>
      {/* Stats */}
      {token?.hp ? (
        <ResourceTracker
          label="HP"
          current={token.hp.current}
          max={token.hp.max}
          onChange={(n) =>
            gameId && void updateToken(gameId, token.id, { hp: { current: n, max: token.hp!.max } })
          }
        />
      ) : (
        <div style={statRow}><span className={s.itemMeta}>HP</span><span>{st.hp ?? '—'}</span></div>
      )}
      {st.ac !== undefined ? (
        <div style={statRow}><span className={s.itemMeta}>AC</span><span>{st.ac}</span></div>
      ) : (
        <div style={statRow}><span className={s.itemMeta}>DR</span><span>{st.dr ?? '—'}</span></div>
      )}
      <div style={statRow}><span className={s.itemMeta}>Speed</span><span>{st.speed ?? '—'}</span></div>

      {uid && (
        <div>
          <span className={s.label}>Token art</span>
          <TokenArtUpload
            scope={uid}
            imageUrl={creatureArt[entry.id]}
            label="art"
            onChange={(url) => void setCreatureArt(uid, entry.id, url)}
            onClear={() => void setCreatureArt(uid, entry.id, null)}
          />
          <p className={s.hint} style={{ marginTop: 'var(--space-1)' }}>
            Applies to every {entry.name} token across your games.
          </p>
        </div>
      )}

      {rollToHit && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {usingTarget ? (
            <span className={s.itemMeta}>
              Attacking <strong>{target!.name}</strong> (AC {target!.ac})
            </span>
          ) : (
            <label className={s.itemMeta} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              {target && target.id !== token?.id ? `${target.name} (no AC) — ` : ''}Target AC
              <input
                type="number"
                value={targetAc}
                onChange={(e) => setTargetAc(Number(e.target.value) || 0)}
                style={{ width: 56 }}
              />
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
        </div>
      )}
      {rollToHit && !usingTarget && (
        <p className={s.hint}>Right-click a token on the board to attack its AC automatically.</p>
      )}

      {/* Roll-vs-DC: this creature (the defender) rolls a save / check vs an entered DC. */}
      {rollToHit && (
        <div>
          <span className={s.label}>Saving throw / check</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <select
              className={s.itemMeta}
              value={saveAbility}
              onChange={(e) => setSaveAbility(e.target.value as AbilityId)}
              aria-label="Ability"
            >
              {ABILITIES.map((a) => (
                <option key={a} value={a}>{a.toUpperCase()}</option>
              ))}
            </select>
            <select
              className={s.itemMeta}
              value={checkMode}
              onChange={(e) => setCheckMode(e.target.value as 'save' | 'check')}
              aria-label="Save or check"
            >
              <option value="save">save</option>
              <option value="check">check</option>
            </select>
            <label className={s.itemMeta} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              DC
              <input type="number" value={saveDc} onChange={(e) => setSaveDc(Number(e.target.value) || 0)} style={{ width: 56 }} />
            </label>
            <Button size="sm" onClick={postCheck}>Roll</Button>
          </div>
          <p className={s.hint} style={{ marginTop: 'var(--space-1)' }}>
            Uses the Roll-mode (adv/dis) above. Save-based abilities (e.g. breath weapons) show
            their DC in the ability text.
          </p>
        </div>
      )}

      {entry.attacks && entry.attacks.length > 0 && (
        <div>
          <span className={s.label}>Attacks</span>
          {entry.attacks.map((a, i) => (
            <div key={i} style={interactiveRow}>
              <span style={nameCol}>
                <span style={nameText}>{a.name}</span>
                <span className={s.itemMeta}>
                  {a.attackBonus !== undefined ? `${a.attackBonus >= 0 ? '+' : ''}${a.attackBonus} to hit · ` : ''}
                  {a.diceExpr} {a.damageType}
                  {a.note ? ` · ${a.note}` : ''}
                </span>
              </span>
              <Button onClick={() => post(a.name, a.diceExpr, a.damageType, a.attackBonus)}>Roll</Button>
            </div>
          ))}
        </div>
      )}

      {entry.abilities && entry.abilities.length > 0 && (
        <div>
          <span className={s.label}>Abilities</span>
          {entry.abilities.map((ab, i) => {
            const dice = abilityDice(ab);
            const label = ab.split(':')[0];
            const sv = saveByName.get(label.replace(' (Legendary)', '').trim());
            return (
              <div key={i} style={abilityRow}>
                <span style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
                  {ab}
                  {sv && (
                    <span className={s.itemMeta}>
                      {' '}· DC {sv.dc} {sv.ability} save{sv.success === 'half' ? ' (half on success)' : ''}
                    </span>
                  )}
                </span>
                {dice && (
                  <Button variant="secondary" onClick={() => postAbility(label, dice, sv)}>
                    Roll
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Equipment the monster carries as loot (GM sees it before distributing). */}
      {lootItems && lootItems.length > 0 && (
        <div>
          <span className={s.label}>Equipment</span>
          {lootItems.map((eq) => (
            <div key={eq.id} style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBlock: 'var(--space-1)' }}>
              <span style={nameText}>
                {eq.name} <span className={s.itemMeta}>· {eq.category}
                  {eq.category === 'weapon' && eq.damageDice ? ` · ${eq.damageDice} ${eq.damageType ?? ''}` : ''}
                  {eq.category === 'armor' && eq.baseAc !== undefined ? ` · ${eq.armorType ?? ''} AC ${eq.baseAc}` : ''}
                </span>
              </span>
              {eq.description && <span className={s.itemMeta}>{eq.description}</span>}
            </div>
          ))}
        </div>
      )}

      {gmControls && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void updateToken(gameId, token.id, { visible: token.visible === false })}
          >
            {token.visible === false ? 'Reveal' : 'Hide'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void updateToken(gameId, token.id, { defeated: !token.defeated })}
          >
            {token.defeated ? 'Revive' : 'Defeat'}
          </Button>
          {lootItems && lootItems.length > 0 && (
            <Button variant="secondary" size="sm" onClick={() => setLootOpen(true)}>
              Distribute Loot
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              void removeToken(gameId, token.id);
              onClose?.();
            }}
          >
            Remove
          </Button>
        </div>
      )}

      {gmControls && lootOpen && lootItems && (
        <LootDistributionModal
          gameId={gameId}
          token={token}
          lootItems={lootItems}
          onClose={() => setLootOpen(false)}
        />
      )}
    </div>
  );
}
