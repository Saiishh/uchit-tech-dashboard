import React, { useState, useEffect } from 'react';

const LoginPage = ({ onLogin, theme, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@uchittechnology.com' && password === 'admin123') {
        onLogin();
      } else {
        setErrors({ general: 'Invalid email or password. Use admin@uchittechnology.com / admin123' });
      }
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 className="login-title">UchitTech AI</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Advanced Surveillance Management System
          </p>
        </div>

        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px',
            zIndex: 1000
          }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div style={{
              background: 'var(--danger-color)',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ borderColor: errors.email ? 'var(--danger-color)' : undefined }}
            />
            {errors.email && (
              <div style={{ color: 'var(--danger-color)', fontSize: '12px', marginTop: '5px' }}>
                {errors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ 
                  paddingRight: '45px',
                  borderColor: errors.password ? 'var(--danger-color)' : undefined 
                }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <div style={{ color: 'var(--danger-color)', fontSize: '12px', marginTop: '5px' }}>
                {errors.password}
              </div>
            )}
          </div>

          <div className="remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember" style={{ color: 'var(--text-secondary)' }}>
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading && <div className="loading-spinner"></div>}
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '25px',
          color: 'var(--text-secondary)',
          fontSize: '12px'
        }}>
          <p>Demo Credentials:</p>
          <p style={{ marginTop: '5px' }}>
            <strong>Email:</strong> admin@uchittechnology.com<br />
            <strong>Password:</strong> admin123
          </p>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          color: 'var(--text-secondary)',
          fontSize: '12px'
        }}>
          <p>© 2024 UchitTech AI. All rights reserved.</p>
          <p>Professional Surveillance Solutions</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;