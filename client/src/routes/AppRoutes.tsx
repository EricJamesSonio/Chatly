import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import FriendsPage from "../pages/FriendsPage";
import AuthPage from "../pages/AuthPage";
import Layout from "../layouts/Layout";
import FeedPage from "../pages/FeedPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <Layout showSidebar={false}>
            <AuthPage />
          </Layout>
        }
      />

      {/* Protected Routes */}
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
          <Layout showSidebar={false}>
            <Settings />
          </Layout>
        }
      />
          <Route
      path="/feed"
      element={
        <Layout showSidebar={true}>
          <FeedPage />
        </Layout>
      }
    />
    </Routes>
    
    
  );
};

export default AppRoutes;
