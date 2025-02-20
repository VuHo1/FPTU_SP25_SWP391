import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faCalendarCheck, faEnvelope, faShoppingBag, faShoppingCart, faSignInAlt, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import './Header.css'; // Import the CSS file

const Header = ({ darkMode, toggleDarkMode }) => {


    return (
        <header className={`header ${darkMode ? 'dark' : ''}`}>
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
                <Link to="/cart_page" className="link">
                    <FontAwesomeIcon icon={faShoppingCart} /> Cart
                </Link>
                <Link to="/sign_in" className="link">
                    <FontAwesomeIcon icon={faSignInAlt} /> Sign In
                </Link>
                <button className="theme-toggle" onClick={toggleDarkMode}>
                    <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                </button>
            </nav>
        </header>
    );
};

export default Header;
