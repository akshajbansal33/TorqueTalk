import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useGarage } from '../context/GarageContext';
import GarageDrawer from './GarageDrawer';
import './Header.css';

/* 
  Header Component
  - Multi-page SPA navigation layout (Syllabus Module 1)
  - Clean, adaptive transparent glassmorphism with scroll detection
  - Bespoke automotive brand identity & vector emblem
  - Theme switching & user session management
*/
function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { compareCars } = useCompare();
  const { garageItems, openDrawer, toastNotification } = useGarage();

  // Toggle mobile navigation drawer
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll detection for transparent -> frosted header transition
  const [isScrolled, setIsScrolled] = useState(false);

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Current logged in user state (initialized lazily from storage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogoClick = (e) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`header-wrapper ${isHome ? 'is-home' : 'is-subpage'} ${isScrolled ? 'is-scrolled' : 'is-top'}`}>
      <div className="header-container container">
        {/* Brand Logo - High-End Automotive Speed Emblem */}
        <Link to="/" className="logo-link" onClick={handleLogoClick} aria-label="Torque Talk Home">
          <div className="logo-emblem">
            <svg 
              width="36" 
              height="36" 
              viewBox="0 0 36 36" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="logo-emblem-svg"
            >
              <defs>
                <linearGradient id="emblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              {/* Automotive hexagonal shield contour */}
              <path 
                d="M18 3L32 9.5V20C32 27.5 25.8 33 18 35C10.2 33 4 27.5 4 20V9.5L18 3Z" 
                fill="url(#emblemGrad)" 
                fillOpacity="0.14"
                stroke="url(#emblemGrad)" 
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              {/* Dynamic kinetic dual aerodynamic wings */}
              <path 
                d="M9 13.5L18 8L27 13.5L25 16.5L18 12.2L11 16.5L9 13.5Z" 
                fill="url(#emblemGrad)" 
              />
              <path 
                d="M11.5 19L18 15L24.5 19L23 21.5L18 18.2L13 21.5L11.5 19Z" 
                fill="url(#emblemGrad)" 
                fillOpacity="0.85"
              />
              {/* Velocity core blade */}
              <path 
                d="M15 24L18 22L21 24L19.8 26L18 24.8L16.2 26L15 24Z" 
                fill="#38bdf8" 
              />
              <circle cx="18" cy="29" r="1.5" fill="#38bdf8" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">TORQUE</span>
            <span className="brand-tag">TALK</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-links">
            <li>
              <NavLink 
                to="/new-cars" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                New Cars
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/brands" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Brands
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/body-types" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Body Types
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/budgets" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Budgets
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/about-us" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/compare" 
                className={({ isActive }) => `nav-link compare-nav-link ${isActive ? 'active' : ''}`}
              >
                Compare
                {compareCars.length > 0 && (
                  <span className="nav-compare-count">{compareCars.length}</span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/finance" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Finance
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Global Action items */}
        <div className="header-actions desktop-nav">
          {/* Luxury Garage Cart Trigger Button */}
          <button 
            type="button" 
            className="garage-trigger-btn" 
            onClick={openDrawer}
            aria-label="Open Luxury Garage"
            title="View Luxury Garage & Saved Allocations"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M7 17h10M7 13h10M7 9h10" />
            </svg>
            <span>Garage</span>
            {garageItems.length > 0 && (
              <span className="garage-badge-count">{garageItems.length}</span>
            )}
          </button>

          <button 
            type="button" 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
          
          {currentUser ? (
            <div className="user-profile-header">
              <span className="user-avatar-badge">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </span>
              <span className="user-name">Hi, {currentUser.name.split(' ')[0]}</span>
              <button type="button" className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button type="button" className="login-btn" onClick={() => navigate('/login')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Login</span>
            </button>
          )}
        </div>

        {/* Hamburger menu button for smaller screens */}
        <button 
          type="button" 
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`} 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Drawer (Clean frosted glass backdrop) */}
      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li>
            <NavLink 
              to="/new-cars" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              New Cars
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/brands" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Brands
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/body-types" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Body Types
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/budgets" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Budgets
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/about-us" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/compare" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Compare Matrix {compareCars.length > 0 && `(${compareCars.length})`}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/garage" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Luxury Garage {garageItems.length > 0 && `(${garageItems.length})`}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/finance" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Finance & EMI
            </NavLink>
          </li>
        </ul>

        <div className="mobile-actions">
          <button 
            type="button" 
            className="theme-toggle-btn-mobile" 
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <span>Light Mode</span>
              </>
            )}
          </button>
          
          {currentUser ? (
            <div className="mobile-user-profile">
              <span className="user-name-mobile">Signed in as {currentUser.name}</span>
              <button type="button" className="logout-btn-mobile" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              className="login-btn" 
              onClick={() => { setIsMenuOpen(false); navigate('/login'); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Slide-Over Luxury Garage Cart Drawer */}
      <GarageDrawer />

      {/* Global Toast Notification Banner */}
      {toastNotification && (
        <div className={`global-toast-banner toast-${toastNotification.type}`} role="status">
          <div className="toast-dot"></div>
          <span className="toast-msg">{toastNotification.message}</span>
        </div>
      )}
    </header>
  );
}

export default Header;
