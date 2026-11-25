import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CompareBar from '../components/CompareBar';
import CarCard, { formatIndianPrice } from '../components/CarCard';
import { cars } from '../data/cars';
import { getCarSpecifications } from '../data/carSpecifications';
import { useCompare } from '../context/CompareContext';
import { useGarage } from '../context/GarageContext';
import { useUserPreferencesStore } from '../store/userPreferencesStore';
import './CarDetailPage.css';

/* 
  CarDetailPage Component (Syllabus Modules 1 & 4)
  - Dynamic Routing (/car/:id) with React Router useParams
  - Interactive Tabbed Specifications Engine (Performance, Dimensions, Highlights, Colors, Warranty)
  - 100% Authentic Original Manufacturer Data from Official Specification Sheets
  - Interactive Exterior Color Palette Swatch Selector
  - Responsive Cinematic Dark-Luxury Glassmorphism UI
*/
function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find car corresponding to the route parameter
  const car = cars.find((item) => String(item.id) === String(id));
  const specs = getCarSpecifications(car);
  const { toggleCompare, isCarCompared } = useCompare();
  const { addToGarage, isInGarage } = useGarage();
  const addRecentlyViewed = useUserPreferencesStore((s) => s.addRecentlyViewed);

  // Component UI State
  const [activeTab, setActiveTab] = useState('performance');
  const [colorSelections, setColorSelections] = useState({});
  const [isCopied, setIsCopied] = useState(false);
  const isCompared = car ? isCarCompared(car.id) : false;
  const inGarage = car ? isInGarage(car.id) : false;

  // Derived selected color for currently viewed car
  const selectedColor = colorSelections[id] || (specs?.colors?.[0]?.name ?? '');

  // Reset scroll and track recently viewed car in Zustand store
  useEffect(() => {
    window.scrollTo(0, 0);
    if (car) {
      addRecentlyViewed(car);
    }
  }, [id, car, addRecentlyViewed]);

  const handleSelectColor = (colorName) => {
    setColorSelections((prev) => ({ ...prev, [id]: colorName }));
  };

  // Handle share / copy link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // If vehicle is not found in database
  if (!car) {
    return (
      <div className="car-detail-page-wrapper">
        <Header />
        <main className="car-not-found-container container">
          <div className="not-found-card">
            <div className="not-found-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2>Vehicle Not Found</h2>
            <p>The vehicle you are looking for does not exist in our catalog or may have been removed.</p>
            <button 
              type="button" 
              className="btn-back-catalog" 
              onClick={() => navigate('/new-cars')}
            >
              Browse All Cars
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Related cars (same brand or same bodyType, excluding current car)
  const relatedCars = cars
    .filter((c) => c.id !== car.id && (c.brand === car.brand || c.bodyType === car.bodyType))
    .slice(0, 3);

  return (
    <div className="car-detail-page-wrapper">
      <Header />

      <main className="car-detail-main">
        <div className="container">
          {/* 1. Breadcrumbs & Back Navigation */}
          <div className="detail-navigation-bar">
            <button 
              type="button" 
              className="btn-detail-back" 
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back</span>
            </button>

            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link to="/" className="breadcrumb-item">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to="/new-cars" className="breadcrumb-item">Inventory</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to="/brands" className="breadcrumb-item">{car.brand}</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">{car.name}</span>
            </nav>
          </div>

          {/* 2. Main Vehicle Showcase */}
          <section className="car-showcase-section">
            <div className="showcase-grid">
              
              {/* Left Column: Media Gallery & Top Benchmarks */}
              <div className="showcase-media-column">
                <div className="showcase-image-wrapper">
                  <img 
                    src={car.image} 
                    alt={`${car.brand} ${car.name}`} 
                    className="showcase-image" 
                  />
                  
                  {/* Badges Overlay */}
                  <div className="showcase-badges-top">
                    <span className={`car-badge ${car.isUsed ? 'car-badge-used' : 'car-badge-new'}`}>
                      {car.isUsed ? 'Certified Pre-Owned' : 'Brand New'}
                    </span>
                    <div className="car-rating-badge">
                      <span className="rating-star">★</span>
                      <span>{car.rating} Verified Rating</span>
                    </div>
                  </div>

                  {car.isUsed && car.odometer && (
                    <div className="showcase-odometer-tag">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 16 14" />
                      </svg>
                      <span>{car.odometer} Verified Odometer</span>
                    </div>
                  )}
                </div>

                {/* Key Benchmark Stat Strip */}
                {specs && (
                  <div className="benchmark-stat-strip">
                    <div className="stat-pill">
                      <span className="stat-label">0-100 km/h</span>
                      <strong className="stat-value text-accent">{specs.acceleration.split(' ')[0]}s</strong>
                    </div>
                    <div className="stat-pill">
                      <span className="stat-label">Top Speed</span>
                      <strong className="stat-value">{specs.topSpeed.split(' ')[0]} km/h</strong>
                    </div>
                    <div className="stat-pill">
                      <span className="stat-label">Max Power</span>
                      <strong className="stat-value">{specs.power.split(' ')[0]} bhp</strong>
                    </div>
                    <div className="stat-pill">
                      <span className="stat-label">Peak Torque</span>
                      <strong className="stat-value">{specs.torque.split(' ')[0]} Nm</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Vehicle Details & Purchasing Actions */}
              <div className="showcase-details-column">
                <div className="details-header">
                  <div className="brand-category-pill">{car.brand} Official Spec</div>
                  <h1 className="vehicle-title">{car.name}</h1>
                  <p className="vehicle-tagline">
                    {specs ? specs.overview : "Engineered for uncompromising luxury and exceptional grand touring dynamics."}
                  </p>
                </div>

                {/* Price Display Card */}
                <div className="detail-price-card">
                  <div className="price-header">
                    <span className="price-label">Ex-Showroom Price</span>
                    <span className="price-value">{formatIndianPrice(car.price)}</span>
                  </div>
                  <p className="price-subtext">
                    *Official ex-showroom price for {car.brand} India. Quotation includes standard manufacturer factory warranty. Optional carbon packages, bespoke interior upholstery, and state registration may vary.
                  </p>
                </div>

                {/* Quick Key Specs 4-Card Grid */}
                <div className="key-specs-grid">
                  <div className="spec-card">
                    <div className="spec-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div className="spec-info">
                      <span className="spec-title">Powertrain</span>
                      <strong className="spec-data">{car.fuel}</strong>
                    </div>
                  </div>

                  <div className="spec-card">
                    <div className="spec-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 14 14" />
                      </svg>
                    </div>
                    <div className="spec-info">
                      <span className="spec-title">Efficiency / Range</span>
                      <strong className="spec-data">{car.mileage}</strong>
                    </div>
                  </div>

                  <div className="spec-card">
                    <div className="spec-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    </div>
                    <div className="spec-info">
                      <span className="spec-title">Transmission</span>
                      <strong className="spec-data">{car.transmission}</strong>
                    </div>
                  </div>

                  <div className="spec-card">
                    <div className="spec-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className="spec-info">
                      <span className="spec-title">Seating Capacity</span>
                      <strong className="spec-data">{car.seating} Seats</strong>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="detail-actions-group">
                  <button 
                    type="button" 
                    className={`btn-reserve-garage ${inGarage ? 'active' : ''}`}
                    onClick={() => addToGarage(car, { color: selectedColor })}
                    title="Reserve allocation or add to Luxury Garage"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M7 17h10M7 13h10M7 9h10" />
                    </svg>
                    <span>{inGarage ? '✓ In Garage (Configure)' : 'Reserve Allocation'}</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn-book-testdrive" 
                    onClick={() => navigate(`/book-test-drive?carId=${car.id}`)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>Schedule Test Drive</span>
                  </button>

                  <button 
                    type="button" 
                    className={`btn-detail-compare ${isCompared ? 'active' : ''}`}
                    onClick={() => toggleCompare(car)}
                  >
                    {isCompared ? '✓ Added to Compare' : '+ Add to Compare'}
                  </button>

                  <button 
                    type="button" 
                    className="btn-detail-finance"
                    onClick={() => navigate(`/finance?carId=${car.id}`)}
                    title="Calculate EMI & Financing Terms"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                    <span>Calculate EMI</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn-detail-share"
                    onClick={handleShare}
                    title="Share link"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Interactive Specifications Console with Tabs (Syllabus Module 4) */}
          {specs && (
            <section className="technical-specs-console">
              <div className="console-header">
                <h2>Manufacturer Technical Dossier</h2>
                <p>Authentic engineering data and verified benchmarks directly from {car.brand}</p>
              </div>

              {/* Navigation Tabs Bar */}
              <div className="spec-tabs-bar" role="tablist">
                <button 
                  type="button" 
                  role="tab" 
                  aria-selected={activeTab === 'performance'}
                  className={`spec-tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('performance')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <span>Performance & Powertrain</span>
                </button>

                <button 
                  type="button" 
                  role="tab" 
                  aria-selected={activeTab === 'dimensions'}
                  className={`spec-tab-btn ${activeTab === 'dimensions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dimensions')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                  <span>Chassis & Dimensions</span>
                </button>

                <button 
                  type="button" 
                  role="tab" 
                  aria-selected={activeTab === 'highlights'}
                  className={`spec-tab-btn ${activeTab === 'highlights' ? 'active' : ''}`}
                  onClick={() => setActiveTab('highlights')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>Signature Highlights</span>
                </button>

                <button 
                  type="button" 
                  role="tab" 
                  aria-selected={activeTab === 'colors'}
                  className={`spec-tab-btn ${activeTab === 'colors' ? 'active' : ''}`}
                  onClick={() => setActiveTab('colors')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                  <span>Color Palette</span>
                </button>

                <button 
                  type="button" 
                  role="tab" 
                  aria-selected={activeTab === 'warranty'}
                  className={`spec-tab-btn ${activeTab === 'warranty' ? 'active' : ''}`}
                  onClick={() => setActiveTab('warranty')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Warranty & Certification</span>
                </button>
              </div>

              {/* Tab Contents Panels */}
              <div className="spec-tab-panel">
                
                {/* 1. Performance Tab */}
                {activeTab === 'performance' && (
                  <div className="tab-pane-content">
                    <div className="spec-dossier-grid">
                      <div className="dossier-item">
                        <span className="dossier-label">Engine Configuration</span>
                        <strong className="dossier-value">{specs.engine}</strong>
                      </div>
                      <div className="dossier-item">
                        <span className="dossier-label">Maximum Power Output</span>
                        <strong className="dossier-value highlight-power">{specs.power}</strong>
                      </div>
                      <div className="dossier-item">
                        <span className="dossier-label">Peak Torque</span>
                        <strong className="dossier-value">{specs.torque}</strong>
                      </div>
                      <div className="dossier-item">
                        <span className="dossier-label">0-100 km/h Acceleration</span>
                        <strong className="dossier-value highlight-sprint">{specs.acceleration}</strong>
                      </div>
                      <div className="dossier-item">
                        <span className="dossier-label">Top Speed (V-Max)</span>
                        <strong className="dossier-value">{specs.topSpeed}</strong>
                      </div>
                      <div className="dossier-item">
                        <span className="dossier-label">Drivetrain & Differential</span>
                        <strong className="dossier-value">{specs.drivetrain}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Dimensions Tab */}
                {activeTab === 'dimensions' && (
                  <div className="tab-pane-content">
                    <div className="spec-dossier-grid">
                      <div className="dossier-item">
                        <span className="dossier-label">Fuel Tank / Battery Capacity</span>
                        <strong className="dossier-value">{specs.fuelCapacity}</strong>
                      </div>
                      <div className="dossier-item">
                        <span className="dossier-label">Cargo / Boot Capacity</span>
                        <strong className="dossier-value">{specs.bootSpace}</strong>
                      </div>
                      <div className="dossier-item">
                        <span className="dossier-label">Ground Clearance</span>
                        <strong className="dossier-value">{specs.groundClearance}</strong>
                      </div>
                      <div className="dossier-item">
                        <span className="dossier-label">Kerb Weight</span>
                        <strong className="dossier-value">{specs.kerbWeight}</strong>
                      </div>
                      <div className="dossier-item">
                        <span className="dossier-label">Passenger Seating Capacity</span>
                        <strong className="dossier-value">{car.seating} Occupants</strong>
                      </div>
                      <div className="dossier-item">
                        <span className="dossier-label">Body Architecture</span>
                        <strong className="dossier-value">{car.bodyType}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Signature Highlights Tab */}
                {activeTab === 'highlights' && (
                  <div className="tab-pane-content">
                    <ul className="highlights-feature-list">
                      {specs.highlights.map((item, idx) => (
                        <li key={idx} className="highlight-feature-card">
                          <span className="highlight-check-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span className="highlight-feature-text">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 4. Color Palette Tab */}
                {activeTab === 'colors' && (
                  <div className="tab-pane-content">
                    <div className="color-palette-container">
                      <div className="palette-info-bar">
                        <span className="palette-title">Official Factory Finishes:</span>
                        <span className="palette-selected-name">
                          Selected: <strong>{selectedColor || specs.colors[0]?.name}</strong>
                        </span>
                      </div>

                      <div className="swatch-picker-row">
                        {specs.colors.map((colorItem, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`color-swatch-btn ${selectedColor === colorItem.name ? 'active' : ''}`}
                            onClick={() => handleSelectColor(colorItem.name)}
                            title={colorItem.name}
                            aria-label={colorItem.name}
                          >
                            <span 
                              className="color-swatch-circle" 
                              style={{ backgroundColor: colorItem.hex }}
                            />
                            <span className="color-swatch-label">{colorItem.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Warranty & Certification Tab */}
                {activeTab === 'warranty' && (
                  <div className="tab-pane-content">
                    <div className="warranty-grid">
                      <div className="warranty-card">
                        <div className="warranty-card-badge">Official Coverage</div>
                        <h3>Manufacturer Warranty</h3>
                        <p className="warranty-highlight">{specs.warranty}</p>
                        <p className="warranty-desc">
                          Includes standard manufacturer factory warranty, complimentary roadside assistance, and authorized service network support across India.
                        </p>
                      </div>

                      <div className="warranty-card">
                        <div className="warranty-card-badge">Torque Talk Assurance</div>
                        <h3>160-Point Multi-Check Inspection</h3>
                        <p className="warranty-highlight">Certified Clear Title Guarantee</p>
                        <p className="warranty-desc">
                          Every vehicle listed is thoroughly verified through original chassis telemetry, maintenance history, zero accidental structure damage, and authentic odometer certification.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </section>
          )}

          {/* 4. Similar / Related Cars Recommendation Section */}
          {relatedCars.length > 0 && (
            <section className="related-cars-section">
              <div className="section-header-compact">
                <h2>Similar Discovery Vehicles</h2>
                <p>Explore other {car.brand} models and comparable {car.bodyType} vehicles in our collection</p>
              </div>

              <div className="related-cars-grid">
                {relatedCars.map((relatedCar) => (
                  <CarCard 
                    key={relatedCar.id} 
                    car={relatedCar} 
                    isCompared={false}
                    onCompareToggle={() => {}}
                    onViewDetails={(c) => navigate(`/car/${c.id}`)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <CompareBar />
      <Footer />
    </div>
  );
}

export default CarDetailPage;
