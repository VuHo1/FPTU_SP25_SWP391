// Header.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfoCircle,
  faCalendarCheck,
  faEnvelope,
  faShoppingBag,
  faShoppingCart,
  faSignInAlt,
  faMoon,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import { useAuth } from "../page/AuthContext";

const Header = ({ darkMode, toggleDarkMode }) => {
  const { isLoggedIn, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/sign_in");
    setIsDropdownOpen(false);
  };

  return (
    <header className={`header ${darkMode ? "dark" : ""}`}>
      <nav className="nav">
        <Link to="/" className="link">
          <FontAwesomeIcon icon={faHome} /> Home
        </Link>
        <Link to="/about" className="link">
          <FontAwesomeIcon icon={faInfoCircle} /> About
        </Link>
        <Link to="/booking_page" className="link">
          <FontAwesomeIcon icon={faCalendarCheck} /> Booking
        </Link>
        <Link to="/contact" className="link">
          <FontAwesomeIcon icon={faEnvelope} /> Contact
        </Link>
        <Link to="/service" className="link">
          <FontAwesomeIcon icon={faShoppingBag} /> Service
        </Link>
        {isLoggedIn && (
          <Link to="/cart_page" className="link">
            <FontAwesomeIcon icon={faShoppingCart} /> Cart
          </Link>
        )}
        {isLoggedIn ? (
          <div 
            className="user-profile"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="user-icon">
              <FontAwesomeIcon icon={faUser} />
            </button>
            <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
              <Link 
                to="/profile" 
                className="dropdown-item" 
                onClick={() => setIsDropdownOpen(false)}
              >
                User Profile
              </Link>
              <Link 
                to="/edit-profile" 
                className="dropdown-item" 
                onClick={() => setIsDropdownOpen(false)}
              >
                Edit Profile
              </Link>
              <button 
                className="dropdown-item logout-btn" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <Link to="/sign_in" className="link">
            <FontAwesomeIcon icon={faSignInAlt} /> Sign In
          </Link>
        )}
        <button className="theme-toggle" onClick={toggleDarkMode}>
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </button>
      </nav>
    </header>
  );
};

export default Header;