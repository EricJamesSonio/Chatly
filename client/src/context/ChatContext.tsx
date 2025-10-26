import React, { createContext, useState, useContext } from "react";

interface ChatUser {
  id: number;
  name: string;
  avatar?: string;
}

interface ChatContextType {
  selectedUser: ChatUser | null;
  openChat: (user: ChatUser) => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  const openChat = (user: ChatUser) => setSelectedUser(user);
  const closeChat = () => setSelectedUser(null);

  return (
    <ChatContext.Provider value={{ selectedUser, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
