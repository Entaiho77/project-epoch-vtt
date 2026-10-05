import { createContext, useContext } from 'react';

/**
 * Why this person can't attack right now (e.g. "It's Goblin's turn"), or null when they can.
 * The board provides it from the initiative order; character sheets disable their attack
 * buttons and show the reason. Outside a board (no provider) attacks are always allowed.
 */
export const AttackGateContext = createContext<string | null>(null);

export function useAttackBlocked(): string | null {
  return useContext(AttackGateContext);
}

/** The board-wide hint shown wherever attacks happen and nothing is targeted. */
export const TARGET_HINT = 'Right-click a creature on the board and choose “Set as target”.';
