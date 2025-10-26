import React from "react";
import Layout from "../layouts/Layout";
import ThemeSwitcher from "../components/ThemeSwitcher";

const Settings: React.FC = () => {
  return (
    <Layout showSearch={false}>
      <div className="settings-page">
        <h1>⚙️ Settings</h1>
        <p>Change your theme below:</p>
        <ThemeSwitcher />
      </div>
    </Layout>
  );
};

export default Settings;
