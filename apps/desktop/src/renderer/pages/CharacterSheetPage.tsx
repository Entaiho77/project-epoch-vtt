import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { SolrynCharacter } from '../features/solryn/SolrynCharacterBuilder';
import { solrynSystem } from '@solryn/systems/solryn';
import '../styles/pages.css';

export function CharacterSheetPage() {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<SolrynCharacter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacter = async () => {
      if (!characterId) {
        setError('No character ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const data = await window.db.read(`characters/${characterId}`);
        if (data && typeof data === 'object') {
          setCharacter(data as SolrynCharacter);
        } else {
          setError('Character not found');
        }
      } catch (err) {
        console.error('Failed to load character:', err);
        setError('Failed to load character');
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacter();
  }, [characterId]);

  if (isLoading) {
    return (
      <div className="page">
        <p style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>Loading character...</p>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="page">
        <div className="page-content">
          <div className="empty-state">
            <p>{error || 'Character not found'}</p>
            <button className="primary" onClick={() => navigate('/')}>
              Back to Lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  const coreStatsMap = Object.fromEntries(
    solrynSystem.coreStats.map((stat: any) => [stat.id, stat])
  ) as Record<string, any>;

  const statOrder = solrynSystem.creation.statOrder as (keyof typeof character.stats)[];
  const ancestryData = solrynSystem.ancestries.find((a: any) => a.id === character.ancestry);

  return (
    <div className="page">
      <header className="game-header">
        <button className="secondary" onClick={() => navigate('/')}>
          ← Back to Lobby
        </button>
        <h1>{character.name}</h1>
        <div style={{ width: '80px' }} />
      </header>

      <div className="page-content">
        <div className="character-sheet">
          {/* Header Section */}
          <div className="sheet-section">
            <div className="sheet-row">
              <div className="sheet-field">
                <label>Name</label>
                <p className="sheet-value">{character.name}</p>
              </div>
              <div className="sheet-field">
                <label>Level</label>
                <p className="sheet-value">{character.level}</p>
              </div>
            </div>
          </div>

          {/* Ancestry Section */}
          <div className="sheet-section">
            <h2>Ancestry</h2>
            <div className="sheet-row">
              <div className="sheet-field">
                <label>Ancestry</label>
                <p className="sheet-value">{ancestryData?.name || character.ancestry}</p>
              </div>
              {ancestryData?.description && (
                <div className="sheet-field">
                  <label>Background</label>
                  <p className="sheet-description">{ancestryData.description}</p>
                </div>
              )}
            </div>
            {ancestryData?.benefits && ancestryData.benefits.length > 0 && (
              <div className="sheet-field">
                <label>Benefits</label>
                <ul className="sheet-benefits">
                  {ancestryData.benefits.map((benefit: string) => (
                    <li key={benefit}>✓ {benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="sheet-section">
            <h2>Ability Scores</h2>
            <div className="stats-display">
              {statOrder.map((statId) => {
                const stat = coreStatsMap[statId];
                const value = character.stats[statId];
                return (
                  <div key={statId} className="stat-display-card">
                    <div className="stat-display-label">{statId}</div>
                    <div className="stat-display-value">{value}</div>
                    <div className="stat-display-name">{stat?.shortName || stat?.name}</div>
                    <div className="stat-display-desc">{stat?.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="sheet-actions">
            <button className="secondary" onClick={() => navigate('/')}>
              Back to Lobby
            </button>
            <button className="primary">Start Game</button>
          </div>
        </div>
      </div>
    </div>
  );
}
