import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import '../styles/pages.css';

interface Character {
  id: string;
  name: string;
  system: string;
  level: number;
}

export function LobbyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [characters] = useState<Character[]>([]);

  const handleNewCharacter = () => {
    navigate('/library');
  };

  const handleLogout = () => {
    void logout();
  };

  return (
    <div className="page lobby-page">
      <header className="lobby-header">
        <h1>Welcome, {user?.name}</h1>
        <button className="secondary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="page-content">
        <section className="section">
          <div className="section-header">
            <h2>Your Characters</h2>
            <button className="primary" onClick={handleNewCharacter}>
              + New Character
            </button>
          </div>

          {characters.length === 0 ? (
            <div className="empty-state">
              <p>You haven't created any characters yet.</p>
              <button className="primary" onClick={handleNewCharacter}>
                Create Your First Character
              </button>
            </div>
          ) : (
            <div className="grid grid-2">
              {characters.map((char) => (
                <div key={char.id} className="card character-card">
                  <h3>{char.name}</h3>
                  <p className="text-secondary">{char.system} · Level {char.level}</p>
                  <button className="primary">Use Character</button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section">
          <h2>Active Games</h2>
          <div className="empty-state">
            <p>No active games. Create a character and start a game!</p>
          </div>
        </section>
      </div>
    </div>
  );
}
