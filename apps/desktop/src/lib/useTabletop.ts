import { useCallback, useEffect, useRef, useState } from 'react';
import type { Character, Scene, TokenPatch } from '../shared/persistence';
import type { MapScale, SceneWire, TokenWire } from '@solryn/protocol';
import type { RelaySession } from './useRelaySession';

/** The minimal token shape the canvas renders — satisfied by both DB and wire tokens. */
export interface RenderToken {
  id: string;
  name: string;
  x: number;
  y: number;
  size: number;
  color: string;
  image: string | null;
  hidden: boolean;
  /** GM-only: set when the token stands in for a campaign character. */
  characterId?: string | null;
}

export interface ActiveScene {
  id: string;
  name: string;
  gridSize: number;
  scale: MapScale;
}

export interface Tabletop {
  isGm: boolean;
  scene: ActiveScene | null;
  mapDataUrl: string | null;
  tokens: RenderToken[];
  fog: Set<string>;
  /** GM-only: campaign scenes to choose an active map from. */
  scenes: Scene[];
  /** GM-only: campaign characters available to drop as tokens. */
  characters: Character[];
  refreshCampaign: () => void;
  selectScene: (sceneId: string) => void;
  importMap: () => void;
  setScale: (scale: MapScale) => void;
  placeCharacter: (character: Character, col: number, row: number) => void;
  /** Live drag update: reflect locally + broadcast, without a DB write per frame. */
  previewToken: (id: string, x: number, y: number) => void;
  /** Commit a token's position (persist + broadcast). Call once when a drag ends. */
  moveToken: (id: string, x: number, y: number) => void;
  updateToken: (id: string, patch: TokenPatch) => void;
  removeToken: (id: string) => void;
  setFog: (cells: Set<string>) => void;
}

const TOKEN_PALETTE = ['#e94560', '#3a86ff', '#2ec4b6', '#ff9f1c', '#8338ec', '#c1121f', '#06d6a0'];
function colorFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return TOKEN_PALETTE[Math.abs(hash) % TOKEN_PALETTE.length];
}

const toWire = (t: RenderToken): TokenWire => ({
  id: t.id,
  name: t.name,
  x: t.x,
  y: t.y,
  size: t.size,
  color: t.color,
  image: t.image,
  hidden: t.hidden,
});

/**
 * Map/token/fog state for a session, layered on the relay's game-event channel.
 * The GM is authoritative: it persists to SQLite (window.db) and broadcasts each
 * change. Players hold no DB — they render whatever the GM sends and re-sync from
 * a full `scene:load` snapshot when they join.
 */
export function useTabletop(session: RelaySession): Tabletop {
  const isGm = session.role === 'gm';

  const [scene, setScene] = useState<ActiveScene | null>(null);
  const [mapDataUrl, setMapDataUrl] = useState<string | null>(null);
  const [tokens, setTokens] = useState<RenderToken[]>([]);
  const [fog, setFogState] = useState<Set<string>>(new Set());
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);

  // Latest values for building an on-demand snapshot (player-join broadcast).
  const snapRef = useRef({ scene, mapDataUrl, tokens, fog });
  snapRef.current = { scene, mapDataUrl, tokens, fog };

  const { campaignId, sendEvent, subscribeEvents, subscribePlayerJoined } = session;

  const buildSceneLoad = useCallback(() => {
    const s = snapRef.current;
    if (!s.scene) return null;
    const sceneWire: SceneWire = {
      id: s.scene.id,
      name: s.scene.name,
      mapDataUrl: s.mapDataUrl,
      gridSize: s.scene.gridSize,
      scale: s.scene.scale,
    };
    const visible = s.tokens.filter((t) => !t.hidden).map(toWire);
    return { kind: 'scene:load' as const, scene: sceneWire, tokens: visible, fog: [...s.fog] };
  }, []);

  const broadcastSceneLoad = useCallback(() => {
    const event = buildSceneLoad();
    if (event) sendEvent(event);
  }, [buildSceneLoad, sendEvent]);

  // --- GM: load campaign scenes/characters, restore active scene -------------
  const refreshCampaign = useCallback(() => {
    if (!isGm || !campaignId) return;
    void window.db.listScenes(campaignId).then(setScenes);
    void window.db.listCharacters(campaignId).then(setCharacters);
  }, [isGm, campaignId]);

  const loadScene = useCallback(
    async (sceneId: string) => {
      const full = await window.db.getScene(sceneId);
      if (!full) return;
      const url = full.mapImage ? await window.maps.read(full.mapImage) : null;
      const sceneTokens = await window.db.listTokens(sceneId);
      setScene({ id: full.id, name: full.name, gridSize: full.gridSize, scale: full.scale });
      setMapDataUrl(url);
      setTokens(
        sceneTokens.map((t) => ({
          id: t.id,
          name: t.name,
          x: t.x,
          y: t.y,
          size: t.size,
          color: t.color,
          image: t.image,
          hidden: t.hidden,
          characterId: t.characterId,
        })),
      );
      setFogState(new Set(full.fog));
    },
    [],
  );

  useEffect(() => {
    refreshCampaign();
  }, [refreshCampaign]);

  useEffect(() => {
    if (!isGm || !campaignId) return;
    let cancelled = false;
    void window.db.getActiveScene(campaignId).then((active) => {
      if (!cancelled && active) void loadScene(active);
    });
    return () => {
      cancelled = true;
    };
  }, [isGm, campaignId, loadScene]);

  // GM: when someone joins, send them the current snapshot.
  useEffect(() => {
    if (!isGm) return;
    return subscribePlayerJoined(() => broadcastSceneLoad());
  }, [isGm, subscribePlayerJoined, broadcastSceneLoad]);

  // --- Player: apply incoming events -----------------------------------------
  useEffect(() => {
    if (isGm) return;
    return subscribeEvents((event) => {
      switch (event.kind) {
        case 'scene:load':
          setScene({
            id: event.scene.id,
            name: event.scene.name,
            gridSize: event.scene.gridSize,
            scale: event.scene.scale,
          });
          setMapDataUrl(event.scene.mapDataUrl);
          setTokens(event.tokens.map((t) => ({ ...t })));
          setFogState(new Set(event.fog));
          break;
        case 'token:add':
          setTokens((prev) =>
            prev.some((t) => t.id === event.token.id) ? prev : [...prev, { ...event.token }],
          );
          break;
        case 'token:move':
          setTokens((prev) =>
            prev.map((t) => (t.id === event.id ? { ...t, x: event.x, y: event.y } : t)),
          );
          break;
        case 'token:update':
          setTokens((prev) => prev.map((t) => (t.id === event.token.id ? { ...event.token } : t)));
          break;
        case 'token:remove':
          setTokens((prev) => prev.filter((t) => t.id !== event.id));
          break;
        case 'fog:update':
          setFogState(new Set(event.fog));
          break;
      }
    });
  }, [isGm, subscribeEvents]);

  // --- GM actions ------------------------------------------------------------
  const selectScene = useCallback(
    (sceneId: string) => {
      if (!isGm || !campaignId) return;
      void window.db.setActiveScene(campaignId, sceneId);
      void loadScene(sceneId).then(() => broadcastSceneLoad());
    },
    [isGm, campaignId, loadScene, broadcastSceneLoad],
  );

  const importMap = useCallback(() => {
    if (!isGm || !scene) return;
    void window.maps.import().then(async (filename) => {
      if (!filename) return;
      await window.db.updateSceneMap(scene.id, { mapImage: filename });
      const url = await window.maps.read(filename);
      setMapDataUrl(url);
      refreshCampaign();
      broadcastSceneLoad();
    });
  }, [isGm, scene, refreshCampaign, broadcastSceneLoad]);

  const setScale = useCallback(
    (scale: MapScale) => {
      if (!isGm || !scene) return;
      setScene((prev) => (prev ? { ...prev, scale } : prev));
      void window.db.updateSceneMap(scene.id, { scale }).then(() => broadcastSceneLoad());
    },
    [isGm, scene, broadcastSceneLoad],
  );

  const placeCharacter = useCallback(
    (character: Character, col: number, row: number) => {
      if (!isGm || !scene) return;
      if (snapRef.current.tokens.some((t) => t.characterId === character.id)) return; // one per map
      const color = colorFor(character.id);
      void window.db
        .addToken({
          sceneId: scene.id,
          characterId: character.id,
          name: character.name,
          x: col,
          y: row,
          color,
        })
        .then((token) => {
          const rt: RenderToken = { ...token };
          setTokens((prev) => [...prev, rt]);
          sendEvent({ kind: 'token:add', token: toWire(rt) });
        });
    },
    [isGm, scene, sendEvent],
  );

  const previewToken = useCallback(
    (id: string, x: number, y: number) => {
      if (!isGm) return;
      setTokens((prev) => prev.map((t) => (t.id === id ? { ...t, x, y } : t)));
      const token = snapRef.current.tokens.find((t) => t.id === id);
      if (token && !token.hidden) sendEvent({ kind: 'token:move', id, x, y });
    },
    [isGm, sendEvent],
  );

  const moveToken = useCallback(
    (id: string, x: number, y: number) => {
      if (!isGm) return;
      setTokens((prev) => prev.map((t) => (t.id === id ? { ...t, x, y } : t)));
      void window.db.moveToken(id, x, y);
      const token = snapRef.current.tokens.find((t) => t.id === id);
      if (token && !token.hidden) sendEvent({ kind: 'token:move', id, x, y });
    },
    [isGm, sendEvent],
  );

  const updateToken = useCallback(
    (id: string, patch: TokenPatch) => {
      if (!isGm) return;
      void window.db.updateToken(id, patch).then((token) => {
        const rt: RenderToken = { ...token };
        setTokens((prev) => prev.map((t) => (t.id === id ? rt : t)));
        // Hidden tokens must vanish from players; visible ones update.
        sendEvent(rt.hidden ? { kind: 'token:remove', id } : { kind: 'token:update', token: toWire(rt) });
      });
    },
    [isGm, sendEvent],
  );

  const removeToken = useCallback(
    (id: string) => {
      if (!isGm) return;
      setTokens((prev) => prev.filter((t) => t.id !== id));
      void window.db.removeToken(id);
      sendEvent({ kind: 'token:remove', id });
    },
    [isGm, sendEvent],
  );

  const setFog = useCallback(
    (cells: Set<string>) => {
      if (!isGm || !scene) return;
      setFogState(new Set(cells));
      void window.db.setSceneFog(scene.id, [...cells]);
      sendEvent({ kind: 'fog:update', fog: [...cells] });
    },
    [isGm, scene, sendEvent],
  );

  return {
    isGm,
    scene,
    mapDataUrl,
    tokens,
    fog,
    scenes,
    characters,
    refreshCampaign,
    selectScene,
    importMap,
    setScale,
    placeCharacter,
    previewToken,
    moveToken,
    updateToken,
    removeToken,
    setFog,
  };
}
