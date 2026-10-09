#!/usr/bin/env node
/**
 * Comingled (dual-stat) bestiary generator.
 *
 * Reads every volume file in data/solryn-bestiary/volume-*.json — each one a plain-JSON
 * export of a Solryn Bestiary PDF/text volume, carrying both the 5e and Solryn stat rows
 * for every creature on its stat-card — and regenerates src/bestiary/comingled.generated.ts
 * from ALL of them. These creatures are tagged systems: ['dnd5e', 'solryn'], so either
 * game's bestiary UI can show them (see src/bestiary/comingled.ts for how that's wired in).
 *
 * Re-run after adding a new data/solryn-bestiary/volume-N.json — nothing else to edit by
 * hand. Run: node packages/systems/scripts/genComingledBestiary.mjs
 *
 * One real limitation, by design: the dice engine (packages/engine/src/rules/dice.ts,
 * parseDice) only understands a single die-type + flat modifier per roll (e.g. "2d6+3") —
 * it can't express a compound roll like "2d6 + 1d4". Several bestiary attacks are written
 * as compound rolls. Rather than lose or fudge that, this generator keeps the FIRST dice
 * term as the rollable diceExpr and folds the rest of the original damage line into the
 * attack's note, verbatim, so nothing is lost — it just isn't a single auto-totaled roll.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data', 'solryn-bestiary');
const OUT_FILE = path.join(__dirname, '..', 'src', 'bestiary', 'comingled.generated.ts');

// The modifier group must NOT swallow the start of a second dice term — e.g. in
// "2d6 + 1d4", the "+ 1" belongs to the second die ("1d4"), not to the first as a flat
// bonus. The negative lookahead keeps "+1" from matching when it's immediately
// followed by "d<digits>".
const DICE_TERM_RE = /(\d*d\d+)(\s*[+-]\s*\d+(?!\s*d\d))?/i;

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Pull the first rollable dice term out of a free-text damage line, e.g.
 *  "2d6 + 1d4 Piercing + Necrotic" -> { diceExpr: "2d6", damageType: "Piercing + Necrotic",
 *  remainder: "+ 1d4" }. Returns null diceExpr if the line has no dice at all
 *  (e.g. "— Special (30 ft radius)") — caller routes those into abilities instead. */
function splitDamageLine(effect) {
  const m = DICE_TERM_RE.exec(effect);
  if (!m) return { diceExpr: null, damageType: effect.trim(), extra: '' };
  const diceExpr = (m[1] + (m[2] ? m[2].replace(/\s+/g, '') : '')).trim();
  const before = effect.slice(0, m.index);
  const after = effect.slice(m.index + m[0].length);
  // Damage type is whatever text surrounds the dice term, minus any other dice terms
  // (compound rolls) — those get folded into `extra` instead of the type label.
  const typeText = (before + ' ' + after)
    .replace(DICE_TERM_RE, '')
    .replace(/^[\s+\-]+/, '') // drop a stray leading "+"/"-" left behind by a removed dice term
    .trim();
  const hasMoreDice = DICE_TERM_RE.test(after);
  return {
    diceExpr,
    damageType: typeText || '—',
    extra: hasMoreDice ? after.trim() : '',
  };
}

const ABILITY_5E_MAP = { STR: 'str', DEX: 'dex', CON: 'con', INT: 'int', WIS: 'wis', CHA: 'cha' };
const ABILITY_SOLRYN_MAP = { STR: 'str', NIM: 'nim', END: 'end', WIS: 'wis', INT: 'int', ARC: 'arc', LCK: 'lck' };

function lowerKeys(obj, map) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const mapped = map[k] ?? k.toLowerCase();
    out[mapped] = v;
  }
  return out;
}

function convertCreature(raw, usedIds) {
  let id = slugify(raw.name);
  if (usedIds.has(id)) {
    let n = 2;
    while (usedIds.has(`${id}-${n}`)) n++;
    id = `${id}-${n}`;
  }
  usedIds.add(id);

  const attacks = [];
  const extraAbilities = [];

  for (const atk of raw.attacks ?? []) {
    const { diceExpr, damageType, extra } = splitDamageLine(atk.effect ?? '');
    const noteParts = [];
    if (extra) noteParts.push(`(also ${extra.replace(/^[\s+\-]+/, '')})`);
    if (atk.notes) noteParts.push(atk.notes);
    const note = noteParts.join(' ').trim() || undefined;

    if (diceExpr) {
      attacks.push({
        name: atk.name,
        diceExpr,
        damageType,
        ...(atk.stat_5e ? { ability5e: ABILITY_5E_MAP[atk.stat_5e.ability] } : {}),
        ...(atk.stat_solryn ? { abilitySolryn: ABILITY_SOLRYN_MAP[atk.stat_solryn.ability] } : {}),
        ...(note ? { note } : {}),
      });
    } else {
      // No rollable dice (a special/recharge effect, or a non-aggressive creature's "None")
      // — keep it as a readable ability line instead of a broken attack entry.
      const cleanType = damageType.replace(/^—\s*/, '').trim();
      const label = cleanType && cleanType !== '—' ? `${atk.name} (${cleanType})` : atk.name;
      extraAbilities.push(atk.notes ? `${label}: ${atk.notes}` : label);
    }
  }

  const abilities = [
    ...extraAbilities,
    ...(raw.abilities ?? []).map((ab) =>
      ab.notes ? `${ab.name}: ${ab.notes}` : ab.name,
    ),
  ];

  return {
    id,
    name: raw.name,
    category: 'creature',
    systems: ['dnd5e', 'solryn'],
    stats: {
      hp: raw.hp,
      dr: raw.dr,
      speed: raw.speed,
      type: raw.creature_type,
      environment: raw.environment,
      tr: raw.tr,
      tier: raw.tier,
      xp: raw.xp,
      ...(raw.soul_core ? { soulCore: raw.soul_core } : {}),
      ...(raw.core_rarity ? { coreRarity: raw.core_rarity } : {}),
    },
    abilityScores5e: lowerKeys(raw.stats_5e, ABILITY_5E_MAP),
    armorClass5e: raw.ac_5e,
    abilityScoresSolryn: lowerKeys(raw.stats_solryn, ABILITY_SOLRYN_MAP),
    ...(attacks.length ? { attacks } : {}),
    ...(abilities.length ? { abilities } : {}),
    ...(raw.lore ? { lore: raw.lore } : {}),
  };
}

function main() {
  const files = readdirSync(DATA_DIR)
    .filter((f) => /^volume-\d+\.json$/.test(f))
    .sort();
  if (files.length === 0) {
    console.error(`No volume-*.json files found in ${DATA_DIR}`);
    process.exit(1);
  }

  const usedIds = new Set();
  const entries = [];
  for (const file of files) {
    const raw = JSON.parse(readFileSync(path.join(DATA_DIR, file), 'utf-8'));
    for (const creature of raw) {
      entries.push(convertCreature(creature, usedIds));
    }
    console.log(`${file}: ${raw.length} creatures`);
  }

  const header = `// AUTO-GENERATED — do not edit by hand.
// Produced by scripts/genComingledBestiary.mjs from data/solryn-bestiary/volume-*.json
// (plain-JSON exports of the Solryn Bestiary PDF/text volumes — each creature's stat
// card carries both its 5e and Solryn stat rows). These entries are tagged
// systems: ['dnd5e', 'solryn'] and are usable from either game — see bestiary/comingled.ts.
// Regenerate after adding a new volume file: node packages/systems/scripts/genComingledBestiary.mjs
import type { BestiaryEntry } from '@epoch/shared-types';

export const comingledBestiary: BestiaryEntry[] = ${JSON.stringify(entries, null, 2)};
`;

  writeFileSync(OUT_FILE, header);
  console.log(`\nWrote ${entries.length} comingled creatures -> ${OUT_FILE}`);
}

main();
