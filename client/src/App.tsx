import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Layout from "./layouts/Layout";
import { ThemeProvider } from "./context/ThemeContext";
import "./css/global.css";
import "./css/Text.css";
import { ChatProvider } from "./context/ChatContext";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ChatProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout showSidebar={true}><Home /></Layout>} />
            <Route path="/profile" element={<Layout showSidebar={true}><Profile /></Layout>} />
            <Route path="/friends" element={<Layout showSidebar={true}><div>Friends (Coming soon)</div></Layout>} />
            <Route path="/settings" element={<Layout showSidebar={true}><Settings /></Layout>} />
          </Routes>
        </Router>
      </ChatProvider>
    </ThemeProvider>
  );
};


export default App;
