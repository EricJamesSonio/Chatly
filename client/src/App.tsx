import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Layout from "./layouts/Layout";
import { ThemeProvider } from "./context/ThemeContext";
import "./css/global.css";
import "./css/Text.css";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout showSidebar={true}><Home /></Layout>} />
          <Route path="/profile" element={<Layout showSidebar={true}><Profile /></Layout>} />
          <Route path="/friends" element={<Layout showSidebar={true}><div>Friends (Coming soon)</div></Layout>} />
          <Route path="/settings" element={<Layout showSidebar={true}><Settings /></Layout>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
