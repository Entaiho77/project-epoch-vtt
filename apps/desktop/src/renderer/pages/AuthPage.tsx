import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import '../styles/pages.css';

export function AuthPage() {
  const [playerName, setPlayerName] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      void login(playerName);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Project Epoch VTT</h1>
          <p>Buy once. Host free. Play forever.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="playerName">Your Name</label>
              <input
                id="playerName"
                type="text"
                placeholder="Enter your character name or player name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                autoFocus
              />
            </div>

            <button type="submit" className="primary" disabled={!playerName.trim()}>
              Enter the Realm
            </button>
          </form>

          <p className="auth-footer text-muted">
            No account needed. Your games are stored locally.
          </p>
        </div>
      </div>
    </div>
  );
}
