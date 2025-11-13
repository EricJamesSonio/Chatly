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

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, user, style }) => {
  const { messages, sendMessage, refreshMessages, socket, activeUsers } = useMessages();
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [newMessageAlert, setNewMessageAlert] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const hideAlertTimeout = useRef<number | null>(null);

  // Initialize socket ref
  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  // Load messages and scroll once to latest when opening
  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;

    (async () => {
      await refreshMessages(user.id);
      if (!mounted) return;

      const chatBody = chatBodyRef.current;
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isOpen, user.id, refreshMessages]);

  // Handle new incoming messages (no auto scroll)
  useEffect(() => {
    if (!socketRef.current) return;

    const handleNewMessage = async (msg: any) => {
      if (msg.sender_id === user.id || msg.receiver_id === user.id) {
        const chatBody = chatBodyRef.current;
        if (!chatBody) return;

        const isAtBottom =
          chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight < 50;

        await refreshMessages(user.id);

        // Only show alert if user is not near bottom
        if (!isAtBottom) {
          setNewMessageAlert(true);
        }
      }
    };

    socketRef.current.on("new_message", handleNewMessage);
    return () => {
      socketRef.current?.off("new_message", handleNewMessage);
    };
  }, [user.id, refreshMessages]);

  // Hide alert when user scrolls near bottom
  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (!chatBody) return;

    const handleScroll = () => {
      const isNearBottom =
        chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight < 80;

      if (isNearBottom && newMessageAlert) {
        if (hideAlertTimeout.current !== null) {
          window.clearTimeout(hideAlertTimeout.current);
        }
        hideAlertTimeout.current = window.setTimeout(() => {
          setNewMessageAlert(false);
          hideAlertTimeout.current = null;
        }, 300);
      }
    };

    chatBody.addEventListener("scroll", handleScroll);
    return () => {
      chatBody.removeEventListener("scroll", handleScroll);
      if (hideAlertTimeout.current !== null) {
        window.clearTimeout(hideAlertTimeout.current);
        hideAlertTimeout.current = null;
      }
    };
  }, [newMessageAlert]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(user.id, input);
    setInput("");
  };

  const handleScrollToBottom = () => {
    const chatBody = chatBodyRef.current;
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
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
            <button className="minimize-btn" onClick={() => setMinimized((p) => !p)}>
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
