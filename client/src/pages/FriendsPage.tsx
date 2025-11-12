import React, { useState, useEffect } from "react";
import { useFriends } from "../context/FriendsContext";
import MiniProfileModal from "../components/friends/MiniProfileModal";
import FriendsHeader from "../components/friends/FriendsHeader";
import FriendsList from "../components/friends/FriendsList";
import FriendRequests from "../components/friends/FriendRequests";
import "../css/FriendsPage.css";

const API_URL = import.meta.env.VITE_API_URL;

const FriendsPage: React.FC = () => {
  const {
    friends,
    nonFriends,
    sortBy,
    setSortBy,
    setSelectedFriend,
    setIsProfileModalOpen,
    loading,
    error,
  } = useFriends();

  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(0);
  const [view, setView] = useState<"default" | "requests">("default");

  const currentUser = JSON.parse(localStorage.getItem("chatly_user") || "{}");

  // Fetch pending friend requests
  const fetchPendingRequests = async () => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch(`${API_URL}/api/friends/pending/${currentUser.id}`);
      if (res.ok) {
        const requests = await res.json();
        setPendingRequests(requests);
        setPendingRequestsCount(requests.length);
      }
    } catch (err) {
      console.error("❌ Failed to fetch pending requests:", err);
    }
  };

  const handleFriendClick = (friend: any) => {
    setSelectedFriend(friend);
    setIsProfileModalOpen(true);
  };

  if (loading) return <div className="loading">Loading friends...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="friends-page">
      <FriendsHeader
        view={view}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setView={setView}
        fetchPendingRequests={fetchPendingRequests}
        pendingRequestsCount={pendingRequestsCount}
      />

      {view === "default" ? (
        <FriendsList
          friends={friends}
          nonFriends={nonFriends}
          handleFriendClick={handleFriendClick} // ✅ currentUserId removed
        />
      ) : (
        <FriendRequests
          requests={pendingRequests}
          fetchPendingRequests={fetchPendingRequests}
        />
      )}

      <MiniProfileModal />
    </div>
  );
};

export default FriendsPage;
