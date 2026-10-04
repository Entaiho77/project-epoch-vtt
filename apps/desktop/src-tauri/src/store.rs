//! Firebase-RTDB-shaped key-value store over SQLite.
//!
//! The renderer's data layer thinks in RTDB paths (`games/{id}/board/tokens/{key}/x`),
//! so this module reproduces RTDB semantics exactly as the old Electron store did:
//!
//! - Everything is normalized to LEAF rows (path -> JSON primitive). Writing an
//!   object replaces the subtree under that path (delete rows, insert leaves).
//! - Writing `null` (or an empty object) deletes.
//! - Reads assemble a nested object from the leaf rows under a path; objects whose
//!   keys are 0..n-1 contiguous integers come back as ARRAYS, like Firebase's
//!   `snap.val()`.
//! - `update` applies each entry as a write to `path/key` (shallow merge,
//!   deep replace per key).
//!
//! Subscriptions: the renderer registers (id, path); after every mutation we
//! re-read each subscription whose path is an ancestor or descendant of a touched
//! path and hand the fresh value to the notifier.

use std::collections::HashMap;
use std::path::Path;
use std::time::{SystemTime, UNIX_EPOCH};

use rusqlite::{params, Connection, OptionalExtension};
use serde_json::{Map, Value};

pub type Notify = Box<dyn Fn(&str, &str, &Value) + Send + Sync>;

pub struct KvStore {
    conn: Connection,
    /// subscription id -> normalized path
    subs: HashMap<String, String>,
    notify: Notify,
}

pub type StoreResult<T> = Result<T, String>;

fn err<E: std::fmt::Display>(e: E) -> String {
    e.to_string()
}

/// Strip leading and trailing slashes.
pub fn norm(path: &str) -> String {
    path.trim_matches('/').to_string()
}

fn join(base: &str, key: &str) -> String {
    if base.is_empty() {
        key.to_string()
    } else if key.is_empty() {
        base.to_string()
    } else {
        format!("{base}/{key}")
    }
}

fn related(a: &str, b: &str) -> bool {
    // The root path ("") is related to everything.
    a.is_empty()
        || b.is_empty()
        || a == b
        || a.starts_with(&format!("{b}/"))
        || b.starts_with(&format!("{a}/"))
}

fn now_ms() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis() as i64)
        .unwrap_or(0)
}

/// Flatten a JSON value into leaf rows (relative path -> primitive).
fn flatten(base: &str, value: &Value, out: &mut Vec<(String, Value)>) {
    match value {
        Value::Null => {}
        Value::Array(items) => {
            for (i, v) in items.iter().enumerate() {
                flatten(&join(base, &i.to_string()), v, out);
            }
        }
        Value::Object(map) => {
            for (k, v) in map {
                flatten(&join(base, k), v, out);
            }
        }
        primitive => out.push((base.to_string(), primitive.clone())),
    }
}

/// Rebuild a nested value from leaf rows relative to the read root ("" = the row itself).
fn assemble(pairs: Vec<(String, Value)>) -> Value {
    if pairs.is_empty() {
        return Value::Null;
    }
    if pairs.len() == 1 && pairs[0].0.is_empty() {
        return pairs.into_iter().next().map(|(_, v)| v).unwrap_or(Value::Null);
    }
    let mut root = Map::new();
    for (rel, val) in pairs {
        if rel.is_empty() {
            // A leaf at the root alongside children shouldn't happen (writes clear
            // ancestors), but if it does the children win, matching the old store.
            continue;
        }
        let parts: Vec<&str> = rel.split('/').collect();
        let mut node = &mut root;
        for key in &parts[..parts.len() - 1] {
            let entry = node
                .entry((*key).to_string())
                .or_insert_with(|| Value::Object(Map::new()));
            if !entry.is_object() {
                *entry = Value::Object(Map::new());
            }
            node = entry.as_object_mut().expect("just ensured object");
        }
        node.insert(parts[parts.len() - 1].to_string(), val);
    }
    arrayify(Value::Object(root))
}

/// Firebase turns {0:a,1:b} into [a,b]; replicate for contiguous 0..n-1 keys.
fn arrayify(value: Value) -> Value {
    match value {
        Value::Object(map) => {
            let map: Map<String, Value> =
                map.into_iter().map(|(k, v)| (k, arrayify(v))).collect();
            let all_numeric =
                !map.is_empty() && map.keys().all(|k| !k.is_empty() && k.bytes().all(|b| b.is_ascii_digit()));
            if all_numeric {
                let mut nums: Vec<(usize, Value)> = Vec::with_capacity(map.len());
                for (k, v) in map.iter() {
                    match k.parse::<usize>() {
                        Ok(n) => nums.push((n, v.clone())),
                        Err(_) => return Value::Object(map),
                    }
                }
                nums.sort_by_key(|(n, _)| *n);
                let contiguous = nums.iter().enumerate().all(|(i, (n, _))| i == *n);
                // Keys like "01" parse to 1 but aren't the canonical index; leave them as an object.
                let canonical = map.keys().all(|k| k == "0" || !k.starts_with('0'));
                if contiguous && canonical {
                    return Value::Array(nums.into_iter().map(|(_, v)| v).collect());
                }
            }
            Value::Object(map)
        }
        other => other,
    }
}

impl KvStore {
    pub fn open(db_path: &Path, notify: Notify) -> StoreResult<Self> {
        let conn = Connection::open(db_path).map_err(err)?;
        conn.pragma_update(None, "journal_mode", "WAL").map_err(err)?;
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS kv (
                path TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at INTEGER NOT NULL
            );",
        )
        .map_err(err)?;
        Ok(Self {
            conn,
            subs: HashMap::new(),
            notify,
        })
    }

    /// Rows strictly below `path`. Uses a range scan rather than LIKE, because
    /// LIKE treats `_` (common in generated keys) as a wildcard.
    /// `'0'` is the character right after `'/'`, so [path/, path0) is exactly
    /// the set of strings that start with "path/".
    fn children(&self, path: &str) -> StoreResult<Vec<(String, String)>> {
        let (sql, lo, hi) = if path.is_empty() {
            ("SELECT path, value FROM kv", String::new(), String::new())
        } else {
            (
                "SELECT path, value FROM kv WHERE path >= ?1 AND path < ?2",
                format!("{path}/"),
                format!("{path}0"),
            )
        };
        let mut stmt = self.conn.prepare_cached(sql).map_err(err)?;
        let map_row = |r: &rusqlite::Row| Ok((r.get::<_, String>(0)?, r.get::<_, String>(1)?));
        let rows = if path.is_empty() {
            stmt.query_map([], map_row).map_err(err)?.collect::<Result<Vec<_>, _>>()
        } else {
            stmt.query_map(params![lo, hi], map_row)
                .map_err(err)?
                .collect::<Result<Vec<_>, _>>()
        };
        rows.map_err(err)
    }

    pub fn read(&self, raw_path: &str) -> StoreResult<Value> {
        let path = norm(raw_path);
        let mut pairs: Vec<(String, Value)> = Vec::new();
        if !path.is_empty() {
            let exact: Option<String> = self
                .conn
                .query_row("SELECT value FROM kv WHERE path = ?1", params![path], |r| r.get(0))
                .optional()
                .map_err(err)?;
            if let Some(v) = exact {
                pairs.push((String::new(), serde_json::from_str(&v).map_err(err)?));
            }
        }
        let skip = if path.is_empty() { 0 } else { path.len() + 1 };
        for (p, v) in self.children(&path)? {
            pairs.push((p[skip..].to_string(), serde_json::from_str(&v).map_err(err)?));
        }
        Ok(assemble(pairs))
    }

    fn write_no_notify(tx: &rusqlite::Transaction, path: &str, value: &Value) -> StoreResult<()> {
        // Remove the node itself and everything below it.
        if path.is_empty() {
            tx.execute("DELETE FROM kv", []).map_err(err)?;
        } else {
            tx.execute("DELETE FROM kv WHERE path = ?1", params![path]).map_err(err)?;
            tx.execute(
                "DELETE FROM kv WHERE path >= ?1 AND path < ?2",
                params![format!("{path}/"), format!("{path}0")],
            )
            .map_err(err)?;
            // RTDB: writing under a leaf ancestor implicitly converts it to a tree.
            let parts: Vec<&str> = path.split('/').collect();
            for i in 1..parts.len() {
                tx.execute("DELETE FROM kv WHERE path = ?1", params![parts[..i].join("/")])
                    .map_err(err)?;
            }
        }
        let mut leaves = Vec::new();
        flatten("", value, &mut leaves);
        let now = now_ms();
        let mut put = tx
            .prepare_cached(
                "INSERT INTO kv (path, value, updated_at) VALUES (?1, ?2, ?3)
                 ON CONFLICT(path) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
            )
            .map_err(err)?;
        for (rel, leaf) in leaves {
            let full = join(path, &rel);
            put.execute(params![full, leaf.to_string(), now]).map_err(err)?;
        }
        Ok(())
    }

    fn apply(&mut self, updates: Vec<(String, Value)>) -> StoreResult<()> {
        let tx = self.conn.transaction().map_err(err)?;
        for (p, v) in &updates {
            Self::write_no_notify(&tx, p, v)?;
        }
        tx.commit().map_err(err)?;
        let touched: Vec<String> = updates.into_iter().map(|(p, _)| p).collect();
        self.notify_touched(&touched)
    }

    fn notify_touched(&self, touched: &[String]) -> StoreResult<()> {
        for (id, sub_path) in &self.subs {
            if touched.iter().any(|t| related(t, sub_path)) {
                let value = self.read(sub_path)?;
                (self.notify)(id, sub_path, &value);
            }
        }
        Ok(())
    }

    pub fn write(&mut self, path: &str, value: Value) -> StoreResult<()> {
        self.apply(vec![(norm(path), value)])
    }

    pub fn update(&mut self, path: &str, partial: Map<String, Value>) -> StoreResult<()> {
        let base = norm(path);
        let updates = partial
            .into_iter()
            .map(|(k, v)| (join(&base, &norm(&k)), v))
            .collect();
        self.apply(updates)
    }

    pub fn multi_update(&mut self, updates: Map<String, Value>) -> StoreResult<()> {
        self.apply(updates.into_iter().map(|(p, v)| (norm(&p), v)).collect())
    }

    pub fn remove(&mut self, path: &str) -> StoreResult<()> {
        self.write(path, Value::Null)
    }

    pub fn subscribe(&mut self, id: &str, path: &str) -> StoreResult<()> {
        let path = norm(path);
        self.subs.insert(id.to_string(), path.clone());
        // Fire immediately with the current value (RTDB onValue semantics).
        let value = self.read(&path)?;
        (self.notify)(id, &path, &value);
        Ok(())
    }

    pub fn unsubscribe(&mut self, id: &str) {
        self.subs.remove(id);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;
    use std::sync::{Arc, Mutex};

    type Events = Arc<Mutex<Vec<(String, String, Value)>>>;

    fn open(dir: &Path) -> (KvStore, Events) {
        let events: Events = Arc::new(Mutex::new(Vec::new()));
        let sink = events.clone();
        let kv = KvStore::open(
            &dir.join("test.db"),
            Box::new(move |id, path, value| {
                sink.lock().unwrap().push((id.into(), path.into(), value.clone()))
            }),
        )
        .unwrap();
        (kv, events)
    }

    fn tmp() -> std::path::PathBuf {
        let d = std::env::temp_dir().join(format!("epoch-kv-{}", uuid::Uuid::new_v4()));
        std::fs::create_dir_all(&d).unwrap();
        d
    }

    #[test]
    fn round_trips_primitives_and_objects() {
        let d = tmp();
        let (mut kv, _) = open(&d);
        kv.write("games/g1/name", json!("Curse of Strahd")).unwrap();
        assert_eq!(kv.read("games/g1/name").unwrap(), json!("Curse of Strahd"));
        kv.write("games/g2", json!({"name": "Solryn", "members": {"u1": {"role": "gm"}}})).unwrap();
        assert_eq!(
            kv.read("games/g2").unwrap(),
            json!({"name": "Solryn", "members": {"u1": {"role": "gm"}}})
        );
        assert_eq!(kv.read("games/g2/members/u1/role").unwrap(), json!("gm"));
    }

    #[test]
    fn assembles_prefix_reads() {
        let d = tmp();
        let (mut kv, _) = open(&d);
        kv.write("games/g1/name", json!("A")).unwrap();
        kv.write("games/g2/name", json!("B")).unwrap();
        assert_eq!(kv.read("games").unwrap(), json!({"g1": {"name": "A"}, "g2": {"name": "B"}}));
    }

    #[test]
    fn object_write_replaces_subtree() {
        let d = tmp();
        let (mut kv, _) = open(&d);
        kv.write("games/g1", json!({"name": "Old", "stale": true})).unwrap();
        kv.write("games/g1", json!({"name": "New"})).unwrap();
        assert_eq!(kv.read("games/g1").unwrap(), json!({"name": "New"}));
    }

    #[test]
    fn update_merges_shallowly() {
        let d = tmp();
        let (mut kv, _) = open(&d);
        kv.write("games/g1", json!({"name": "Keep", "hp": {"cur": 5, "max": 10}})).unwrap();
        let partial = json!({"hp/cur": 7}).as_object().unwrap().clone();
        kv.update("games/g1", partial).unwrap();
        assert_eq!(kv.read("games/g1").unwrap(), json!({"name": "Keep", "hp": {"cur": 7, "max": 10}}));
    }

    #[test]
    fn null_and_remove_delete() {
        let d = tmp();
        let (mut kv, _) = open(&d);
        kv.write("games/g1", json!({"name": "X"})).unwrap();
        kv.write("games/g1", Value::Null).unwrap();
        assert_eq!(kv.read("games/g1").unwrap(), Value::Null);
        kv.write("games/g2", json!({"name": "Y"})).unwrap();
        kv.remove("games/g2").unwrap();
        assert_eq!(kv.read("games/g2").unwrap(), Value::Null);
    }

    #[test]
    fn multi_update_absolute_paths() {
        let d = tmp();
        let (mut kv, _) = open(&d);
        let updates = json!({"/games/g1/name": "A", "/inviteCodes/XY": "g1", "/userGames/u1/g1": true});
        kv.multi_update(updates.as_object().unwrap().clone()).unwrap();
        assert_eq!(kv.read("games/g1/name").unwrap(), json!("A"));
        assert_eq!(kv.read("inviteCodes/XY").unwrap(), json!("g1"));
        assert_eq!(kv.read("userGames/u1/g1").unwrap(), json!(true));
    }

    #[test]
    fn contiguous_numeric_keys_become_arrays() {
        let d = tmp();
        let (mut kv, _) = open(&d);
        kv.write("board/points", json!([{"x": 1}, {"x": 2}, {"x": 3}])).unwrap();
        assert_eq!(kv.read("board/points").unwrap(), json!([{"x": 1}, {"x": 2}, {"x": 3}]));
    }

    #[test]
    fn writing_under_leaf_converts_to_tree() {
        let d = tmp();
        let (mut kv, _) = open(&d);
        kv.write("a/b", json!(1)).unwrap();
        kv.write("a/b/c", json!(2)).unwrap();
        assert_eq!(kv.read("a/b").unwrap(), json!({"c": 2}));
    }

    #[test]
    fn underscore_keys_do_not_leak_between_siblings() {
        // Regression for the old LIKE-based prefix query, where `_` was a wildcard.
        let d = tmp();
        let (mut kv, _) = open(&d);
        kv.write("games/a_b", json!({"name": "Mine"})).unwrap();
        kv.write("games/aXb", json!({"name": "Other"})).unwrap();
        assert_eq!(kv.read("games/a_b").unwrap(), json!({"name": "Mine"}));
        kv.remove("games/a_b").unwrap();
        assert_eq!(kv.read("games/aXb").unwrap(), json!({"name": "Other"}));
    }

    #[test]
    fn notifies_related_subscriptions() {
        let d = tmp();
        let (mut kv, events) = open(&d);
        kv.subscribe("s1", "games/g1").unwrap();
        events.lock().unwrap().clear();
        kv.write("games/g1/name", json!("Below")).unwrap();
        kv.write("games", json!({"g1": {"name": "Above"}})).unwrap();
        kv.write("other/thing", json!(1)).unwrap();
        let ev = events.lock().unwrap();
        let for_sub: Vec<_> = ev.iter().filter(|e| e.0 == "s1").collect();
        assert_eq!(for_sub.len(), 2);
        assert_eq!(for_sub[1].2, json!({"name": "Above"}));
    }

    #[test]
    fn fires_immediately_on_subscribe() {
        let d = tmp();
        let (mut kv, events) = open(&d);
        kv.write("games/g1/name", json!("Now")).unwrap();
        kv.subscribe("s1", "games/g1").unwrap();
        let last = events.lock().unwrap().last().cloned().unwrap();
        assert_eq!(last.0, "s1");
        assert_eq!(last.2, json!({"name": "Now"}));
    }

    #[test]
    fn persists_across_reopen() {
        let d = tmp();
        {
            let (mut kv, _) = open(&d);
            kv.write("games/g1", json!({"name": "Durable"})).unwrap();
        }
        let (kv, _) = open(&d);
        assert_eq!(kv.read("games/g1").unwrap(), json!({"name": "Durable"}));
    }
}
