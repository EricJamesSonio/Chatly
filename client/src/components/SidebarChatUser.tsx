import React from "react";
import UserAvatar from "./UserAvatar";
import "../css/SidebarChatUser.css";

interface SidebarChatUserProps {
  name: string;
  avatar: string;
  lastMessage: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarChatUser: React.FC<SidebarChatUserProps> = ({
  name,
  avatar,
  lastMessage,
  isActive,
  onClick,
}) => {
  return (
    <div
      className={`sidebar-chat-user ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <UserAvatar avatar={avatar} isActive={isActive} size={50} />
      <div className="user-info">
        <h4>{name}</h4>
        <p>{lastMessage}</p>
      </div>
    </div>
  );
};

export default SidebarChatUser;
