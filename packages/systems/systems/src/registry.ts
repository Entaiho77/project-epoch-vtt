import type { SystemDefinition } from '@solryn/shared-types';
import { solrynSystem } from './solryn';
import { dnd5eSystem } from './dnd5e';

/**
 * The system registry — the app's menu of available presets. Today it holds only Solryn.
 * Adding a system = registering another SystemDefinition here; "Custom" (the deferred
 * builder) will eventually register a user-built definition the same way. The create-game
 * picker, header badge, and rules reference all read from here, never from Solryn directly.
 */
const systems: Record<string, SystemDefinition> = {
  [solrynSystem.id]: solrynSystem,
  [dnd5eSystem.id]: dnd5eSystem,
};

export interface SystemSummary {
  id: string;
  name: string;
  glyph: string;
  color: string;
  tagline?: string;
}

/** Resolve a full system definition by id (used once a game's systemId is known). */
export function getSystem(systemId: string): SystemDefinition | undefined {
  return systems[systemId];
}

/** Like getSystem, but throws — for call sites that require a valid system. */
export function requireSystem(systemId: string): SystemDefinition {
  const system = systems[systemId];
  if (!system) throw new Error(`Unknown system: ${systemId}`);
  return system;
}

/** Lightweight list for the create-game picker and lobby badges. */
export function listSystems(): SystemSummary[] {
  return Object.values(systems).map(({ id, name, glyph, color, tagline }) => ({
    id,
    name,
    glyph,
    color,
    tagline,
  }));
}

export const DEFAULT_SYSTEM_ID = solrynSystem.id;

/**
 * Whether a system uses the class-and-level model (5e) — the single source of truth for
 * picking the 5e builder/sheet vs. Solryn's. Both GamePage (builder) and BoardScreen (sheet)
 * route through this so the selection can't drift between call sites.
 */
export function isClassAndLevel(system: SystemDefinition): boolean {
  return system.modes.progression.id === 'class-and-level';
}
