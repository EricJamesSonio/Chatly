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

// Define the user type for chat users
interface ChatUser {
  id: number;
  name: string;
  profile_image?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = false }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [openChats, setOpenChats] = useState<number[]>([]);
  const { chatUsers } = useMessages();

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  const handleUserSelect = (userId: number) => {
    setOpenChats((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
  };

  const closeChat = (userId: number) => {
    setOpenChats((prev) => prev.filter((id) => id !== userId));
  };

  // Filter full user objects for open chats
  const selectedUsers: ChatUser[] = chatUsers.filter((u) => openChats.includes(u.id));

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

      {/* Chat modals */}
      <div
        className="chat-modals-container"
        style={{ right: isSidebarExpanded ? 330 : 70 }}
      >
        {selectedUsers.map((user: ChatUser, index: number) => (
          <ChatModal
            key={user.id}
            isOpen={true}
            onClose={() => closeChat(user.id)}
            user={user} // ✅ matches ChatModalProps
            style={{ bottom: 0, right: `${index * 360}px` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Layout;
