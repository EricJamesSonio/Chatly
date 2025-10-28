import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
}

interface ChatUser {
  id: number;
  name: string;
  profile_image: string;
}

interface MessagesContextType {
  messages: Record<number, Message[]>; // keyed by userId
  chatUsers: ChatUser[];
  selectedUserId: number | null;
  setSelectedUserId: (id: number | null) => void;
  sendMessage: (receiverId: number, message: string) => Promise<void>;
  refreshMessages: (userId: number) => Promise<void>;
  socket: Socket;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

// Initialize socket outside to persist across components
const socket = io("http://localhost:5000");

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Record<number, Message[]>>({});
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Fetch friends to chat with
  const fetchChatUsers = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/friends/${user.id}`);
      const data = await res.json();
      setChatUsers(data);
    } catch (err) {
      console.error("❌ Failed to fetch chat users", err);
    }
  };

  // Fetch messages with a user
  const refreshMessages = async (userId: number) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${user.id}/${userId}`);
      const data: Message[] = await res.json();
      setMessages((prev) => ({ ...prev, [userId]: data }));
    } catch (err) {
      console.error("❌ Failed to fetch messages", err);
    }
  };

  // Send message
  const sendMessage = async (receiverId: number, messageText: string) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: user.id,
          receiver_id: receiverId,
          message: messageText,
        }),
      });
      const message: Message = await res.json();

      // Update local state
      setMessages((prev) => {
        const prevMessages = prev[receiverId] || [];
        return { ...prev, [receiverId]: [...prevMessages, message] };
      });

      // Emit socket event to receiver
      socket.emit("send_message", message);
    } catch (err) {
      console.error("❌ Failed to send message", err);
    }
  };

  // Socket.IO listeners
useEffect(() => {
  if (!user?.id) return;

  fetchChatUsers();

  // Listen to global friend refresh events
  const handleRefresh = () => {
    fetchChatUsers();
  };

  window.addEventListener("refreshFriends", handleRefresh);

  return () => {
    window.removeEventListener("refreshFriends", handleRefresh);
  };
}, [user?.id]);


  useEffect(() => {
    fetchChatUsers();
  }, [user?.id]);

  return (
    <MessagesContext.Provider
      value={{
        messages,
        chatUsers,
        selectedUserId,
        setSelectedUserId,
        sendMessage,
        refreshMessages,
        socket,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) throw new Error("useMessages must be used within a MessagesProvider");
  return context;
};
