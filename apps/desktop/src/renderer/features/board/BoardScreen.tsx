import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SystemDefinition } from '@epoch/shared-types';
import type { Character, Game, Role, Token } from '@epoch/shared-types';
import { homebrewList, homebrewToBestiaryEntry, useLibrary, useRules } from '../../data/homebrew';
import {
  addToken,
  grabPartyToken,
  moveToken,
  releasePartyToken,
  setGridVisible,
  removeToken,
  setTokenCondition,
  toggleFogSquare,
  updateToken,
} from '../../data/board';
import { addShape, removeShape } from '../../data/shapes';
import { clearAllMeasures, moveShape, rotateShape, setMyMeasure } from '../../data/measures';
import { useCreatureArt, useMyCreatures } from '../../data/creatures';
import { useGameCharacterArt } from '../../data/characters';
import { firstFreeCell, gridDimensions, takenSquares } from './boardGeometry';
import { isPartyScale } from './partyMode';
import { useGridPrefs } from './gridPrefs';
import { GridDrawer } from './drawers/GridDrawer';
import { GiveLootModal } from './drawers/GiveLootModal';
import { LootCorpseModal } from './drawers/LootCorpseModal';
import { AoeDamageModal } from './drawers/AoeDamageModal';
import { BoardShell, type BarItem } from './BoardShell';
import { BoardCanvas, type BoardTool, type ShapeDraft } from './BoardCanvas';
import { TokenCard } from './TokenCard';
import { TokenContextMenu } from './TokenContextMenu';
import { InitiativeTracker } from './InitiativeTracker';
import { InitiativeDrawer } from './drawers/InitiativeDrawer';
import { ShapesDrawer } from './drawers/ShapesDrawer';
import { MapsDrawer } from './drawers/MapsDrawer';
import { FogDrawer } from './drawers/FogDrawer';
import { AddCreatureDrawer } from './drawers/AddCreatureDrawer';
import { DiceDrawer } from './drawers/DiceDrawer';
import { RulesDrawer } from './drawers/RulesDrawer';
import { ChatDrawer } from './drawers/ChatDrawer';
import { NotesDrawer } from './drawers/NotesDrawer';
import { CharacterQuickView } from './drawers/CharacterQuickView';
import { Dnd5eSheet } from '../sheet5e/Dnd5eSheet';
import { MonsterStatCard } from './drawers/MonsterStatCard';
import { RollLog, useRollLog } from '../rolllog/rollLog';
import { AttackGateContext } from './attackGate';
import { playChime } from '../voice/chime';
import { dice3dEnabled, playDice } from '../dice3d/dice3d';
import { isDefeated } from '../../data/damage';
import { creatureCombatant, joinCombat, leaveCombat, mayMoveNow, rollInitiative, turnBlockReason } from '../../data/combat';
import { initiativeModifier } from '../../data/initiativeModifier';
import { useGameCharacters } from '../../data/characters';
import { canSeeMessage, useChat } from '../../data/chat';
import { writeValue } from '../../data/realtime';
import { BoardToasts, useArrivals, useToasts, type Toast } from './BoardToasts';
import { rollsToShow, summarizeRoll, unreadMessages } from './toastSummaries';
import { canSeeMonsterStats } from '../../permissions';
import { isClassAndLevel } from '@epoch/systems/registry';
import { pcDerived, pcTokenStats } from '@epoch/systems/dnd5e/character';
import styles from './BoardScreen.module.css';

// Slate icon tiles — the image is the full button face, no separate label.
import icoDice from '../../assets/icons/icon-dice.png';
import icoChat from '../../assets/icons/icon-chat.png';
import icoFog from '../../assets/icons/icon-fog-of-war.png';
import icoInitiative from '../../assets/icons/icon-initiative.png';
import icoInventory from '../../assets/icons/icon-inventory.png';
import icoMap from '../../assets/icons/icon-map.png';
import icoMeasure from '../../assets/icons/icon-measure.png';
import icoMonster from '../../assets/icons/icon-monster.png';
import icoJournal from '../../assets/icons/icon-journal.png';
import icoSettings from '../../assets/icons/icon-settings.png';
import icoShapes from '../../assets/icons/icon-shape-tools.png';
import icoToken from '../../assets/icons/icon-token.png';
import icoRules from '../../assets/icons/icon-rules.png';
import icoLoot from '../../assets/icons/icon-loot.png';
// Imported for future use in the voice top-bar button (not yet wired up);
// the `void` reference keeps both eslint and tsc quiet about the unused import.
import icoVoice from '../../assets/icons/icon-voice.png';
void icoVoice;

function Ico({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} />;
}

interface BoardScreenProps {
  system: SystemDefinition;
  game: Game;
  role: Role;
  uid: string;
  character?: Character;
}

/** The left slot's id while it shows the selected creature's stat card. */
const MONSTER_PANEL = '__monster';

export function BoardScreen({ system, game, role, uid, character }: BoardScreenProps) {
  const navigate = useNavigate();
  const gameId = game.id;
  const gmUid = game.gmUid ?? game.createdBy;
  // The GM's account-wide library (monsters/equipment/player options), read live for this session.
  const { library } = useLibrary(gmUid);
  // Campaign rules (crit threshold/formula, starting HP, feats toggle, house rules), resolved.
  const { rules } = useRules(gmUid);
  const hasPlayers = Object.values(game.members ?? {}).some((m) => m.role === 'player');
  const tokens: Token[] = Object.values(game.tokens ?? {}).filter(
    (t) => t.kind !== 'party' || hasPlayers,
  );
  const activeMap = game.activeMapId ? game.maps?.[game.activeMapId] : undefined;

  // Token art resolution (by id, at render). Bestiary + saved-creature art is the GM's
  // (read under the game owner); character art covers every player's character. A token's
  // own imageUrl wins as a per-token override; art-less tokens resolve to nothing and the
  // canvas keeps its colored-circle + letter fallback.
  const creatureArt = useCreatureArt(game.createdBy);
  const savedCreatures = useMyCreatures(game.createdBy);
  const characterArt = useGameCharacterArt(gameId);
  const artById: Record<string, string> = { ...creatureArt };
  for (const c of savedCreatures) if (c.imageUrl) artById[c.id] = c.imageUrl;
  const tokenImage = (t: Token): string | undefined =>
    t.imageUrl ??
    (t.creatureId ? artById[t.creatureId] : undefined) ??
    (t.characterId ? characterArt[t.characterId] : undefined);
  const boardTokens: Token[] = tokens.map((t) => {
    const img = tokenImage(t);
    return img && img !== t.imageUrl ? { ...t, imageUrl: img } : t;
  });
  const initState = game.initiative;
  // A persisted initiative can be malformed: Firebase drops empty arrays, so a fully
  // cleared order comes back undefined. Only "active with a non-empty order" is real
  // combat; anything else degrades to no tracker instead of crashing.
  // While rolling in, combat is on even with nobody in the order yet (a chase, a duel).
  const rollingIn = !!initState?.active && initState.phase === 'rolling';
  const combatActive =
    !!initState?.active && (rollingIn || (Array.isArray(initState.order) && initState.order.length > 0));
  const highlightTokenId = combatActive && !rollingIn
    ? initState!.order?.[initState!.turnIndex]?.tokenId
    : undefined;
  // Playtest #2: moving a token during combat follows the same turn gate attacks already do.
  const mayMoveToken = (tokenId: string) => mayMoveNow(initState, { uid, tokenId });

  const [openLeft, setOpenLeft] = useState<string | null>(null);
  const [openRight, setOpenRight] = useState<string | null>(
    role === 'player' ? 'character' : null,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Click-to-target combat: a per-user, local current target whose defense is read from the
  // token's stat block when an attack resolves (5e → AC, Solryn → DR); no typed number.
  const is5e = isClassAndLevel(system);
  // Systems with a target-vs-defense combat model: 5e (attack roll vs AC) and Solryn (auto-hit vs DR).
  const canTargetMode = is5e || system.modes.combat.id === 'auto-hit-vs-dr';
  const [targetId, setTargetId] = useState<string | null>(null);
  // Every player's character (GM tools: rolling a player into initiative).
  const gameCharacters = useGameCharacters(role === 'gm' ? gameId : null);
  // GM "Give loot" (open or secret); null = closed, '' = no player picked yet.
  const [giveLootFor, setGiveLootFor] = useState<string | null>(null);
  // Player "Loot corpse" (playtest #6): the defeated creature token being searched; null = closed.
  const [lootCorpseFor, setLootCorpseFor] = useState<string | null>(null);
  // GM "Apply AoE damage" (playtest #8): the placed shape being resolved; null = closed.
  const [aoeShapeFor, setAoeShapeFor] = useState<string | null>(null);
  // GM right-click token menu (board cleanup): the token + cursor position, null when closed.
  const [ctxMenu, setCtxMenu] = useState<{ token: Token; x: number; y: number } | null>(null);
  // 2026-10-06 playtest (corrected again): Measure is just another same-side menu now, with no
  // special-case behavior — it participates in the ordinary one-panel-per-side toggle (below)
  // exactly like Initiative, Dice, Shapes, etc., so it opens/closes/replaces the same way they do.
  const measuring = openRight === 'measure' || openLeft === 'measure';
  // Armed shape from the Shapes drawer (drives the 'shape' canvas tool); null when none.
  const [shapeDraft, setShapeDraft] = useState<ShapeDraft | null>(null);
  // How the grid looks on this computer (strength/thickness/light-dark) — per person.
  const gridLook = useGridPrefs();

  const tool: BoardTool = measuring
    ? 'measure'
    : shapeDraft
      ? 'shape'
      : role === 'gm' && openRight === 'fog'
        ? 'fog'
        : 'select';

  const activeType = activeMap
    ? system.mapTypes.find((t) => t.id === activeMap.typeId)
    : undefined;
  const partyScale = isPartyScale(activeType);
  const measureScale = activeMap
    ? (activeMap.customSquare ?? activeType?.perSquare ?? { value: 1, unit: 'sq' })
    : undefined;

  // Auto-create the player's character token on the active map (once per character per map).
  // Skipped on travel-scale maps, where the party rides a single shared token instead.
  // The guard key is characterId+mapId (not just mapId): a replacement/re-created character on a
  // still-mounted board must still get its own token — keying by map alone left the map "attempted"
  // from the previous character and silently skipped the new one.
  const attempted = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (role !== 'player' || !character || !activeMap || partyScale) return;
    // The PC's race sets its visual token size (5e Gnome/Halfling are Small). Solryn ancestries
    // define no size → undefined → default Medium radius. sizeCategory is visual only; the
    // footprint (`size`) stays 1×1 for every PC race.
    const ancestry = system.ancestries.find((a) => a.id === character.definition.ancestryId);
    const existingToken = tokens.find(
      (t) => t.characterId === character.id && t.mapId === activeMap.id,
    );
    const key = `${character.id}:${activeMap.id}`;
    if (existingToken) {
      // Backfill: tokens created before sizeCategory existed render at Medium. Stamp the race's
      // size onto them once (self-terminating — the write flips sizeCategory truthy). Footprint
      // is untouched.
      if (!existingToken.sizeCategory && ancestry?.size) {
        void updateToken(gameId, existingToken.id, { sizeCategory: ancestry.size });
      }
      return;
    }
    if (attempted.current.has(key)) return;
    attempted.current.add(key);
    // Nearest free square to wherever the GM is looking (or the middle of the map), so the GM
    // sees the new token arrive instead of hunting for it in a corner.
    const { cols, rows } = gridDimensions(activeMap.width, activeMap.height, activeMap.gridSize);
    const start = activeMap.gmView ?? { col: Math.floor(cols / 2), row: Math.floor(rows / 2) };
    const spot = firstFreeCell(takenSquares(tokens, activeMap.id), start.col, start.row, cols, rows);
    void addToken(gameId, {
      mapId: activeMap.id,
      kind: 'character',
      name: character.name,
      col: spot.col,
      row: spot.row,
      color: '#5dcaa5',
      visible: true,
      ownerUserId: uid,
      characterId: character.id,
      ...(ancestry?.size ? { sizeCategory: ancestry.size } : {}),
      // 5e: stamp the PC's derived AC (+max HP) onto the token so a GM attacking this player
      // reads the AC straight from the stat block — no typed number. Solryn tokens carry none.
      ...(isClassAndLevel(system) ? { stats: pcTokenStats(system, character) } : {}),
    });
  }, [role, character, activeMap, partyScale, tokens, gameId, uid, system]);

  // On a travel-scale map the party shares one token. The GM's client seeds it (single
  // authority → no duplicate race); any player can then drag it. Once per such map.
  //
  // Must look at ALL tokens: `tokens` above hides the party token until a player joins, so
  // checking that list made a new party token every time the GM opened the game alone.
  const partyAttempted = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (role !== 'gm' || !activeMap || !partyScale) return;
    const parties = Object.values(game.tokens ?? {})
      .filter((t) => t.kind === 'party' && t.mapId === activeMap.id)
      .sort((a, b) => (a.id < b.id ? -1 : 1)); // push keys sort oldest-first
    if (parties.length > 1) {
      // Clean up duplicates left by the old bug: keep the oldest, remove the rest.
      for (const extra of parties.slice(1)) void removeToken(gameId, extra.id);
      return;
    }
    if (parties.length === 1 || partyAttempted.current.has(activeMap.id)) return;
    partyAttempted.current.add(activeMap.id);
    const { cols, rows } = gridDimensions(activeMap.width, activeMap.height, activeMap.gridSize);
    const all = Object.values(game.tokens ?? {});
    const spot = firstFreeCell(takenSquares(all, activeMap.id), Math.floor(cols / 2), Math.floor(rows / 2), cols, rows);
    void addToken(gameId, {
      mapId: activeMap.id,
      kind: 'party',
      name: 'Party',
      col: spot.col,
      row: spot.row,
      color: '#e9c46a',
      visible: true,
    });
  }, [role, activeMap, partyScale, game.tokens, gameId]);

  function toggle(side: 'left' | 'right', id: string) {
    setShapeDraft(null); // opening any menu disarms an armed shape
    if (side === 'left') setOpenLeft((o) => (o === id ? null : id));
    else setOpenRight((o) => (o === id ? null : id));
  }

  const selected = selectedId ? (tokens.find((t) => t.id === selectedId) ?? null) : null;

  // The current attack target (5e). We resolve its name + AC straight from the token's stats
  // (monsters carry AC from the bestiary; PC tokens are stamped with pcTokenStats). Using the
  // live token here also self-clears the target if it's removed from the board.
  // A defeated creature (0 HP) drops out as a target on its own.
  const targetToken =
    canTargetMode && targetId ? (tokens.find((t) => t.id === targetId && !isDefeated(t)) ?? null) : null;
  const target = targetToken
    ? {
        id: targetToken.id,
        name: targetToken.name,
        ...(typeof targetToken.stats?.ac === 'number' ? { ac: targetToken.stats.ac } : {}),
        ...(typeof targetToken.stats?.dr === 'number' ? { dr: targetToken.stats.dr } : {}),
        ...(targetToken.conditions ? { conditions: targetToken.conditions } : {}),
      }
    : undefined;
  // Toggle a token as the current target (click the same one again to clear).
  const onSetTarget = (id: string) => setTargetId((cur) => (cur === id ? null : id));

  // Attacks during combat wait for your turn (the GM's computer enforces the same rule).
  const turnName = (c: { name: string; kind: string; tokenId?: string }) =>
    role !== 'gm' && c.kind === 'creature' && (!c.tokenId || game.tokens?.[c.tokenId]?.visible === false) ? 'someone else' : c.name;
  // A character at 0 HP is down: no attacks or spells until healed (5e: death saves instead).
  const myHp = character?.play.pools?.hp?.current;
  const iAmDown = role === 'player' && typeof myHp === 'number' && myHp <= 0;
  const myTurnBlock = iAmDown
    ? (is5e ? "You're down at 0 HP — roll death saves until you're healed." : "You're down at 0 HP — you can't act until you're healed.")
    : turnBlockReason(initState, { uid }, turnName);

  // conditionId → { name, color } for the canvas indicators + hover tooltips.
  const conditionDefs = useMemo(() => {
    const m: Record<string, { name: string; color: string }> = {};
    for (const c of system.tokenConditions ?? []) m[c.id] = { name: c.name, color: c.color };
    return m;
  }, [system.tokenConditions]);
  // The viewer's own character token — its conditions are the attacker's, threaded to the sheet.
  const myConditions = character
    ? tokens.find((t) => t.characterId === character.id)?.conditions
    : undefined;

  // 2026-10-06 playtest: "a player who's down and making death saves should automatically show a
  // visible indicator of that condition, not just a number somewhere." Mirror it as the existing
  // 'unconscious' ring — on/off tracks 0 HP (iAmDown), so it appears the instant HP hits 0 and
  // clears itself the instant they're healed, with no one having to tag it by hand. 5e only:
  // Solryn has no death-save state to show (it just goes "down," no separate ring to add).
  useEffect(() => {
    if (!is5e || role !== 'player' || !character) return;
    const myToken = tokens.find((t) => t.characterId === character.id);
    if (!myToken) return;
    const alreadyShown = !!myToken.conditions?.unconscious;
    if (iAmDown !== alreadyShown) void setTokenCondition(gameId, myToken.id, 'unconscious', iAmDown);
  }, [is5e, role, character, tokens, iAmDown, gameId]);

  // Library monsters (from the GM's account) as BestiaryEntry[], so the stat card + combat resolver
  // read them exactly like SRD creatures — no special-casing in the resolver.
  const libraryMonsters = useMemo(() => homebrewList(library?.monsters), [library?.monsters]);
  const homebrewEntries = useMemo(
    () => libraryMonsters.map(homebrewToBestiaryEntry),
    [libraryMonsters],
  );

  // GM-selected creature → the merged stat card in a proper right-side slide-out panel
  // (same chrome/width as the Add-creature drawer). Other tokens keep the floating TokenCard.
  const canShowMonster = !!selected && selected.kind === 'creature' && canSeeMonsterStats(role);
  // The monster card lives in the LEFT slot and follows the one-panel-per-side rule: opening a
  // left menu (Initiative, Dice, Log…) replaces it; clicking the creature again brings it back.
  const showMonsterPanel = canShowMonster && openLeft === MONSTER_PANEL;
  function selectToken(id: string | null) {
    setSelectedId(id);
    const t = id ? tokens.find((tk) => tk.id === id) : undefined;
    if (t && t.kind === 'creature' && canSeeMonsterStats(role)) setOpenLeft(MONSTER_PANEL);
    else setOpenLeft((o) => (o === MONSTER_PANEL ? null : o));
  }
  function closeMonsterPanel() {
    setSelectedId(null);
    setOpenLeft((o) => (o === MONSTER_PANEL ? null : o));
  }
  // The homebrew loot a spawned monster carries, resolved from the game's equipment library.
  // Shared by the GM's "Distribute Loot" panel (the selected monster) and a player's "Loot
  // corpse" check (whichever creature they right-clicked) — same lookup, any creature id.
  const lootFor = (creatureId: string | undefined) => {
    const hb = creatureId ? library?.monsters?.[creatureId] : undefined;
    const eq = library?.equipment ?? {};
    return Object.keys(hb?.loot ?? {})
      .map((id) => eq[id])
      .filter((x): x is NonNullable<typeof x> => !!x);
  };
  const selectedLoot = useMemo(
    () => lootFor(selected?.creatureId),
    [selected?.creatureId, library?.monsters, library?.equipment],
  );
  const monsterPanel =
    showMonsterPanel && selected
      ? {
          title: selected.name,
          content: (
            <MonsterStatCard
              system={system}
              name={selected.name}
              creatureId={selected.creatureId}
              extraEntries={homebrewEntries}
              lootItems={role === 'gm' ? selectedLoot : undefined}
              token={selected}
              gameId={gameId}
              uid={uid}
              target={target}
              rules={rules}
              turnBlocked={
                isDefeated(selected) ? `${selected.name} is down and can't act.` : turnBlockReason(initState, { tokenId: selected.id })
              }
              onPlaceAoe={
                role === 'gm' && activeMap
                  ? (kind, sizeFt) =>
                      void addShape(gameId, {
                        mapId: activeMap.id,
                        kind,
                        sizeFt,
                        anchor: { tokenId: selected.id },
                        ownerUid: uid,
                      })
                  : undefined
              }
              onClose={closeMonsterPanel}
            />
          ),
          onClose: closeMonsterPanel,
        }
      : undefined;

  const myName = game.members[uid]?.displayName ?? 'Someone';

  // --- Pop-ups: new chat/whispers (with an unread count on the Chat button) and roll results.
  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();
  const chatOpen = openLeft === 'chat';
  const chatMsgs = useChat(gameId);
  const [unreadChat, setUnreadChat] = useState<string[]>([]);
  useArrivals(chatMsgs, (fresh) => {
    const mine = unreadMessages(fresh, uid, new Set());
    if (mine.length === 0 || chatOpen) return;
    setUnreadChat((u) => [...u, ...mine.map((m) => m.id)]);
    playChime('message');
    for (const m of mine) {
      pushToast({ id: `chat-${m.id}`, kind: m.audience === 'public' ? 'chat' : 'whisper', from: m.senderName, text: m.text });
    }
  });
  useEffect(() => {
    if (chatOpen) setUnreadChat([]);
  }, [chatOpen]);
  const unreadCount = unreadChat.filter((id) => chatMsgs.some((m) => m.id === id && canSeeMessage(m, uid))).length;
  const { entries: rollEntries, postRoll: postRollText } = useRollLog();
  const boardAreaRef = useRef<HTMLDivElement | null>(null);
  useArrivals(rollEntries, (fresh) => {
    for (const e of rollsToShow(fresh, uid, role === 'gm', new Set()).reverse()) {
      const card = () => pushToast({ id: `roll-${e.id}`, kind: 'roll', by: e.by, mine: e.byUid === uid, roll: summarizeRoll(e) });
      // Only the roller sees their dice tumble; the card shows once they've landed.
      if (e.byUid === uid && e.dice?.length && dice3dEnabled()) void playDice(boardAreaRef.current, e.dice).then(card);
      else card();
    }
  });
  function openToast(t: Toast) {
    const id = t.kind === 'roll' ? 'log' : 'chat';
    setOpenLeft(id);
  }
  const dice: BarItem = { kind: 'drawer', id: 'dice', label: 'Dice', short: 'Dice', glyph: <Ico src={icoDice} alt="Dice" />, content: <DiceDrawer /> };
  const log: BarItem = { kind: 'drawer', id: 'log', label: 'Log', short: 'Log', glyph: <Ico src={icoJournal} alt="Log" />, content: <RollLog /> };
  const chat: BarItem = {
    kind: 'drawer',
    id: 'chat',
    label: 'Chat',
    short: 'Chat',
    glyph: <Ico src={icoChat} alt="Chat" />,
    badge: unreadCount,
    content: <ChatDrawer gameId={gameId} uid={uid} displayName={myName} members={game.members} />,
  };
  const rulesBar: BarItem = {
    kind: 'drawer',
    id: 'rules',
    label: 'Rules',
    short: 'Rules',
    glyph: <Ico src={icoRules} alt="Rules" />,
    content: <RulesDrawer system={system} rules={rules} role={role} gameId={gameId} />,
  };

  const initiative: BarItem = {
    kind: 'drawer',
    id: 'initiative',
    label: 'Initiative',
    short: 'Initiative',
    glyph: <Ico src={icoInitiative} alt="Initiative" />,
    content: <InitiativeDrawer gameId={gameId} game={game} activeMap={activeMap} system={system} uid={uid} homebrewEntries={homebrewEntries} rules={rules} target={target} />,
  };

  // Distance measuring is available to everyone — players measure their own movement/range.
  // 2026-10-06 playtest (corrected again): Measure is a plain menu now, no special-casing —
  // it's a `kind: 'drawer'` item like Initiative/Dice/Shapes, so `toggle()` (above) opens,
  // closes, and replaces it exactly the same way it does every other same-side menu.
  const measureAction: BarItem = {
    kind: 'drawer',
    id: 'measure',
    label: 'Measure distance',
    short: 'Measure',
    glyph: <Ico src={icoMeasure} alt="Measure" />,
    content: (
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        Drag on the map to measure distance — the line stays for everyone to see. Right-click or
        Esc removes {role === 'gm' ? 'all measuring lines' : 'yours'}.
      </p>
    ),
  };

  // Shapes are scoped to the active map; hidden shapes are GM-only (filtered like tokens).
  const visibleShapes = Object.values(game.shapes ?? {}).filter(
    (sh) => sh.mapId === activeMap?.id && (!sh.hidden || role === 'gm'),
  );
  const shapes: BarItem = {
    kind: 'drawer',
    id: 'shapes',
    label: 'Shapes',
    short: 'Shapes',
    glyph: <Ico src={icoShapes} alt="Shapes" />,
    content: (
      <ShapesDrawer
        gameId={gameId}
        uid={uid}
        role={role}
        activeMap={activeMap}
        shapes={game.shapes ?? {}}
        draft={shapeDraft}
        onChangeDraft={setShapeDraft}
        onAoeDamage={setAoeShapeFor}
      />
    ),
  };

  const left: BarItem[] =
    role === 'gm'
      ? [initiative, dice, log, chat, rulesBar]
      : [
          dice,
          log,
          chat,
          { kind: 'drawer', id: 'notes', label: 'Notes', short: 'Notes', glyph: <Ico src={icoJournal} alt="Notes" />, content: <NotesDrawer uid={uid} gameId={gameId} /> },
          rulesBar,
        ];

  let right: BarItem[] = [];
  if (role === 'gm') {
    right = [
      measureAction,
      shapes,
      { kind: 'divider', id: 'd1' },
      {
        kind: 'drawer',
        id: 'fog',
        label: 'Fog of war',
        short: 'Fog',
        glyph: <Ico src={icoFog} alt="Fog of war" />,
        content: <FogDrawer gameId={gameId} activeMap={activeMap} />,
      },
      {
        kind: 'drawer',
        id: 'creatures',
        label: 'Add creature',
        short: 'Creature',
        glyph: <Ico src={icoMonster} alt="Add creature" />,
        content: (
          <AddCreatureDrawer
            system={system}
            homebrewMonsters={libraryMonsters}
            gameId={gameId}
            uid={uid}
            activeMap={activeMap}
            tokens={tokens}
          />
        ),
      },
      {
        kind: 'action',
        id: 'library',
        label: 'Open my library',
        short: 'Library',
        glyph: <Ico src={icoInventory} alt="Library" />,
        onClick: () => navigate(`/game/${gameId}/customize`),
      },
      {
        kind: 'action',
        id: 'giveloot',
        label: 'Give loot to a player (openly or secretly)',
        short: 'Loot',
        glyph: <Ico src={icoLoot} alt="Give loot" />,
        onClick: () => setGiveLootFor(''),
      },
      { kind: 'divider', id: 'd2' },
      {
        kind: 'drawer',
        id: 'grid',
        label: 'Grid',
        short: 'Grid',
        glyph: <Ico src={icoSettings} alt="Grid settings" />,
        content: (
          <GridDrawer
            gmToggle={
              activeMap
                ? { on: activeMap.gridVisible, onChange: (on) => void setGridVisible(gameId, activeMap.id, on) }
                : undefined
            }
          />
        ),
      },
      {
        kind: 'drawer',
        id: 'maps',
        label: 'Maps',
        short: 'Maps',
        glyph: <Ico src={icoMap} alt="Maps" />,
        content: <MapsDrawer system={system} gameId={gameId} game={game} />,
      },
    ];
  } else if (character) {
    right = [
      measureAction,
      shapes,
      { kind: 'drawer', id: 'grid', label: 'Grid', short: 'Grid', glyph: <Ico src={icoSettings} alt="Grid settings" />, content: <GridDrawer /> },
      { kind: 'divider', id: 'pd1' },
      {
        kind: 'drawer',
        id: 'character',
        label: 'Character',
        short: 'Character',
        glyph: <Ico src={icoToken} alt="Character" />,
        // The richer 5e sheet gets a wider drawer; Solryn's quick-view stays the default width.
        wide: isClassAndLevel(system),
        // Class-and-level systems (5e) use their own sheet; Solryn keeps CharacterQuickView.
        content:
          isClassAndLevel(system) ? (
            <Dnd5eSheet system={system} character={character} target={target} startingLevel={game.startingLevel} rules={rules} attackerConditions={myConditions} />
          ) : (
            <CharacterQuickView
              system={system}
              character={character}
              canLevelUp={character.play.level < (game.levelGrant ?? 1)}
              target={target}
              attackerConditions={myConditions}
            />
          ),
      },
    ];
  }

  /** GM: put a token into the current fight — a creature rolls with its modifier, a player's
   *  character with theirs. */
  function addTokenToCombat(tok: Token) {
    if (tok.kind === 'creature') {
      void joinCombat(gameId, creatureCombatant(tok));
      return;
    }
    const ch = tok.characterId ? gameCharacters.find((c) => c.id === tok.characterId) : undefined;
    if (!ch) return;
    void joinCombat(gameId, {
      id: `char:${ch.id}`,
      name: ch.name,
      kind: 'character',
      characterId: ch.id,
      ownerUserId: ch.ownerUserId,
      tokenId: tok.id,
      ...rollInitiative(initiativeModifier(system, ch)),
    });
  }

  return (
    <AttackGateContext.Provider value={myTurnBlock}>
    <BoardShell
      left={left}
      right={right}
      openLeft={openLeft}
      openRight={openRight}
      onToggle={toggle}
      leftPanel={monsterPanel}
    >
      <div className={styles.boardArea} ref={boardAreaRef}>
        {activeMap ? (
          <BoardCanvas
            map={activeMap}
            tokens={boardTokens}
            role={role}
            uid={uid}
            tool={tool}
            gridLook={gridLook}
            onViewSettled={
              role === 'gm' && activeMap
                ? (c) => {
                    const prev = activeMap.gmView;
                    if (!prev || prev.col !== c.col || prev.row !== c.row) {
                      void writeValue(`games/${gameId}/maps/${activeMap.id}/gmView`, c);
                    }
                  }
                : undefined
            }
            partyScale={partyScale}
            measureScale={measureScale}
            selectedTokenId={selected?.id}
            highlightTokenId={highlightTokenId}
            targetTokenId={target?.id}
            shapes={visibleShapes}
            onMoveShape={(id, col, row) => void moveShape(gameId, id, col, row)}
            onRotateShape={(id, deg) => void rotateShape(gameId, id, deg)}
            onDeleteShape={(id) => void removeShape(gameId, id)}
            measures={Object.values(game.measures ?? {}).filter((m) => m.mapId === activeMap?.id)}
            onCommitMeasure={(seg) =>
              activeMap && void setMyMeasure(gameId, uid, { ...seg, ownerUid: uid, ownerName: character?.name ?? myName, mapId: activeMap.id })
            }
            onClearMeasures={() => void (role === 'gm' ? clearAllMeasures(gameId) : setMyMeasure(gameId, uid, null))}
            shapeDraft={shapeDraft}
            onCommitShape={(shape) =>
              activeMap && void addShape(gameId, { ...shape, mapId: activeMap.id, ownerUid: uid })
            }
            onMoveToken={(id, col, row) => void moveToken(gameId, id, col, row)}
            mayMoveToken={mayMoveToken}
            onToggleFog={(col, row, f) =>
              activeMap && void toggleFogSquare(gameId, activeMap.id, col, row, f)
            }
            onSelectToken={(t) => selectToken(t?.id ?? null)}
            // Right-click token menu: set the attack target, toggle conditions (any member, on any
            // character/creature token), and — for the GM — remove tokens. Party is excluded.
            onContextToken={(token, x, y) => {
              if (token.kind === 'party') return;
              const attackable = token.kind === 'character' || token.kind === 'creature';
              if (attackable || role === 'gm') setCtxMenu({ token, x, y });
            }}
            onGrabParty={(id) => void grabPartyToken(gameId, id, uid)}
            onReleaseParty={(id) => void releasePartyToken(gameId, id)}
            conditionDefs={conditionDefs}
          />
        ) : (
          <div className={styles.empty}>
            {role === 'gm'
              ? 'Open Maps (right edge) to upload a map and start your board.'
              : 'The GM hasn’t set up a map yet.'}
          </div>
        )}

        {/* Non-creature (or non-GM) tokens keep the floating TokenCard; GM creatures use the
            left-side monster panel (rendered by BoardShell.leftPanel above). */}
        {selected && selected.kind !== 'party' && !canShowMonster && (
          <TokenCard
            token={selected}
            system={system}
            role={role}
            uid={uid}
            gameId={gameId}
            viewerCharacter={character}
            onClose={() => setSelectedId(null)}
          />
        )}

        <BoardToasts toasts={toasts} onDismiss={dismissToast} onOpen={openToast} />

        {measuring && (
          <div className={styles.toolHint} role="status">
            Drag to measure — the line stays for everyone. Right-click or Esc removes{' '}
            {role === 'gm' ? 'all measuring lines' : 'yours'}.
          </div>
        )}

        {ctxMenu && (
          <TokenContextMenu
            // Read the LIVE token from state so condition toggles reflect (and can remove)
            // the current Firebase value — the ctxMenu snapshot is captured at right-click time.
            token={tokens.find((t) => t.id === ctxMenu.token.id) ?? ctxMenu.token}
            x={ctxMenu.x}
            y={ctxMenu.y}
            gameId={gameId}
            targetingEnabled={canTargetMode}
            isTarget={ctxMenu.token.id === targetId}
            onSetTarget={() => onSetTarget(ctxMenu.token.id)}
            canRemove={role === 'gm'}
            conditions={system.tokenConditions}
            initiative={
              role === 'gm' && initState?.active && (ctxMenu.token.kind === 'creature' || ctxMenu.token.kind === 'character')
                ? {
                    inOrder: (initState.order ?? []).some((c) => c.tokenId === ctxMenu.token.id),
                    onAdd: () => addTokenToCombat(ctxMenu.token),
                    onRemove: () => {
                      const c = (initState.order ?? []).find((o) => o.tokenId === ctxMenu.token.id);
                      if (c) void leaveCombat(gameId, c.id);
                    },
                  }
                : undefined
            }
            onGiveLoot={
              role === 'gm' && ctxMenu.token.kind === 'character' && ctxMenu.token.characterId
                ? () => setGiveLootFor(ctxMenu.token.characterId!)
                : undefined
            }
            onLootCorpse={
              role !== 'gm' &&
              is5e &&
              character &&
              ctxMenu.token.kind === 'creature' &&
              isDefeated(ctxMenu.token) &&
              !combatActive
                ? () => setLootCorpseFor(ctxMenu.token.id)
                : undefined
            }
            onClose={() => setCtxMenu(null)}
          />
        )}

        {lootCorpseFor !== null && character && (() => {
          const corpse = tokens.find((t) => t.id === lootCorpseFor);
          if (!corpse) return null;
          const investigationMod = pcDerived(system, character).allSkills.find((s) => s.id === 'investigation')?.mod ?? 0;
          return (
            <LootCorpseModal
              gameId={gameId}
              token={corpse}
              characterId={character.id}
              characterName={character.name}
              investigationMod={investigationMod}
              lootItems={lootFor(corpse.creatureId)}
              postRoll={postRollText}
              onClose={() => setLootCorpseFor(null)}
            />
          );
        })()}

        {aoeShapeFor !== null && role === 'gm' && activeMap && (() => {
          const shape = (game.shapes ?? {})[aoeShapeFor];
          if (!shape) return null;
          return (
            <AoeDamageModal
              gameId={gameId}
              shape={shape}
              tokens={tokens}
              characters={gameCharacters}
              gridSize={activeMap.gridSize}
              ftPerSquare={measureScale?.value ?? 1}
              postRoll={postRollText}
              onClose={() => setAoeShapeFor(null)}
            />
          );
        })()}

        {giveLootFor !== null && role === 'gm' && (
          <GiveLootModal
            gameId={gameId}
            gmUid={uid}
            gmName={myName}
            characters={gameCharacters}
            equipment={Object.values(library?.equipment ?? {})}
            initialCharacterId={giveLootFor || undefined}
            announce={(text) => postRollText(text)}
            onClose={() => setGiveLootFor(null)}
          />
        )}

        {combatActive && (
          <InitiativeTracker
            state={{ ...initState!, order: initState!.order ?? [] }}
            system={system}
            role={role}
            uid={uid}
            character={character}
            gameId={gameId}
            tokens={game.tokens ?? {}}
            activeMapId={activeMap?.id}
            onSelectToken={(id) => selectToken(id)}
          />
        )}
      </div>
    </BoardShell>
    </AttackGateContext.Provider>
  );
}
