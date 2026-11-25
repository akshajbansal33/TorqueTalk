import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Status states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Seed default demo users in localStorage if not present
  useEffect(() => {
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
      const defaultUsers = [
        { name: 'John Doe', email: 'user@torquetalk.com', password: 'user123' },
        { name: 'Admin Talk', email: 'admin@torquetalk.com', password: 'admin123' }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
  }, []);

  // Quick fill handler for demo accounts
  const handleDemoFill = (demoEmail, demoPassword) => {
    setActiveTab('login');
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setSuccess('Demo credentials loaded. Click "Sign In" to proceed.');
  };

  // Handle Login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (matchedUser) {
      localStorage.setItem('currentUser', JSON.stringify(matchedUser));
      setSuccess(`Welcome back, ${matchedUser.name}! Redirecting to dashboard...`);
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } else {
      setError('Invalid email address or password.');
    }
  };

  // Handle Signup submission
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!name || !email || !password) {
      setError('Please complete all fields to register.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (emailExists) {
      setError('An account with this email address already exists.');
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    setSuccess('Account successfully created! Redirecting to dashboard...');
    setTimeout(() => {
      navigate('/');
    }, 1200);
  };

  return (
    <div className="login-page-container">
      {/* Left side cinematic video hero banner */}
      <div className="login-side-image">
        <video 
          className="login-side-video" 
          autoPlay 
          loop 
          muted 
          playsInline
          src="/video/login page.mp4"
        >
          Your browser does not support the video tag.
        </video>
        <div className="login-side-overlay"></div>
        <div className="login-image-content">
          <h2>Your Journey to Premium Motoring Starts Here</h2>
        </div>
      </div>

      {/* Right side professional card form */}
      <div className="login-side-form">
        <div className="login-form-card">
          {/* Top Home Back Link */}
          <button className="login-back-btn" onClick={() => navigate('/')} title="Back to Home">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Home</span>
          </button>

          {/* Form Header */}
          <div className="login-header">
            <div className="login-logo-row" onClick={() => navigate('/')}>
              <span className="login-logo-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </span>
              <h1 className="login-title">
                Torque<span className="logo-accent">Talk</span>
              </h1>
            </div>
            <p className="login-subtitle">
              {activeTab === 'login' ? 'Sign in to access your account' : 'Create an account to get started'}
            </p>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="login-toggle-tabs">
            <button 
              type="button" 
              className={`login-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
            >
              Sign In
            </button>
            <button 
              type="button" 
              className={`login-tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => { setActiveTab('signup'); setError(''); setSuccess(''); }}
            >
              Create Account
            </button>
          </div>

          {/* Notification Alerts */}
          {error && (
            <div className="login-error-msg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="login-success-msg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>{success}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="login-form-group">
                <label className="login-label">Email Address</label>
                <div className="login-input-wrapper">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <input 
                    type="email" 
                    className="login-input" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="login-form-group">
                <label className="login-label">Password</label>
                <div className="login-input-wrapper">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input 
                    type="password" 
                    className="login-input" 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="login-btn-submit">
                <span>Sign In</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              
              {/* Sleek Demo Quick Access */}
              <div className="demo-credentials-box">
                <div className="demo-header">
                  <span className="demo-title">Quick Demo Sign In</span>
                  <span className="demo-badge">One-Click</span>
                </div>
                <div className="demo-chips">
                  <button 
                    type="button" 
                    className="demo-chip"
                    onClick={() => handleDemoFill('user@torquetalk.com', 'user123')}
                  >
                    <span className="demo-role">User:</span> user@torquetalk.com
                  </button>
                  <button 
                    type="button" 
                    className="demo-chip"
                    onClick={() => handleDemoFill('admin@torquetalk.com', 'admin123')}
                  >
                    <span className="demo-role">Admin:</span> admin@torquetalk.com
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit}>
              <div className="login-form-group">
                <label className="login-label">Full Name</label>
                <div className="login-input-wrapper">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    className="login-input" 
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="login-form-group">
                <label className="login-label">Email Address</label>
                <div className="login-input-wrapper">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <input 
                    type="email" 
                    className="login-input" 
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="login-form-group">
                <label className="login-label">Password</label>
                <div className="login-input-wrapper">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input 
                    type="password" 
                    className="login-input" 
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="login-btn-submit">
                <span>Create Account</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

