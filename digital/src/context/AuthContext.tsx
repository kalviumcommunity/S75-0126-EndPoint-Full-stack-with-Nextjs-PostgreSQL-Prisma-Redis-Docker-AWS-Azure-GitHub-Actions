"use client";

import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from "react";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAccessToken = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken);
        // In a real app, you might decode the token to set the user
        // For simplicity, we'll just set a mock user or use the one we have
        return data.accessToken;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
    setAccessToken(null);
    setUser(null);
    return null;
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      setAccessToken(data.accessToken);
      // Mock user setting - in reality, decode the JWT
      setUser({ id: "1", email, role: "user" });
      console.log("User logged in:", email);
    } else {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    // You should also call an API to clear the refresh token cookie
    fetch("/api/auth/logout", { method: "POST" }).catch(console.error);
    console.log("User logged out");
  };

  // Initial token refresh on mount
  useEffect(() => {
    refreshAccessToken().finally(() => setLoading(false));
  }, [refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, refreshAccessToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
