import React, { useState, useEffect } from "react";
import "../../css/FriendButton.css";
import { useFriends } from "../../context/FriendsContext";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || '';

interface FriendButtonsProps {
  targetUserId: number;
  onRequestSent?: () => void;
}

const FriendButtons: React.FC<FriendButtonsProps> = ({
  targetUserId,
  onRequestSent,
}) => {
  const { user } = useAuth(); // ✅ get logged-in user from context
  const [status, setStatus] = useState<"none" | "pending" | "friends">("none");
  const [loading, setLoading] = useState(false);
  const { refreshFriends } = useFriends();

  useEffect(() => {
    const checkStatus = async () => {
      if (!user?.id || !targetUserId) return;

      try {
        const res = await fetch(`${API_URL}/api/friends/status/${user.id}/${targetUserId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "accepted") setStatus("friends");
          else if (data.status === "pending") setStatus("pending");
          else setStatus("none");
        }
      } catch (err) {
        console.error("⚠️ Failed to check friend status:", err);
      }
    };

    checkStatus();
  }, [user?.id, targetUserId]);

  const sendRequest = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/friends/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          friend_id: targetUserId,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to send friend request");

      setStatus("pending");
      refreshFriends();
      onRequestSent?.();
    } catch (err) {
      console.error("❌ Friend request error:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/friends/${user.id}/${targetUserId}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to remove friend");

      setStatus("none");
      refreshFriends();
      onRequestSent?.();
    } catch (err) {
      console.error("❌ Remove friend error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="friend-buttons">
      {status === "none" && (
        <button className="btn-add" disabled={loading} onClick={sendRequest}>
          Add Friend
        </button>
      )}
      {status === "pending" && (
        <button className="btn-pending" disabled>
          Friend Request Sent
        </button>
      )}
      {status === "friends" && (
        <button className="btn-remove" disabled={loading} onClick={removeFriend}>
          UnFriend
        </button>
      )}
    </div>
  );
};

export default FriendButtons;
