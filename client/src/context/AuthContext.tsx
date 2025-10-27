import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";


interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("chatly_user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("chatly_user", JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("chatly_user", JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Signup error:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("chatly_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
