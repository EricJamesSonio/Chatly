import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import FriendsPage from "./pages/FriendsPage";
import Layout from "./layouts/Layout";
import AuthPage from "./pages/AuthPage";
import { ThemeProvider } from "./context/ThemeContext";
import { ChatProvider } from "./context/ChatContext";
import { FriendsProvider } from "./context/FriendsContext";
import { AuthProvider } from "./context/AuthContext"; // ✅ import this
import "./css/global.css";
import "./css/Text.css";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider> {/* ✅ Add this wrapper */}
        <ChatProvider>
          <FriendsProvider>
            <Router>
              <Routes>

                <Route
                  path="/auth"
                  element={
                    <Layout showSidebar={false}>
                      <AuthPage />
                    </Layout>
                  }
                />
                {/* Protected routes */}
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
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
