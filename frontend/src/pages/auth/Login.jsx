import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Show password modal
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.user.userType === 'deaf') {
          navigate('/deaf-dashboard');
        } else {
          navigate('/interpreter-dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background image */}
      <div 
        className="login-background"
        style={{
          backgroundImage: 'url(/NYCskyline.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      />

      {/* Login form container */}
      <div className="login-form-container">
        <div className="login-form-box">
          {/* Logo inside form box - upper left */}
          <img 
            src="/bluelogo.png" 
            alt="TERP Logo" 
            className="form-logo"
            style={{
              width: '80px',
              marginBottom: '20px'
            }}
          />

          {/* Trouble signing in text */}
          <p style={{
            fontSize: '12px',
            color: 'white',
            marginBottom: '20px',
            textAlign: 'right',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
          }}>
            Trouble signing in?
          </p>

          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSubmit}>
            {/* Email input - white with 80% transparency */}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                fontSize: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                color: '#333',
                outline: 'none'
              }}
            />

            {/* Blue submit button */}
            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              Log in
            </button>

            {/* Create account link */}
            <p style={{
              textAlign: 'center',
              fontSize: '14px',
              color: 'white',
              marginBottom: '20px',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
            }}>
              Create a new account - <Link to="/signup" style={{ color: '#2196F3', textDecoration: 'none', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)' }}>signup!</Link>
            </p>

            {/* Social login section */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <p style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '15px'
              }}>
                Or sign in with
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px'
              }}>
                {/* Facebook */}
                <a href="#" style={{ textDecoration: 'none' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#1877f2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>f</span>
                  </div>
                </a>

                {/* Google */}
                <a href="#" style={{ textDecoration: 'none' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#ea4335',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>G</span>
                  </div>
                </a>

                {/* Apple */}
                <a href="#" style={{ textDecoration: 'none' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>🍎</span>
                  </div>
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Enter Password</h2>
            
            {error && (
              <div style={{
                backgroundColor: '#fee',
                color: '#c33',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#ccc',
                    color: '#333',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                
                <button 
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Loading...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;