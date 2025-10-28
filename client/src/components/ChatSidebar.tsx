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
  const { chatUsers, socket } = useMessages(); // ✅ use context socket
  const currentUser = JSON.parse(localStorage.getItem("chatly_user") || "{}");

  const [lastMessages, setLastMessages] = useState<Record<number, Message>>({});

  // Fetch last message with a user
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

  // Fetch last message for all users whenever chatUsers updates
  useEffect(() => {
    chatUsers.forEach((user) => fetchLastMessage(user.id));
  }, [chatUsers]);

  // Socket.IO: listen for new messages
  useEffect(() => {
    if (!currentUser.id) return;

    socket.emit("join", currentUser.id);

    const handleNewMessage = (message: Message) => {
      setLastMessages((prev) => ({
        ...prev,
        [message.sender_id === currentUser.id ? message.receiver_id : message.sender_id]:
          message,
      }));
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [currentUser.id, socket]);

  return (
    <div className={`chat-sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <button className="sidebar-toggle" onClick={onToggle}>
        {isExpanded ? "◀" : "☰"}
      </button>

      <div className="chat-list">
        {chatUsers.map((u) => (
          <div
            key={u.id}
            className={`chat-user ${activeUserId === u.id ? "active" : ""}`}
            onClick={() => onUserSelect(u.id)}
          >
            <img
              className="chat-avatar"
              src={u.profile_image || "/assets/avatar1.jpg"}
              alt={u.name}
            />
            <div className="chat-user-info">
              <div className="chat-name">{u.name}</div>
              <div className="chat-last">
                {lastMessages[u.id]?.message || "No messages yet"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
