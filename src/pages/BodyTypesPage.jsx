import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BodyTypeCard from '../components/BodyTypeCard';
import Footer from '../components/Footer';

// Data imports
import { bodyTypes } from '../data/bodyTypes';
import { cars } from '../data/cars';
import './Home.css';

function BodyTypesPage() {
  const navigate = useNavigate();

  const handleBodyTypeClick = (bodyTypeName) => {
    // Navigate back to home page and pass body type as query param
    navigate(`/?bodyType=${encodeURIComponent(bodyTypeName)}`);
  };

  return (
    <div className="bodytypes-page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. Header */}
      <Header />

      {/* 2. Page Hero with Video Background */}
      <div className="bodytypes-hero">
        <video 
          className="bodytypes-hero-video" 
          autoPlay 
          loop 
          muted 
          playsInline
          src="/video/home.mp4"
        >
          Your browser does not support the video tag.
        </video>
        <div className="bodytypes-hero-overlay"></div>

        <button className="bodytypes-back-btn" onClick={() => navigate('/')} title="Back to Home">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }} className="back-arrow-svg">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </button>
      </div>

      {/* 3. Body Types Grid */}
      <main style={{ flexGrow: 1 }} className="page-container">
        <div className="bodytypes-grid" style={{ margin: '0' }}>
          {bodyTypes.map((type) => {
            const getTargetFilterKey = (name) => {
              if (name === 'Limousine') return 'sedan';
              if (name === 'SUV Range') return 'suv';
              if (name === 'Cabriolets / Roadsters') return 'coupe';
              return name.toLowerCase();
            };

            const dynamicCount = cars.filter(car => {
              const targetKey = getTargetFilterKey(type.name);
              return car.bodyType.toLowerCase() === targetKey && !car.isUsed;
            }).length;

            return (
              <BodyTypeCard
                key={type.id}
                bodyType={type}
                dynamicCount={dynamicCount}
                onClick={handleBodyTypeClick}
              />
            );
          })}
        </div>
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}

export default BodyTypesPage;
