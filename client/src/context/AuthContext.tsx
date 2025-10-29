import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";


interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  socket: Socket | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a single socket instance
const socket = io("http://localhost:5000");

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
    // Emit logout event to server
    socket.emit('logout');
    
    // Clear user data
    setUser(null);
    localStorage.removeItem("chatly_user");
    
    // Clear any friends list data from local storage if exists
    localStorage.removeItem('friends_list');
    
    // Emit a custom event to notify other components to clear their state
    window.dispatchEvent(new Event('user_logged_out'));
    
    // Disconnect socket if needed
    if (socket.connected) {
      socket.disconnect();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, socket }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
