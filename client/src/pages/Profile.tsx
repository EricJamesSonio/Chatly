import React, { useEffect, useState } from "react";
import Layout from "../layouts/Layout";
import ProfileCard from "../components/ProfileCard";
import ProfileInfo from "../components/ProfileInfo";
import "../css/Profile.css";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        // Step 1️⃣: Fetch account info to get user_id
        const accRes = await fetch(`http://localhost:5000/api/accounts/${accountId}`);
        if (!accRes.ok) throw new Error("Failed to fetch account data");
        const accountData = await accRes.json();

        // Step 2️⃣: Fetch the user profile using user_id
        const userId = accountData.user_id;
        const userRes = await fetch(`http://localhost:5000/api/users/${userId}`);
        if (!userRes.ok) throw new Error("Failed to fetch user profile");

        const userData = await userRes.json();

        // Step 3️⃣: Merge both account and user data
        setUser({
          ...userData,
          username: accountData.username,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return (
      <Layout>
        <p className="loading">Loading profile...</p>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <p className="error">❌ {error}</p>
      </Layout>
    );

  if (!user)
    return (
      <Layout>
        <p>No user found</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="profile-page">
        <ProfileCard
          name={user.name || user.username}
          profile_image={user.profile_image || "/assets/default-avatar.png"}
          cover_photo={user.cover_photo || "/assets/default-cover.jpg"}
          location={user.location || "No location specified"}
        />
        <ProfileInfo user={user} />
      </div>
    </Layout>
  );
};

export default Profile;
