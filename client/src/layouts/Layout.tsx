import React from "react";
import Navbar from "../components/Navbar";
import ChatSidebar from "../components/ChatSidebar";
import "../css/Layout.css";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = false }) => {
  return (
    <div className="layout-wrapper">
      <Navbar />

      <div className="layout-body">
        {showSidebar && (
          <aside className="layout-sidebar">
            <ChatSidebar />
          </aside>
        )}

        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
