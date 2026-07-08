/**
 * A tiny, safe arithmetic evaluator for user-authored formulas (the homebrew custom crit formula).
 *
 * It supports ONLY numeric literals, the named variables passed in, the four arithmetic operators
 * (+ - * /), unary minus, and parentheses — nothing else. There is no property access, no function
 * calls, and no identifier resolution beyond the supplied variable map, so a malicious or malformed
 * string can never execute code (unlike raw eval()). Unknown identifiers, bad syntax, or a
 * non-finite result all return null, which callers treat as "invalid formula".
 *
 * Grammar (recursive descent):
 *   expr   := term (('+' | '-') term)*
 *   term   := unary (('*' | '/') unary)*
 *   unary  := ('+' | '-') unary | primary
 *   primary:= number | identifier | '(' expr ')'
 */

type Token = { kind: 'num'; value: number } | { kind: 'id'; name: string } | { kind: 'op'; op: string };

function tokenize(input: string): Token[] | null {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const c = input[i];
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      i++;
      continue;
    }
    if ('+-*/()'.includes(c)) {
      tokens.push({ kind: 'op', op: c });
      i++;
      continue;
    }
    if (c >= '0' && c <= '9') {
      let j = i + 1;
      while (j < input.length && ((input[j] >= '0' && input[j] <= '9') || input[j] === '.')) j++;
      const value = Number(input.slice(i, j));
      if (!Number.isFinite(value)) return null;
      tokens.push({ kind: 'num', value });
      i = j;
      continue;
    }
    if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c === '_') {
      let j = i + 1;
      while (j < input.length && /[A-Za-z0-9_]/.test(input[j])) j++;
      tokens.push({ kind: 'id', name: input.slice(i, j) });
      i = j;
      continue;
    }
    return null; // any other character is a syntax error
  }
  return tokens;
}

/**
 * Evaluate `expr` with the given variables. Returns the numeric result, or null if the formula is
 * malformed, references an unknown variable, or produces a non-finite value.
 */
export function evalFormula(expr: string, vars: Record<string, number>): number | null {
  const tokens = tokenize(expr ?? '');
  if (!tokens || tokens.length === 0) return null;

  let pos = 0;
  const peek = () => tokens[pos];
  const eat = () => tokens[pos++];

  // Thrown for any parse/eval error; caught at the boundary and turned into null.
  class ParseError extends Error {}

  // A single left-associative pass over + and - (kept together for correct associativity).
  function parseAddSub(): number {
    let value = parseTerm();
    while (peek()?.kind === 'op' && ((peek() as { op: string }).op === '+' || (peek() as { op: string }).op === '-')) {
      const op = (eat() as { op: string }).op;
      const rhs = parseTerm();
      value = op === '+' ? value + rhs : value - rhs;
    }
    return value;
  }

  function parseTerm(): number {
    let value = parseUnary();
    while (peek()?.kind === 'op' && ((peek() as { op: string }).op === '*' || (peek() as { op: string }).op === '/')) {
      const op = (eat() as { op: string }).op;
      const rhs = parseUnary();
      value = op === '*' ? value * rhs : value / rhs;
    }
    return value;
  }

  function parseUnary(): number {
    const t = peek();
    if (t?.kind === 'op' && (t.op === '+' || t.op === '-')) {
      eat();
      const v = parseUnary();
      return t.op === '-' ? -v : v;
    }
    return parsePrimary();
  }

  function parsePrimary(): number {
    const t = eat();
    if (!t) throw new ParseError('unexpected end');
    if (t.kind === 'num') return t.value;
    if (t.kind === 'id') {
      if (!(t.name in vars)) throw new ParseError(`unknown variable ${t.name}`);
      return vars[t.name];
    }
    if (t.kind === 'op' && t.op === '(') {
      const v = parseAddSub();
      const close = eat();
      if (!close || close.kind !== 'op' || close.op !== ')') throw new ParseError('missing )');
      return v;
    }
    throw new ParseError('unexpected token');
  }

  try {
    const result = parseAddSub();
    if (pos !== tokens.length) return null; // trailing garbage
    return Number.isFinite(result) ? result : null;
  } catch {
    return null;
  }
}
