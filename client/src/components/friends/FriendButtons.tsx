import React, { useState, useEffect } from "react";
import "../../css/FriendButton.css";
import { useFriends } from "../../context/FriendsContext"; // ✅ import hook

interface FriendButtonsProps {
  currentUserId: number;
  targetUserId: number;
  onRequestSent?: () => void;
}

const FriendButtons: React.FC<FriendButtonsProps> = ({
  currentUserId,
  targetUserId,
  onRequestSent,
}) => {
  const [status, setStatus] = useState<"none" | "pending" | "friends">("none");
  const [loading, setLoading] = useState(false);

  const { refreshFriends } = useFriends(); // ✅ get function

  useEffect(() => {
    const checkStatus = async () => {
      if (!currentUserId || !targetUserId) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/friends/status/${currentUserId}/${targetUserId}`
        );
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
  }, [currentUserId, targetUserId]);

  const sendRequest = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/friends/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUserId,
          friend_id: targetUserId,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to send friend request");

      setStatus("pending");
      refreshFriends(); // ✅ update global friends list
      onRequestSent?.();
    } catch (err) {
      console.error("❌ Friend request error:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/friends/${currentUserId}/${targetUserId}`,
        { method: "DELETE" }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to remove friend");

      setStatus("none");
      refreshFriends(); // ✅ instantly sync UI
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
