import { useParams, useNavigate } from 'react-router-dom';
import '../styles/pages.css';

export function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  return (
    <div className="page game-page">
      <header className="game-header">
        <button className="secondary" onClick={() => navigate('/')}>
          ← Lobby
        </button>
        <h1>Game {gameId}</h1>
        <div style={{ width: '80px' }} />
      </header>

      <div className="page-content game-board">
        <div className="empty-state">
          <h2>Game Board</h2>
          <p>The game board will be rendered here.</p>
        </div>
      </div>
    </div>
  );
}
