import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { ChatProvider } from "./context/ChatContext";
import { FriendsProvider } from "./context/FriendsContext";
import { MessagesProvider } from "./context/MessagesContext";
import { AuthProvider } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext"; // ✅ Import PostProvider
import AppRoutes from "./routes/AppRoutes";

import "./css/global.css";
import "./css/Text.css";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <FriendsProvider>
            <MessagesProvider>
              <PostProvider> {/* ✅ Wrap app with PostProvider */}
                <Router>
                  <AppRoutes />
                </Router>
              </PostProvider>
            </MessagesProvider>
          </FriendsProvider>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
