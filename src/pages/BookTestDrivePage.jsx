import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { formatIndianPrice } from '../components/CarCard';
import { cars } from '../data/cars';
import { getCarSpecifications } from '../data/carSpecifications';
import './BookTestDrivePage.css';

/* 
  BookTestDrivePage Component (Syllabus Modules 1 & 3)
  - Multi-Page SPA Navigation (/book-test-drive)
  - Form Handling in React (Controlled Components, Event Handlers)
  - Comprehensive Validation Strategies (Name, Email Regex, Phone 10-Digit, Future Date, License)
  - Reusable Form Input Patterns (Input, Select, Radio Pills, Checkbox)
  - Live Selected Vehicle Showcase & Booking Confirmation Pass
*/

const DEALERSHIP_HUBS = [
  { id: 'mumbai', name: 'Mumbai — BKC Signature Experience Centre' },
  { id: 'delhi', name: 'Delhi NCR — Golf Course Road Flagship Studio' },
  { id: 'bangalore', name: 'Bangalore — Indiranagar Performance Lounge' },
  { id: 'hyderabad', name: 'Hyderabad — Jubilee Hills Showroom' },
  { id: 'chennai', name: 'Chennai — OMR Luxury Hub' },
  { id: 'pune', name: 'Pune — Koregaon Park Experience Studio' }
];

const TIME_SLOTS = [
  '10:00 AM – 12:00 PM (Morning Exclusive)',
  '12:00 PM – 02:00 PM (Midday Session)',
  '02:00 PM – 04:00 PM (Afternoon Circuit)',
  '04:00 PM – 06:30 PM (Golden Hour Sunset Drive)'
];

function BookTestDrivePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Derive carId from URL parameter or user selection
  const carIdParam = searchParams.get('carId');
  const [userSelectedCarId, setUserSelectedCarId] = useState(null);
  const selectedCarId = userSelectedCarId ?? carIdParam ?? '1';

  // Current car object & authentic specs
  const selectedCar = useMemo(() => {
    return cars.find((c) => String(c.id) === String(selectedCarId)) || cars[0];
  }, [selectedCarId]);

  const carSpecs = useMemo(() => {
    return getCarSpecifications(selectedCar);
  }, [selectedCar]);

  // Get minimum date (tomorrow)
  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cityHub: 'mumbai',
    driveDate: '',
    timeSlot: TIME_SLOTS[0],
    experienceType: 'track', // 'track' | 'doorstep'
    doorstepAddress: '',
    hasLicense: false,
    specialRequests: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Real-time Field Validation
  const validateField = (name, value, allValues = formData) => {
    let error = '';

    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          error = 'Full name is required.';
        } else if (value.trim().length < 3) {
          error = 'Name must be at least 3 characters.';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Name can only contain alphabetic letters.';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address (e.g., name@domain.com).';
        }
        break;

      case 'phone':
        if (!value.trim()) {
          error = 'Mobile phone number is required.';
        } else if (!/^[6-9]\d{9}$/.test(value.replace(/\s+/g, ''))) {
          error = 'Please enter a valid 10-digit Indian mobile number starting with 6-9.';
        }
        break;

      case 'cityHub':
        if (!value) {
          error = 'Please select an authorized experience centre.';
        }
        break;

      case 'driveDate':
        if (!value) {
          error = 'Please select a preferred test drive date.';
        } else if (new Date(value) < new Date(minDate)) {
          error = 'Reservation must be booked at least 24 hours in advance.';
        }
        break;

      case 'timeSlot':
        if (!value) {
          error = 'Please select an appointment time window.';
        }
        break;

      case 'doorstepAddress':
        if (allValues.experienceType === 'doorstep' && !value.trim()) {
          error = 'Doorstep address is required for home/office vehicle delivery.';
        }
        break;

      case 'hasLicense':
        if (!value) {
          error = 'You must confirm possession of a valid Permanent Driving License.';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validate all fields
  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const err = validateField(field, formData[field], formData);
      if (err) newErrors[field] = err;
    });
    return newErrors;
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: fieldValue };
      if (touched[name]) {
        const err = validateField(name, fieldValue, updated);
        setErrors((prevErr) => ({ ...prevErr, [name]: err }));
      }
      return updated;
    });
  };

  // Blur handler for instantaneous touched validation
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  // Switch car selection
  const handleCarSelect = (e) => {
    const newId = e.target.value;
    setUserSelectedCarId(newId);
    setSearchParams({ carId: newId });
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields touched
    const allTouched = Object.keys(formData).reduce((acc, curr) => ({ ...acc, [curr]: true }), {});
    setTouched(allTouched);

    const validationErrors = validateAll();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Scroll to the first error
      const firstErrorKey = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    // Generate verified reference number
    const bookingCode = `TT-VIP-${Math.floor(100000 + Math.random() * 900000)}`;
    const confirmationData = {
      bookingCode,
      car: selectedCar,
      specs: carSpecs,
      customer: { ...formData },
      bookedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setBookingConfirmation(confirmationData);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="testdrive-page-wrapper">
      <Header />

      <main className="testdrive-main">
        <div className="container">
          
          {/* Breadcrumb Navigation */}
          <div className="testdrive-nav-bar">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link to="/" className="breadcrumb-item">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to="/new-cars" className="breadcrumb-item">Inventory</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Schedule Private Test Drive</span>
            </nav>
          </div>

          {/* Success / Booking Confirmation View */}
          {isSubmitted && bookingConfirmation ? (
            <div className="booking-success-container">
              <div className="success-confirmation-card">
                <div className="success-header-badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Reservation Confirmed</span>
                </div>

                <h1 className="success-title">Your Private Test Drive is Booked</h1>
                <p className="success-subtitle">
                  A personalized itinerary and concierge confirmation pass have been dispatched to <strong>{bookingConfirmation.customer.email}</strong>.
                </p>

                {/* VIP Boarding Pass Card */}
                <div className="vip-boarding-pass">
                  <div className="pass-top-banner">
                    <span className="pass-brand-tag">TORQUE TALK VIP PASS</span>
                    <span className="pass-booking-id">{bookingConfirmation.bookingCode}</span>
                  </div>

                  <div className="pass-main-grid">
                    <div className="pass-car-media">
                      <img 
                        src={bookingConfirmation.car.image} 
                        alt={bookingConfirmation.car.name} 
                        className="pass-car-img" 
                      />
                    </div>

                    <div className="pass-car-details">
                      <span className="pass-vehicle-brand">{bookingConfirmation.car.brand}</span>
                      <h2 className="pass-vehicle-title">{bookingConfirmation.car.name}</h2>
                      <div className="pass-vehicle-price">{formatIndianPrice(bookingConfirmation.car.price)}</div>

                      <div className="pass-meta-tags">
                        <span className="pass-meta-pill">
                          {bookingConfirmation.customer.experienceType === 'track' 
                            ? '🏎️ Showroom Track Circuit' 
                            : '🏡 Doorstep VIP Delivery'}
                        </span>
                        <span className="pass-meta-pill">
                          📅 {bookingConfirmation.customer.driveDate}
                        </span>
                        <span className="pass-meta-pill">
                          ⏰ {bookingConfirmation.customer.timeSlot.split(' ')[0]} {bookingConfirmation.customer.timeSlot.split(' ')[1]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pass-footer-grid">
                    <div className="pass-footer-item">
                      <span className="footer-item-label">Guest Pilot</span>
                      <strong className="footer-item-val">{bookingConfirmation.customer.fullName}</strong>
                    </div>
                    <div className="pass-footer-item">
                      <span className="footer-item-label">Contact</span>
                      <strong className="footer-item-val">{bookingConfirmation.customer.phone}</strong>
                    </div>
                    <div className="pass-footer-item">
                      <span className="footer-item-label">Assigned Hub</span>
                      <strong className="footer-item-val">
                        {DEALERSHIP_HUBS.find(h => h.id === bookingConfirmation.customer.cityHub)?.name.split('—')[0] || 'Mumbai BKC'}
                      </strong>
                    </div>
                    <div className="pass-footer-item">
                      <span className="footer-item-label">Concierge Pilot</span>
                      <strong className="footer-item-val">Certified AMG / M Specialist</strong>
                    </div>
                  </div>
                </div>

                <div className="success-action-buttons">
                  <button 
                    type="button" 
                    className="btn-print-pass" 
                    onClick={() => window.print()}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="6 9 6 2 18 2 18 9" />
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                      <rect x="6" y="14" width="12" height="8" />
                    </svg>
                    <span>Print VIP Pass</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn-book-another"
                    onClick={() => {
                      setIsSubmitted(false);
                      setBookingConfirmation(null);
                      setFormData(prev => ({
                        ...prev,
                        fullName: '',
                        email: '',
                        phone: '',
                        driveDate: '',
                        hasLicense: false
                      }));
                      setTouched({});
                      setErrors({});
                    }}
                  >
                    Book Another Model
                  </button>

                  <button 
                    type="button" 
                    className="btn-back-showroom"
                    onClick={() => navigate('/new-cars')}
                  >
                    Back to Inventory
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Booking Form Layout */
            <div className="testdrive-content-grid">
              
              {/* Left Column: Selected Car Preview & Fast Telemetry */}
              <aside className="testdrive-vehicle-panel">
                <div className="panel-card sticky-vehicle-card">
                  
                  {/* Vehicle Switcher Dropdown */}
                  <div className="vehicle-picker-group">
                    <label htmlFor="vehicle-select" className="vehicle-picker-label">
                      Choose Showroom Vehicle ({cars.length} Available)
                    </label>
                    <div className="select-wrapper">
                      <select 
                        id="vehicle-select"
                        value={selectedCar.id} 
                        onChange={handleCarSelect}
                        className="vehicle-dropdown-select"
                      >
                        {cars.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.brand} {c.name} — {formatIndianPrice(c.price)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Vehicle Visual Card */}
                  <div className="vehicle-card-showcase">
                    <div className="vehicle-card-img-wrap">
                      <img 
                        src={selectedCar.image} 
                        alt={selectedCar.name} 
                        className="vehicle-card-img" 
                      />
                      <span className={`vehicle-card-badge ${selectedCar.isUsed ? 'badge-used' : 'badge-new'}`}>
                        {selectedCar.isUsed ? 'Certified Pre-Owned' : 'Brand New'}
                      </span>
                    </div>

                    <div className="vehicle-card-meta">
                      <span className="vehicle-card-brand">{selectedCar.brand}</span>
                      <h2 className="vehicle-card-name">{selectedCar.name}</h2>
                      <div className="vehicle-card-price">{formatIndianPrice(selectedCar.price)}</div>
                    </div>

                    {/* Fast Specs Matrix */}
                    {carSpecs ? (
                      <div className="vehicle-fast-specs">
                        <div className="fast-spec-item">
                          <span className="spec-k">Power</span>
                          <strong className="spec-v">{carSpecs.power.split('@')[0]}</strong>
                        </div>
                        <div className="fast-spec-item">
                          <span className="spec-k">0–100</span>
                          <strong className="spec-v text-cyan">{carSpecs.acceleration}</strong>
                        </div>
                        <div className="fast-spec-item">
                          <span className="spec-k">Top Speed</span>
                          <strong className="spec-v">{carSpecs.topSpeed}</strong>
                        </div>
                        <div className="fast-spec-item">
                          <span className="spec-k">Gearbox</span>
                          <strong className="spec-v">{selectedCar.transmission}</strong>
                        </div>
                      </div>
                    ) : (
                      <div className="vehicle-fast-specs">
                        <div className="fast-spec-item">
                          <span className="spec-k">Fuel</span>
                          <strong className="spec-v">{selectedCar.fuel}</strong>
                        </div>
                        <div className="fast-spec-item">
                          <span className="spec-k">Transmission</span>
                          <strong className="spec-v">{selectedCar.transmission}</strong>
                        </div>
                        <div className="fast-spec-item">
                          <span className="spec-k">Capacity</span>
                          <strong className="spec-v">{selectedCar.seating} Seats</strong>
                        </div>
                        <div className="fast-spec-item">
                          <span className="spec-k">Rating</span>
                          <strong className="spec-v">★ {selectedCar.rating}</strong>
                        </div>
                      </div>
                    )}

                    <div className="testdrive-perks-box">
                      <div className="perk-row">
                        <span className="perk-check">✓</span>
                        <span>Full performance track demonstration with a professional driver</span>
                      </div>
                      <div className="perk-row">
                        <span className="perk-check">✓</span>
                        <span>Zero obligation, sanitized vehicle with complimentary beverage service</span>
                      </div>
                      <div className="perk-row">
                        <span className="perk-check">✓</span>
                        <span>Comprehensive telemetry diagnostic debrief post-drive</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Right Column: The Controlled Reservation Form */}
              <section className="testdrive-form-panel">
                <div className="panel-card form-card">
                  
                  <div className="form-header">
                    <span className="form-eyebrow">Concierge Reservation</span>
                    <h1 className="form-title">Schedule Your Private Test Drive</h1>
                    <p className="form-subtitle">
                      Complete the credentials below to secure your dedicated appointment with the {selectedCar.brand} {selectedCar.name}.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="reservation-form">
                    
                    {/* 1. Experience Type Toggle */}
                    <div className="form-section">
                      <span className="section-legend">1. Select Driving Experience</span>
                      
                      <div className="experience-pills-row">
                        <label className={`experience-pill ${formData.experienceType === 'track' ? 'active' : ''}`}>
                          <input 
                            type="radio" 
                            name="experienceType" 
                            value="track" 
                            checked={formData.experienceType === 'track'}
                            onChange={handleChange}
                            className="radio-hidden"
                          />
                          <span className="pill-icon">🏎️</span>
                          <div className="pill-content">
                            <strong>Showroom & Circuit Drive</strong>
                            <span>Experience high-speed cornering & acceleration on track</span>
                          </div>
                        </label>

                        <label className={`experience-pill ${formData.experienceType === 'doorstep' ? 'active' : ''}`}>
                          <input 
                            type="radio" 
                            name="experienceType" 
                            value="doorstep" 
                            checked={formData.experienceType === 'doorstep'}
                            onChange={handleChange}
                            className="radio-hidden"
                          />
                          <span className="pill-icon">🏡</span>
                          <div className="pill-content">
                            <strong>VIP Doorstep Delivery</strong>
                            <span>Vehicle brought directly to your home or office address</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* 2. Personal Information */}
                    <div className="form-section">
                      <span className="section-legend">2. Pilot Credentials</span>

                      <div className="form-grid-2">
                        {/* Full Name */}
                        <div className={`form-field ${touched.fullName && errors.fullName ? 'has-error' : ''}`}>
                          <label htmlFor="fullName" className="field-label">
                            Full Legal Name <span className="req">*</span>
                          </label>
                          <div className="input-container">
                            <span className="field-icon">👤</span>
                            <input 
                              type="text" 
                              id="fullName"
                              name="fullName"
                              placeholder="e.g. Vikramaditya Singhania"
                              value={formData.fullName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="text-input"
                              autoComplete="name"
                            />
                          </div>
                          {touched.fullName && errors.fullName && (
                            <span className="field-error-msg">{errors.fullName}</span>
                          )}
                        </div>

                        {/* Phone Number */}
                        <div className={`form-field ${touched.phone && errors.phone ? 'has-error' : ''}`}>
                          <label htmlFor="phone" className="field-label">
                            Mobile Phone Number <span className="req">*</span>
                          </label>
                          <div className="input-container">
                            <span className="field-prefix">+91</span>
                            <input 
                              type="tel" 
                              id="phone"
                              name="phone"
                              placeholder="98201 54321"
                              value={formData.phone}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="text-input with-prefix"
                              autoComplete="tel"
                            />
                          </div>
                          {touched.phone && errors.phone && (
                            <span className="field-error-msg">{errors.phone}</span>
                          )}
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className={`form-field ${touched.email && errors.email ? 'has-error' : ''}`}>
                        <label htmlFor="email" className="field-label">
                          Email Address (for Itinerary & Pass) <span className="req">*</span>
                        </label>
                        <div className="input-container">
                          <span className="field-icon">✉️</span>
                          <input 
                            type="email" 
                            id="email"
                            name="email"
                            placeholder="vikram@luxuryauto.in"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="text-input"
                            autoComplete="email"
                          />
                        </div>
                        {touched.email && errors.email && (
                          <span className="field-error-msg">{errors.email}</span>
                        )}
                      </div>
                    </div>

                    {/* 3. Appointment Logistics */}
                    <div className="form-section">
                      <span className="section-legend">3. Schedule & Location</span>

                      <div className="form-grid-2">
                        {/* City / Hub */}
                        <div className={`form-field ${touched.cityHub && errors.cityHub ? 'has-error' : ''}`}>
                          <label htmlFor="cityHub" className="field-label">
                            Experience Centre / Dealership Hub <span className="req">*</span>
                          </label>
                          <div className="input-container">
                            <select 
                              id="cityHub"
                              name="cityHub"
                              value={formData.cityHub}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="select-input"
                            >
                              {DEALERSHIP_HUBS.map((hub) => (
                                <option key={hub.id} value={hub.id}>
                                  {hub.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          {touched.cityHub && errors.cityHub && (
                            <span className="field-error-msg">{errors.cityHub}</span>
                          )}
                        </div>

                        {/* Preferred Date */}
                        <div className={`form-field ${touched.driveDate && errors.driveDate ? 'has-error' : ''}`}>
                          <label htmlFor="driveDate" className="field-label">
                            Preferred Date <span className="req">*</span>
                          </label>
                          <div className="input-container">
                            <input 
                              type="date" 
                              id="driveDate"
                              name="driveDate"
                              min={minDate}
                              value={formData.driveDate}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="text-input date-input"
                            />
                          </div>
                          {touched.driveDate && errors.driveDate && (
                            <span className="field-error-msg">{errors.driveDate}</span>
                          )}
                        </div>
                      </div>

                      {/* Time Window */}
                      <div className={`form-field ${touched.timeSlot && errors.timeSlot ? 'has-error' : ''}`}>
                        <label htmlFor="timeSlot" className="field-label">
                          Preferred Time Window <span className="req">*</span>
                        </label>
                        <div className="input-container">
                          <select 
                            id="timeSlot"
                            name="timeSlot"
                            value={formData.timeSlot}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="select-input"
                          >
                            {TIME_SLOTS.map((slot, idx) => (
                              <option key={idx} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>
                        {touched.timeSlot && errors.timeSlot && (
                          <span className="field-error-msg">{errors.timeSlot}</span>
                        )}
                      </div>

                      {/* Conditional Doorstep Address Input */}
                      {formData.experienceType === 'doorstep' && (
                        <div className={`form-field ${touched.doorstepAddress && errors.doorstepAddress ? 'has-error' : ''}`}>
                          <label htmlFor="doorstepAddress" className="field-label">
                            Doorstep Delivery Address (Residential / Office) <span className="req">*</span>
                          </label>
                          <div className="input-container">
                            <input 
                              type="text" 
                              id="doorstepAddress"
                              name="doorstepAddress"
                              placeholder="e.g. Penthouse 42, Altamount Road, Cumballa Hill, Mumbai 400026"
                              value={formData.doorstepAddress}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="text-input"
                            />
                          </div>
                          {touched.doorstepAddress && errors.doorstepAddress && (
                            <span className="field-error-msg">{errors.doorstepAddress}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 4. Terms & Special Requirements */}
                    <div className="form-section">
                      <span className="section-legend">4. Driving License & Special Notes</span>

                      {/* Special Requests (Optional) */}
                      <div className="form-field">
                        <label htmlFor="specialRequests" className="field-label">
                          Special Preferences or Technical Inquiries (Optional)
                        </label>
                        <textarea 
                          id="specialRequests"
                          name="specialRequests"
                          rows="3"
                          placeholder="e.g. Would like to test launch control on track, or compare against my current Porsche 911."
                          value={formData.specialRequests}
                          onChange={handleChange}
                          className="textarea-input"
                        ></textarea>
                      </div>

                      {/* Driving License Mandatory Checkbox */}
                      <div className={`checkbox-field-wrap ${touched.hasLicense && errors.hasLicense ? 'has-error' : ''}`}>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            id="hasLicense"
                            name="hasLicense"
                            checked={formData.hasLicense}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="checkbox-input"
                          />
                          <span className="checkbox-custom"></span>
                          <span className="checkbox-text">
                            I verify that I hold an active and valid <strong>Permanent Driving License</strong> and agree to present original photo identification prior to test drive departure.
                          </span>
                        </label>
                        {touched.hasLicense && errors.hasLicense && (
                          <span className="field-error-msg block-error">{errors.hasLicense}</span>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="form-submit-container">
                      <button type="submit" className="btn-submit-reservation">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Confirm VIP Test Drive Reservation</span>
                      </button>
                      <p className="submit-disclaimer">
                        🔒 Confidential & Encrypted. No spam guarantee. Torque Talk respects your privacy.
                      </p>
                    </div>

                  </form>
                </div>
              </section>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BookTestDrivePage;
