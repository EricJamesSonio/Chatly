import React from "react";
import SocialLinks from "./SocialLink";
import "../css/ProfileInfo.css";

interface User {
  name: string;
  birthdate: string;
  profile_image: string;
  location: string;
  hobbies: string;
  talents: string;
  facebook_url?: string;
  tiktok_url?: string;
  instagram_url?: string;
}

const ProfileInfo: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="profile-info">
      <h3>About</h3>
      <p><strong>Birthdate:</strong> {user.birthdate}</p>
      <p><strong>Hobbies:</strong> {user.hobbies}</p>
      <p><strong>Talents:</strong> {user.talents}</p>
      <SocialLinks
        facebook={user.facebook_url}
        tiktok={user.tiktok_url}
        instagram={user.instagram_url}
      />
    </div>
  );
};

export default ProfileInfo;
