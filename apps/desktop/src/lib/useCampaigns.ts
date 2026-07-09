import { useCallback, useEffect, useState } from 'react';
import type { Campaign, NewCampaign } from '../shared/persistence';

export interface CampaignsState {
  campaigns: Campaign[];
  loading: boolean;
  create: (input: NewCampaign) => Promise<void>;
  remove: (id: string) => Promise<void>;
  rename: (id: string, name: string) => Promise<void>;
}

/** Renderer-side view of the local campaign store, over the window.db bridge. */
export function useCampaigns(): CampaignsState {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const rows = await window.db.listCampaigns();
    setCampaigns(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: NewCampaign) => {
      await window.db.createCampaign(input);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await window.db.deleteCampaign(id);
      await refresh();
    },
    [refresh],
  );

  const rename = useCallback(
    async (id: string, name: string) => {
      await window.db.renameCampaign(id, name);
      await refresh();
    },
    [refresh],
  );

  return { campaigns, loading, create, remove, rename };
}
