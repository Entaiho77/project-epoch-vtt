import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SolrynCharacterBuilder, type SolrynCharacter } from '../features/solryn/SolrynCharacterBuilder';
import '../styles/pages.css';

export function CustomizePage() {
  const navigate = useNavigate();
  const [characterName, setCharacterName] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<'solryn' | 'dnd5e' | null>(null);

  const handleSystemSelect = (system: 'solryn' | 'dnd5e') => {
    setSelectedSystem(system);
  };

  const handleSaveCharacter = async (character: SolrynCharacter) => {
    // Save character to database
    await window.db.write(`characters/${character.id}`, character);
    navigate('/');
  };

  const handleCancel = () => {
    if (selectedSystem) {
      setSelectedSystem(null);
      setCharacterName('');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="page customize-page">
      <header className="customize-header">
        <button className="secondary" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Create Character</h1>
        <div style={{ width: '80px' }} />
      </header>

      <div className="page-content">
        {selectedSystem === null && (
          <section className="system-select">
            <h2>Choose Your System</h2>
            <div className="grid grid-2">
              <div className="card system-card" onClick={() => handleSystemSelect('solryn')}>
                <h3>Solryn</h3>
                <p>The native Epoch system. Fast-paced tactical combat.</p>
              </div>
              <div className="card system-card">
                <h3>D&D 5e</h3>
                <p>Coming soon: Classic D&D 5th Edition support.</p>
              </div>
            </div>
          </section>
        )}

        {selectedSystem === 'dnd5e' && (
          <section className="character-builder">
            <h2>D&D 5e Character Builder</h2>
            <p className="text-muted">Coming soon...</p>
            <button className="secondary" onClick={() => setSelectedSystem(null)}>
              ← Choose Different System
            </button>
          </section>
        )}

        {selectedSystem === 'solryn' && (
          <section className="character-builder">
            <div className="builder-header">
              <div className="name-input-group">
                <label htmlFor="charName">Character Name</label>
                <input
                  id="charName"
                  type="text"
                  placeholder="e.g., Aragorn the Ranger"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {characterName && (
              <SolrynCharacterBuilder
                characterName={characterName}
                onSave={handleSaveCharacter}
                onCancel={handleCancel}
              />
            )}

            {!characterName && (
              <p className="text-muted" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                Enter a character name above to begin.
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
