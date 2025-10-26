import React from "react";
import SidebarChatUser from "./SidebarChatUser";
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
  const openChat = (userId: number) => {
    console.log("Open chat for user:", userId);
    // TODO: open modal later
  };

  return (
    <div className="chat-sidebar">
      {dummyUsers.map((u) => (
        <SidebarChatUser
          key={u.id}
          name={u.name}
          avatar={u.avatar}
          lastMessage={u.lastMessage}
          onClick={() => openChat(u.id)}
        />
      ))}
    </div>
  );
};

export default ChatSidebar;
