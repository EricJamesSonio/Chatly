import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

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

interface FriendsContextType {
  friends: User[];
  sortBy: "name" | "date";
  setSortBy: (sort: "name" | "date") => void;
  selectedFriend: User | null;
  setSelectedFriend: (friend: User | null) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (isOpen: boolean) => void;
  loading: boolean;
  error: string | null;
  refreshFriends: () => Promise<void>;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

// ✅ Initialize socket outside the component
const socket = io("http://localhost:5000");

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<User[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshFriends = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/friends/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch friends");
      const data = await res.json();
      setFriends(data);
    } catch (err) {
      setError("Failed to refresh friends");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    refreshFriends();

    // ✅ Join the user’s private room
    socket.emit("join", user.id);

    // ✅ Listen for real-time updates
    socket.on("refresh_friends", () => {
      console.log("🔁 Friend list updated from WebSocket");
      refreshFriends();
    });

    return () => {
      socket.off("refresh_friends");
    };
  }, [user?.id]);

  const sortedFriends = useMemo(() => {
    return [...friends].sort((a, b) =>
      sortBy === "name"
        ? a.name.localeCompare(b.name)
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [friends, sortBy]);

  return (
    <FriendsContext.Provider
      value={{
        friends: sortedFriends,
        sortBy,
        setSortBy,
        selectedFriend,
        setSelectedFriend,
        isProfileModalOpen,
        setIsProfileModalOpen,
        loading,
        error,
        refreshFriends,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (!context) throw new Error("useFriends must be used within a FriendsProvider");
  return context;
};
