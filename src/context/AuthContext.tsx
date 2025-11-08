"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  userId: number | null;
  login: (username: string, userId: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUsername(parsed.username);
      setUserId(parsed.userId);
    }
  }, []);

  const login = (username: string, userId: number) => {
    setIsLoggedIn(true);
    setUsername(username);
    setUserId(userId);
    localStorage.setItem("user", JSON.stringify({ username, userId }));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setUserId(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
