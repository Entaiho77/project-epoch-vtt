/**
 * Firebase-free stub. The desktop app's storage (SQLite via window.db) is always
 * available, so the "is the backend configured?" guard the web app threaded
 * through its data modules is permanently true here. Kept at the same import
 * path so the ported data layer compiles unchanged.
 */
export const firebaseConfigured = true;
