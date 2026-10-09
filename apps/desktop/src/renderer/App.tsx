import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { getVoice, leaveVoice } from './features/voice/voiceStore';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { AuthPage } from './features/auth/AuthPage';
import { LobbyPage } from './features/lobby/LobbyPage';
import { GamePage } from './features/game/GamePage';
import { CustomizePage } from './features/customize/CustomizePage';
import { DmToolsPage } from './features/dmtools/DmToolsPage';
import { SessionOverlay } from './features/session/SessionOverlay';

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

/**
 * Leaving the game (to the lobby or the library) ends your voice call too. Opening the game's
 * own customize screen (still in the game) keeps it.
 */
function LeaveVoiceOutsideGames() {
  const { pathname } = useLocation();
  useEffect(() => {
    const v = getVoice();
    if (!pathname.startsWith('/game/') && (v.joined || v.joining)) leaveVoice();
  }, [pathname]);
  return null;
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
        path="/dm-tools"
        element={user ? <DmToolsPage /> : <Navigate to="/" replace />}
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
        <LeaveVoiceOutsideGames />
        <SessionOverlay />
      </AuthProvider>
    </HashRouter>
  );
}
