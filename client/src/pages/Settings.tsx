import React from "react";
import Layout from "../layouts/Layout";
import ThemeSwitcher from "../components/ThemeSwitcher";
import "../css/Settings.css";

const Settings: React.FC = () => {
  return (
    <Layout showSidebar={false}>
      <div className="settings-page">
        <h1>⚙️ Settings</h1>
        <p>Change your theme below:</p>
        <ThemeSwitcher />
      </div>
    </Layout>
  );
};

export default Settings;
