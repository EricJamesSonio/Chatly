import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ChatSidebar from "../components/ChatSidebar";
import ChatModal from "../components/ChatModal";
import { useMessages } from "../context/MessagesContext";
import "../css/Layout.css";
import "../css/ChatSidebar.css";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = false }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [openChats, setOpenChats] = useState<number[]>([]);
  const { chatUsers } = useMessages();

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  const handleUserSelect = (userId: number) => {
    setOpenChats((prev) => {
      if (!prev.includes(userId)) return [...prev, userId];
      return prev;
    });
  };

  const closeChat = (userId: number) => {
    setOpenChats((prev) => prev.filter((id) => id !== userId));
  };

  // Get full user objects for open chats
  const selectedUsers = chatUsers.filter((u) => openChats.includes(u.id));

  return (
    <div className="layout-wrapper">
      <Navbar />

      {showSidebar && (
        <ChatSidebar
          isExpanded={isSidebarExpanded}
          onToggle={toggleSidebar}
          onUserSelect={handleUserSelect}
          activeUserId={openChats[openChats.length - 1] || null}
        />
      )}

      <main
        className={`layout-content ${showSidebar ? "with-sidebar" : ""} ${
          isSidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"
        }`}
      >
        {children}
      </main>

      {/* Multiple chat modals */}
      <div
        className="chat-modals-container"
        style={{
          right: isSidebarExpanded ? 330 : 70,
        }}
      >
        {selectedUsers.map((user, index) => (
          <ChatModal
            key={user.id}
            isOpen={true}
            onClose={() => closeChat(user.id)}
            user={user} // ✅ pass full user object
            style={{ bottom: 0, right: `${index * 360}px` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Layout;
