/** Random source returning a float in [0, 1). Injectable for deterministic tests. */
export type Rng = () => number;
export const defaultRng: Rng = Math.random;

export interface ParsedDice {
  count: number;
  sides: number;
  modifier: number;
}

/** Parse dice notation like "2d6+3", "d20", "1d4-1". Returns null if invalid. */
export function parseDice(notation: string): ParsedDice | null {
  const m = /^\s*(\d*)d(\d+)\s*([+-]\s*\d+)?\s*$/i.exec(notation);
  if (!m) return null;
  const count = m[1] === '' ? 1 : parseInt(m[1], 10);
  const sides = parseInt(m[2], 10);
  const modifier = m[3] ? parseInt(m[3].replace(/\s+/g, ''), 10) : 0;
  if (count < 1 || sides < 1) return null;
  return { count, sides, modifier };
}

/** Roll a single die with the given number of sides. */
export function rollDie(sides: number, rng: Rng = defaultRng): number {
  return Math.floor(rng() * sides) + 1;
}

export interface RollResult {
  notation: string;
  rolls: number[];
  modifier: number;
  total: number;
}

/** Roll dice notation. Throws on invalid notation. */
export function rollDice(notation: string, rng: Rng = defaultRng): RollResult {
  const parsed = parseDice(notation);
  if (!parsed) throw new Error(`Invalid dice notation: ${notation}`);
  const rolls = Array.from({ length: parsed.count }, () =>
    rollDie(parsed.sides, rng),
  );
  const total = rolls.reduce((a, b) => a + b, 0) + parsed.modifier;
  return { notation, rolls, modifier: parsed.modifier, total };
}

/**
 * Roll the same notation several times and keep the highest total (the advantage /
 * harvest-assist pattern: "roll two d100s and take the highest").
 */
export function rollHighest(
  notation: string,
  times: number,
  rng: Rng = defaultRng,
): { best: RollResult; all: RollResult[] } {
  const all = Array.from({ length: Math.max(1, times) }, () =>
    rollDice(notation, rng),
  );
  const best = all.reduce((hi, r) => (r.total > hi.total ? r : hi), all[0]);
  return { best, all };
}

/**
 * Roll the same notation several times and keep the LOWEST total (the disadvantage
 * pattern: "roll two d20s and take the lowest"). Mirror of {@link rollHighest}.
 */
export function rollLowest(
  notation: string,
  times: number,
  rng: Rng = defaultRng,
): { worst: RollResult; all: RollResult[] } {
  const all = Array.from({ length: Math.max(1, times) }, () =>
    rollDice(notation, rng),
  );
  const worst = all.reduce((lo, r) => (r.total < lo.total ? r : lo), all[0]);
  return { worst, all };
}
