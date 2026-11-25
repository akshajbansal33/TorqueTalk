import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatIndianPrice } from './CarCard';
import { useCompare } from '../context/CompareContext';
import './CompareBar.css';

/* 
  CompareBar Component
  - Slide-up bottom toolbar triggered when cars are added to comparison
  - Integrated with Global CompareContext (Syllabus Module 2)
  - Seamlessly links to dedicated /compare matrix page (Syllabus Module 1)
*/
function CompareBar(props) {
  const navigate = useNavigate();
  const context = useCompare();

  const compareCars = props.compareCars || context.compareCars;
  const onRemove = props.onRemove ? props.onRemove : (car) => context.removeFromCompare(car.id);
  const onClearAll = props.onClearAll || context.clearCompare;

  const hasItems = compareCars.length > 0;

  const handleGoToComparePage = () => {
    navigate('/compare');
  };

  return (
    <aside className={`compare-bar-wrapper ${hasItems ? 'visible' : ''}`} aria-label="Comparison Tray">
      <div className="compare-bar-container container">
        
        {/* Metadata Title */}
        <div className="compare-title-area">
          <h4>Compare Selection</h4>
          <p>{compareCars.length} of 4 cars selected</p>
        </div>

        {/* List of active car chips */}
        <div className="compare-items-list">
          {compareCars.map((car) => (
            <div key={car.id} className="compare-item-chip">
              <img src={car.image} alt={car.name} className="compare-chip-img" />
              <div className="compare-chip-details">
                <span className="compare-chip-name">{car.name}</span>
                <span className="compare-chip-price">{formatIndianPrice(car.price)}</span>
              </div>
              <button 
                type="button" 
                className="compare-chip-remove" 
                onClick={() => onRemove(car)}
                title={`Remove ${car.name}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
          
          {/* Display empty slots */}
          {Array.from({ length: Math.max(0, 4 - compareCars.length) }).map((_, idx) => (
            <div 
              key={`empty-${idx}`} 
              className="compare-item-chip" 
              onClick={handleGoToComparePage}
              style={{ opacity: 0.5, borderStyle: 'dashed', backgroundColor: 'transparent', cursor: 'pointer' }}
              title="Add more cars to compare"
            >
              <div className="compare-chip-details" style={{ margin: 'auto' }}>
                <span className="compare-chip-name" style={{ color: 'var(--dark-400)', fontWeight: 500 }}>
                  + Slot {compareCars.length + idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Control Action Buttons */}
        <div className="compare-bar-actions">
          <button 
            type="button" 
            className="btn-compare-now" 
            onClick={handleGoToComparePage}
          >
            Compare Matrix →
          </button>
          <button 
            type="button" 
            className="btn-compare-clear" 
            onClick={onClearAll}
          >
            Clear All
          </button>
        </div>
      </div>
    </aside>
  );
}

export default CompareBar;
