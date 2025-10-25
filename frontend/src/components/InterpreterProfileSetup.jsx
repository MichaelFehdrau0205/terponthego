import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function InterpreterProfileSetup() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    profile_photo: '',
    years_experience: '',
    specializations: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3001/api/profile/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userType: 'interpreter',
          ...formData
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Profile submitted! Your application is pending review by our team.');
        navigate('/interpreter-dashboard');
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('❌ Profile setup error:', err);
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>🔴 Complete Your Interpreter Profile</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Welcome {user.name}! Please complete your profile. Our team will review your application.
      </p>
      
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        {/* Profile Photo Preview */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '30px' 
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            margin: '0 auto',
            backgroundColor: '#f44336',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #ffebee'
          }}>
            {formData.profile_photo ? (
              <img 
                src={formData.profile_photo} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<span style="color: white; fontSize: 48px; fontWeight: bold">${user.name ? user.name[0].toUpperCase() : '?'}</span>`;
                }}
              />
            ) : (
              <span style={{ color: 'white', fontSize: '48px', fontWeight: 'bold' }}>
                {user.name ? user.name[0].toUpperCase() : '?'}
              </span>
            )}
          </div>
          <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
            Your Profile Photo
          </p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Profile Photo URL:</label>
          <input
            type="url"
            name="profile_photo"
            value={formData.profile_photo}
            onChange={handleChange}
            placeholder="https://example.com/your-photo.jpg (optional)"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          <small style={{ color: '#666' }}>Or leave blank for default avatar</small>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Phone Number: *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="555-123-4567"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Street Address: *</label>
          <input
            type="text"
            name="address"
            spellCheck="true"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="123 Main St"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Apt/Suite/Unit (Optional):</label>
          <input
            type="text"
            name="apt_unit"
            spellCheck="true"
            value={formData.apt_unit || ''}
            onChange={handleChange}
            placeholder="Apt 2B, Suite 100, etc."
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ flex: 2 }}>
            <label>City: *</label>
            <input
              type="text"
              name="city"
              spellCheck="true"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Springville"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>State: *</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="">Select State</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label>State: *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              placeholder="NY"
              maxLength="2"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label>ZIP: *</label>
            <input
              type="text"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              required
              placeholder="14141"
              maxLength="10"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Years of Experience: *</label>
          <input
            type="number"
            name="years_experience"
            value={formData.years_experience}
            onChange={handleChange}
            required
            min="0"
            max="50"
            placeholder="5"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Specializations:</label>
          <textarea
            name="specializations"
            value={formData.specializations}
            onChange={handleChange}
            placeholder="e.g., Medical, Legal, Educational (optional)"
            rows="3"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ 
          padding: '15px',
          backgroundColor: '#fff3e0',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>⚠️ Next Steps:</h4>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            After submitting, our verification team will review your:
          </p>
          <ul style={{ margin: '10px 0', fontSize: '14px' }}>
            <li>Certification documents</li>
            <li>Professional references</li>
            <li>Video introduction (submitted separately)</li>
          </ul>
          <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
            You'll receive an email when your application is approved!
          </p>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginTop: '10px'
          }}
        >
          {loading ? 'Submitting...' : 'Submit for Review'}
        </button>
      </form>
    </div>
  );
}

export default InterpreterProfileSetup;
