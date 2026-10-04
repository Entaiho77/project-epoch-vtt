/**
 * Formula expression AST.
 *
 * Derived-stat formulas (HP, DR, Speed, Carry, resource pools…) are expressed as
 * DATA — a small, serializable arithmetic tree — never as hardcoded functions.
 * This is the keystone principle applied to math: the engine evaluates any system's
 * formulas generically, and a future system-builder can construct these trees from a
 * form instead of requiring code.
 *
 * The language is deliberately tiny (the finite "menu" philosophy): constants, stat
 * references (score or modifier), equipment-field references, and a handful of
 * operations. It is enough for Solryn and extends by adding node kinds, which then
 * benefit every system.
 */

/** Reference a core stat's raw score or its computed modifier. */
export interface StatTerm {
  kind: 'stat';
  /** Core-stat id (e.g. "END"). */
  stat: string;
  /** Use the raw rolled score, or the derived modifier. */
  as: 'score' | 'modifier';
}

/**
 * Reference a numeric field from currently-equipped gear.
 * e.g. { equipment: "armor", field: "dr" } or { equipment: "armor", field: "speedPenalty" }.
 * These are what make DR and Speed "equipment-fed" and partial until gear is chosen.
 */
export interface EquipmentTerm {
  kind: 'equipment';
  /** Equipment slot/category id (e.g. "armor", "shield"). */
  equipment: string;
  /** Numeric field on the equipped item. */
  field: string;
}

export interface ConstTerm {
  kind: 'const';
  value: number;
}

export interface AddExpr {
  kind: 'add';
  terms: Expr[];
}

export interface SubExpr {
  kind: 'sub';
  left: Expr;
  right: Expr;
}

export interface MulExpr {
  kind: 'mul';
  left: Expr;
  right: Expr;
}

/** Clamp a value to an optional inclusive [min, max] (Solryn Speed caps at 50ft). */
export interface ClampExpr {
  kind: 'clamp';
  value: Expr;
  min?: number;
  max?: number;
}

export type Expr =
  | ConstTerm
  | StatTerm
  | EquipmentTerm
  | AddExpr
  | SubExpr
  | MulExpr
  | ClampExpr;

// --- Builder helpers (ergonomic authoring of seed data; produce plain data) ---

export const c = (value: number): ConstTerm => ({ kind: 'const', value });

export const score = (stat: string): StatTerm => ({ kind: 'stat', stat, as: 'score' });

export const mod = (stat: string): StatTerm => ({
  kind: 'stat',
  stat,
  as: 'modifier',
});

export const equip = (equipment: string, field: string): EquipmentTerm => ({
  kind: 'equipment',
  equipment,
  field,
});

export const add = (...terms: Expr[]): AddExpr => ({ kind: 'add', terms });

export const sub = (left: Expr, right: Expr): SubExpr => ({
  kind: 'sub',
  left,
  right,
});

export const mul = (left: Expr, right: Expr): MulExpr => ({
  kind: 'mul',
  left,
  right,
});

export const clamp = (value: Expr, min?: number, max?: number): ClampExpr => ({
  kind: 'clamp',
  value,
  min,
  max,
});
