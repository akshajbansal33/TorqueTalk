import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { formatIndianPrice } from '../components/CarCard';
import { cars } from '../data/cars';
import { getCarSpecifications } from '../data/carSpecifications';
import { useCompare } from '../context/CompareContext';
import './ComparePage.css';

/* 
  ComparePage Component (Syllabus Modules 1, 2, 4)
  - Dedicated multi-page SPA route (/compare)
  - Driven by Global State (CompareContext & LocalStorage persistence)
  - Interactive Modal for searching and adding vehicles into vacant slots
  - Performance winner badges & side-by-side specification table
*/
function ComparePage() {
  const navigate = useNavigate();
  const { compareCars, removeFromCompare, clearCompare, addToCompare } = useCompare();

  // Search modal state for adding new cars to comparison
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('All');

  // Extract all unique brands for filter pill bar in modal
  const allBrands = useMemo(() => {
    return ['All', ...new Set(cars.map((c) => c.brand))];
  }, []);

  // Filter cars available to be added
  const availableCars = useMemo(() => {
    const comparedIds = new Set(compareCars.map((c) => c.id));
    return cars.filter((car) => {
      if (comparedIds.has(car.id)) return false;
      const matchesBrand = selectedBrandFilter === 'All' || car.brand === selectedBrandFilter;
      const matchesSearch = car.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                            car.brand.toLowerCase().includes(modalSearchQuery.toLowerCase());
      return matchesBrand && matchesSearch;
    });
  }, [compareCars, selectedBrandFilter, modalSearchQuery]);

  // Extract specs for all compared cars
  const carSpecsMap = useMemo(() => {
    const map = {};
    compareCars.forEach((c) => {
      map[c.id] = getCarSpecifications(c);
    });
    return map;
  }, [compareCars]);

  // Determine fastest 0-100 km/h acceleration among compared cars
  const fastestCarId = useMemo(() => {
    if (compareCars.length < 2) return null;
    let minTime = Infinity;
    let fastestId = null;

    compareCars.forEach((c) => {
      const spec = carSpecsMap[c.id];
      if (spec && spec.acceleration) {
        const timeVal = parseFloat(spec.acceleration);
        if (!isNaN(timeVal) && timeVal < minTime) {
          minTime = timeVal;
          fastestId = c.id;
        }
      }
    });

    return fastestId;
  }, [compareCars, carSpecsMap]);

  return (
    <div className="compare-page-wrapper">
      <Header />

      <main className="compare-main-container">
        <div className="container">
          {/* Breadcrumb Navigation & Top Actions */}
          <div className="compare-navigation-bar">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link to="/" className="breadcrumb-item">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to="/new-cars" className="breadcrumb-item">Inventory</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Vehicle Comparison</span>
            </nav>

            <div className="compare-top-controls">
              {compareCars.length < 4 && (
                <button 
                  type="button" 
                  className="btn-add-vehicle-slot"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Add Vehicle ({compareCars.length}/4)</span>
                </button>
              )}

              {compareCars.length > 0 && (
                <button 
                  type="button" 
                  className="btn-clear-compare"
                  onClick={clearCompare}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Page Hero Header */}
          <div className="compare-header-hero">
            <span className="compare-eyebrow">Interactive Telemetry Matrix</span>
            <h1 className="compare-page-title">Vehicle Comparison Matrix</h1>
            <p className="compare-page-subtitle">
              Evaluate real-world acceleration, powerplant configurations, curb dimensions, and pricing side-by-side with verified manufacturer benchmarks.
            </p>
          </div>

          {/* Conditional Layout: Empty State (< 2 cars) vs Comparison Table (>= 2 cars) */}
          {compareCars.length < 2 ? (
            <div className="compare-empty-hub">
              <div className="empty-hub-card">
                <div className="empty-hub-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h2>
                  {compareCars.length === 0 
                    ? "No Vehicles in Comparison" 
                    : "Add 1 More Vehicle to Compare"}
                </h2>
                <p>
                  {compareCars.length === 0 
                    ? "Select 2 to 4 vehicles from our inventory or click below to launch the side-by-side technical evaluation."
                    : `You have selected 1 vehicle (${compareCars[0].name}). Select at least one more to unlock the side-by-side telemetry matrix.`}
                </p>

                <div className="empty-hub-actions">
                  <button 
                    type="button" 
                    className="btn-primary-action" 
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    + Choose Vehicle to Compare
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary-action" 
                    onClick={() => navigate('/new-cars')}
                  >
                    Browse All Inventory
                  </button>
                </div>

                {/* Currently selected single car preview */}
                {compareCars.length === 1 && (
                  <div className="single-selected-preview">
                    <span className="selected-preview-label">Current Selection:</span>
                    <div className="selected-preview-card">
                      <img src={compareCars[0].image} alt={compareCars[0].name} className="preview-card-img" />
                      <div className="preview-card-info">
                        <strong>{compareCars[0].brand} {compareCars[0].name}</strong>
                        <span>{formatIndianPrice(compareCars[0].price)}</span>
                      </div>
                      <button 
                        type="button" 
                        className="btn-remove-preview"
                        onClick={() => removeFromCompare(compareCars[0].id)}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Comparison Matrix Table */
            <div className="compare-table-wrapper">
              <div className="compare-matrix-table">
                
                {/* 1. Header Vehicle Cards Row */}
                <div className="matrix-row matrix-header-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-category">Vehicles</span>
                    <strong className="label-metric">Selected Models</strong>
                  </div>

                  {compareCars.map((car) => (
                    <div key={car.id} className="matrix-cell matrix-car-card-cell">
                      <button 
                        type="button" 
                        className="btn-remove-car"
                        onClick={() => removeFromCompare(car.id)}
                        title={`Remove ${car.name}`}
                      >
                        ✕
                      </button>

                      <div 
                        className="car-cell-img-wrapper"
                        onClick={() => navigate(`/car/${car.id}`)}
                        title="View Full Page"
                      >
                        <img src={car.image} alt={car.name} className="car-cell-img" />
                        <span className={`cell-badge ${car.isUsed ? 'badge-used' : 'badge-new'}`}>
                          {car.isUsed ? 'Pre-Owned' : 'New'}
                        </span>
                      </div>

                      <div className="car-cell-meta">
                        <span className="car-cell-brand">{car.brand}</span>
                        <h3 
                          className="car-cell-name"
                          onClick={() => navigate(`/car/${car.id}`)}
                        >
                          {car.name}
                        </h3>
                        <div className="car-cell-price">{formatIndianPrice(car.price)}</div>
                        
                        <button 
                          type="button" 
                          className="btn-cell-view"
                          onClick={() => navigate(`/car/${car.id}`)}
                        >
                          Showcase Page →
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Empty Slot Card if less than 4 cars */}
                  {compareCars.length < 4 && (
                    <div className="matrix-cell matrix-add-slot-cell" onClick={() => setIsAddModalOpen(true)}>
                      <div className="add-slot-inner">
                        <span className="add-slot-icon">+</span>
                        <span className="add-slot-text">Add Vehicle</span>
                        <span className="add-slot-sub">Slot {compareCars.length + 1} of 4</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section A: Performance & Benchmarks */}
                <div className="matrix-section-divider">
                  <span>⚡ Performance & Drivetrain Telemetry</span>
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">0–100 km/h Sprint</span>
                    <span className="label-sub">Acceleration</span>
                  </div>
                  {compareCars.map((car) => {
                    const spec = carSpecsMap[car.id];
                    const isFastest = car.id === fastestCarId;
                    return (
                      <div key={car.id} className={`matrix-cell ${isFastest ? 'cell-winner' : ''}`}>
                        <strong className="cell-data-prominent">
                          {spec ? spec.acceleration : "—"}
                        </strong>
                        {isFastest && <span className="winner-tag">⚡ Quickest</span>}
                      </div>
                    );
                  })}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Top Speed</span>
                    <span className="label-sub">Maximum Velocity</span>
                  </div>
                  {compareCars.map((car) => {
                    const spec = carSpecsMap[car.id];
                    return (
                      <div key={car.id} className="matrix-cell">
                        <strong className="cell-data-prominent">
                          {spec ? spec.topSpeed : "—"}
                        </strong>
                      </div>
                    );
                  })}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Maximum Power Output</span>
                    <span className="label-sub">Brake Horsepower</span>
                  </div>
                  {compareCars.map((car) => {
                    const spec = carSpecsMap[car.id];
                    return (
                      <div key={car.id} className="matrix-cell">
                        <strong className="cell-data-highlight">
                          {spec ? spec.power : "—"}
                        </strong>
                      </div>
                    );
                  })}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Peak Torque</span>
                    <span className="label-sub">Newton-Meters</span>
                  </div>
                  {compareCars.map((car) => {
                    const spec = carSpecsMap[car.id];
                    return (
                      <div key={car.id} className="matrix-cell">
                        <span className="cell-data">
                          {spec ? spec.torque : "—"}
                        </span>
                      </div>
                    );
                  })}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Engine & Displacement</span>
                    <span className="label-sub">Cylinder Configuration</span>
                  </div>
                  {compareCars.map((car) => {
                    const spec = carSpecsMap[car.id];
                    return (
                      <div key={car.id} className="matrix-cell">
                        <span className="cell-data">
                          {spec ? spec.engine : car.fuel}
                        </span>
                      </div>
                    );
                  })}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Drivetrain & Traction</span>
                    <span className="label-sub">Drive Layout</span>
                  </div>
                  {compareCars.map((car) => {
                    const spec = carSpecsMap[car.id];
                    return (
                      <div key={car.id} className="matrix-cell">
                        <span className="cell-data">
                          {spec ? spec.drivetrain : "All-Wheel Drive"}
                        </span>
                      </div>
                    );
                  })}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Transmission</span>
                    <span className="label-sub">Gearbox Type</span>
                  </div>
                  {compareCars.map((car) => (
                    <div key={car.id} className="matrix-cell">
                      <span className="cell-data">{car.transmission}</span>
                    </div>
                  ))}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Fuel / Electric Range</span>
                    <span className="label-sub">Efficiency Metric</span>
                  </div>
                  {compareCars.map((car) => (
                    <div key={car.id} className="matrix-cell">
                      <span className="cell-data">{car.mileage}</span>
                    </div>
                  ))}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                {/* Section B: Dimensions & Capacities */}
                <div className="matrix-section-divider">
                  <span>📐 Dimensions & Utility Capacities</span>
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Fuel Tank / Battery</span>
                    <span className="label-sub">Capacity</span>
                  </div>
                  {compareCars.map((car) => {
                    const spec = carSpecsMap[car.id];
                    return (
                      <div key={car.id} className="matrix-cell">
                        <span className="cell-data">
                          {spec ? spec.fuelCapacity : "Standard"}
                        </span>
                      </div>
                    );
                  })}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Boot Space</span>
                    <span className="label-sub">Cargo Volume</span>
                  </div>
                  {compareCars.map((car) => {
                    const spec = carSpecsMap[car.id];
                    return (
                      <div key={car.id} className="matrix-cell">
                        <span className="cell-data">
                          {spec ? spec.bootSpace : "—"}
                        </span>
                      </div>
                    );
                  })}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Ground Clearance</span>
                    <span className="label-sub">Ride Height</span>
                  </div>
                  {compareCars.map((car) => {
                    const spec = carSpecsMap[car.id];
                    return (
                      <div key={car.id} className="matrix-cell">
                        <span className="cell-data">
                          {spec ? spec.groundClearance : "—"}
                        </span>
                      </div>
                    );
                  })}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Kerb Weight</span>
                    <span className="label-sub">Unladen Mass</span>
                  </div>
                  {compareCars.map((car) => {
                    const spec = carSpecsMap[car.id];
                    return (
                      <div key={car.id} className="matrix-cell">
                        <span className="cell-data">
                          {spec ? spec.kerbWeight : "—"}
                        </span>
                      </div>
                    );
                  })}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Seating Capacity</span>
                    <span className="label-sub">Passenger Occupancy</span>
                  </div>
                  {compareCars.map((car) => (
                    <div key={car.id} className="matrix-cell">
                      <span className="cell-data">{car.seating} Occupants</span>
                    </div>
                  ))}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Body Style</span>
                    <span className="label-sub">Chassis Class</span>
                  </div>
                  {compareCars.map((car) => (
                    <div key={car.id} className="matrix-cell">
                      <span className="cell-data">{car.bodyType}</span>
                    </div>
                  ))}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                {/* Section C: Ownership & Assurance */}
                <div className="matrix-section-divider">
                  <span>🛡️ Ownership & Pricing Metrics</span>
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Ex-Showroom Price</span>
                    <span className="label-sub">Base Pricing</span>
                  </div>
                  {compareCars.map((car) => (
                    <div key={car.id} className="matrix-cell">
                      <strong className="cell-data-prominent">
                        {formatIndianPrice(car.price)}
                      </strong>
                    </div>
                  ))}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Manufacturer Warranty</span>
                    <span className="label-sub">Coverage Terms</span>
                  </div>
                  {compareCars.map((car) => {
                    const spec = carSpecsMap[car.id];
                    return (
                      <div key={car.id} className="matrix-cell">
                        <span className="cell-data">
                          {spec ? spec.warranty : "3 Years / Unlimited km"}
                        </span>
                      </div>
                    );
                  })}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Satisfaction Rating</span>
                    <span className="label-sub">Verified Reviews</span>
                  </div>
                  {compareCars.map((car) => (
                    <div key={car.id} className="matrix-cell">
                      <span className="cell-data">★ {car.rating} / 5.0</span>
                    </div>
                  ))}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

                {/* Bottom Action Row */}
                <div className="matrix-row matrix-actions-row">
                  <div className="matrix-cell matrix-label-cell">
                    <span className="label-metric">Action</span>
                  </div>
                  {compareCars.map((car) => (
                    <div key={car.id} className="matrix-cell">
                      <button 
                        type="button" 
                        className="btn-matrix-testdrive"
                        onClick={() => navigate(`/book-test-drive?carId=${car.id}`)}
                      >
                        Book Test Drive
                      </button>
                    </div>
                  ))}
                  {compareCars.length < 4 && <div className="matrix-cell empty-filler-cell"></div>}
                </div>

              </div>
            </div>
          )}
        </div>
      </main>

      {/* Vehicle Selection Modal (Syllabus Module 4: Modal Pattern) */}
      {isAddModalOpen && (
        <div className="compare-modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="compare-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Select Vehicle to Compare</h2>
                <p>Choose from our verified luxury showroom inventory ({compareCars.length}/4 selected)</p>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Search and Brand Filter Controls */}
            <div className="modal-filter-toolbar">
              <div className="modal-search-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search by car model or brand..." 
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  className="modal-search-input"
                />
                {modalSearchQuery && (
                  <button 
                    type="button" 
                    className="modal-search-clear" 
                    onClick={() => setModalSearchQuery('')}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Brand Filter Pills */}
              <div className="modal-brand-pills">
                {allBrands.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    className={`brand-pill-btn ${selectedBrandFilter === brand ? 'active' : ''}`}
                    onClick={() => setSelectedBrandFilter(brand)}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Available Car Grid */}
            <div className="modal-cars-grid">
              {availableCars.length > 0 ? (
                availableCars.map((car) => (
                  <div key={car.id} className="modal-car-card">
                    <img src={car.image} alt={car.name} className="modal-car-img" />
                    <div className="modal-car-info">
                      <span className="modal-car-brand">{car.brand}</span>
                      <h4 className="modal-car-title">{car.name}</h4>
                      <span className="modal-car-price">{formatIndianPrice(car.price)}</span>
                      <span className="modal-car-specs">{car.fuel} • {car.transmission}</span>
                    </div>
                    <button 
                      type="button" 
                      className="btn-add-modal-car"
                      onClick={() => {
                        addToCompare(car);
                        setIsAddModalOpen(false);
                      }}
                    >
                      + Add to Compare
                    </button>
                  </div>
                ))
              ) : (
                <div className="modal-empty-results">
                  <p>No vehicles found matching your search. Try resetting the brand filter or keyword.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ComparePage;
