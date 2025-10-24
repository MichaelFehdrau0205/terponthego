import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateRequestForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: '',
    date_time: '',
    message: ''
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

    if (!token) {
      setError('Please login first');
      setLoading(false);
      return;
    }

    console.log('🔄 Creating request:', formData);

    try {
      const response = await fetch('http://localhost:3001/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('✅ Create request response:', data);

      if (data.success) {
        alert('Request created successfully! Interpreters will be notified.');
        navigate('/deaf-dashboard');
      } else {
        setError(data.message || 'Failed to create request');
      }
    } catch (err) {
      console.error('❌ Create request error:', err);
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h2>🤟 Request an Interpreter</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Fill out the details below
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
        <div style={{ marginBottom: '15px' }}>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g., City Hospital, 123 Main St"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Date & Time:</label>
          <input
            type="datetime-local"
            name="date_time"
            value={formData.date_time}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Additional Message (Optional):</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Any specific requirements or details..."
            rows="4"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

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
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Creating Request...' : 'Submit Request'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        <a href="/deaf-dashboard">Back to Dashboard</a>
      </p>
    </div>
  );
}

export default CreateRequestForm;
