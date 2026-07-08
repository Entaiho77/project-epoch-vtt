import { describe, it, expect } from 'vitest';
import { bestiary } from '../bestiary';

const byId = (id: string) => bestiary.find((b) => b.id === id);

describe('dnd5e SRD bestiary (raw 5e stat blocks)', () => {
  it('converted the full SRD set', () => {
    expect(bestiary.length).toBeGreaterThan(300);
  });

  it('Goblin converts with correct raw 5e numbers', () => {
    const g = byId('goblin');
    expect(g).toBeDefined();
    expect(g!.stats.ac).toBe(15); // raw 5e AC, not Solryn DR
    expect(g!.stats.hp).toBe(7);
    expect(g!.stats.type).toBe('Humanoid (Goblinoid)');
    const scimitar = g!.attacks?.find((a) => a.name === 'Scimitar');
    expect(scimitar).toMatchObject({ diceExpr: '1d6+2', damageType: 'Slashing', attackBonus: 4 });
  });

  it('every attack carries a to-hit bonus (drives attackRollVsAc)', () => {
    for (const b of bestiary) {
      for (const a of b.attacks ?? []) {
        expect(typeof a.attackBonus).toBe('number');
      }
    }
  });

  it('routing: a breath weapon is an ABILITY, not a to-hit attack', () => {
    const dragon = byId('adult-red-dragon');
    expect(dragon).toBeDefined();
    // Bite has a to-hit bonus → it's an attack.
    expect(dragon!.attacks?.some((a) => a.name === 'Bite')).toBe(true);
    // Fire Breath has damage dice but NO attack_bonus → it must NOT be in attacks.
    expect(dragon!.attacks?.some((a) => /breath/i.test(a.name))).toBe(false);
    expect(dragon!.abilities?.some((ab) => /Fire Breath/i.test(ab))).toBe(true);
  });

  it('versatile-weapon monsters still get a rollable attack', () => {
    // guard's Spear uses the `choose`/options damage form — must resolve to its one-handed dice.
    const guard = byId('guard');
    expect(guard!.attacks?.find((a) => a.name === 'Spear')).toMatchObject({
      diceExpr: '1d6+1',
      attackBonus: 3,
    });
  });
});
