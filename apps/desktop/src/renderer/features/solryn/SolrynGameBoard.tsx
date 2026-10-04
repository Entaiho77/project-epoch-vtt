import { useState } from 'react';
import type { SolrynCharacter } from './SolrynCharacterBuilder';
import '../../styles/board.css';

interface Position {
  x: number;
  y: number;
}

interface SolrynGameBoardProps {
  character: SolrynCharacter;
  onExit: () => void;
}

export function SolrynGameBoard({ character, onExit }: SolrynGameBoardProps) {
  const GRID_SIZE = 8;
  const [playerPos, setPlayerPos] = useState<Position>({ x: 3, y: 3 });
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);

  const handleCellClick = (x: number, y: number) => {
    // Simple movement: can move to adjacent cells or selected cell
    const distance = Math.abs(playerPos.x - x) + Math.abs(playerPos.y - y);
    if (distance <= 2) {
      // Can move up to 2 cells (simplified movement)
      setPlayerPos({ x, y });
      setSelectedPos(null);
    } else {
      setSelectedPos({ x, y });
    }
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isPlayer = playerPos.x === x && playerPos.y === y;
        const isSelected = selectedPos && selectedPos.x === x && selectedPos.y === y;
        const canMove = Math.abs(playerPos.x - x) + Math.abs(playerPos.y - y) <= 2;

        cells.push(
          <div
            key={`${x}-${y}`}
            className={`board-cell ${isPlayer ? 'player' : ''} ${isSelected ? 'selected' : ''} ${canMove && !isPlayer ? 'moveable' : ''}`}
            onClick={() => handleCellClick(x, y)}
          >
            {isPlayer && <div className="token" title={character.name} />}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="solryn-game-board">
      <div className="board-main">
        <div className="board-grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
          {renderGrid()}
        </div>
      </div>

      <div className="board-sidebar">
        <div className="sidebar-section">
          <h3>{character.name}</h3>
          <div className="stat-bar">
            <span className="stat-label">Level</span>
            <span className="stat-value">{character.level}</span>
          </div>
        </div>

        <div className="sidebar-section">
          <h4>Position</h4>
          <p className="position-display">
            ({playerPos.x}, {playerPos.y})
          </p>
        </div>

        <div className="sidebar-section">
          <h4>Movement</h4>
          <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
            Click cells up to 2 spaces away to move. Green indicates valid moves.
          </p>
        </div>

        <div className="sidebar-actions">
          <button className="secondary" style={{ width: '100%' }} onClick={onExit}>
            Exit Game
          </button>
        </div>
      </div>
    </div>
  );
}
