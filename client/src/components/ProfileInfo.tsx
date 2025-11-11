import React, { useState, useEffect } from "react";
import SocialLinks from "./SocialLink";
import "../css/ProfileInfo.css";

export interface User {
  id: number;
  name: string;
  birthdate: string;
  profile_image: string;
  cover_photo?: string;
  location: string;
  hobbies: string;
  talents: string;
  facebook_url?: string;
  tiktok_url?: string;
  instagram_url?: string;
}

interface Props {
  user: User;
  isEditing?: boolean; // controlled by parent
  onSave?: (updatedUser: User) => void;
}

const ProfileInfo: React.FC<Props> = ({ user, isEditing = false, onSave }) => {
  const [editData, setEditData] = useState<User>(user);

  // Sync editData whenever user changes
  useEffect(() => {
    setEditData(user);
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (onSave) onSave(editData);
  };

  return (
    <div className="profile-info">
      {isEditing ? (
        <>
          <h3>Edit Profile Information</h3>

          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleChange}
              placeholder="Name"
            />
          </div>

          <div className="form-group">
            <label>Birthdate:</label>
            <input
              type="date"
              name="birthdate"
              value={editData.birthdate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={editData.location}
              onChange={handleChange}
              placeholder="Location"
            />
          </div>

          <div className="form-group">
            <label>Hobbies:</label>
            <textarea
              name="hobbies"
              value={editData.hobbies}
              onChange={handleChange}
              placeholder="Hobbies"
            />
          </div>

          <div className="form-group">
            <label>Talents:</label>
            <textarea
              name="talents"
              value={editData.talents}
              onChange={handleChange}
              placeholder="Talents"
            />
          </div>

          <div className="form-group">
            <label>Facebook URL:</label>
            <input
              type="url"
              name="facebook_url"
              value={editData.facebook_url || ""}
              onChange={handleChange}
              placeholder="Facebook URL"
            />
          </div>

          <div className="form-group">
            <label>Instagram URL:</label>
            <input
              type="url"
              name="instagram_url"
              value={editData.instagram_url || ""}
              onChange={handleChange}
              placeholder="Instagram URL"
            />
          </div>

          <div className="form-group">
            <label>TikTok URL:</label>
            <input
              type="url"
              name="tiktok_url"
              value={editData.tiktok_url || ""}
              onChange={handleChange}
              placeholder="TikTok URL"
            />
          </div>

          <div className="button-group">
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <h3>About</h3>
          <p><strong>Birthdate:</strong> {user.birthdate}</p>
          <p><strong>Hobbies:</strong> {user.hobbies}</p>
          <p><strong>Talents:</strong> {user.talents}</p>
          <SocialLinks
            facebook={user.facebook_url}
            tiktok={user.tiktok_url}
            instagram={user.instagram_url}
          />
        </>
      )}
    </div>
  );
};

export default ProfileInfo;
