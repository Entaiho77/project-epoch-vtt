import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { SolrynCharacter } from '../features/solryn/SolrynCharacterBuilder';
import '../styles/pages.css';

export function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<SolrynCharacter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const loadCharacter = async () => {
      if (!gameId) {
        setIsLoading(false);
        return;
      }

      try {
        // gameId is the character ID
        const data = await window.db.read(`characters/${gameId}`);
        if (data && typeof data === 'object') {
          setCharacter(data as SolrynCharacter);
        }
      } catch (error) {
        console.error('Failed to load character:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacter();
  }, [gameId]);

  if (isLoading) {
    return (
      <div className="page game-page">
        <p style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>Loading game...</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="page game-page">
        <header className="game-header">
          <button className="secondary" onClick={() => navigate('/')}>
            ← Lobby
          </button>
          <h1>Game Error</h1>
          <div style={{ width: '80px' }} />
        </header>

        <div className="page-content">
          <div className="empty-state">
            <p>Character not found</p>
            <button className="primary" onClick={() => navigate('/')}>
              Back to Lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page game-page">
      <header className="game-header">
        <button className="secondary" onClick={() => navigate('/')}>
          ← Lobby
        </button>
        <h1>{character.name}</h1>
        <div style={{ width: '80px' }} />
      </header>

      <div className="page-content">
        {!gameStarted ? (
          <div className="game-lobby">
            <div className="game-lobby-content">
              <h2>Ready to play?</h2>
              <div className="character-summary-compact">
                <div className="summary-item">
                  <span className="summary-label">Character</span>
                  <span className="summary-value">{character.name}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Level</span>
                  <span className="summary-value">{character.level}</span>
                </div>
              </div>

              <div className="game-actions">
                <button className="secondary" onClick={() => navigate('/')}>
                  Back to Lobby
                </button>
                <button className="primary" onClick={() => setGameStarted(true)}>
                  Start Game
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="game-board">
            <div className="board-header">
              <h2>Game in Progress</h2>
              <div className="board-info">
                <span>{character.name}</span>
                <span>Level {character.level}</span>
              </div>
            </div>

            <div className="board-container">
              <div className="game-grid">
                <div className="grid-note">
                  <p>Game board and combat mechanics coming soon</p>
                  <p className="text-muted">This is a placeholder for the interactive board</p>
                </div>
              </div>
            </div>

            <div className="board-footer">
              <button className="secondary" onClick={() => setGameStarted(false)}>
                Back to Lobby
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
