import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logoIcon from '../../assets/cubit-logo-icon-svg.svg'

export default function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleLinkClick = () => {
    setMenuOpen(false)
  }

  return (
    <header className="landing-header" id="landing-navbar">
      <div className="landing-nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={handleLinkClick}>
          <img src={logoIcon} alt="Cubit Logo" className="logo-icon" />
          <span className="logo-text"><span style={{ color: 'var(--brand-primary)' }}>C</span> U B I T</span>
        </Link>

        {/* Hamburger Menu Toggle (Mobile) */}
        <button 
          className={`nav-toggle ${menuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          id="nav-toggle-btn"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Navigation Links */}
        <nav className={`landing-nav-menu ${menuOpen ? 'open' : ''}`}>
          <div className="nav-links-wrapper">
            <a href="#features" className="nav-link" onClick={handleLinkClick}>Feature</a>
            <a href="#training" className="nav-link" onClick={handleLinkClick}>Training</a>
            <a href="#community" className="nav-link" onClick={handleLinkClick}>Community</a>
            <a href="#open-source" className="nav-link" onClick={handleLinkClick}>Open Source</a>
          </div>

          {/* Action Buttons */}
          <div className="nav-actions-wrapper">
            <Link to="/login" className="btn-nav-login" onClick={handleLinkClick}>Login</Link>
            <Link to="/signup" className="btn-nav-start" onClick={handleLinkClick}>Get Started</Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
