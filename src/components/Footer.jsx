import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

/* 
  Footer Component
  - Standard Semantic HTML structure with responsive columns
  - Navigation routing to About Us & showroom sections
  - Interactive Contact Support Pop-up Modal generating dynamic random direct phone & Gmail
*/
function Footer() {
  const navigate = useNavigate();

  // Contact Support Pop-up Modal State
  const [contactModal, setContactModal] = useState({
    isOpen: false,
    phone: '',
    email: '',
    copiedItem: null
  });

  const generateRandomContact = () => {
    // Generate authentic random Indian mobile number
    const prefixes = ['9820', '9811', '9717', '9930', '9845', '9876', '9769', '9819'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const part1 = Math.floor(100 + Math.random() * 900);
    const part2 = Math.floor(100 + Math.random() * 900);
    const phone = `+91 ${prefix} ${part1} ${part2}`;

    // Generate random concierge Gmail
    const desks = ['support', 'helpdesk', 'concierge', 'care', 'advisor', 'contact'];
    const desk = desks[Math.floor(Math.random() * desks.length)];
    const randomNum = Math.floor(100 + Math.random() * 900);
    const email = `torquetalk.${desk}${randomNum}@gmail.com`;

    return { phone, email };
  };

  const handleOpenContact = (e) => {
    e.preventDefault();
    const { phone, email } = generateRandomContact();
    setContactModal({
      isOpen: true,
      phone,
      email,
      copiedItem: null
    });
  };

  const handleCloseContact = () => {
    setContactModal((prev) => ({ ...prev, isOpen: false, copiedItem: null }));
  };

  const handleCopy = (text, type) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setContactModal((prev) => ({ ...prev, copiedItem: type }));
      setTimeout(() => {
        setContactModal((prev) => ({ ...prev, copiedItem: null }));
      }, 2000);
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="container">
        
        {/* Upper Column list */}
        <div className="footer-grid">
          
          {/* Brand Info with New Automotive Speed Emblem */}
          <div className="footer-col footer-brand">
            <h3 className="footer-logo-wrap">
              <svg 
                width="28" 
                height="28" 
                viewBox="0 0 36 36" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="footer-logo-svg"
              >
                <defs>
                  <linearGradient id="footerEmblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
                <path 
                  d="M18 3L32 9.5V20C32 27.5 25.8 33 18 35C10.2 33 4 27.5 4 20V9.5L18 3Z" 
                  fill="url(#footerEmblemGrad)" 
                  fillOpacity="0.2"
                  stroke="url(#footerEmblemGrad)" 
                  strokeWidth="1.6"
                />
                <path d="M9 13.5L18 8L27 13.5L25 16.5L18 12.2L11 16.5L9 13.5Z" fill="url(#footerEmblemGrad)" />
                <path d="M11.5 19L18 15L24.5 19L23 21.5L18 18.2L13 21.5L11.5 19Z" fill="url(#footerEmblemGrad)" fillOpacity="0.85" />
                <circle cx="18" cy="29" r="1.5" fill="#38bdf8" />
              </svg>
              TORQUE<span className="logo-text-talk">TALK</span>
            </h3>
            <p className="footer-brand-desc">
              Torque Talk is India's premium automobile discovery platform. We assist you in finding, comparing, and selecting the perfect car that seamlessly integrates with your lifestyle and budget.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <span className="footer-col-title">Overview & Features</span>
            <ul className="footer-links">
              <li><span onClick={() => navigate('/new-cars')}>New Car Listings</span></li>
              <li><span onClick={() => navigate('/compare')}>Compare Matrix</span></li>
              <li><span onClick={() => navigate('/garage')}>Luxury Garage Cart</span></li>
              <li><span onClick={() => navigate('/finance')}>Finance & EMI Calculator</span></li>
            </ul>
          </div>

          {/* Column 3: Corporate Info (Careers & Press Releases removed; Contact Support triggers random phone & Gmail popup) */}
          <div className="footer-col">
            <span className="footer-col-title">Corporate</span>
            <ul className="footer-links">
              <li>
                <span 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => navigate('/about-us')}
                >
                  About Us
                </span>
              </li>
              <li>
                <a 
                  href="#contact" 
                  onClick={handleOpenContact}
                  className="footer-contact-link"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div className="footer-col">
            <span className="footer-col-title">Get in Touch</span>
            <div className="footer-links">
              <div className="footer-contact-item">
                <span className="footer-contact-icon">📍</span>
                <span>123 Auto Hub, Bandra Kurla Complex, Mumbai, India</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">📞</span>
                <span>+91 22 5555 0199</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">✉️</span>
                <span>discover@torquetalk.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Copyright bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Torque Talk India Private Ltd. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Cookie Settings</a>
          </div>
        </div>
      </div>

      {/* Direct Contact Support Pop-up Modal (Syllabus Module 4: Modal Pattern) */}
      {contactModal.isOpen && (
        <div className="footer-contact-modal-backdrop" onClick={handleCloseContact}>
          <div 
            className="footer-contact-modal-card" 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            <button 
              type="button" 
              className="btn-contact-modal-close" 
              onClick={handleCloseContact}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="contact-modal-badge">Direct Concierge Support</div>
            <h3 id="contact-modal-title" className="contact-modal-title">
              Contact Customer Care
            </h3>
            <p className="contact-modal-desc">
              Connect with an assigned Torque Talk luxury automotive specialist directly:
            </p>

            <div className="contact-modal-info-list">
              {/* Phone item */}
              <div className="contact-info-block">
                <div className="contact-block-icon">📞</div>
                <div className="contact-block-text">
                  <span className="contact-block-label">Direct Mobile Support</span>
                  <strong className="contact-block-value">{contactModal.phone}</strong>
                </div>
                <div className="contact-block-actions">
                  <button 
                    type="button" 
                    className="btn-contact-copy"
                    onClick={() => handleCopy(contactModal.phone, 'phone')}
                    title="Copy phone number"
                  >
                    {contactModal.copiedItem === 'phone' ? '✓ Copied' : 'Copy'}
                  </button>
                  <a 
                    href={`tel:${contactModal.phone.replace(/\s+/g, '')}`} 
                    className="btn-contact-action"
                  >
                    Call
                  </a>
                </div>
              </div>

              {/* Email item */}
              <div className="contact-info-block">
                <div className="contact-block-icon">✉️</div>
                <div className="contact-block-text">
                  <span className="contact-block-label">Dedicated Support G-Mail</span>
                  <strong className="contact-block-value">{contactModal.email}</strong>
                </div>
                <div className="contact-block-actions">
                  <button 
                    type="button" 
                    className="btn-contact-copy"
                    onClick={() => handleCopy(contactModal.email, 'email')}
                    title="Copy email"
                  >
                    {contactModal.copiedItem === 'email' ? '✓ Copied' : 'Copy'}
                  </button>
                  <a 
                    href={`mailto:${contactModal.email}`} 
                    className="btn-contact-action"
                  >
                    Mail
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-modal-footer">
              <span className="concierge-hours">⚡ Operational 24/7 • Average response time under 15 minutes</span>
              <button 
                type="button" 
                className="btn-contact-done"
                onClick={handleCloseContact}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
