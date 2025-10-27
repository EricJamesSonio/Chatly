import React, { useEffect, useState } from "react";
import { useFriends } from "../context/FriendsContext";
import MiniProfileModal from "../components/friends/MiniProfileModal";
import FriendButtons from "../components/friends/FriendButtons";
import FriendsHeader from "../components/friends/FriendsHeader";
import FriendsList from "../components/friends/FriendsList";
import FriendRequests from "../components/friends/FriendRequests";
import "../css/FriendsPage.css";

const FriendsPage: React.FC = () => {
  const {
    friends,
    sortBy,
    setSortBy,
    setSelectedFriend,
    setIsProfileModalOpen,
    loading,
    error,
  } = useFriends();

  const [nonFriends, setNonFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [view, setView] = useState<"default" | "requests">("default");
  const currentUser = JSON.parse(localStorage.getItem("chatly_user") || "{}");

  useEffect(() => {
    if (!currentUser?.id) return;
    fetch(`http://localhost:5000/api/friends/not-friends/${currentUser.id}`)
      .then((res) => res.json())
      .then(setNonFriends)
      .catch(console.error);
  }, [currentUser?.id]);

  const fetchPendingRequests = async () => {
    if (!currentUser?.id) return;
    const res = await fetch(`http://localhost:5000/api/friends/pending/${currentUser.id}`);
    if (res.ok) setPendingRequests(await res.json());
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
      />

      {view === "default" ? (
        <FriendsList
          friends={friends}
          nonFriends={nonFriends}
          currentUserId={currentUser.id}
          handleFriendClick={handleFriendClick}
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
