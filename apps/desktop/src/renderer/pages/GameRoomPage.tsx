import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages.css';

export function GameRoomPage() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const generateRoomCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateRoom = async () => {
    try {
      const newCode = generateRoomCode();
      // Store room metadata in database
      await window.db.write(`rooms/${newCode}`, {
        id: newCode,
        createdAt: Date.now(),
        host: true,
        players: [],
      });
      // Navigate to game room
      navigate(`/room/${newCode}`);
    } catch (err) {
      setError('Failed to create room');
      console.error(err);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    try {
      const code = roomCode.toUpperCase().trim();
      // Check if room exists
      const room = await window.db.read(`rooms/${code}`);
      if (!room) {
        setError('Room not found');
        return;
      }
      // Navigate to game room
      navigate(`/room/${code}`);
    } catch (err) {
      setError('Failed to join room');
      console.error(err);
    }
  };

  return (
    <div className="page">
      <header className="game-header">
        <button className="secondary" onClick={() => navigate('/')}>
          ← Lobby
        </button>
        <h1>Game Rooms</h1>
        <div style={{ width: '80px' }} />
      </header>

      <div className="page-content">
        <div className="room-container">
          {/* Create Room Section */}
          <div className="room-section">
            <div className="room-card">
              <h2>Start a New Game</h2>
              <p>Create a room code to invite local players</p>
              <button className="primary" onClick={handleCreateRoom}>
                Generate Room Code
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="room-divider">
            <span>OR</span>
          </div>

          {/* Join Room Section */}
          <div className="room-section">
            <div className="room-card">
              <h2>Join Existing Game</h2>
              <p>Enter a room code to join a friend's game</p>

              <div className="room-input-group">
                <input
                  type="text"
                  placeholder="E.g., ABC1"
                  value={roomCode}
                  onChange={(e) => {
                    setRoomCode(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleJoinRoom();
                    }
                  }}
                  maxLength={4}
                  style={{ textTransform: 'uppercase', letterSpacing: '0.2em' }}
                />
              </div>

              {error && <p className="error-message">{error}</p>}

              <button className="primary" onClick={handleJoinRoom}>
                Join Game
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="room-info">
            <p>
              <strong>Local Play:</strong> Room codes are stored locally on your computer. Share
              your room code with other players on your network to play together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
