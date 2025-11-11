import React from "react";
import "../css/UserAvatar.css";

interface UserAvatarProps {
  avatar: string;
  isActive?: boolean;
  size?: number; // optional, for different sizes
  alt?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ avatar, isActive, size = 40, alt = "" }) => {
  return (
    <div className="user-avatar-wrapper" style={{ width: size, height: size }}>
      <img
        className="user-avatar-img"
        src={avatar}
        alt={alt}
        style={{ width: size, height: size }}
      />
      {isActive && <span className="active-indicator" />}
    </div>
  );
};

export default UserAvatar;
