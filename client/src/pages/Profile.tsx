import React, { useEffect, useState } from "react";
import Layout from "../layouts/Layout";
import ProfileCard from "../components/ProfileCard";
import ProfileInfo, { type User } from "../components/ProfileInfo";
import "../css/Profile.css";

const API_URL = import.meta.env.VITE_API_URL;

interface UserWithUsername extends User {
  username?: string; // include username from account
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserWithUsername | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("chatly_user");
    if (!storedUser) {
      setError("No logged-in user found");
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    const accountId = parsedUser.id;

    const fetchUser = async () => {
      try {
        const accRes = await fetch(`${API_URL}/api/accounts/${accountId}`);
        if (!accRes.ok) throw new Error("Failed to fetch account data");
        const accountData = await accRes.json();

        const userRes = await fetch(`${API_URL}/api/users/${accountData.user_id}`);
        if (!userRes.ok) throw new Error("Failed to fetch user profile");
        const userData = await userRes.json();

        const combinedUser: UserWithUsername = { ...userData, username: accountData.username };
        setUser(combinedUser);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async (updatedUser: UserWithUsername) => {
    if (!user) return;

    try {
      const payload = { ...updatedUser };
      delete payload.username; // remove username for users table

      const res = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update user profile");

      setUser({ ...user, ...payload });
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <Layout><p className="loading">Loading profile...</p></Layout>;
  if (error) return <Layout><p className="error">❌ {error}</p></Layout>;
  if (!user) return <Layout><p>No user found</p></Layout>;

  return (
    <Layout>
      <div className="profile-page">
        <ProfileCard
          name={user.name || user.username || "Unknown"}
          profile_image={user.profile_image || "/assets/default-avatar.png"}
          cover_photo={user.cover_photo || "/assets/default-cover.jpg"}
          location={user.location || "No location specified"}
        />

        <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>

        <ProfileInfo user={user} isEditing={isEditing} onSave={handleSave} />
      </div>
    </Layout>
  );
};

export default Profile;
