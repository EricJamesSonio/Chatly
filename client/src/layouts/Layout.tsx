import React from "react";
import Navbar from "../components/Navbar";
import ChatSidebar from "../components/ChatSidebar";
import "../css/Layout.css";
import "../css/ChatSidebar.css";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = false }) => {
  return (
    <div className="layout-wrapper">
      <Navbar />

      {/* Sidebar FLOATS on the right — not in the content flow */}
      {showSidebar && <ChatSidebar />}

      {/* Main body content */}
      <main className="layout-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
