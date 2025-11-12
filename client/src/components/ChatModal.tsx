import React, { useEffect, useState, useRef } from "react";
import "../css/ChatModal.css";
import { useMessages } from "../context/MessagesContext";
import type { Socket } from "socket.io-client";
import UserAvatar from "./UserAvatar";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    name: string;
    profile_image?: string;
  };
  style?: React.CSSProperties;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  user,
  style,
}) => {
  const { messages, sendMessage, refreshMessages, socket, activeUsers } = useMessages();
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [newMessageAlert, setNewMessageAlert] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    if (isOpen) refreshMessages(user.id);
  }, [isOpen, user.id, refreshMessages]);

  useEffect(() => {
    if (!socketRef.current) return;

    const handleNewMessage = (msg: any) => {
      if (msg.sender_id === user.id || msg.receiver_id === user.id) {
        refreshMessages(user.id);
      }
    };

    socketRef.current.on("new_message", handleNewMessage);
    return () => {
      socketRef.current?.off("new_message", handleNewMessage);
    };
  }, [user.id, refreshMessages]);

  // Auto-scroll effect with "new message" detection
  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (!chatBody) return;

    const isNearBottom =
      chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight < 50; // 50px tolerance

    if (isNearBottom) {
      chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior: "smooth",
      });
      setNewMessageAlert(false); // Hide alert if user is at bottom
    } else {
      // User scrolled up, show "new messages" alert
      setNewMessageAlert(true);
    }
  }, [messages[user.id]]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(user.id, input);
    setInput("");

    // Scroll to bottom after sending
    const chatBody = chatBodyRef.current;
    if (chatBody) {
      chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleScrollToBottom = () => {
    const chatBody = chatBodyRef.current;
    if (chatBody) {
      chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior: "smooth",
      });
      setNewMessageAlert(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-modal-overlay" style={style}>
      <div className={`chat-modal ${minimized ? "minimized" : ""}`}>
        <header className="chat-modal-header">
          <div className="chat-avatar-wrapper">
            <UserAvatar
              avatar={user.profile_image || "/assets/default.png"} 
              size={50}
              alt={user.name}
            />
            {activeUsers.includes(user.id) && <span className="active-indicator" />}
          </div>
          <h3>{user.name}</h3>
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
              {(messages[user.id] || []).map((msg) => {
                const time = new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={msg.id}
                    className={`chat-message ${msg.sender_id === user.id ? "received" : "sent"}`}
                  >
                    <div className="message-text">{msg.message}</div>
                    <div className="message-time">{time}</div>
                  </div>
                );
              })}
            </div>

            {/* New messages alert */}
            {newMessageAlert && (
              <div className="new-messages-alert" onClick={handleScrollToBottom}>
                New messages below ⬇
              </div>
            )}

            <footer className="chat-input-area">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend} aria-label="Send message">
                ➤
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatModal;
