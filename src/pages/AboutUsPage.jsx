import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Home.css';

function AboutUsPage() {
  const navigate = useNavigate();

  return (
    <div className="aboutus-page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. Header */}
      <Header />

      {/* 2. Page Hero */}
      <div className="page-hero">
        <button className="page-back-btn" onClick={() => navigate('/')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline' }}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </button>
        <h1>About Torque Talk</h1>
        <p>Learn more about India's leading luxury automotive discovery and research platform</p>
      </div>

      {/* 3. Detailed Info Cards */}
      <main style={{ flexGrow: 1 }} className="page-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
          
          <div className="why-us-card" style={{ flexDirection: 'column', textAlign: 'left', alignItems: 'flex-start', padding: '40px', width: '100%', gap: '20px' }}>
            <div className="why-us-icon-wrapper" style={{ margin: '0' }}>🎯</div>
            <h2 className="why-us-title" style={{ fontSize: '1.6rem' }}>Our Mission</h2>
            <p className="why-us-desc" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
              At Torque Talk, we aim to redefine the premium automotive research experience. We provide car enthusiasts and buyers with high-fidelity specs, real-world images, and intuitive tools to discover, compare, and select the finest luxury vehicles in the Indian market.
            </p>
          </div>

          <div className="why-us-card" style={{ flexDirection: 'column', textAlign: 'left', alignItems: 'flex-start', padding: '40px', width: '100%', gap: '20px' }}>
            <div className="why-us-icon-wrapper" style={{ margin: '0' }}>⚖️</div>
            <h2 className="why-us-title" style={{ fontSize: '1.6rem' }}>Premium Comparison Engine</h2>
            <p className="why-us-desc" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
              We believe in data-driven decisions. Our advanced comparison engine allows you to compare up to three luxury models side-by-side. View detailed metrics including prices, gearboxes, fuel efficiency, seating capacities, and safety ratings all in a single, clean matrix.
            </p>
          </div>

          <div className="why-us-card" style={{ flexDirection: 'column', textAlign: 'left', alignItems: 'flex-start', padding: '40px', width: '100%', gap: '20px' }}>
            <div className="why-us-icon-wrapper" style={{ margin: '0' }}>🔍</div>
            <h2 className="why-us-title" style={{ fontSize: '1.6rem' }}>Smart Luxury Discovery</h2>
            <p className="why-us-desc" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
              Discovering a dream car should be seamless. Our real-time search filters are optimized to handle queries instantly. Narrow down models by body style, precise luxury budget tiers, fuel preferences, and manufacturers without any lag.
            </p>
          </div>

        </div>
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}

export default AboutUsPage;
