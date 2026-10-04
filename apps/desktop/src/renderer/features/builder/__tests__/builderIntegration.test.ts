import { describe, it, expect } from 'vitest';
import { solrynSystem } from '@epoch/systems/solryn';
import { dnd5eSystem } from '@epoch/systems/dnd5e';
import {
  buildStepPlan,
  canAdvanceStep,
  createInitialDraft,
  createReducer,
  finalizeCharacter,
  type BuilderDraft,
} from '../builderModel';

/**
 * Integration test: verify a complete character creation flow for both Solryn and D&D 5e,
 * from initial draft through finalization to full Character object.
 */

describe('Character Creation Integration', () => {
  describe('Solryn system', () => {
    it('creates a complete Solryn character from scratch', () => {
      const system = solrynSystem;
      const reducer = createReducer(system);
      let draft = createInitialDraft();

      // Step 1: Roll all stats
      const statOrder = system.creation.statOrder;
      for (let i = 0; i < statOrder.length; i++) {
        draft = reducer(draft, {
          type: 'rollStat',
          statId: statOrder[i],
          value: 8 + i, // 8, 9, 10, 11, 12, 13, 14
        });
      }
      expect(Object.keys(draft.coreScores)).toHaveLength(statOrder.length);

      // Step 2: Choose ancestry
      const firstAncestry = system.ancestries[0];
      draft = reducer(draft, {
        type: 'chooseAncestry',
        ancestryId: firstAncestry.id,
      });
      expect(draft.ancestryId).toBe(firstAncestry.id);

      // Step 3: Enter name
      draft = reducer(draft, {
        type: 'setName',
        name: 'Test Character',
      });
      expect(draft.name).toBe('Test Character');

      // Step 4: Choose skills (pick 3)
      const skillIds = system.skills.slice(0, 3).map((s) => s.id);
      for (const skillId of skillIds) {
        draft = reducer(draft, {
          type: 'toggleSkill',
          skillId,
        });
      }
      expect(draft.chosenSkillIds.length).toBeGreaterThanOrEqual(3);

      // Step 5: Choose spells (if applicable — ARC mod must be > 0)
      const arcMod = Math.floor((draft.coreScores['ARC'] - 3) / 3);
      if (arcMod > 0) {
        const spellIds = system.spells.slice(0, Math.min(2, arcMod)).map((s) => s.id);
        for (const spellId of spellIds) {
          draft = reducer(draft, {
            type: 'toggleSpell',
            spellId,
          });
        }
      }

      // Step 6: Choose starting gear
      if (system.equipment.startingGear && system.equipment.startingGear.length > 0) {
        const firstGear = system.equipment.startingGear[0];
        if (firstGear.id) {
          draft = reducer(draft, {
            type: 'equipGear',
            gearId: firstGear.id,
          });
        }
      }

      // Finalize: build the complete Character object
      const ids = {
        gameId: 'game-123',
        ownerUserId: 'user-456',
      };
      const character = finalizeCharacter(system, draft, ids);

      // Verify key character properties
      expect(character.name).toBe('Test Character');
      expect(character.gameId).toBe('game-123');
      expect(character.ownerUserId).toBe('user-456');
      expect(character.definition.ancestryId).toBe(firstAncestry.id);
      expect(character.definition.coreScores).toBeDefined();
      expect(Object.keys(character.definition.coreScores)).toHaveLength(statOrder.length);
      expect(character.definition.chosenSkillIds).toBeDefined();
      expect(character.definition.knownSpellIds).toBeDefined();
      expect(character.buildComplete).toBe(true);
      expect(character.play).toBeDefined();
      expect(character.play.pools).toBeDefined();
    });

    it('non-caster character skips spell selection', () => {
      const system = solrynSystem;
      const reducer = createReducer(system);
      let draft = createInitialDraft();

      // Roll stats with very low ARC
      const statOrder = system.creation.statOrder;
      for (let i = 0; i < statOrder.length; i++) {
        draft = reducer(draft, {
          type: 'rollStat',
          statId: statOrder[i],
          value: statOrder[i] === 'ARC' ? 2 : 8,
        });
      }

      // Step plan should not include spells for non-caster
      const plan = buildStepPlan(system, draft);
      const hasSpellStep = plan.some((s) => s.kind === 'spells');
      expect(hasSpellStep).toBe(false);
    });
  });

  describe('D&D 5e system', () => {
    it('creates a complete D&D 5e character from scratch', () => {
      const system = dnd5eSystem;
      const reducer = createReducer(system);
      let draft = createInitialDraft();

      // Step 1: Roll ability scores
      const statOrder = system.creation.statOrder;
      for (let i = 0; i < statOrder.length; i++) {
        draft = reducer(draft, {
          type: 'rollStat',
          statId: statOrder[i],
          value: 8 + i,
        });
      }

      // Step 2: Choose race
      const firstRace = system.ancestries[0];
      draft = reducer(draft, {
        type: 'chooseAncestry',
        ancestryId: firstRace.id,
      });

      // Step 3: Enter name
      draft = reducer(draft, {
        type: 'setName',
        name: 'D&D Character',
      });

      // Step 4: Choose class
      const firstClass = system.skillCategories[0]; // In 5e, "skillCategories" holds class-like categorization
      if (firstClass) {
        // The actual class selection mechanism may differ; this is structural
      }

      // Finalize
      const ids = {
        gameId: 'game-789',
        ownerUserId: 'user-000',
      };
      const character = finalizeCharacter(system, draft, ids);

      expect(character.name).toBe('D&D Character');
      expect(character.definition.ancestryId).toBe(firstRace.id);
      expect(character.buildComplete).toBe(true);
    });
  });

  describe('Advancement', () => {
    it('prevents advancement until all required steps are complete', () => {
      const system = solrynSystem;
      const reducer = createReducer(system);
      const draft = createInitialDraft();

      // Can't advance from roll step without rolling any stats
      const plan = buildStepPlan(system, draft);
      const rollStep = plan[0];
      expect(rollStep.kind).toBe('roll');
      expect(canAdvanceStep(system, draft, rollStep, 0)).toBe(false);
    });

    it('allows advancement once all required fields are filled', () => {
      const system = solrynSystem;
      const reducer = createReducer(system);
      let draft = createInitialDraft();

      // Roll all stats
      const statOrder = system.creation.statOrder;
      for (const statId of statOrder) {
        draft = reducer(draft, {
          type: 'rollStat',
          statId,
          value: 10,
        });
      }

      const plan = buildStepPlan(system, draft);
      const rollStep = plan[0];
      expect(canAdvanceStep(system, draft, rollStep, 0)).toBe(true);
    });
  });
});
