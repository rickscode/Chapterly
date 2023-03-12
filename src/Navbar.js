import React, { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">Logo</div>
      <ul className={`menu ${isMenuOpen ? 'open' : ''}`}>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
      <button className="toggle-menu-btn" onClick={toggleMenu}>
        <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
      </button>
    </nav>
  );
}

export default Navbar;
