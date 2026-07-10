import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { AuthPage } from './features/auth/AuthPage';
import { LobbyPage } from './features/lobby/LobbyPage';
import { GamePage } from './features/game/GamePage';
import { CustomizePage } from './features/customize/CustomizePage';

function FullScreenMessage({ children }: { children: string }) {
  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
      }}
    >
      {children}
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullScreenMessage>Loading…</FullScreenMessage>;
  }

  // Everyone enters the same way; role determines what they see inside a game (§1).
  return (
    <Routes>
      <Route path="/" element={user ? <LobbyPage /> : <AuthPage />} />
      <Route
        path="/library"
        element={user ? <CustomizePage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/game/:gameId/customize"
        element={user ? <CustomizePage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/game/:gameId"
        element={user ? <GamePage /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
}
