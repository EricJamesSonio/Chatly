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
  nonFriends: User[]; // ✅ added
  sortBy: "name" | "date";
  setSortBy: (sort: "name" | "date") => void;
  selectedFriend: User | null;
  setSelectedFriend: (friend: User | null) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (isOpen: boolean) => void;
  loading: boolean;
  error: string | null;
  refreshFriends: () => Promise<void>;
  refreshNonFriends: () => Promise<void>; // ✅ added
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

// ✅ Initialize socket outside the component
const socket = io("http://localhost:5000");

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<User[]>([]);
  const [nonFriends, setNonFriends] = useState<User[]>([]); // ✅ added
  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch accepted friends
  const refreshFriends = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/friends/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch friends");
      const data = await res.json();
      setFriends(data);
    } catch (err) {
      console.error("❌ Error fetching friends:", err);
      setError("Failed to refresh friends");
    }
  };

  // ✅ Fetch users that are NOT friends
  const refreshNonFriends = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/friends/not-friends/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch non-friends");
      const data = await res.json();
      setNonFriends(data);
    } catch (err) {
      console.error("❌ Error fetching non-friends:", err);
    }
  };

  // ✅ Refresh both friends + non-friends together
  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([refreshFriends(), refreshNonFriends()]);
    setLoading(false);
  };

  useEffect(() => {
    if (!user?.id) return;

    refreshAll();

    // Join private room
    socket.emit("join", user.id);

    // Listen for friend updates
    const handleFriendUpdate = () => {
      console.log("🔁 Friend or non-friend list updated via WebSocket");
      refreshAll();

      // ✅ Dispatch a global event for other contexts (like MessagesProvider)
      window.dispatchEvent(new Event("refreshFriends"));
    };

    socket.on("refresh_friends", handleFriendUpdate);

    return () => {
      socket.off("refresh_friends", handleFriendUpdate);
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
        nonFriends, // ✅ added
        sortBy,
        setSortBy,
        selectedFriend,
        setSelectedFriend,
        isProfileModalOpen,
        setIsProfileModalOpen,
        loading,
        error,
        refreshFriends,
        refreshNonFriends, // ✅ added
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
