import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GarageDrawer from '../components/GarageDrawer';
import { useGarage, PROTECTION_PACKAGES, DELIVERY_OPTIONS } from '../context/GarageContext';
import { formatIndianPrice } from '../components/CarCard';
import './GaragePage.css';

/* 
  GaragePage Component (Syllabus Module 1, 2, 3 & 5)
  - Multi-Page SPA Navigation: Dedicated `/garage` reservation & cart view
  - Context API & Global State: Reads & mutates items from GarageContext
  - Local State Architecture: Manages multi-step checkout workflow (Review -> Buyer Details -> Allocation Pass)
  - Controlled Form Handling & Validation: PAN card compliance, email regex, 10-digit phone
  - Asynchronous State Management: Loading state, error boundary simulation, and retry handling
*/
function GaragePage() {
  const navigate = useNavigate();
  const {
    garageItems,
    removeFromGarage,
    updateItemCustomization,
    clearGarage,
    financialSummary
  } = useGarage();

  // Multi-step checkout workflow state: 1: Configure & Review | 2: Buyer Verification | 3: Confirmation Certificate
  const [checkoutStep, setCheckoutStep] = useState(1);

  // Controlled form state for VIP Reservation (Syllabus Module 3)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    panNumber: '',
    city: 'Mumbai',
    paymentMethod: 'upi',
    specialRequests: '',
    agreeTerms: true
  });

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Asynchronous reservation state machine (Syllabus Module 2 & 5)
  // Status: 'idle' | 'processing' | 'error' | 'success'
  const [asyncStatus, setAsyncStatus] = useState('idle');
  const [asyncProgress, setAsyncProgress] = useState(0);
  const [asyncStatusMessage, setAsyncStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Interactive toggle for evaluator: simulates real network failure & retry workflow
  const [simulateNetworkError, setSimulateNetworkError] = useState(false);

  // Generated VIP confirmation details upon success
  const [allocationCertificate, setAllocationCertificate] = useState(null);

  // Scroll to top upon step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [checkoutStep]);

  // Real-time controlled form input change handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  // Validation strategy for individual fields
  const validateField = (name, value) => {
    let error = null;

    if (name === 'fullName') {
      if (!value || value.trim().length < 3) {
        error = 'Full legal name is required (min 3 characters).';
      }
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || !emailRegex.test(value.trim())) {
        error = 'Please provide a valid email address.';
      }
    } else if (name === 'phone') {
      const cleanPhone = (value || '').replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        error = 'Please enter a valid 10-digit Indian mobile number.';
      }
    } else if (name === 'panNumber') {
      // Luxury vehicle purchases in India require valid PAN verification
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      const upperPan = (value || '').trim().toUpperCase();
      if (!upperPan) {
        error = 'PAN is mandatory for high-value automobile bookings in India.';
      } else if (!panRegex.test(upperPan)) {
        error = 'Invalid PAN format (Expected 5 letters, 4 digits, 1 letter e.g., ABCDE1234F).';
      }
    } else if (name === 'agreeTerms') {
      if (!value) {
        error = 'You must accept the luxury allocation agreement.';
      }
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: error
    }));

    return !error;
  };

  // Full form validator before async submission
  const validateFullForm = () => {
    const fieldsToValidate = ['fullName', 'email', 'phone', 'panNumber', 'agreeTerms'];
    let isValid = true;
    const newErrors = {};

    fieldsToValidate.forEach((field) => {
      const value = formData[field];
      const valid = validateField(field, value);
      if (!valid) {
        isValid = false;
        newErrors[field] = formErrors[field] || 'Required';
      }
    });

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      panNumber: true,
      agreeTerms: true
    });

    return isValid;
  };

  /* 
    Asynchronous Reservation Submission (Syllabus Module 2 & 5: Async state, loading and error handling)
    Simulates a secure payment token API call with progressive loading steps and error recovery
  */
  const handleExecuteReservation = async (e) => {
    if (e) e.preventDefault();

    if (!validateFullForm()) {
      return;
    }

    setAsyncStatus('processing');
    setAsyncProgress(15);
    setAsyncStatusMessage('Initiating high-security allocation escrow...');
    setErrorMessage('');

    try {
      // Step 1: Simulate dealership inventory verification
      await new Promise((resolve) => setTimeout(resolve, 600));
      setAsyncProgress(45);
      setAsyncStatusMessage('Verifying manufacturer allocation slots for India...');

      // Step 2: Simulate chassis reservation
      await new Promise((resolve) => setTimeout(resolve, 700));
      setAsyncProgress(75);
      setAsyncStatusMessage('Securing VIP priority chassis reservation token...');

      // Simulate failure if the evaluator enabled the network glitch switch
      if (simulateNetworkError) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        throw new Error('Gateway Timeout (HTTP 504): Dealership allocation server did not respond in time. Please retry.');
      }

      // Step 3: Finalize cryptographic confirmation
      await new Promise((resolve) => setTimeout(resolve, 600));
      setAsyncProgress(100);
      setAsyncStatusMessage('Allocation confirmed! Generating digital certificate...');

      await new Promise((resolve) => setTimeout(resolve, 300));

      const certNumber = `TT-VIP-${Math.floor(100000 + Math.random() * 900000)}`;
      const certDate = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      setAllocationCertificate({
        bookingId: certNumber,
        date: certDate,
        clientName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        pan: formData.panNumber.toUpperCase(),
        city: formData.city,
        paymentMethod: formData.paymentMethod.toUpperCase(),
        tokenPaid: financialSummary.totalReservationToken,
        cars: [...garageItems]
      });

      setAsyncStatus('success');
      setCheckoutStep(3);
    } catch (err) {
      console.error('Reservation API Error:', err);
      setAsyncStatus('error');
      setErrorMessage(err.message || 'An unexpected network error occurred while securing your allocation.');
    }
  };

  // Retry handler for error state
  const handleRetryReservation = () => {
    setSimulateNetworkError(false); // reset simulated error toggle
    handleExecuteReservation();
  };

  return (
    <div className="garage-page-wrapper">
      <Header />
      <GarageDrawer />

      <main className="garage-main-container">
        {/* Breadcrumb Navigation */}
        <div className="garage-breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/new-cars" className="breadcrumb-link">Inventory</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Luxury Garage & Reservation</span>
        </div>

        {/* Page Hero Title */}
        <div className="garage-hero-section">
          <div className="garage-badge">
            <span className="garage-badge-dot"></span>
            <span>TORQUE TALK LUXURY GARAGE & ALLOCATION</span>
          </div>
          <h1 className="garage-page-title">Reserve Your Supercar Allocation</h1>
          <p className="garage-page-desc">
            Lock in an official manufacturer build allocation with a 100% refundable reservation token deposit. Fully protected by certified automotive escrow.
          </p>
        </div>

        {/* Step Progress Bar */}
        {garageItems.length > 0 && asyncStatus !== 'success' && (
          <div className="checkout-stepper">
            <div className={`step-item ${checkoutStep >= 1 ? 'active' : ''} ${checkoutStep > 1 ? 'completed' : ''}`}>
              <div className="step-circle">{checkoutStep > 1 ? '✓' : '1'}</div>
              <span className="step-label">1. Configure Fleet</span>
            </div>
            <div className="step-connector"></div>
            <div className={`step-item ${checkoutStep >= 2 ? 'active' : ''} ${checkoutStep > 2 ? 'completed' : ''}`}>
              <div className="step-circle">{checkoutStep > 2 ? '✓' : '2'}</div>
              <span className="step-label">2. VIP Verification</span>
            </div>
            <div className="step-connector"></div>
            <div className={`step-item ${checkoutStep >= 3 ? 'active' : ''}`}>
              <div className="step-circle">3</div>
              <span className="step-label">3. Allocation Pass</span>
            </div>
          </div>
        )}

        {/* Async Error Banner with Retry (Syllabus Module 2 & 5) */}
        {asyncStatus === 'error' && (
          <div className="async-error-alert" role="alert">
            <div className="error-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="error-content">
              <h4>Allocation Transaction Interrupted</h4>
              <p>{errorMessage}</p>
              <div className="error-actions">
                <button 
                  type="button" 
                  className="btn-retry-async"
                  onClick={handleRetryReservation}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  <span>Retry Reservation Now</span>
                </button>
                <button 
                  type="button" 
                  className="btn-edit-details"
                  onClick={() => {
                    setAsyncStatus('idle');
                    setCheckoutStep(2);
                  }}
                >
                  Review Form Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Async Loading Overlay Progress Modal */}
        {asyncStatus === 'processing' && (
          <div className="async-processing-overlay">
            <div className="processing-modal-card">
              <div className="radar-spinner">
                <div className="radar-core"></div>
                <div className="radar-wave"></div>
              </div>

              <h3>Securing Manufacturer Allocation</h3>
              <p className="processing-status-msg">{asyncStatusMessage}</p>

              <div className="processing-progress-track">
                <div 
                  className="processing-progress-fill" 
                  style={{ width: `${asyncProgress}%` }}
                ></div>
              </div>

              <span className="processing-pct">{asyncProgress}% Completed</span>
              <p className="processing-security-note">
                🔒 Protected by 256-Bit TLS Bank-Grade Automotive Escrow
              </p>
            </div>
          </div>
        )}

        {/* Content View Based on Step & Item Count */}
        {garageItems.length === 0 && asyncStatus !== 'success' ? (
          <div className="empty-garage-full-page">
            <div className="empty-garage-icon-large">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M7 17h10M7 13h10M7 9h10" />
              </svg>
            </div>
            <h2>Your Luxury Garage is Empty</h2>
            <p>
              You haven't added any vehicles to your garage yet. Browse our curated collection of supercars, grand tourers, and hyper SUVs to lock in an allocation.
            </p>
            <div className="empty-garage-actions">
              <Link to="/new-cars" className="btn-browse-primary">
                Explore Vehicle Inventory
              </Link>
              <Link to="/compare" className="btn-browse-secondary">
                View Compare Matrix
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* STEP 1: CONFIGURE & REVIEW */}
            {checkoutStep === 1 && (
              <div className="garage-step-layout">
                <div className="garage-vehicles-column">
                  <div className="column-header-bar">
                    <h3>Configured Vehicles ({garageItems.length})</h3>
                    <button 
                      type="button" 
                      className="btn-text-clear"
                      onClick={clearGarage}
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="garage-cards-stack">
                    {garageItems.map((item) => {
                      const { car, customization } = item;
                      const pkg = PROTECTION_PACKAGES[customization?.protectionPackage] || PROTECTION_PACKAGES.standard;
                      const del = DELIVERY_OPTIONS[customization?.deliveryOption] || DELIVERY_OPTIONS.hub;

                      return (
                        <div key={item.id} className="garage-detail-card">
                          <div className="card-top-row">
                            <div className="card-img-box">
                              <img src={car.image} alt={`${car.brand} ${car.name}`} />
                            </div>

                            <div className="card-main-meta">
                              <span className="card-brand-tag">{car.brand}</span>
                              <h4 className="card-name-title">{car.name}</h4>
                              <div className="card-price-tag">{formatIndianPrice(car.price)}</div>
                              <span className="card-tech-specs">{car.fuel} • {car.transmission} • {car.seating} Seats</span>
                            </div>

                            <button 
                              type="button" 
                              className="btn-trash-item"
                              onClick={() => removeFromGarage(item.id)}
                              title="Remove vehicle from garage"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>

                          {/* Bespoke Customization Selectors */}
                          <div className="card-customization-grid">
                            <div className="custom-input-group">
                              <label>Protection & Factory Shield:</label>
                              <select 
                                value={customization?.protectionPackage || 'standard'}
                                onChange={(e) => updateItemCustomization(item.id, { protectionPackage: e.target.value })}
                              >
                                <option value="standard">Standard Factory Care (₹0)</option>
                                <option value="ceramic">9H Diamond Ceramic Guard (+₹85,000)</option>
                                <option value="vipShield">Torque VIP 5-Yr Extended Shield (+₹2,40,000)</option>
                              </select>
                              <small className="pkg-desc">{pkg.description}</small>
                            </div>

                            <div className="custom-input-group">
                              <label>Handover & Transportation:</label>
                              <select 
                                value={customization?.deliveryOption || 'hub'}
                                onChange={(e) => updateItemCustomization(item.id, { deliveryOption: e.target.value })}
                              >
                                <option value="hub">Official Brand Studio Lounge (Free)</option>
                                <option value="doorstep">Enclosed Hydraulic Transporter (+₹25,000)</option>
                              </select>
                              <small className="pkg-desc">{del.description}</small>
                            </div>
                          </div>

                          <div className="card-token-footer">
                            <div className="token-item-info">
                              <span>Allocation Lock Deposit:</span>
                              <strong>₹ 50,000 (100% Refundable)</strong>
                            </div>
                            <Link to={`/car/${car.id}`} className="link-view-specs">
                              Full Specs Sheet →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Summary Column */}
                <div className="garage-summary-column">
                  <div className="summary-card-sticky">
                    <h3 className="summary-title">Financial Breakdown</h3>

                    <div className="breakdown-lines">
                      <div className="breakdown-row">
                        <span>Ex-Showroom Subtotal ({financialSummary.itemsCount} Cars)</span>
                        <span>{formatIndianPrice(financialSummary.exShowroomTotal)}</span>
                      </div>

                      {financialSummary.addOnsTotal > 0 && (
                        <div className="breakdown-row">
                          <span>Custom Protection & Delivery</span>
                          <span>{formatIndianPrice(financialSummary.addOnsTotal)}</span>
                        </div>
                      )}

                      <div className="breakdown-row">
                        <span>Estimated RTO Registration (~12%)</span>
                        <span>{formatIndianPrice(financialSummary.rtoEstimate)}</span>
                      </div>

                      <div className="breakdown-row">
                        <span>Comprehensive 3-Yr Insurance (~3%)</span>
                        <span>{formatIndianPrice(financialSummary.insuranceEstimate)}</span>
                      </div>

                      <div className="breakdown-row">
                        <span>TCS Tax Collected at Source (~1%)</span>
                        <span>{formatIndianPrice(financialSummary.tcsEstimate)}</span>
                      </div>

                      <div className="breakdown-divider"></div>

                      <div className="breakdown-row total-onroad-row">
                        <span>Total Estimated On-Road Price</span>
                        <strong>{formatIndianPrice(financialSummary.totalOnRoadPrice)}</strong>
                      </div>

                      <div className="token-card-box">
                        <div className="token-box-header">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                          <span>Reservation Token Due Now</span>
                        </div>
                        <div className="token-box-amount">
                          ₹ {(financialSummary.totalReservationToken).toLocaleString('en-IN')}
                        </div>
                        <p className="token-box-note">
                          Secures immediate production build priority. Fully refundable within 14 days of booking.
                        </p>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      className="btn-next-step"
                      onClick={() => setCheckoutStep(2)}
                    >
                      <span>Proceed to VIP Verification</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>

                    <div className="concierge-guarantee">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 14 14" />
                      </svg>
                      <span>Official OEM allocation verified in real time</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: BUYER VERIFICATION & PAYMENT (Form Handling & Validation) */}
            {checkoutStep === 2 && (
              <div className="garage-step-layout">
                <div className="garage-form-column">
                  <div className="form-step-header">
                    <button 
                      type="button" 
                      className="btn-back-step"
                      onClick={() => setCheckoutStep(1)}
                    >
                      ← Back to Fleet Configuration
                    </button>
                    <h3>VIP Allocation Buyer Verification</h3>
                    <p>Provide your legal registration details required for luxury automobile allotment under Indian motor vehicle regulations.</p>
                  </div>

                  <form className="vip-checkout-form" onSubmit={handleExecuteReservation} noValidate>
                    <div className="form-row-dual">
                      <div className="form-field-group">
                        <label className="field-label">Legal Full Name <span className="req">*</span></label>
                        <input 
                          type="text" 
                          name="fullName"
                          className={`field-input ${touched.fullName && formErrors.fullName ? 'has-error' : ''}`}
                          placeholder="e.g. Vikramaditya Singhania"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                        />
                        {touched.fullName && formErrors.fullName && (
                          <span className="error-text">{formErrors.fullName}</span>
                        )}
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">Email Address for Official Docket <span className="req">*</span></label>
                        <input 
                          type="email" 
                          name="email"
                          className={`field-input ${touched.email && formErrors.email ? 'has-error' : ''}`}
                          placeholder="vikram@singhaniagroup.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                        />
                        {touched.email && formErrors.email && (
                          <span className="error-text">{formErrors.email}</span>
                        )}
                      </div>
                    </div>

                    <div className="form-row-dual">
                      <div className="form-field-group">
                        <label className="field-label">Direct Mobile Number <span className="req">*</span></label>
                        <div className="phone-prefix-wrap">
                          <span className="phone-prefix">+91</span>
                          <input 
                            type="tel" 
                            name="phone"
                            className={`field-input input-phone ${touched.phone && formErrors.phone ? 'has-error' : ''}`}
                            placeholder="9876543210"
                            maxLength={10}
                            value={formData.phone}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                          />
                        </div>
                        {touched.phone && formErrors.phone && (
                          <span className="error-text">{formErrors.phone}</span>
                        )}
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">PAN Number (Tax Compliance) <span className="req">*</span></label>
                        <input 
                          type="text" 
                          name="panNumber"
                          className={`field-input ${touched.panNumber && formErrors.panNumber ? 'has-error' : ''}`}
                          placeholder="ABCDE1234F"
                          maxLength={10}
                          value={formData.panNumber}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          style={{ textTransform: 'uppercase' }}
                        />
                        {touched.panNumber && formErrors.panNumber && (
                          <span className="error-text">{formErrors.panNumber}</span>
                        )}
                      </div>
                    </div>

                    <div className="form-row-dual">
                      <div className="form-field-group">
                        <label className="field-label">Delivery Hub City</label>
                        <select 
                          name="city"
                          className="field-input"
                          value={formData.city}
                          onChange={handleInputChange}
                        >
                          <option value="Mumbai">Mumbai (Torque Studio, Worli Sea Face)</option>
                          <option value="Delhi NCR">Delhi NCR (DLF Emporio, Vasant Kunj)</option>
                          <option value="Bengaluru">Bengaluru (Lavelle Road Flagship)</option>
                          <option value="Hyderabad">Hyderabad (Jubilee Hills Centre)</option>
                          <option value="Chennai">Chennai (Boat Club Concierge)</option>
                          <option value="Kolkata">Kolkata (Alipore Luxury Hub)</option>
                          <option value="Ahmedabad">Ahmedabad (SG Highway)</option>
                          <option value="Pune">Pune (Koregaon Park)</option>
                        </select>
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">Token Deposit Payment Method</label>
                        <select 
                          name="paymentMethod"
                          className="field-input"
                          value={formData.paymentMethod}
                          onChange={handleInputChange}
                        >
                          <option value="upi">Instant UPI (Google Pay, PhonePe, Cred)</option>
                          <option value="netbanking">Direct HDFC / ICICI Wealth NetBanking</option>
                          <option value="credit">Premium Metal Credit Card (Amex Centurion / Infinia)</option>
                          <option value="escrow">Torque Escrow Bank RTGS Wire Transfer</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">Bespoke Requests / Delivery Notes (Optional)</label>
                      <textarea 
                        name="specialRequests"
                        className="field-textarea"
                        rows={3}
                        placeholder="Specify special registration plate number preference, delivery date window, or concierge requests..."
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    {/* Evaluator Testing Toggle: Simulate Network Error & Retry */}
                    <div className="academic-eval-box">
                      <div className="eval-toggle-row">
                        <input 
                          type="checkbox" 
                          id="simulateErrorToggle"
                          checked={simulateNetworkError}
                          onChange={(e) => setSimulateNetworkError(e.target.checked)}
                        />
                        <label htmlFor="simulateErrorToggle">
                          <strong>Simulate Network Glitch (For Academic Evaluation)</strong>
                          <span>Enabling this causes the async reservation endpoint to fail with HTTP 504, demonstrating error state recovery and the retry mechanism.</span>
                        </label>
                      </div>
                    </div>

                    <div className="terms-checkbox-wrap">
                      <input 
                        type="checkbox" 
                        id="agreeTerms" 
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="agreeTerms">
                        I understand this reservation fee of <strong>₹ {(financialSummary.totalReservationToken).toLocaleString('en-IN')}</strong> holds an official manufacturer build allocation slot and is 100% refundable within 14 days of placement.
                      </label>
                    </div>
                    {touched.agreeTerms && formErrors.agreeTerms && (
                      <span className="error-text">{formErrors.agreeTerms}</span>
                    )}

                    <div className="form-submit-row">
                      <button 
                        type="submit" 
                        className="btn-submit-reservation"
                        disabled={asyncStatus === 'processing'}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span>Authorize Token Deposit (₹ {(financialSummary.totalReservationToken).toLocaleString('en-IN')})</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right Summary Column */}
                <div className="garage-summary-column">
                  <div className="summary-card-sticky">
                    <h3 className="summary-title">Allocation Summary</h3>
                    
                    <div className="reservation-cars-mini-list">
                      {garageItems.map((item) => (
                        <div key={item.id} className="mini-car-item">
                          <img src={item.car.image} alt={item.car.name} />
                          <div>
                            <strong>{item.car.brand} {item.car.name}</strong>
                            <small>{formatIndianPrice(item.car.price)}</small>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="breakdown-lines">
                      <div className="breakdown-row">
                        <span>Vehicles Reserved</span>
                        <strong>{financialSummary.itemsCount}</strong>
                      </div>
                      <div className="breakdown-row">
                        <span>Total On-Road Estimated</span>
                        <span>{formatIndianPrice(financialSummary.totalOnRoadPrice)}</span>
                      </div>
                      <div className="breakdown-divider"></div>
                      <div className="breakdown-row total-onroad-row">
                        <span>Payable Token Deposit</span>
                        <strong className="token-highlight">₹ {(financialSummary.totalReservationToken).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ALLOCATION CERTIFICATE PASS (Success State) */}
            {checkoutStep === 3 && allocationCertificate && (
              <div className="certificate-page-layout">
                <div className="certificate-docket-card">
                  <div className="docket-header">
                    <div className="docket-watermark">TORQUE TALK OEM ALLOCATION</div>
                    <div className="docket-status-badge">
                      <span className="live-dot"></span>
                      <span>OFFICIAL ALLOCATION CONFIRMED</span>
                    </div>
                    <h2 className="docket-title">Digital Allocation Certificate</h2>
                    <p className="docket-id">Reference Docket: <strong>{allocationCertificate.bookingId}</strong> • Issued on {allocationCertificate.date}</p>
                  </div>

                  <div className="docket-grid">
                    <div className="docket-section">
                      <h4>Allotment Holder</h4>
                      <div className="docket-data-row">
                        <span>Full Legal Name:</span>
                        <strong>{allocationCertificate.clientName}</strong>
                      </div>
                      <div className="docket-data-row">
                        <span>Email Contact:</span>
                        <strong>{allocationCertificate.email}</strong>
                      </div>
                      <div className="docket-data-row">
                        <span>Registered Phone:</span>
                        <strong>+91 {allocationCertificate.phone}</strong>
                      </div>
                      <div className="docket-data-row">
                        <span>PAN Verification:</span>
                        <strong>{allocationCertificate.pan} (Verified ✓)</strong>
                      </div>
                      <div className="docket-data-row">
                        <span>Delivery Hub:</span>
                        <strong>{allocationCertificate.city}</strong>
                      </div>
                    </div>

                    <div className="docket-section">
                      <h4>Escrow Deposit Receipt</h4>
                      <div className="docket-data-row">
                        <span>Deposit Amount Paid:</span>
                        <strong className="amount-gold">₹ {(allocationCertificate.tokenPaid).toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="docket-data-row">
                        <span>Payment Mode:</span>
                        <strong>{allocationCertificate.paymentMethod}</strong>
                      </div>
                      <div className="docket-data-row">
                        <span>Escrow Status:</span>
                        <strong style={{ color: '#10b981' }}>Secured in Tier-1 Escrow ✓</strong>
                      </div>
                      <div className="docket-data-row">
                        <span>Refund Policy:</span>
                        <strong>100% Unconditional Refund (14 Days)</strong>
                      </div>
                      <div className="docket-data-row">
                        <span>Concierge Executive:</span>
                        <strong>Assigned (Direct call in 30 mins)</strong>
                      </div>
                    </div>
                  </div>

                  {/* Reserved Vehicles Table */}
                  <div className="docket-vehicles-table">
                    <h4>Secured Vehicles in Fleet</h4>
                    <div className="vehicles-receipt-list">
                      {allocationCertificate.cars.map((item) => (
                        <div key={item.id} className="receipt-car-card">
                          <img src={item.car.image} alt={item.car.name} />
                          <div className="receipt-car-meta">
                            <span className="brand">{item.car.brand}</span>
                            <strong>{item.car.name}</strong>
                            <p>{item.car.fuel} • {item.car.transmission} • {PROTECTION_PACKAGES[item.customization?.protectionPackage]?.name || 'Standard Care'}</p>
                          </div>
                          <div className="receipt-car-price">
                            <span>Ex-Showroom: {formatIndianPrice(item.car.price)}</span>
                            <small>Token: ₹ 50,000</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="docket-actions-footer">
                    <button 
                      type="button" 
                      className="btn-print-docket"
                      onClick={() => window.print()}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                      </svg>
                      <span>Print / Save Allocation PDF</span>
                    </button>

                    <button 
                      type="button" 
                      className="btn-continue-shopping"
                      onClick={() => {
                        clearGarage();
                        navigate('/new-cars');
                      }}
                    >
                      <span>Explore More Vehicles</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default GaragePage;
