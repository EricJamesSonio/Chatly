import React, { useEffect, useState } from "react";
import "../css/ChatSidebar.css";
import { useMessages } from "../context/MessagesContext";

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
}

interface ChatSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onUserSelect: (userId: number) => void;
  activeUserId?: number | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isExpanded,
  onToggle,
  onUserSelect,
  activeUserId,
}) => {
  const { chatUsers, socket, activeUsers } = useMessages();
  const currentUser = JSON.parse(localStorage.getItem("chatly_user") || "{}");

  const [lastMessages, setLastMessages] = useState<Record<number, Message>>({});
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>(() => {
    // Initialize from localStorage if available
    const savedCounts = localStorage.getItem('chatly_unread_counts');
    return savedCounts ? JSON.parse(savedCounts) : {};
  });

  // Fetch last message for a user
  const fetchLastMessage = async (userId: number) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/messages/${currentUser.id}/${userId}`
      );
      const data: Message[] = await res.json();
      if (data.length) {
        setLastMessages((prev) => ({
          ...prev,
          [userId]: data[data.length - 1],
        }));
      }
    } catch (err) {
      console.error("❌ Failed to fetch last message", err);
    }
  };

  // Update localStorage whenever unreadCounts changes
  useEffect(() => {
    localStorage.setItem('chatly_unread_counts', JSON.stringify(unreadCounts));
  }, [unreadCounts]);

  // Fetch unread counts for the current user
  const fetchUnreadCounts = async () => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/messages/unread/${currentUser.id}`);
      const serverCounts: Record<number, number> = await res.json();
      
      // Merge with existing counts to prevent losing unread state on refresh
      setUnreadCounts(prevCounts => {
        const merged = { ...serverCounts };
        // Preserve any existing unread counts that might not be on server yet
        Object.entries(prevCounts).forEach(([userId, count]) => {
          const uid = Number(userId);
          if (count > 0 && (!(uid in serverCounts) || serverCounts[uid] < count)) {
            merged[uid] = count;
          }
        });
        return merged;
      });
    } catch (err) {
      console.error("❌ Failed to fetch unread counts", err);
    }
  };

  // Fetch last messages & unread counts on mount / chatUsers change
  useEffect(() => {
    chatUsers.forEach((user) => fetchLastMessage(user.id));
    fetchUnreadCounts();
  }, [chatUsers]);

  // Socket.IO listener for new messages
  useEffect(() => {
    if (!currentUser.id || !socket) return;

    socket.emit("join", currentUser.id);

    const handleNewMessage = (message: Message) => {
      const otherUserId =
        message.sender_id === currentUser.id ? message.receiver_id : message.sender_id;

      setLastMessages((prev) => ({
        ...prev,
        [otherUserId]: message,
      }));

      // Increment unread count if not the active chat
      if (activeUserId !== otherUserId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [otherUserId]: (prev[otherUserId] || 0) + 1,
        }));
      }
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [currentUser.id, socket, activeUserId]);

  const handleUserSelect = async (userId: number) => {
    onUserSelect(userId);

    // Mark messages as read on the backend
    try {
      await fetch(`http://localhost:5000/api/messages/read/${currentUser.id}/${userId}`, {
        method: "POST",
      });
    } catch (err) {
      console.error("❌ Failed to mark messages as read", err);
    }

    // Clear unread count locally
    setUnreadCounts((prev) => {
      const copy = { ...prev };
      delete copy[userId];
      return copy;
    });
    
    // Also update localStorage immediately
    const updatedCounts = { ...unreadCounts };
    delete updatedCounts[userId];
    localStorage.setItem('chatly_unread_counts', JSON.stringify(updatedCounts));
  };

  return (
    <div className={`chat-sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <button className="sidebar-toggle" onClick={onToggle}>
        {isExpanded ? "◀" : "☰"}
      </button>

      <div className="chat-list">
        {chatUsers.map((u) => {
          const isOnline = activeUsers.includes(u.id);
          const unreadCount = unreadCounts[u.id] || 0;

          return (
            <div
              key={u.id}
              className={`chat-user ${activeUserId === u.id ? "active" : ""} ${
                unreadCount > 0 ? "unread" : ""
              }`}
              onClick={() => handleUserSelect(u.id)}
            >
              <div className="chat-avatar-container">
                <img
                  className="chat-avatar"
                  src={u.profile_image || "/assets/avatar1.jpg"}
                  alt={u.name}
                />
                {isOnline && <span className="active-indicator" />}
              </div>

              <div className="chat-user-info">
                <div className="chat-name">{u.name}</div>
                <div className="chat-last">
                  {lastMessages[u.id]?.message || "No messages yet"}
                </div>
              </div>

              {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;
