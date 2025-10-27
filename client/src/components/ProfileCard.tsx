import React from "react";
import "../css/ProfileCard.css";

interface ProfileCardProps {
  name: string;
  profile_image: string;
  cover_photo: string;
  location: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  profile_image,
  cover_photo,
  location,
}) => {
  return (
    <div className="profile-header">
      {/* ✅ Cover Photo */}
      <div
        className="profile-cover"
        style={{
          backgroundImage: `url(${cover_photo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Profile Image */}
      <div className="profile-avatar">
        <img src={profile_image} alt={name} />
      </div>

      {/* Basic Info */}
      <div className="profile-header-info">
        <h2>{name}</h2>
        <p className="profile-location">{location}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
