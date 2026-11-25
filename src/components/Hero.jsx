import React from 'react';
import './Hero.css';

/* 
  Hero Component — simplified cinematic full-bleed banner
  Centres the main heading and the action button with 80% opacity.
  Utilizes the background video for a premium enthusiast showroom aesthetic.
*/
function Hero({ onScrollToCatalog }) {
  return (
    <section className="hero-section">
      {/* Background media */}
      <div className="hero-bg">
        <video
          src="/video/home.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="hero-bg-video"
          aria-hidden="true"
        />
        <div className="hero-bg-overlay" aria-hidden="true"></div>
      </div>



      <div className="hero-inner container">
        <div className="hero-copy">
          <div className="hero-actions">
            <button type="button" className="hero-cta-primary" onClick={onScrollToCatalog}>
              Explore Inventory
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
