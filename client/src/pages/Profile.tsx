import React from "react";
import Layout from "../layouts/Layout";
import ProfileCard from "../components/ProfileCard";
import ProfileInfo from "../components/ProfileInfo";
import "../css/Profile.css";

const Profile: React.FC = () => {
  // Temporary mock user data (will later come from backend)
  const user = {
    name: "Eric James Sonio",
    birthdate: "2003-07-15",
    profile_image: "/assets/profile.jpg",
    location: "Cebu City, Philippines",
    hobbies: "Playing guitar, gaming, coding",
    talents: "Music arrangement, programming",
    facebook_url: "https://facebook.com/",
    tiktok_url: "https://tiktok.com/",
    instagram_url: "https://instagram.com/",
  };

  return (
    <Layout>
      <div className="profile-page">
        <ProfileCard
          name={user.name}
          profile_image={user.profile_image}
          location={user.location}
        />
        <ProfileInfo user={user} />
      </div>
    </Layout>
  );
};

export default Profile;
