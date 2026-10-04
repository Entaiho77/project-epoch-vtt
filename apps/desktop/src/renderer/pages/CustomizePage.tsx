import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages.css';

export function CustomizePage() {
  const navigate = useNavigate();
  const [characterName, setCharacterName] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<'solryn' | 'dnd5e'>('solryn');
  const [currentStep, setCurrentStep] = useState<'system' | 'builder'>('system');

  const handleSystemSelect = (system: 'solryn' | 'dnd5e') => {
    setSelectedSystem(system);
    setCurrentStep('builder');
  };

  const handleSaveCharacter = () => {
    if (characterName.trim()) {
      // TODO: Save character to database
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
        {currentStep === 'system' && (
          <section className="system-select">
            <h2>Choose Your System</h2>
            <div className="grid grid-2">
              <div className="card system-card" onClick={() => handleSystemSelect('solryn')}>
                <h3>Solryn</h3>
                <p>The native Epoch system. Fast-paced tactical combat.</p>
              </div>
              <div className="card system-card" onClick={() => handleSystemSelect('dnd5e')}>
                <h3>D&D 5e</h3>
                <p>Coming soon: Classic D&D 5th Edition support.</p>
              </div>
            </div>
          </section>
        )}

        {currentStep === 'builder' && (
          <section className="character-builder">
            <h2>Character Builder</h2>
            <div className="builder-form">
              <div className="form-group">
                <label htmlFor="charName">Character Name</label>
                <input
                  id="charName"
                  type="text"
                  placeholder="e.g., Aragorn the Ranger"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>System: {selectedSystem.toUpperCase()}</label>
                <p className="text-muted">
                  {selectedSystem === 'solryn'
                    ? 'Building with Solryn engine'
                    : 'D&D 5e will be available soon'}
                </p>
              </div>

              {selectedSystem === 'solryn' && (
                <div className="solryn-builder">
                  <p className="text-muted">Character builder coming soon...</p>
                </div>
              )}

              <div className="builder-actions">
                <button className="secondary" onClick={() => setCurrentStep('system')}>
                  ← Change System
                </button>
                <button
                  className="primary"
                  onClick={handleSaveCharacter}
                  disabled={!characterName.trim()}
                >
                  Save Character
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
