/**
 * The gatekeeper's newer rules: dice that must be the GM's numbers, checked
 * initiative, and the numbers on a player's own character.
 */
import { describe, expect, it } from 'vitest';
import { computeDerived, faceFor } from '@epoch/engine';
import { getSystem } from '@epoch/systems/registry';
import { checkPlayerOp, type GateContext, type WriteOp } from '../gatekeeper';
import { DiceLedger, uniformFor } from '../diceLedger';
import { initiativeModifier } from '../initiativeModifier';
import type { Character } from '@epoch/shared-types';

const G = 'g1';
const ME = 'thomas';
const GM = 'gm';
const solryn = getSystem('solryn')!;
const dnd5e = getSystem('dnd5e')!;

const scores = (v: number, sys = solryn) => Object.fromEntries(sys.coreStats.map((c) => [c.id, v]));

function solrynChar(over: Record<string, unknown> = {}) {
  return {
    id: 'c-me',
    ownerUserId: ME,
    gameId: G,
    systemId: 'solryn',
    name: 'Brannoc',
    buildComplete: true,
    definition: { ancestryId: 'human', coreScores: scores(5), chosenSkillIds: [], knownSpellIds: [] },
    play: { level: 1, reputation: '', pools: { hp: { current: 3 } }, equippedWeaponIds: [], skills: {}, unspentSkillPoints: 0 },
    ...over,
  };
}

function fiveEChar(over: Record<string, unknown> = {}) {
  return {
    id: 'c-me',
    ownerUserId: ME,
    gameId: G,
    systemId: 'dnd5e',
    name: 'Ila',
    buildComplete: true,
    definition: {
      ancestryId: 'human',
      classId: 'fighter',
      coreScores: scores(12, dnd5e),
      chosenSkillIds: [],
      knownSpellIds: [],
    },
    play: { level: 1, reputation: '', pools: { hp: { current: 5 } }, equippedWeaponIds: [], skills: {}, xp: 0 },
    ...over,
  };
}

function setup(character: Record<string, unknown>, game: Record<string, unknown> = {}) {
  const data: Record<string, unknown> = {
    games: {
      [G]: {
        id: G,
        levelGrant: 1,
        members: { [GM]: { role: 'gm' }, [ME]: { role: 'player' } },
        initiative: { active: true, round: 1, turnIndex: 0, order: [{ id: 'b', kind: 'creature', initiative: 10, tieBreak: 0 }] },
        rollLog: {},
        ...game,
      },
    },
    characters: { 'c-me': character },
    users: { [GM]: { library: {} } },
  };
  const ledger = new DiceLedger();
  const ctx: GateContext = {
    gameId: G,
    gmUid: GM,
    dice: ledger,
    read: async (path) => {
      let node: unknown = data;
      for (const s of path.split('/').filter(Boolean)) {
        node = node && typeof node === 'object' ? (node as Record<string, unknown>)[s] : undefined;
      }
      return node === undefined ? null : node;
    },
  };
  const check = (op: WriteOp) => checkPlayerOp(op, ME, ctx);
  return { data, ledger, ctx, check };
}

const ok = { ok: true };
const no = { ok: false };
const write = (path: string, value: unknown): WriteOp => ({ t: 'write', path, value });
const multi = (updates: Record<string, unknown>): WriteOp => ({ t: 'multi', updates });

describe('dice-log entries', () => {
  const entry = (extra: Record<string, unknown>) => ({ id: 'r9', text: 'd20: 17', byUid: ME, by: 'Thomas', at: 9, ...extra });

  it('a roll made with the GM’s numbers is accepted', async () => {
    const { ledger, check } = setup(solrynChar());
    const { rngId, values } = ledger.issue(ME);
    const dice = [{ s: 20, f: faceFor(20, uniformFor(values[0])) }];
    await expect(check(write(`games/${G}/rollLog/r9`, entry({ rngId, dice })))).resolves.toEqual(ok);
  });

  it('a made-up result is refused', async () => {
    const { ledger, check } = setup(solrynChar());
    const { rngId, values } = ledger.issue(ME);
    const real = faceFor(20, uniformFor(values[0]));
    const fake = real === 20 ? 19 : 20;
    await expect(check(write(`games/${G}/rollLog/r9`, entry({ rngId, dice: [{ s: 20, f: fake }] })))).resolves.toMatchObject(no);
  });

  it('dice that were never handed out are refused; plain text is allowed (shown unchecked)', async () => {
    const { check } = setup(solrynChar());
    await expect(check(write(`games/${G}/rollLog/r9`, entry({ rngId: 'gfake', dice: [{ s: 20, f: 20 }] })))).resolves.toMatchObject(no);
    await expect(check(write(`games/${G}/rollLog/r9`, entry({ dice: [{ s: 20, f: 20 }] })))).resolves.toMatchObject(no);
    await expect(check(write(`games/${G}/rollLog/r9`, entry({})))).resolves.toEqual(ok);
  });

  it("players can't stamp their own entries (e.g. hide skipped rolls)", async () => {
    const { check } = setup(solrynChar());
    await expect(check(write(`games/${G}/rollLog/r9`, entry({ skipped: 0 })))).resolves.toMatchObject(no);
  });

  it('a fished-for roll is posted with a note of how many were skipped', async () => {
    const { ledger, check } = setup(solrynChar());
    ledger.issue(ME);
    const { rngId, values } = ledger.issue(ME);
    const dice = [{ s: 20, f: faceFor(20, uniformFor(values[0])) }];
    await expect(check(write(`games/${G}/rollLog/r9`, entry({ rngId, dice })))).resolves.toEqual({
      ok: true,
      followUps: { [`/games/${G}/rollLog/r9/skipped`]: 1 },
    });
  });
});

describe('initiative', () => {
  async function rollIn(over: (c: Record<string, unknown>, face: number) => Record<string, unknown> = (c) => c) {
    const s = setup(solrynChar());
    const { rngId, values } = s.ledger.issue(ME);
    const face = faceFor(20, uniformFor(values[0]));
    const mod = initiativeModifier(solryn, solrynChar() as unknown as Character);
    const me = over(
      {
        id: 'char:c-me',
        kind: 'character',
        characterId: 'c-me',
        ownerUserId: ME,
        name: 'Brannoc',
        initiative: face + mod,
        tieBreak: mod,
        roll: { rngId, dice: [{ s: 20, f: face }] },
      },
      face,
    );
    const init = (s.data.games as any)[G].initiative;
    // The newcomer sorts in; the creature whose turn it is keeps the turn.
    const order = [...init.order, me].sort((a, b) => (b.initiative as number) - (a.initiative as number));
    const turnIndex = order.findIndex((c) => c.id === 'b');
    return s.check(write(`games/${G}/initiative`, { ...init, order, turnIndex }));
  }

  it('rolling in with a checked d20 and the real modifier works', async () => {
    await expect(rollIn()).resolves.toEqual(ok);
  });

  it('a higher number than the roll gives is refused', async () => {
    await expect(rollIn((c) => ({ ...c, initiative: (c.initiative as number) + 5 }))).resolves.toMatchObject(no);
  });

  it('a made-up modifier is refused', async () => {
    await expect(
      rollIn((c, face) => ({ ...c, tieBreak: 15, initiative: face + 15 })),
    ).resolves.toMatchObject(no);
  });

  it('a d20 that was not the GM’s is refused', async () => {
    await expect(rollIn((c) => ({ ...c, roll: { rngId: 'gfake', dice: [{ s: 20, f: 20 }] }, initiative: 20 + (c.tieBreak as number) }))).resolves.toMatchObject(no);
    await expect(rollIn((c) => { const { roll: _r, ...rest } = c; return rest; })).resolves.toMatchObject(no);
  });
});

describe("a player's own character (Solryn)", () => {
  const path = (p: string) => `characters/c-me/${p}`;

  it('everyday changes are fine: damage, spending, healing up to max', async () => {
    const { check } = setup(solrynChar());
    const maxHp = computeDerived(solryn, scores(5)).find((d) => d.id === 'hp')!.value as number;
    await expect(check(write(path('play/pools/hp/current'), 1))).resolves.toEqual(ok);
    await expect(check(write(path('play/pools/hp/current'), maxHp))).resolves.toEqual(ok);
    await expect(check(write(path('name'), 'Brannoc the Bold'))).resolves.toEqual(ok);
  });

  it('HP above the maximum is refused', async () => {
    const { check } = setup(solrynChar());
    await expect(check(write(path('play/pools/hp/current'), 999))).resolves.toMatchObject(no);
  });

  it("a level the GM didn't grant is refused; a granted one works", async () => {
    const levelUp = (incs: number) =>
      multi({
        [`/${path('play/level')}`]: 2,
        [`/${path('definition/coreScores')}`]: Object.fromEntries(Object.entries(scores(5)).map(([k, v]) => [k, v + incs])),
        [`/${path('play/unspentSkillPoints')}`]: 2,
      });
    await expect(setup(solrynChar()).check(levelUp(1))).resolves.toMatchObject(no);
    await expect(setup(solrynChar(), { levelGrant: 2 }).check(levelUp(1))).resolves.toEqual(ok);
    // Level 2's die is 1d4: +5 to a stat is more than any roll gives.
    await expect(setup(solrynChar(), { levelGrant: 2 }).check(levelUp(5))).resolves.toMatchObject(no);
  });

  it('levels go one at a time', async () => {
    const { check } = setup(solrynChar(), { levelGrant: 5 });
    await expect(check(write(path('play/level'), 3))).resolves.toMatchObject(no);
  });

  it('scores are locked once built, and skill points only come with levels', async () => {
    const { check } = setup(solrynChar());
    await expect(check(write(path('definition/coreScores/STR'), 8))).resolves.toMatchObject(no);
    await expect(check(write(path('play/unspentSkillPoints'), 10))).resolves.toMatchObject(no);
  });

  it('a new character must have scores the creation dice can roll', async () => {
    const { data, check } = setup(solrynChar());
    (data.characters as Record<string, unknown>)['c-me'] = undefined;
    const fresh = solrynChar({ buildComplete: false });
    await expect(check(write('characters/c-me', fresh))).resolves.toEqual(ok);
    const cheat = solrynChar({ buildComplete: false, definition: { ...fresh.definition, coreScores: scores(12) } });
    await expect(check(write('characters/c-me', cheat))).resolves.toMatchObject(no); // 2d4 tops out at 8 (+ a Human's flexible +1)
  });

  it("a race's bonuses count on top of the creation dice", async () => {
    const drakari = solryn.ancestries.find((a) => a.bonuses.some((b) => b.kind === 'fixed' && b.amount >= 2))!;
    const bonus = drakari.bonuses.find((b) => b.kind === 'fixed' && b.amount >= 2) as { stat: string; amount: number };
    const withRace = (v: number) =>
      solrynChar({
        buildComplete: false,
        definition: { ancestryId: drakari.id, coreScores: { ...scores(5), [bonus.stat]: v }, chosenSkillIds: [], knownSpellIds: [] },
      });
    const fresh = () => {
      const s = setup(solrynChar());
      (s.data.characters as Record<string, unknown>)['c-me'] = undefined;
      return s;
    };
    await expect(fresh().check(write('characters/c-me', withRace(8 + bonus.amount)))).resolves.toEqual(ok);
    await expect(fresh().check(write('characters/c-me', withRace(8 + bonus.amount + 2)))).resolves.toMatchObject(no);
  });
});

describe("a player's own character (5e)", () => {
  const path = (p: string) => `characters/c-me/${p}`;

  it('XP is the GM’s to award', async () => {
    const { check } = setup(fiveEChar());
    await expect(check(write(path('play/xp'), 5000))).resolves.toMatchObject(no);
  });

  it('only the GM grants a pending level-up', async () => {
    const { check } = setup(fiveEChar());
    await expect(check(write(path('play/levelUpPending'), true))).resolves.toMatchObject(no);
    // ...except catching up to the game's starting level.
    const catchUp = setup(fiveEChar(), { startingLevel: 3 });
    await expect(catchUp.check(write(path('play/levelUpPending'), true))).resolves.toEqual(ok);
  });

  it('a pending level-up allows +2 to scores at most', async () => {
    const pending = () => fiveEChar({ play: { ...fiveEChar().play, levelUpPending: true } });
    const up = (inc: Record<string, number>) =>
      multi({
        [`/${path('play/level')}`]: 2,
        [`/${path('play/levelUpPending')}`]: false,
        [`/${path('definition/coreScores')}`]: { ...scores(12, dnd5e), ...inc },
      });
    await expect(setup(pending()).check(up({ STR: 14 }))).resolves.toEqual(ok);
    await expect(setup(pending()).check(up({ STR: 14, DEX: 14 }))).resolves.toMatchObject(no);
  });

  it('XP earned from the GM unlocks the level', async () => {
    const earned = fiveEChar({ play: { ...fiveEChar().play, xp: 300 } });
    await expect(setup(earned).check(write(path('play/level'), 2))).resolves.toEqual(ok);
  });

  it('HP can use full hit dice (max-HP campaigns) but not more', async () => {
    const lvl3 = fiveEChar({ play: { ...fiveEChar().play, level: 3 } });
    // Fighter d10, CON 12 (+1): full dice at level 3 = 3 × (10 + 1) = 33.
    await expect(setup(lvl3).check(write(path('play/pools/hp/current'), 33))).resolves.toEqual(ok);
    await expect(setup(lvl3).check(write(path('play/pools/hp/current'), 34))).resolves.toMatchObject(no);
  });
});
