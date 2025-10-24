import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ViewRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Please login first');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/requests/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('✅ Fetched requests:', data);

      if (data.success) {
        setRequests(data.requests);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('❌ Fetch requests error:', err);
      setError('Could not load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:3001/api/requests/${requestId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('Request accepted! The deaf user will be notified.');
        // Refresh the list
        fetchRequests();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('❌ Accept request error:', err);
      alert('Failed to accept request');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Loading requests...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h2>📋 Available Requests</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Accept requests from deaf users who need interpreters
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

      {requests.length === 0 ? (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <h3>No pending requests</h3>
          <p>Check back later for new interpreter requests</p>
        </div>
      ) : (
        <div>
          {requests.map((request) => (
            <div 
              key={request.id} 
              style={{ 
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '15px',
                backgroundColor: 'white',
                color: "black"
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <strong>From:</strong> {request.deaf_user_name}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>📍 Location:</strong> {request.location}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>📅 Date & Time:</strong> {new Date(request.date_time).toLocaleString()}
              </div>
              {request.message && (
                <div style={{ marginBottom: '10px' }}>
                  <strong>💬 Message:</strong> {request.message}
                </div>
              )}
              <div style={{ marginTop: '15px' }}>
                <button
                  onClick={() => handleAccept(request.id)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Accept Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ marginTop: '30px', textAlign: 'center' }}>
        <a href="/interpreter-dashboard">Back to Dashboard</a>
      </p>
    </div>
  );
}

export default ViewRequestsPage;
