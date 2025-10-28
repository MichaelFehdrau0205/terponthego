import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userType) {
      setError('Please select Deaf or Interpreter');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          firstName,
          lastName,
          userType 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Route based on userType
        if (userType === 'deaf') {
          navigate('/profile-setup/deaf');
        } else {
          navigate('/profile-setup/interpreter');
        }
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* Background image */}
      <div 
        className="signup-background"
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

      {/* Signup form container */}
      <div className="signup-form-container">
        <div className="signup-form-box">
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

          {/* Headline */}
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            Create your TERP account
          </h1>

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

          <form onSubmit={handleSubmit}>
            {/* First Name and Last Name */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '4px',
                  fontSize: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  color: '#333',
                  outline: 'none'
                }}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '4px',
                  fontSize: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  color: '#333',
                  outline: 'none'
                }}
              />
            </div>

            {/* Radio buttons for Deaf/Interpreter */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <label style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '4px',
                  backgroundColor: userType === 'deaf' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#333'
                }}>
                  <input
                    type="radio"
                    name="userType"
                    value="deaf"
                    checked={userType === 'deaf'}
                    onChange={(e) => setUserType(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  DEAF
                </label>

                <label style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '4px',
                  backgroundColor: userType === 'interpreter' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#333'
                }}>
                  <input
                    type="radio"
                    name="userType"
                    value="interpreter"
                    checked={userType === 'interpreter'}
                    onChange={(e) => setUserType(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  INTERPRETER
                </label>
              </div>
            </div>

            {/* Blue submit button */}
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '20px'
              }}
            >
              {loading ? 'Loading...' : 'Create an account'}
            </button>

            {/* Social signup section */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
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
                gap: '20px',
                marginBottom: '20px'
              }}>
                {/* Facebook */}
                <a href="#" style={{ textDecoration: 'none' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#2196F3',
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
                    backgroundColor: '#2196F3',
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
                    backgroundColor: '#2196F3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>🍎</span>
                  </div>
                </a>
              </div>

              {/* Terms text */}
              <p style={{
                fontSize: '11px',
                color: '#666',
                textAlign: 'center',
                lineHeight: '1.4'
              }}>
                By creating an account, you agree to our <a href="#" style={{ color: '#2196F3' }}>user agreement</a> and acknowledge our <a href="#" style={{ color: '#2196F3' }}>privacy notice</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;