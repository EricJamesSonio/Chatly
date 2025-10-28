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
  messages: Record<number, Message[]>;
  chatUsers: ChatUser[];
  selectedUserId: number | null;
  setSelectedUserId: (id: number | null) => void;
  sendMessage: (receiverId: number, message: string) => Promise<void>;
  refreshMessages: (userId: number) => Promise<void>;
  socket: Socket;
  activeUsers: number[]; // ✅ required
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

// Initialize socket outside to persist across components
const socket = io("http://localhost:5000");

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Record<number, Message[]>>({});
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [activeUsers, setActiveUsers] = useState<number[]>([]); // ✅ inside provider

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
          senderId: user.id,
          receiverId,
          message: messageText,
        }),
      });
      const message: Message = await res.json();

      setMessages((prev) => {
        const prevMessages = prev[receiverId] || [];
        return { ...prev, [receiverId]: [...prevMessages, message] };
      });

      socket.emit("send_message", message);
    } catch (err) {
      console.error("❌ Failed to send message", err);
    }
  };

  // Socket: update active users
  useEffect(() => {
    socket.on("update_active_users", (userIds: number[]) => {
      setActiveUsers(userIds);
    });

    return () => {
      socket.off("update_active_users");
    };
  }, []);

  // Fetch friends & handle refresh
  useEffect(() => {
    if (!user?.id) return;
    fetchChatUsers();

    const handleRefresh = () => fetchChatUsers();
    window.addEventListener("refreshFriends", handleRefresh);
    return () => window.removeEventListener("refreshFriends", handleRefresh);
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
        activeUsers, // ✅ include here to satisfy type
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
