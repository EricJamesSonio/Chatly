// ✅ Home.tsx
import React from "react";
import Layout from "../layouts/Layout";
import "../css/Home.css";

const Home: React.FC = () => {
  return (
    <Layout showSidebar={true}>
      <div className="home-container">
        <div className="home-content">
          <h1>Welcome to Chatly ❤️</h1>
          <p>Connect with your friends and start chatting instantly.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
