import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ChatSidebar from "../components/ChatSidebar";
import "../css/Layout.css";
import "../css/ChatSidebar.css";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = false }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="layout-wrapper">
      <Navbar />

      {/* Sidebar with toggle state */}
      {showSidebar && (
        <ChatSidebar 
          isExpanded={isSidebarExpanded} 
          onToggle={toggleSidebar} 
        />
      )}

      {/* Main content area */}
      <main className={`layout-content ${showSidebar ? 'with-sidebar' : ''} ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
