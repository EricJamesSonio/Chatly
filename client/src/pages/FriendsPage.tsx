import React, { useEffect, useState } from "react";
import { useFriends } from "../context/FriendsContext";
import MiniProfileModal from "../components/friends/MiniProfileModal";
import FriendButtons from "../components/friends/FriendButtons";
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

  // Fetch people you may know
  useEffect(() => {
    const fetchNonFriends = async () => {
      if (!currentUser?.id) return;
      const res = await fetch(`http://localhost:5000/api/friends/not-friends/${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setNonFriends(data);
      }
    };
    fetchNonFriends();
  }, [currentUser?.id]);

  // Fetch pending friend requests
  const fetchPendingRequests = async () => {
    if (!currentUser?.id) return;
    const res = await fetch(`http://localhost:5000/api/friends/pending/${currentUser.id}`);
    if (res.ok) {
      const data = await res.json();
      setPendingRequests(data);
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
      <div className="friends-header">
        {view === "default" ? (
          <>
            <h1>Friends</h1>
            <div className="header-actions">
              <div className="sort-options">
                <span>Sort by:</span>
                <button
                  className={`sort-btn ${sortBy === "name" ? "active" : ""}`}
                  onClick={() => setSortBy("name")}
                >
                  Name
                </button>
                <button
                  className={`sort-btn ${sortBy === "date" ? "active" : ""}`}
                  onClick={() => setSortBy("date")}
                >
                  Recently Added
                </button>
              </div>
              <button
                className="requests-btn"
                onClick={() => {
                  fetchPendingRequests();
                  setView("requests");
                }}
              >
                View Friend Requests
              </button>
            </div>
          </>
        ) : (
          <>
            <button className="back-btn" onClick={() => setView("default")}>
              ← Back
            </button>
            <h1>Friend Requests</h1>
          </>
        )}
      </div>

      {/* Default View: Friends + People You May Know */}
      {view === "default" && (
        <>
          <div className="friends-grid">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className="friend-card"
                  onClick={() => handleFriendClick(friend)}
                >
                  <img src={friend.profile_image} alt={friend.name} className="friend-avatar" />
                  <div className="friend-info">
                    <h3>{friend.name}</h3>
                    <p className="username">@{friend.username}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-friends">
                <p>You don't have any friends yet.</p>
              </div>
            )}
          </div>

          {/* 💡 People You May Know Section */}
          <div className="non-friends-section">
            <h2>People You May Know</h2>
            <div className="friends-grid">
              {nonFriends.map((user) => (
                <div key={user.id} className="friend-card">
                  <img src={user.profile_image} alt={user.name} className="friend-avatar" />
                  <div className="friend-info">
                    <h3>{user.name}</h3>
                    <FriendButtons currentUserId={currentUser.id} targetUserId={user.id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Requests View */}
      {view === "requests" && (
        <div className="friends-grid">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((req) => (
              <div key={req.id} className="friend-card">
                <img src={req.profile_image} alt={req.name} className="friend-avatar" />
                <div className="friend-info">
                  <h3>{req.name}</h3>
                  <div className="buttons">
                    <button
                      className="accept-btn"
                      onClick={async () => {
                        await fetch(`http://localhost:5000/api/friends/accept/${req.id}`, {
                          method: "PUT",
                        });
                        fetchPendingRequests();
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={async () => {
                        await fetch(`http://localhost:5000/api/friends/${req.id}`, {
                          method: "DELETE",
                        });
                        fetchPendingRequests();
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-requests">No pending friend requests.</p>
          )}
        </div>
      )}

      <MiniProfileModal />
    </div>
  );
};

export default FriendsPage;
