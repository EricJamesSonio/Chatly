import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  name: string;
  username: string;
  profile_image: string;
  location?: string;
  bio?: string;
  birthdate?: string;
  hobbies?: string;
  talents?: string;
  facebook_url?: string;
  tiktok_url?: string;
  instagram_url?: string;
  created_at: string;
  last_active: string;
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
let socket: Socket | null = null;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("chatly_user");
    if (savedUser) setUser(JSON.parse(savedUser));

    // Initialize socket only once
    if (!socket) {
      socket = io(API_URL);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("chatly_user", JSON.stringify(data.user));

        // Join private room
        socket?.emit("join", data.user.id);
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
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("chatly_user", JSON.stringify(data.user));

        // Join private room
        socket?.emit("join", data.user.id);
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
    socket?.emit("logout");

    // Clear user data
    setUser(null);
    localStorage.removeItem("chatly_user");
    localStorage.removeItem("friends_list");

    // Emit a custom event to notify other components to clear their state
    window.dispatchEvent(new Event("user_logged_out"));

    // Disconnect socket if connected
    if (socket?.connected) {
      socket.disconnect();
      socket = null; // reset socket for next login
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
