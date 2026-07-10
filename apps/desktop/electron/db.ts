import Database from 'better-sqlite3';

/**
 * Firebase-RTDB-shaped key-value store over SQLite (better-sqlite3, synchronous,
 * main process only). The renderer's ported data layer thinks in RTDB paths —
 * `games/{id}/board/tokens/{key}/x` — so this module reproduces RTDB's semantics:
 *
 * - Everything is normalized to LEAF rows (path → JSON primitive). Writing an
 *   object replaces the subtree under that path (delete rows, insert leaves).
 * - Writing `null` (or an empty object — RTDB treats them identically) deletes.
 * - Reads assemble a nested object from the leaf rows under a path; objects whose
 *   keys are 0..n-1 contiguous integers come back as ARRAYS, mirroring what
 *   Firebase's `snap.val()` does — ported code depends on this.
 * - `update` applies each entry as a write to `path/key` (RTDB update semantics:
 *   shallow merge, deep replace per key).
 *
 * Subscriptions: the renderer registers (id, path); after every mutation batch we
 * re-read each subscription whose path is an ancestor or descendant of a touched
 * path and hand the fresh value to the notifier (main pushes it over IPC).
 */

export type Primitive = string | number | boolean;

export interface KvStore {
  read(path: string): unknown;
  write(path: string, value: unknown): void;
  update(path: string, partial: Record<string, unknown>): void;
  multiUpdate(updates: Record<string, unknown>): void;
  remove(path: string): void;
  subscribe(id: string, path: string): void;
  unsubscribe(id: string): void;
  close(): void;
}

const norm = (path: string): string => path.replace(/^\/+|\/+$/g, '');

function flatten(base: string, value: unknown, out: Map<string, Primitive>): void {
  if (value === null || value === undefined) return;
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      value.forEach((v, i) => flatten(base ? `${base}/${i}` : String(i), v, out));
      return;
    }
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      flatten(base ? `${base}/${k}` : k, v, out);
    }
    return;
  }
  out.set(base, value as Primitive);
}

/** Rebuild a nested value from leaf rows relative to `root` ('' = the row itself). */
function assemble(pairs: Array<[string, Primitive]>): unknown {
  if (pairs.length === 0) return null;
  if (pairs.length === 1 && pairs[0][0] === '') return pairs[0][1];
  const obj: Record<string, unknown> = {};
  for (const [rel, val] of pairs) {
    const parts = rel.split('/');
    let node = obj;
    for (let i = 0; i < parts.length - 1; i += 1) {
      const key = parts[i];
      const next = node[key];
      if (typeof next !== 'object' || next === null) node[key] = {};
      node = node[key] as Record<string, unknown>;
    }
    node[parts[parts.length - 1]] = val;
  }
  return arrayify(obj);
}

/** RTDB's snap.val() turns {0:a,1:b} into [a,b]; replicate for contiguous 0..n-1 keys. */
function arrayify(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) return value;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj);
  for (const k of keys) obj[k] = arrayify(obj[k]);
  if (keys.length > 0 && keys.every((k, ) => /^\d+$/.test(k))) {
    const nums = keys.map(Number).sort((a, b) => a - b);
    if (nums[0] === 0 && nums[nums.length - 1] === nums.length - 1) {
      const arr = new Array<unknown>(nums.length);
      for (const n of nums) arr[n] = obj[String(n)];
      return arr;
    }
  }
  return value;
}

export function openKv(
  dbPath: string,
  notify: (subId: string, path: string, value: unknown) => void,
): KvStore {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS kv (
      path TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  const stGet = db.prepare('SELECT value FROM kv WHERE path = ?');
  const stPrefix = db.prepare("SELECT path, value FROM kv WHERE path LIKE ? || '/%'");
  const stPut = db.prepare(
    'INSERT INTO kv (path, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(path) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at',
  );
  const stDelExact = db.prepare('DELETE FROM kv WHERE path = ?');
  const stDelPrefix = db.prepare("DELETE FROM kv WHERE path LIKE ? || '/%'");

  // Renderer subscriptions: id → path.
  const subs = new Map<string, string>();

  const related = (a: string, b: string): boolean =>
    a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`);

  const read = (rawPath: string): unknown => {
    const path = norm(rawPath);
    const pairs: Array<[string, Primitive]> = [];
    const exact = stGet.get(path) as { value: string } | undefined;
    if (exact) pairs.push(['', JSON.parse(exact.value) as Primitive]);
    for (const row of stPrefix.all(path) as Array<{ path: string; value: string }>) {
      pairs.push([row.path.slice(path.length + 1), JSON.parse(row.value) as Primitive]);
    }
    return assemble(pairs);
  };

  const notifyTouched = (touched: string[]): void => {
    for (const [id, subPath] of subs) {
      if (touched.some((t) => related(t, subPath))) {
        notify(id, subPath, read(subPath));
      }
    }
  };

  const writeNoNotify = (rawPath: string, value: unknown): void => {
    const path = norm(rawPath);
    stDelExact.run(path);
    stDelPrefix.run(path);
    // RTDB: writing under a leaf ancestor implicitly converts it to a tree.
    const parts = path.split('/');
    for (let i = 1; i < parts.length; i += 1) {
      stDelExact.run(parts.slice(0, i).join('/'));
    }
    const leaves = new Map<string, Primitive>();
    flatten('', value, leaves);
    const now = Date.now();
    for (const [rel, leaf] of leaves) {
      stPut.run(rel === '' ? path : `${path}/${rel}`, JSON.stringify(leaf), now);
    }
  };

  const txWrite = db.transaction((path: string, value: unknown) => writeNoNotify(path, value));
  const txMulti = db.transaction((updates: Record<string, unknown>) => {
    for (const [p, v] of Object.entries(updates)) writeNoNotify(p, v);
  });

  return {
    read,

    write(path, value) {
      txWrite(norm(path), value);
      notifyTouched([norm(path)]);
    },

    update(path, partial) {
      const base = norm(path);
      const updates: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(partial)) updates[`${base}/${norm(k)}`] = v;
      txMulti(updates);
      notifyTouched(Object.keys(updates));
    },

    multiUpdate(updates) {
      const normed: Record<string, unknown> = {};
      for (const [p, v] of Object.entries(updates)) normed[norm(p)] = v;
      txMulti(normed);
      notifyTouched(Object.keys(normed));
    },

    remove(path) {
      txWrite(norm(path), null);
      notifyTouched([norm(path)]);
    },

    subscribe(id, path) {
      subs.set(id, norm(path));
      // Fire immediately with the current value (RTDB onValue semantics).
      notify(id, norm(path), read(norm(path)));
    },

    unsubscribe(id) {
      subs.delete(id);
    },

    close() {
      db.close();
    },
  };
}
