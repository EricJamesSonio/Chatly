import React, { useEffect, useState, useRef } from "react";
import "../css/ChatModal.css";
import { useMessages } from "../context/MessagesContext";
import type { Socket } from "socket.io-client";
import UserAvatar from "./UserAvatar"; // <-- import here

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
  style?: React.CSSProperties;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  style,
}) => {
  const { messages, sendMessage, refreshMessages, socket, activeUsers } = useMessages();
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    if (isOpen) refreshMessages(userId);
  }, [isOpen, userId, refreshMessages]);

  useEffect(() => {
    if (!socketRef.current) return;

    const handleNewMessage = (msg: any) => {
      if (msg.sender_id === userId || msg.receiver_id === userId) {
        refreshMessages(userId);
      }
    };

    socketRef.current.on("new_message", handleNewMessage);
    return () => {
      socketRef.current?.off("new_message", handleNewMessage);
    };
  }, [userId, refreshMessages]);

  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages[userId]]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(userId, input);
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="chat-modal-overlay" style={style}>
      <div className={`chat-modal ${minimized ? "minimized" : ""}`}>
        <header className="chat-modal-header">
          <UserAvatar
            avatar={`/assets/avatar-${userId}.jpg`} // replace with real avatar if needed
            isActive={activeUsers.includes(userId)}
            size={50}
            alt={userName}
          />
          <h3>{userName}</h3>
          <div>
            <button
              className="minimize-btn"
              onClick={() => setMinimized((prev) => !prev)}
            >
              {minimized ? "▢" : "_"}
            </button>
            <button className="close-btn" onClick={onClose}>
              X
            </button>
          </div>
        </header>

        {!minimized && (
          <>
            <div className="chat-body" ref={chatBodyRef}>
              {(messages[userId] || []).map((msg) => {
                const time = new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={msg.id}
                    className={`chat-message ${msg.sender_id === userId ? "received" : "sent"}`}
                  >
                    <div className="message-text">{msg.message}</div>
                    <div className="message-time">{time}</div>
                  </div>
                );
              })}
            </div>

            <footer className="chat-input-area">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend}>Send</button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatModal;
