import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BrandCard from '../components/BrandCard';
import Footer from '../components/Footer';

// Data imports
import { brands } from '../data/brands';
import './Home.css';

function BrandsPage() {
  const navigate = useNavigate();

  const handleBrandClick = (brandName) => {
    // Navigate back to home page and pass selected brand as query param
    navigate(`/?brand=${encodeURIComponent(brandName)}&mode=brand`);
  };

  return (
    <div className="brands-page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. Header */}
      <Header />

      {/* 2. Page Hero with Aston Martin Video Background */}
      <div className="brands-hero">
        <video 
          className="brands-hero-video" 
          autoPlay 
          loop 
          muted 
          playsInline
          src="/video/Aston martin.mp4"
        >
          Your browser does not support the video tag.
        </video>
        <div className="brands-hero-overlay"></div>

        {/* Back button with logo/arrow at top left */}
        <button className="brands-back-btn" onClick={() => navigate('/')} title="Back to Home">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }} className="back-arrow-svg">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </button>
      </div>

      {/* 3. Brands Grid Container */}
      <main style={{ flexGrow: 1 }} className="page-container">
        <div className="brands-grid" style={{ margin: '0' }}>
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onClick={handleBrandClick}
            />
          ))}
        </div>
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}

export default BrandsPage;
