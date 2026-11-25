import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGarage } from '../context/GarageContext';
import { formatIndianPrice } from './CarCard';
import './GarageDrawer.css';

/* 
  GarageDrawer Component (Syllabus Module 1, 2 & 4: SPA Modals, Global State, Cart Drawer)
  - Slide-over luxury cart drawer presenting selected vehicles for reservation
  - Instant dynamic package configuration (Warranty, Ceramic coating, Enclosed delivery)
  - Live price recalculation using derived Context API state
  - Seamless routing to full `/garage` checkout page
*/
function GarageDrawer() {
  const navigate = useNavigate();
  const {
    garageItems,
    isDrawerOpen,
    closeDrawer,
    removeFromGarage,
    updateItemCustomization,
    clearGarage,
    financialSummary
  } = useGarage();

  if (!isDrawerOpen) return null;

  const handleProceedToCheckout = () => {
    closeDrawer();
    navigate('/garage');
  };

  const handleBrowseCars = () => {
    closeDrawer();
    navigate('/new-cars');
  };

  return (
    <div className="garage-drawer-overlay" onClick={closeDrawer} role="dialog" aria-modal="true" aria-label="Luxury Garage Cart">
      <div 
        className="garage-drawer-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="garage-drawer-header">
          <div className="drawer-title-group">
            <div className="drawer-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M7 17h10M7 13h10M7 9h10" />
              </svg>
            </div>
            <div>
              <h3 className="drawer-title">Luxury Garage</h3>
              <p className="drawer-subtitle">
                {garageItems.length === 1 ? '1 vehicle saved for reservation' : `${garageItems.length} vehicles saved for reservation`}
              </p>
            </div>
          </div>

          <div className="drawer-header-actions">
            {garageItems.length > 0 && (
              <button 
                type="button" 
                className="btn-clear-garage" 
                onClick={clearGarage}
                title="Clear all vehicles"
              >
                Clear All
              </button>
            )}
            <button 
              type="button" 
              className="btn-close-drawer" 
              onClick={closeDrawer}
              aria-label="Close Garage Drawer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="garage-drawer-body">
          {garageItems.length === 0 ? (
            <div className="empty-garage-state">
              <div className="empty-garage-graphic">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <h4>Your Luxury Garage is Empty</h4>
              <p>Explore our flagship collection of hypercars, grand tourers, and performance SUVs to lock in your official allocation token.</p>
              <button 
                type="button" 
                className="btn-explore-inventory"
                onClick={handleBrowseCars}
              >
                Explore New Cars Inventory
              </button>
            </div>
          ) : (
            <div className="garage-items-list">
              {garageItems.map((item) => {
                const { car, customization } = item;

                return (
                  <div key={item.id} className="garage-item-card">
                    <div className="garage-item-top">
                      <div className="garage-item-thumb">
                        <img src={car.image} alt={`${car.brand} ${car.name}`} loading="lazy" />
                      </div>
                      
                      <div className="garage-item-info">
                        <div className="garage-item-brand">{car.brand}</div>
                        <h4 className="garage-item-name">{car.name}</h4>
                        <div className="garage-item-price">{formatIndianPrice(car.price)}</div>
                        <span className="garage-item-powertrain">{car.fuel} • {car.transmission}</span>
                      </div>

                      <button 
                        type="button" 
                        className="btn-remove-item"
                        onClick={() => removeFromGarage(item.id)}
                        title="Remove vehicle"
                        aria-label={`Remove ${car.brand} ${car.name}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>

                    {/* Customization Options */}
                    <div className="garage-item-customizations">
                      <div className="customization-row">
                        <label className="custom-label">Protection Package:</label>
                        <select 
                          className="custom-select"
                          value={customization?.protectionPackage || 'standard'}
                          onChange={(e) => updateItemCustomization(item.id, { protectionPackage: e.target.value })}
                        >
                          <option value="standard">Standard Factory Care (₹0)</option>
                          <option value="ceramic">9H Diamond Ceramic (+₹85,000)</option>
                          <option value="vipShield">Torque VIP 5-Yr Shield (+₹2,40,000)</option>
                        </select>
                      </div>

                      <div className="customization-row">
                        <label className="custom-label">Handover Method:</label>
                        <select 
                          className="custom-select"
                          value={customization?.deliveryOption || 'hub'}
                          onChange={(e) => updateItemCustomization(item.id, { deliveryOption: e.target.value })}
                        >
                          <option value="hub">Dealership VIP Hub Handover (Free)</option>
                          <option value="doorstep">Enclosed Flatbed Doorstep Delivery (+₹25,000)</option>
                        </select>
                      </div>

                      <div className="item-token-tag">
                        <span>Refundable Reservation Token:</span>
                        <strong>₹ 50,000</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer with Financial Summary */}
        {garageItems.length > 0 && (
          <div className="garage-drawer-footer">
            <div className="drawer-pricing-summary">
              <div className="pricing-row">
                <span>Vehicles Ex-Showroom ({financialSummary.itemsCount})</span>
                <strong>{formatIndianPrice(financialSummary.exShowroomTotal)}</strong>
              </div>

              {financialSummary.addOnsTotal > 0 && (
                <div className="pricing-row">
                  <span>Protection & Flatbed Add-ons</span>
                  <strong>{formatIndianPrice(financialSummary.addOnsTotal)}</strong>
                </div>
              )}

              <div className="pricing-row">
                <span>Estimated On-Road (incl. RTO + Tax)</span>
                <strong>{formatIndianPrice(financialSummary.totalOnRoadPrice)}</strong>
              </div>

              <div className="pricing-row token-highlight-row">
                <div>
                  <span className="token-label">Reservation Token Payable Now</span>
                  <small className="token-sublabel">100% Fully Refundable Allocation Lock</small>
                </div>
                <strong className="token-amount">₹ {(financialSummary.totalReservationToken).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <button 
              type="button" 
              className="btn-checkout-reservation"
              onClick={handleProceedToCheckout}
            >
              <span>Proceed to VIP Reservation</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GarageDrawer;
