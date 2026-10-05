import { describe, expect, it } from 'vitest';
import type { Token } from '@epoch/shared-types';
import { hitChanges, isDefeated, maxClaimableDamage, mayAttackNow } from '../damage';

const tok = (over: Partial<Token>): Token => ({ id: 't', kind: 'creature', name: 'Orc', mapId: 'm', col: 0, row: 0, color: '#000', ...over }) as Token;

describe('damage helpers', () => {
  it('a creature at 0 HP or marked defeated is down; characters never count', () => {
    expect(isDefeated(tok({ hp: { current: 0, max: 5 } }))).toBe(true);
    expect(isDefeated(tok({ defeated: true }))).toBe(true);
    expect(isDefeated(tok({ hp: { current: 2, max: 5 } }))).toBe(false);
    expect(isDefeated(tok({ kind: 'character', hp: { current: 0, max: 5 } }))).toBe(false);
  });
  it('a hit lowers HP (never below 0) on the token, or on the character sheet for a PC', () => {
    expect(hitChanges('g', tok({ hp: { current: 5, max: 5 } }), 2)).toEqual({ '/games/g/tokens/t/hp/current': 3 });
    expect(hitChanges('g', tok({ hp: { current: 5, max: 5 } }), 9)).toEqual({
      '/games/g/tokens/t/hp/current': 0,
      '/games/g/tokens/t/defeated': true,
    });
    expect(hitChanges('g', tok({ kind: 'character', characterId: 'c1' }), 4, 10)).toEqual({ '/characters/c1/play/pools/hp/current': 6 });
    expect(hitChanges('g', tok({}), 4)).toBeNull(); // no HP tracked
  });
  it('the most a roll can claim grows with its dice', () => {
    expect(maxClaimableDamage([{ s: 20, f: 18 }, { s: 8, f: 6 }])).toBe(52);
  });
  it('turn rule: free outside combat and while rolling in; else your turn, your creature, or GM allows', () => {
    const order = [{ tokenId: 'gob' }, { ownerUserId: 'me' }];
    expect(mayAttackNow(null, { uid: 'me' })).toBe(true);
    expect(mayAttackNow({ active: true, phase: 'rolling', turnIndex: 0, order }, { uid: 'me' })).toBe(true);
    expect(mayAttackNow({ active: true, turnIndex: 0, order }, { uid: 'me' })).toBe(false);
    expect(mayAttackNow({ active: true, turnIndex: 0, order }, { tokenId: 'gob' })).toBe(true);
    expect(mayAttackNow({ active: true, turnIndex: 1, order }, { uid: 'me' })).toBe(true);
    expect(mayAttackNow({ active: true, turnIndex: 0, order, allowOffTurn: true }, { uid: 'me' })).toBe(true);
  });
});
