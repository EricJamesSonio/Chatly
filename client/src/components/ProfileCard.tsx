import React from "react";
import "../css/ProfileCard.css";

interface ProfileCardProps {
  name: string;
  profile_image: string;
  location: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  profile_image,
  location,
}) => {
  return (
    <div className="profile-header">
      {/* Cover Photo */}
      <div className="profile-cover"></div>

      {/* Profile Image */}
      <div className="profile-avatar">
        <img src={profile_image} alt={name} />
      </div>

      {/* User Basic Info */}
      <div className="profile-header-info">
        <h2>{name}</h2>
        <p className="profile-location">{location}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
