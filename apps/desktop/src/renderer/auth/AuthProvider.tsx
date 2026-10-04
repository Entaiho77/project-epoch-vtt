import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore the user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('epochUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to restore user:', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (name: string) => {
    const newUser: User = {
      id: await window.db.newKey(),
      name,
    };
    setUser(newUser);
    localStorage.setItem('epochUser', JSON.stringify(newUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('epochUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
