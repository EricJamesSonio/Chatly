import React, { createContext, useContext, useState, useEffect } from 'react';

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
  sortBy: 'name' | 'date';
  setSortBy: (sort: 'name' | 'date') => void;
  selectedFriend: User | null;
  setSelectedFriend: (friend: User | null) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (isOpen: boolean) => void;
  loading: boolean;
  error: string | null;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [friends, setFriends] = useState<User[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Replace mock with actual API call
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const userId = 1; // TODO: replace with logged-in user id (from auth context or session)
        const response = await fetch(`http://localhost:5000/api/friends/${userId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setFriends(data);
      } catch (err) {
        setError('Failed to load friends');
        console.error('Error fetching friends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  // Sorting logic
  const sortedFriends = React.useMemo(() => {
    return [...friends].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
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
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error('useFriends must be used within a FriendsProvider');
  }
  return context;
};
