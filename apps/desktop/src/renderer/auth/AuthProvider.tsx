import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { readValue, updateValue, writeValue } from '../data/realtime';
import type { UserProfile } from '@solryn/shared-types';

/**
 * Local identity — the desktop replacement for Firebase Auth. A permanent uid is
 * minted on first launch and stored at `local/identity` in the on-disk database;
 * "signing in" is just choosing a display name. No accounts, no network.
 */

export interface LocalUser {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
}

interface AuthContextValue {
  user: LocalUser | null;
  /** Best-effort display name. */
  displayName: string;
  loading: boolean;
  /** Always true on desktop — storage is local and always available. */
  configured: boolean;
  /** Set (or change) the display name; first set completes "sign-in". */
  setDisplayName: (name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface StoredIdentity {
  uid: string;
  displayName?: string;
  createdAt: number;
}

function newUid(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `uid-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Keep the public profile record in sync (lobby rosters and sheets read it). */
async function upsertUserProfile(user: LocalUser): Promise<void> {
  const existingCreatedAt = await readValue<number>(`users/${user.uid}/createdAt`);
  const profile: Partial<UserProfile> = {
    uid: user.uid,
    displayName: user.displayName,
    email: null,
    photoURL: null,
    createdAt: existingCreatedAt ?? Date.now(),
  };
  await updateValue(`users/${user.uid}`, profile as Record<string, unknown>);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<StoredIdentity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      let stored = await readValue<StoredIdentity>('local/identity');
      if (!stored?.uid) {
        stored = { uid: newUid(), createdAt: Date.now() };
        await writeValue('local/identity', stored);
      }
      if (!cancelled) {
        setIdentity(stored);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const named = Boolean(identity?.displayName?.trim());
    const user: LocalUser | null =
      identity && named
        ? {
            uid: identity.uid,
            displayName: identity.displayName!.trim(),
            email: null,
            photoURL: null,
          }
        : null;

    return {
      user,
      displayName: user?.displayName ?? '',
      loading,
      configured: true,

      async setDisplayName(name: string) {
        const trimmed = name.trim();
        if (!trimmed) throw new Error('Please choose a display name.');
        if (!identity) throw new Error('Identity not ready yet.');
        const next: StoredIdentity = { ...identity, displayName: trimmed };
        await writeValue('local/identity', next);
        setIdentity(next);
        await upsertUserProfile({
          uid: next.uid,
          displayName: trimmed,
          email: null,
          photoURL: null,
        });
      },

      async signOut() {
        // Keep the permanent uid; just drop the display name so the app returns
        // to the name prompt (mirrors "signed out" in the web app's routing).
        if (!identity) return;
        const next: StoredIdentity = { uid: identity.uid, createdAt: identity.createdAt };
        await writeValue('local/identity', next);
        setIdentity(next);
      },
    };
  }, [identity, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
