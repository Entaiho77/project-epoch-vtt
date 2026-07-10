import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SystemDefinition } from '@solryn/shared-types';
import type { Character, Game, Role, Token } from '@solryn/shared-types';
import { homebrewList, homebrewToBestiaryEntry, useLibrary, useRules } from '../../data/homebrew';
import {
  addToken,
  grabPartyToken,
  moveToken,
  releasePartyToken,
  setGridVisible,
  toggleFogSquare,
  updateToken,
} from '../../data/board';
import { addShape } from '../../data/shapes';
import { useCreatureArt, useMyCreatures } from '../../data/creatures';
import { useGameCharacterArt } from '../../data/characters';
import { gridDimensions } from './boardGeometry';
import { isPartyScale } from './partyMode';
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
import { RollLog } from '../rolllog/rollLog';
import { canSeeMonsterStats } from '../../permissions';
import { isClassAndLevel } from '@solryn/systems/registry';
import { pcTokenStats } from '@solryn/systems/dnd5e/character';
import styles from './BoardScreen.module.css';

interface BoardScreenProps {
  system: SystemDefinition;
  game: Game;
  role: Role;
  uid: string;
  character?: Character;
}

export function BoardScreen({ system, game, role, uid, character }: BoardScreenProps) {
  const navigate = useNavigate();
  const gameId = game.id;
  const gmUid = game.gmUid ?? game.createdBy;
  // The GM's account-wide library (monsters/equipment/player options), read live for this session.
  const { library } = useLibrary(gmUid);
  // Campaign rules (crit threshold/formula, starting HP, feats toggle, house rules), resolved.
  const { rules } = useRules(gmUid);
  const tokens: Token[] = Object.values(game.tokens ?? {});
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
  const combatActive =
    !!initState?.active && Array.isArray(initState.order) && initState.order.length > 0;
  const highlightTokenId = combatActive
    ? initState!.order[initState!.turnIndex]?.tokenId
    : undefined;

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
  // GM right-click token menu (board cleanup): the token + cursor position, null when closed.
  const [ctxMenu, setCtxMenu] = useState<{ token: Token; x: number; y: number } | null>(null);
  const [measuring, setMeasuring] = useState(false);
  // Armed shape from the Shapes drawer (drives the 'shape' canvas tool); null when none.
  const [shapeDraft, setShapeDraft] = useState<ShapeDraft | null>(null);
  // Session-only GM toggle for grid + measure line color (white for dark maps, black for light).
  const [lineColor, setLineColor] = useState<'white' | 'black'>('white');

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
    const count = tokens.filter(
      (t) => t.kind === 'character' && t.mapId === activeMap.id,
    ).length;
    void addToken(gameId, {
      mapId: activeMap.id,
      kind: 'character',
      name: character.name,
      col: count,
      row: 0,
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
  const partyAttempted = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (role !== 'gm' || !activeMap || !partyScale) return;
    const exists = tokens.some((t) => t.kind === 'party' && t.mapId === activeMap.id);
    if (exists || partyAttempted.current.has(activeMap.id)) return;
    partyAttempted.current.add(activeMap.id);
    const { cols, rows } = gridDimensions(activeMap.width, activeMap.height, activeMap.gridSize);
    void addToken(gameId, {
      mapId: activeMap.id,
      kind: 'party',
      name: 'Party',
      col: Math.floor(cols / 2),
      row: Math.floor(rows / 2),
      color: '#e9c46a',
      visible: true,
    });
  }, [role, activeMap, partyScale, tokens, gameId]);

  function toggle(side: 'left' | 'right', id: string) {
    setMeasuring(false); // opening a drawer exits measure mode
    setShapeDraft(null); // …and disarms any armed shape
    if (side === 'left') setOpenLeft((o) => (o === id ? null : id));
    else setOpenRight((o) => (o === id ? null : id));
  }

  const selected = selectedId ? (tokens.find((t) => t.id === selectedId) ?? null) : null;

  // The current attack target (5e). We resolve its name + AC straight from the token's stats
  // (monsters carry AC from the bestiary; PC tokens are stamped with pcTokenStats). Using the
  // live token here also self-clears the target if it's removed from the board.
  const targetToken = canTargetMode && targetId ? (tokens.find((t) => t.id === targetId) ?? null) : null;
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

  // Library monsters (from the GM's account) as BestiaryEntry[], so the stat card + combat resolver
  // read them exactly like SRD creatures — no special-casing in the resolver.
  const libraryMonsters = useMemo(() => homebrewList(library?.monsters), [library?.monsters]);
  const homebrewEntries = useMemo(
    () => libraryMonsters.map(homebrewToBestiaryEntry),
    [libraryMonsters],
  );

  // GM-selected creature → the merged stat card in a proper right-side slide-out panel
  // (same chrome/width as the Add-creature drawer). Other tokens keep the floating TokenCard.
  const showMonsterPanel = !!selected && selected.kind === 'creature' && canSeeMonsterStats(role);
  // The homebrew loot the selected spawned monster carries, resolved from the game's equipment
  // library (drives the GM "Distribute Loot" button on the stat card).
  const selectedLoot = useMemo(() => {
    const hb = selected?.creatureId ? library?.monsters?.[selected.creatureId] : undefined;
    const eq = library?.equipment ?? {};
    return Object.keys(hb?.loot ?? {})
      .map((id) => eq[id])
      .filter((x): x is NonNullable<typeof x> => !!x);
  }, [selected?.creatureId, library?.monsters, library?.equipment]);
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
              onClose={() => setSelectedId(null)}
            />
          ),
          onClose: () => setSelectedId(null),
        }
      : undefined;

  const myName = game.members[uid]?.displayName ?? 'Someone';
  const dice: BarItem = { kind: 'drawer', id: 'dice', label: 'Dice', short: 'Dice', glyph: '⚄', content: <DiceDrawer /> };
  const log: BarItem = { kind: 'drawer', id: 'log', label: 'Log', short: 'Log', glyph: '📜', content: <RollLog /> };
  const chat: BarItem = {
    kind: 'drawer',
    id: 'chat',
    label: 'Chat',
    short: 'Chat',
    glyph: '✉',
    content: <ChatDrawer gameId={gameId} uid={uid} displayName={myName} members={game.members} />,
  };
  const rulesBar: BarItem = {
    kind: 'drawer',
    id: 'rules',
    label: 'Rules',
    short: 'Rules',
    glyph: 'ℹ',
    content: <RulesDrawer system={system} rules={rules} role={role} gameId={gameId} />,
  };

  const initiative: BarItem = {
    kind: 'drawer',
    id: 'initiative',
    label: 'Initiative',
    short: 'Initiative',
    glyph: '⚔',
    content: <InitiativeDrawer gameId={gameId} game={game} activeMap={activeMap} system={system} uid={uid} homebrewEntries={homebrewEntries} rules={rules} target={target} />,
  };

  // Distance measuring is available to everyone — players measure their own movement/range.
  const measureAction: BarItem = {
    kind: 'action',
    id: 'measure',
    label: 'Measure distance',
    short: 'Measure',
    glyph: '↔',
    active: measuring,
    onClick: () => {
      setShapeDraft(null); // measuring and shape placement are mutually exclusive
      setMeasuring((m) => !m);
    },
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
    glyph: '◎',
    content: (
      <ShapesDrawer
        gameId={gameId}
        uid={uid}
        role={role}
        activeMap={activeMap}
        shapes={game.shapes ?? {}}
        draft={shapeDraft}
        onChangeDraft={setShapeDraft}
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
          { kind: 'drawer', id: 'notes', label: 'Notes', short: 'Notes', glyph: '✎', content: <NotesDrawer uid={uid} gameId={gameId} /> },
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
        glyph: '☁',
        content: <FogDrawer gameId={gameId} activeMap={activeMap} />,
      },
      {
        kind: 'drawer',
        id: 'creatures',
        label: 'Add creature',
        short: 'Creature',
        glyph: '✚',
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
        glyph: '📖',
        onClick: () => navigate(`/game/${gameId}/customize`),
      },
      { kind: 'divider', id: 'd2' },
      {
        kind: 'action',
        id: 'grid',
        label: 'Toggle grid',
        short: 'Grid',
        glyph: '#',
        active: activeMap?.gridVisible,
        onClick: () =>
          activeMap && void setGridVisible(gameId, activeMap.id, !activeMap.gridVisible),
      },
      {
        kind: 'action',
        id: 'linecolor',
        label: `Grid & measure lines: ${lineColor} — click for ${lineColor === 'white' ? 'black' : 'white'}`,
        short: 'Color',
        glyph: lineColor === 'white' ? '○' : '●',
        active: lineColor === 'black',
        onClick: () => setLineColor((c) => (c === 'white' ? 'black' : 'white')),
      },
      {
        kind: 'drawer',
        id: 'maps',
        label: 'Maps',
        short: 'Maps',
        glyph: '▦',
        content: <MapsDrawer system={system} gameId={gameId} game={game} />,
      },
    ];
  } else if (character) {
    right = [
      measureAction,
      shapes,
      { kind: 'divider', id: 'pd1' },
      {
        kind: 'drawer',
        id: 'character',
        label: 'Character',
        short: 'Character',
        glyph: '◈',
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

  return (
    <BoardShell
      left={left}
      right={right}
      openLeft={openLeft}
      openRight={openRight}
      onToggle={toggle}
      rightPanel={monsterPanel}
    >
      <div className={styles.boardArea}>
        {activeMap ? (
          <BoardCanvas
            map={activeMap}
            tokens={boardTokens}
            role={role}
            uid={uid}
            tool={tool}
            lineColor={lineColor}
            partyScale={partyScale}
            measureScale={measureScale}
            selectedTokenId={selected?.id}
            highlightTokenId={highlightTokenId}
            targetTokenId={target?.id}
            shapes={visibleShapes}
            shapeDraft={shapeDraft}
            onCommitShape={(shape) =>
              activeMap && void addShape(gameId, { ...shape, mapId: activeMap.id, ownerUid: uid })
            }
            onMoveToken={(id, col, row) => void moveToken(gameId, id, col, row)}
            onToggleFog={(col, row, f) =>
              activeMap && void toggleFogSquare(gameId, activeMap.id, col, row, f)
            }
            onSelectToken={(t) => setSelectedId(t?.id ?? null)}
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
            right-side monster panel (rendered by BoardShell.rightPanel above). */}
        {selected && selected.kind !== 'party' && !showMonsterPanel && (
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
            onClose={() => setCtxMenu(null)}
          />
        )}

        {combatActive && (
          <InitiativeTracker
            state={initState}
            system={system}
            role={role}
            uid={uid}
            character={character}
            gameId={gameId}
            tokens={game.tokens ?? {}}
            activeMapId={activeMap?.id}
            onSelectToken={(id) => setSelectedId(id)}
          />
        )}
      </div>
    </BoardShell>
  );
}
