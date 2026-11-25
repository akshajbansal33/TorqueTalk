import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import CarGrid from '../components/CarGrid';
import CompareBar from '../components/CompareBar';
import Footer from '../components/Footer';
import { useCompare } from '../context/CompareContext';

// Data imports
import { cars } from '../data/cars';

// Hook and utility imports
import { useCarFilter } from '../hooks/useCarFilter';
import { formatIndianPrice } from '../components/CarCard';
import './Home.css';

function NewCarsPage() {
  const navigate = useNavigate();


  // 1. Invoke custom search/filter hook
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    filters,
    handleFilterChange,
    resetFilters,
    filteredCars,
    searchMode,
    setSearchMode
  } = useCarFilter(cars);

  // 2. Comparison global state from CompareContext
  const { compareCars, toggleCompare, removeFromCompare, clearCompare } = useCompare();

  // 3. Detail modal visibility states
  const [selectedCarDetails, setSelectedCarDetails] = useState(null);

  // Toggle adding / removing cars in compare array
  const handleCompareToggle = (car) => {
    toggleCompare(car);
  };

  const handleCompareRemove = (car) => {
    removeFromCompare(car.id);
  };

  const handleClearAllCompare = () => {
    clearCompare();
  };

  const handleViewDetails = (car) => {
    navigate(`/car/${car.id}`);
  };

  const handleCloseDetails = () => {
    setSelectedCarDetails(null);
  };

  const isCarCompared = (carId) => compareCars.some((item) => item.id === carId);

  // Filter only new cars for this page
  const newCars = filteredCars.filter((car) => !car.isUsed);

  return (
    <div className="newcars-page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. Header (Sticky navigation) */}
      <Header />

      {/* 2. Page Hero Banner with Background Video */}
      <div className="newcars-hero">
        <video 
          className="newcars-hero-video" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source 
            src="/new_car_video.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        <div className="newcars-hero-overlay"></div>

        {/* Back button with logo at top left */}
        <button className="newcars-back-btn" onClick={() => navigate('/')} title="Back to Home">
          <svg className="back-arrow-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span className="back-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </span>
          <span>Back to Home</span>
        </button>

        {/* Find your right car box positioned on the right */}
        <div className="newcars-hero-search-container">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            handleFilterChange={handleFilterChange}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchMode={searchMode}
            setSearchMode={setSearchMode}
            onSearchSubmit={() => {
              const element = document.getElementById('newcars-catalog-start');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          />
        </div>
      </div>

      <main style={{ flexGrow: 1 }} id="newcars-catalog-start">
        {/* 4. Filtered Cars Grid */}
        <CarGrid
          cars={newCars}
          compareCars={compareCars}
          onCompareToggle={handleCompareToggle}
          onViewDetails={handleViewDetails}
          onResetFilters={resetFilters}
        />
      </main>

      {/* 5. Compare Drawer Bar */}
      <CompareBar
        compareCars={compareCars}
        onRemove={handleCompareRemove}
        onClearAll={handleClearAllCompare}
      />

      {/* 6. Footer */}
      <Footer />

      {/* 7. Specifications Detail Modal overlay */}
      {selectedCarDetails && (
        <div className="details-modal-overlay" onClick={handleCloseDetails}>
          <div 
            className="details-modal-box" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="details-modal-header">
              <h3>Vehicle Specifications Sheet</h3>
              <button 
                type="button" 
                className="btn-details-close" 
                onClick={handleCloseDetails}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Details Grid */}
            <div className="details-modal-body">
              <img 
                src={selectedCarDetails.image} 
                alt={selectedCarDetails.name} 
                className="details-modal-img" 
              />
              <div className="details-info-wrap">
                <div className="details-meta-header">
                  <span className="details-brand">{selectedCarDetails.brand}</span>
                  <h2 className="details-name">{selectedCarDetails.name}</h2>
                  <div className="details-price">
                    {formatIndianPrice(selectedCarDetails.price)}
                  </div>
                </div>

                <table className="details-specs-table">
                  <tbody>
                    <tr>
                      <th>Fuel Type</th>
                      <td>{selectedCarDetails.fuel}</td>
                    </tr>
                    <tr>
                      <th>Gearbox</th>
                      <td>{selectedCarDetails.transmission}</td>
                    </tr>
                    <tr>
                      <th>Body Style</th>
                      <td>{selectedCarDetails.bodyType}</td>
                    </tr>
                    <tr>
                      <th>Mileage Rating</th>
                      <td>{selectedCarDetails.mileage}</td>
                    </tr>
                    <tr>
                      <th>Seating</th>
                      <td>{selectedCarDetails.seating} Seater</td>
                    </tr>
                    <tr>
                      <th>Safety Rating</th>
                      <td>⭐ {selectedCarDetails.rating} / 5.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="details-modal-footer">
              <button 
                type="button" 
                className={`btn-details-compare ${isCarCompared(selectedCarDetails.id) ? 'active' : ''}`}
                onClick={() => {
                  handleCompareToggle(selectedCarDetails);
                }}
              >
                {isCarCompared(selectedCarDetails.id) ? 'Added to Compare ✓' : 'Add to Compare'}
              </button>
              <button 
                type="button" 
                className="btn-reset-filters" 
                style={{ backgroundColor: 'var(--dark-900)' }} 
                onClick={handleCloseDetails}
              >
                Close Spec Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewCarsPage;
