import { computeDerived } from '@epoch/engine';
import type { Character, SystemDefinition } from '@epoch/shared-types';

/**
 * A character's initiative modifier: the derived stat marked as the roll stat,
 * with their equipped armor. Used when rolling in, and by the GM's computer to
 * check a player's initiative.
 */
export function initiativeModifier(system: SystemDefinition, character: Character): number {
  const armor = system.equipment.armor.find((a) => a.id === character.play.equippedArmorId);
  const equip = armor ? { armor: { dr: armor.dr, speedPenalty: armor.speedPenalty } } : undefined;
  const roll = computeDerived(system, character.definition.coreScores, equip).find((d) => d.isRoll);
  return roll?.value ?? 0;
}
