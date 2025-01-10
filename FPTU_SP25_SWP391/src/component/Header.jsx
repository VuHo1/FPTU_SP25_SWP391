import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header style={styles.header}>
            <nav style={styles.nav}>
                <Link to="/" style={styles.link}>Home</Link>
                <Link to="/about" style={styles.link}>About</Link>
                <Link to="/booking_page" style={styles.link}>Booking</Link>
                <Link to="/contact" style={styles.link}>Contact</Link>
                <Link to="/products" style={styles.link}>Products</Link>
                <Link to="/cart_page" style={styles.link}>Cart</Link>
            </nav>
        </header>
    );
};

const styles = {
    header: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'blue',
        padding: '10px 20px'


    },
    nav: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '18px',
    },
};

export default Header;
