import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ChatSidebar from "../components/ChatSidebar";
import ChatModal from "../components/ChatModal"; // ⬅ Add this import
import "../css/Layout.css";
import "../css/ChatSidebar.css";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const dummyUsers = [
  { id: 1, name: "Sophia" },
  { id: 2, name: "Mark" },
  { id: 3, name: "Ella" },
];

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = false }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleUserSelect = (userId: number) => {
    const user = dummyUsers.find((u) => u.id === userId);
    if (user) setSelectedUser(user);
  };

  const closeChat = () => setSelectedUser(null);

  return (
    <div className="layout-wrapper">
      <Navbar />

      {showSidebar && (
        <ChatSidebar
          isExpanded={isSidebarExpanded}
          onToggle={toggleSidebar}
          onUserSelect={handleUserSelect}
          activeUserId={selectedUser?.id || null}
        />
      )}

      <main
        className={`layout-content ${showSidebar ? "with-sidebar" : ""} ${
          isSidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"
        }`}
      >
        {children}
      </main>

      {/* ⬇ Render ChatModal OUTSIDE the sidebar */}
      {selectedUser && (
        <ChatModal
          isOpen={true}
          onClose={closeChat}
          userName={selectedUser.name}
        />
      )}
    </div>
  );
};

export default Layout;
