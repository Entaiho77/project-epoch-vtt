import { useCallback, useEffect, useState } from 'react';
import type { NewCampaignChild } from '../shared/persistence';

/** The window.db surface shared by characters and scenes (identical shape). */
export interface ChildApi<T> {
  list: (campaignId: string) => Promise<T[]>;
  create: (input: NewCampaignChild) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

export interface ChildrenState<T> {
  items: T[];
  loading: boolean;
  add: (name: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

/**
 * Renderer-side view of a campaign's characters or scenes over `window.db`.
 * Generic because the two are structurally identical — the caller supplies the
 * matching db methods.
 */
export function useCampaignChildren<T extends { id: string }>(
  campaignId: string,
  api: ChildApi<T>,
): ChildrenState<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setItems(await api.list(campaignId));
    setLoading(false);
  }, [api, campaignId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      await api.create({ campaignId, name: trimmed });
      await refresh();
    },
    [api, campaignId, refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.remove(id);
      await refresh();
    },
    [api, refresh],
  );

  return { items, loading, add, remove };
}
