import { useState } from 'react';
import { solrynSystem } from '@solryn/systems/solryn';
import type { CoreStat } from '@solryn/shared-types';
import '../../styles/builder.css';

interface CharacterStats {
  STR: number;
  NIM: number;
  END: number;
  WIS: number;
  INT: number;
  ARC: number;
  LCK: number;
}

export interface SolrynCharacter {
  id: string;
  name: string;
  ancestry: string;
  stats: CharacterStats;
  level: number;
}

interface Props {
  characterName: string;
  onSave: (character: SolrynCharacter) => void;
  onCancel: () => void;
}

export function SolrynCharacterBuilder({ characterName, onSave, onCancel }: Props) {
  const [currentStep, setCurrentStep] = useState<'stats' | 'ancestry' | 'gear' | 'confirm'>('stats');
  const [stats, setStats] = useState<CharacterStats>({
    STR: 0,
    NIM: 0,
    END: 0,
    WIS: 0,
    INT: 0,
    ARC: 0,
    LCK: 0,
  });
  const [selectedAncestry, setSelectedAncestry] = useState<string>('');

  const statOrder = solrynSystem.creation.statOrder as (keyof CharacterStats)[];
  const coreStatsMap = Object.fromEntries(
    solrynSystem.coreStats.map((stat: CoreStat) => [stat.id, stat])
  ) as Record<string, CoreStat>;

  const rollStats = () => {
    const newStats: CharacterStats = { ...stats };
    for (const statId of statOrder) {
      // Roll 2d4: (Math.random() * 4 + 1) twice
      const roll1 = Math.floor(Math.random() * 4) + 1;
      const roll2 = Math.floor(Math.random() * 4) + 1;
      newStats[statId] = roll1 + roll2;
    }
    setStats(newStats);
  };

  const handleStatChange = (statId: keyof CharacterStats, value: number) => {
    setStats({ ...stats, [statId]: Math.min(8, Math.max(2, value)) });
  };

  const handleNext = () => {
    if (currentStep === 'stats' && stats.STR > 0) {
      setCurrentStep('ancestry');
    } else if (currentStep === 'ancestry' && selectedAncestry) {
      setCurrentStep('gear');
    } else if (currentStep === 'gear') {
      setCurrentStep('confirm');
    }
  };

  const handleSave = () => {
    const character: SolrynCharacter = {
      id: `char-${Date.now()}`,
      name: characterName,
      ancestry: selectedAncestry,
      stats,
      level: 1,
    };
    onSave(character);
  };

  return (
    <div className="solryn-builder">
      {currentStep === 'stats' && (
        <div className="builder-step">
          <h2>Roll Your Ability Scores</h2>
          <p className="step-description">
            Solryn uses 2d4 for each stat (roll between 2-8). Roll all seven stats or enter them manually.
          </p>

          <div className="stats-grid">
            {statOrder.map((statId) => {
              const stat = coreStatsMap[statId];
              return (
                <div key={statId} className="stat-card">
                  <label>{stat.name}</label>
                  <div className="stat-input-group">
                    <input
                      type="number"
                      min="2"
                      max="8"
                      value={stats[statId]}
                      onChange={(e) => handleStatChange(statId, parseInt(e.target.value) || 0)}
                    />
                    <span className="stat-desc">{stat.description}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="step-actions">
            <button className="secondary" onClick={onCancel}>
              Cancel
            </button>
            <button className="secondary" onClick={rollStats}>
              Roll All Stats
            </button>
            <button className="primary" onClick={handleNext} disabled={stats.STR === 0}>
              Next: Ancestry
            </button>
          </div>
        </div>
      )}

      {currentStep === 'ancestry' && (
        <div className="builder-step">
          <h2>Choose Your Ancestry</h2>
          <p className="step-description">Your ancestry gives you cultural background and some mechanical benefits.</p>

          <div className="ancestry-grid">
            {solrynSystem.ancestries.map((ancestry: any) => (
              <div
                key={ancestry.id}
                className={`ancestry-card ${selectedAncestry === ancestry.id ? 'selected' : ''}`}
                onClick={() => setSelectedAncestry(ancestry.id)}
              >
                <h3>{ancestry.name}</h3>
                <p>{ancestry.description}</p>
                {ancestry.benefits && <ul className="benefits">{ancestry.benefits.map((b: string) => <li key={b}>{b}</li>)}</ul>}
              </div>
            ))}
          </div>

          <div className="step-actions">
            <button className="secondary" onClick={() => setCurrentStep('stats')}>
              ← Back
            </button>
            <button className="primary" onClick={handleNext} disabled={!selectedAncestry}>
              Next: Gear
            </button>
          </div>
        </div>
      )}

      {currentStep === 'gear' && (
        <div className="builder-step">
          <h2>Choose Starting Gear</h2>
          <p className="step-description">Select your starting armor and equipment.</p>

          <div className="gear-note">
            <p>Starting armor options: Light or Medium</p>
            <p>Additional equipment will be added based on your choices.</p>
          </div>

          <div className="step-actions">
            <button className="secondary" onClick={() => setCurrentStep('ancestry')}>
              ← Back
            </button>
            <button className="primary" onClick={handleNext}>
              Review Character
            </button>
          </div>
        </div>
      )}

      {currentStep === 'confirm' && (
        <div className="builder-step">
          <h2>Confirm Your Character</h2>

          <div className="character-summary">
            <div className="summary-section">
              <h3>Name</h3>
              <p>{characterName}</p>
            </div>

            <div className="summary-section">
              <h3>Ancestry</h3>
              <p>{solrynSystem.ancestries.find((a: any) => a.id === selectedAncestry)?.name}</p>
            </div>

            <div className="summary-section">
              <h3>Ability Scores</h3>
              <div className="stats-summary">
                {statOrder.map((statId) => (
                  <div key={statId} className="stat-summary-item">
                    <span>{statId}</span>
                    <span className="stat-value">{stats[statId]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="step-actions">
            <button className="secondary" onClick={() => setCurrentStep('gear')}>
              ← Back
            </button>
            <button className="primary" onClick={handleSave}>
              Create Character
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
