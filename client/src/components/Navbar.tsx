import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import "../css/Navbar.css";

const Navbar: React.FC = () => {
  return (
    <nav className="main-navbar">
      {/* Left Links */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/friends">Friends</Link>
        <Link to="/auth">Login / Signup</Link> {/* ✅ new link */}
         <Link to="/feed">NewFeed</Link> {/* ✅ new link */}
      </div>

      {/* Center Search */}
      <div className="nav-search">
        <SearchBar placeholder="Search..." />
      </div>

      {/* Right Profile Icon */}
      <div className="profile-icon">
        <Link to="/settings">
          <img src="/assets/icon.jpg" alt="icon" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
