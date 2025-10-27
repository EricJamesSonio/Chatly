import React, { useState } from "react";
import '../../css/FriendButton.css';

interface FriendButtonsProps {
  currentUserId: number;
  targetUserId: number;
}

const FriendButtons: React.FC<FriendButtonsProps> = ({ currentUserId, targetUserId }) => {
  const [status, setStatus] = useState<"none" | "pending" | "friends">("none");
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/friends/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUserId, friend_id: targetUserId }),
      });
      if (!res.ok) throw new Error("Failed to send request");
      setStatus("pending");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/friends/${targetUserId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove friend");
      setStatus("none");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="friend-buttons">
      {status === "none" && (
        <button className="btn-add" disabled={loading} onClick={sendRequest}>
          ➕ Add Friend
        </button>
      )}
      {status === "pending" && (
        <button className="btn-pending" disabled>
          ⏳ Request Sent
        </button>
      )}
      {status === "friends" && (
        <button className="btn-remove" disabled={loading} onClick={removeFriend}>
          ❌ Remove Friend
        </button>
      )}
    </div>
  );
};

export default FriendButtons;
