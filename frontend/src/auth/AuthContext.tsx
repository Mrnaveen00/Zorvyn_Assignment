import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { financeApi } from "../api/financeApi";
import type { User } from "../types";

const STORAGE_KEY = "finance-dashboard-auth";

type StoredAuth = {
  token: string;
  user: User;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      setIsLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as StoredAuth;
      setToken(parsed.token);
      setUser(parsed.user);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = (nextToken: string, nextUser: User) => {
    setToken(nextToken);
    setUser(nextUser);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
  };

  const clear = () => {
    setToken(null);
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (email: string, password: string) => {
    const result = await financeApi.login(email, password);
    persist(result.token, result.user);
  };

  const logout = () => clear();

  const refreshUser = async () => {
    if (!token) return;

    try {
      const result = await financeApi.me(token);
      persist(token, result.user);
    } catch {
      clear();
    }
  };

  const value = useMemo(
    () => ({ token, user, isLoading, login, logout, refreshUser }),
    [token, user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
