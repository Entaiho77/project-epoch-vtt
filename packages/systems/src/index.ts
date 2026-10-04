// Public API of @epoch/systems: the system registry (lookup/list) over the bundled game systems.
// Individual system data files (dnd5e/*, solryn/*) remain importable via @epoch/systems/<path>.
export * from './registry';
export { solrynSystem } from './solryn';
export { dnd5eSystem } from './dnd5e';
