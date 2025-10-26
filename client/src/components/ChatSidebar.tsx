import React, { useState } from "react";
import SidebarChatUser from "./SidebarChatUser";
import ChatModal from "./ChatModal";
import "../css/ChatSidebar.css";

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

const ChatSidebar: React.FC = () => {
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
    <>
      <div className="chat-sidebar">
        {dummyUsers.map((u) => (
          <SidebarChatUser
            key={u.id}
            name={u.name}
            avatar={u.avatar}
            lastMessage={u.lastMessage}
            onClick={() => openChat(u.id)}
            isActive={selectedUser?.id === u.id}
          />
        ))}
      </div>

      {selectedUser && (
        <ChatModal
          isOpen={true}
          onClose={closeChat}
          userName={selectedUser.name}
        />
      )}
    </>
  );
};

export default ChatSidebar;
