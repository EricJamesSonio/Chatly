import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import FriendsPage from "./pages/FriendsPage";
import Layout from "./layouts/Layout";
import { ThemeProvider } from "./context/ThemeContext";
import { ChatProvider } from "./context/ChatContext";
import { FriendsProvider } from "./context/FriendsContext"; // ✅ new import
import "./css/global.css";
import "./css/Text.css";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ChatProvider>
        <FriendsProvider>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout showSidebar={true}>
                    <Home />
                  </Layout>
                }
              />
              <Route
                path="/profile"
                element={
                  <Layout showSidebar={true}>
                    <Profile />
                  </Layout>
                }
              />
              <Route
                path="/friends"
                element={
                  <Layout showSidebar={true}>
                    <FriendsPage />
                  </Layout>
                }
              />
              <Route
                path="/settings"
                element={
                  <Layout showSidebar={true}>
                    <Settings />
                  </Layout>
                }
              />
            </Routes>
          </Router>
        </FriendsProvider>
      </ChatProvider>
    </ThemeProvider>
  );
};

export default App;
