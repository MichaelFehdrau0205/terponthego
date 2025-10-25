import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

console.log('🎨 NEW DASHBOARD LOADING!');

function DeafDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3001/api/requests/my-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const activeRequests = requests.filter(r => r.status === 'pending' || r.status === 'accepted');
  const nextRequest = activeRequests[0];
  const recentInterpreter = requests.find(r => r.interpreter_name)?.interpreter_name || 'None yet';

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>👋 Welcome, {user.name}!</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            🦻 Deaf User Dashboard
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="profile-circle" style={{ backgroundColor: 'var(--deaf-primary)' }}>
            {user.profile_photo ? (
              <img src={user.profile_photo} alt="Profile" />
            ) : (
              <div className="profile-circle-initial">
                {user.name ? user.name[0].toUpperCase() : '?'}
              </div>
            )}
          </div>
          <button onClick={handleLogout} style={{
            padding: '8px 16px',
            backgroundColor: '#6C757D',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Logout
          </button>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--deaf-primary)' }}>
            {activeRequests.length}
          </div>
          <div className="stat-label">Active Requests</div>
        </div>

        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--info)' }}>
            {nextRequest ? 'Today' : 'None'}
          </div>
          <div className="stat-label">Next Appointment</div>
        </div>

        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--success)' }}>
            {recentInterpreter !== 'None yet' ? '✓' : '-'}
          </div>
          <div className="stat-label">Recent Interpreter</div>
          {recentInterpreter !== 'None yet' && (
            <div style={{ fontSize: '14px', marginTop: '4px', fontWeight: '500' }}>
              {recentInterpreter}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">⚡ Quick Actions</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/map" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary-deaf btn-full">
                🗺️ Find Interpreters
              </button>
            </Link>

            <Link to="/create-request" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary-deaf btn-full">
                📝 Request Interpreter
              </button>
            </Link>

            <Link to="/tracking" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary-deaf btn-full">
                🚗 Track Journey
              </button>
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            📋 My Requests ({requests.length})
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              Loading requests...
            </p>
          ) : requests.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              No requests yet. Create your first request!
            </p>
          ) : (
            <div>
              {requests.slice(0, 5).map(request => (
                <div key={request.id} className="list-item">
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {request.location}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {new Date(request.date_time).toLocaleDateString()} at{' '}
                      {new Date(request.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {request.interpreter_name && (
                      <div style={{ fontSize: '14px', color: 'var(--success)', marginTop: '4px' }}>
                        ✓ {request.interpreter_name}
                      </div>
                    )}
                  </div>
                  <div>
                    {request.status === 'pending' && (
                      <span className="badge badge-warning">Pending</span>
                    )}
                    {request.status === 'accepted' && (
                      <span className="badge badge-success">Accepted</span>
                    )}
                    {request.status === 'completed' && (
                      <span className="badge badge-pending">Completed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">📅 Upcoming</div>

          {nextRequest ? (
            <div style={{ padding: '16px', backgroundColor: '#E3F2FD', borderRadius: '8px' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                NEXT APPOINTMENT
              </div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                {nextRequest.location}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {new Date(nextRequest.date_time).toLocaleDateString()}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {new Date(nextRequest.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              {nextRequest.interpreter_name && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #BBDEFB' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    INTERPRETER
                  </div>
                  <div style={{ fontWeight: '600' }}>
                    {nextRequest.interpreter_name}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px 0' }}>
              No upcoming appointments
            </p>
          )}

          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E9ECEF' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              💡 Quick Tips
            </div>
            <ul style={{ fontSize: '14px', color: 'var(--text-secondary)', paddingLeft: '20px', margin: 0 }}>
              <li>Request interpreters 24hrs in advance</li>
              <li>Check interpreter ratings</li>
              <li>Track your journey in real-time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeafDashboard;
