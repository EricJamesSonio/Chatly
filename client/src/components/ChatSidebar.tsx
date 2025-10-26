import React, { useState } from "react";
import SidebarChatUser from "./SidebarChatUser";
import ChatModal from "./ChatModal";
import "../css/ChatSidebar.css";

interface ChatSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const dummyUsers = [
  {
    id: 1,
    name: "Sophia",
    avatar: "/assets/avatar1.jpg",
    lastMessage: "Hey! Are you free later?",
  },
  {
    id: 2,
    name: "Mark",
    avatar: "/assets/avatar2.jpg",
    lastMessage: "I'll send the file!",
  },
  {
    id: 3,
    name: "Ella",
    avatar: "/assets/avatar3.jpg",
    lastMessage: "Okay, thanks!",
  },
];

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isExpanded, onToggle }) => {
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const openChat = (userId: number) => {
    const user = dummyUsers.find((u) => u.id === userId);
    if (user) setSelectedUser(user);
  };

  const closeChat = () => {
    setSelectedUser(null);
  };

  return (
    <div className={`chat-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="sidebar-toggle" onClick={onToggle}>
        {isExpanded ? '◀' : '☰'}
      </button>
      <div className="chat-list">
        {dummyUsers.map((u) => (
          <div 
            key={u.id} 
            className={`chat-user ${selectedUser?.id === u.id ? 'active' : ''}`}
            onClick={() => openChat(u.id)}
          >
            <img 
              className="chat-avatar" 
              src={u.avatar} 
              alt={u.name} 
              title={u.name} 
            />
            <div className="chat-user-info">
              <div className="chat-name">{u.name}</div>
              <div className="chat-last">{u.lastMessage}</div>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <ChatModal
          isOpen={true}
          onClose={closeChat}
          userName={selectedUser.name}
        />
      )}
    </div>
  );
};

export default ChatSidebar;
