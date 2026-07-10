import type { EquipmentDefinition } from '@solryn/shared-types';

/**
 * Minimal 5e equipment — just enough for a Fighter to have an AC and an attack. Armor uses
 * the 5e baseAc/maxDexBonus fields (dr/speedPenalty are the Solryn fields, set to 0/unused).
 * weaponSkillId is a nominal '5e' category (5e gates weapons by simple/martial proficiency).
 */
export const equipment: EquipmentDefinition = {
  armor: [
    { id: 'chain-mail', name: 'Chain Mail', weight: 'heavy', dr: 0, speedPenalty: 0, baseAc: 16, maxDexBonus: 0 },
    { id: 'leather-armor', name: 'Leather Armor', weight: 'light', dr: 0, speedPenalty: 0, baseAc: 11, maxDexBonus: null },
  ],
  weapons: [
    { id: 'longsword', name: 'Longsword', weaponSkillId: 'martial', damageDice: '1d8', damageType: 'Slashing' },
    { id: 'greataxe', name: 'Greataxe', weaponSkillId: 'martial', damageDice: '1d12', damageType: 'Slashing', twoHanded: true },
    { id: 'rapier', name: 'Rapier', weaponSkillId: 'martial', damageDice: '1d8', damageType: 'Piercing', finesse: true },
    { id: 'shortsword', name: 'Shortsword', weaponSkillId: 'martial', damageDice: '1d6', damageType: 'Piercing', finesse: true },
    { id: 'dagger', name: 'Dagger', weaponSkillId: 'simple', damageDice: '1d4', damageType: 'Piercing', finesse: true, range: '20/60' },
    { id: 'quarterstaff', name: 'Quarterstaff', weaponSkillId: 'simple', damageDice: '1d6', damageType: 'Bludgeoning' },
    { id: 'shortbow', name: 'Shortbow', weaponSkillId: 'simple', damageDice: '1d6', damageType: 'Piercing', range: '80/320' },
  ],
  startingKit: [{ name: "Explorer's pack" }],
};
