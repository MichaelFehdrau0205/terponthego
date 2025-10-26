import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Green icon for interpreter
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Blue icon for deaf user requests
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function InterpreterDashboard() {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recurringSchedules, setRecurringSchedules] = useState([]);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    weekAppointments: 0,
    totalCompleted: 0,
    rating: 0
  });

  // Interpreter location (example - should come from user profile)
  const interpreterLocation = {
    lat: 42.8864,
    lng: -78.8784,
    name: 'Your Location'
  };

  useEffect(() => {
    // TODO: Fetch real data from backend
    // Mock data for now
    setIncomingRequests([
      {
        id: 1,
        deafUserName: 'John Doe',
        location: 'Buffalo General Hospital',
        distance: 5.2,
        time: '2pm tomorrow',
        date: '2025-10-26',
        paymentType: 'Government',
        latitude: 42.9000,
        longitude: -78.8500
      },
      {
        id: 2,
        deafUserName: 'Sarah Smith',
        location: 'Job Interview - Tech Company',
        distance: 3.1,
        time: '10am Monday',
        date: '2025-10-27',
        paymentType: 'Self-Pay',
        latitude: 42.8700,
        longitude: -78.9000
      }
    ]);

    setUpcomingAppointments([
      {
        id: 3,
        deafUserName: 'Mike Johnson',
        location: 'High School',
        distance: 2.1,
        time: 'Today 3pm',
        date: '2025-10-25'
      }
    ]);

    setRecurringSchedules([
      {
        id: 1,
        schedule: 'Mon/Wed/Fri 9am',
        location: 'Elementary School',
        deafUserName: 'Student Group'
      },
      {
        id: 2,
        schedule: 'Every Tuesday 2pm',
        location: 'Therapy Center',
        deafUserName: 'Client A'
      }
    ]);

    setStats({
      todayEarnings: 250,
      weekAppointments: 3,
      totalCompleted: 47,
      rating: 4.9
    });
  }, []);

  const handleAcceptRequest = (requestId) => {
    alert(`Accepting request ${requestId}...`);
    // TODO: Call backend API to accept request
  };

  const handleDeclineRequest = (requestId) => {
    alert(`Declining request ${requestId}...`);
    // TODO: Call backend API to decline request
  };

  const handleViewRoute = (appointment) => {
    alert(`Opening route to ${appointment.location}...`);
    // TODO: Open route in map or navigation app
  };

  const handleContactClient = (appointment) => {
    alert(`Contacting ${appointment.deafUserName}...`);
    // TODO: Open messaging/video call
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#7C995B',
          marginBottom: '5px'
        }}>
          Interpreter Dashboard
        </h1>
        <p style={{ color: '#666' }}>
         Welcome back, {localStorage.getItem('userName') || 'there'}! Here are your upcoming opportunities.</p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#666' }}>Today's Earnings</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#7C995B' }}>
            ${stats.todayEarnings}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#666' }}>This Week</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#7C995B' }}>
            {stats.weekAppointments} appts
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#666' }}>Total Completed</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#7C995B' }}>
            {stats.totalCompleted}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#666' }}>Rating</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#7C995B' }}>
            {stats.rating} ★
          </div>

        </div>
      </div>

      {/* Main Content - Map + Requests */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        
        {/* Left Side - Map */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            marginBottom: '15px',
            color: '#7C995B'
          }}>
            🗺️ Request Locations
          </h3>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
            🟢 You | 🔵 Requests
          </p>
          
          <MapContainer 
            center={[interpreterLocation.lat, interpreterLocation.lng]} 
            zoom={11} 
            style={{ height: '400px', width: '100%', borderRadius: '8px' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Interpreter location */}
            <Marker position={[interpreterLocation.lat, interpreterLocation.lng]} icon={greenIcon}>
              <Popup>
                <strong>📍 Your Location</strong>
              </Popup>
            </Marker>

            {/* Request locations */}
            {incomingRequests.map((request) => (
              <Marker 
                key={request.id} 
                position={[request.latitude, request.longitude]} 
                icon={blueIcon}
              >
                <Popup>
                  <div style={{ textAlign: 'center' }}>
                    <strong>{request.location}</strong>
                    <p style={{ fontSize: '12px', margin: '5px 0' }}>
                      {request.distance} miles away
                    </p>
                    <p style={{ fontSize: '12px' }}>{request.time}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Right Side - Requests & Appointments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Incoming Requests */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '15px',
              color: '#7C995B'
            }}>
              📬 Incoming Requests ({incomingRequests.length})
            </h3>
            
            {incomingRequests.length === 0 ? (
              <p style={{ color: '#666' }}>No new requests at the moment.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {incomingRequests.map((request) => (
                  <div 
                    key={request.id}
                    style={{
                      border: '1px solid #e0e0e0',
                      padding: '15px',
                      borderRadius: '8px',
                      backgroundColor: '#fafafa'
                    }}
                  >
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        {request.location}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        Client: {request.deafUserName}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        📍 {request.distance} miles away | {request.time}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        💳 Payment: {request.paymentType}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => handleAcceptRequest(request.id)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          backgroundColor: '#7C995B',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleDeclineRequest(request.id)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          backgroundColor: '#999',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Appointments */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '15px',
              color: '#7C995B'
            }}>
              📅 Upcoming Appointments ({upcomingAppointments.length})
            </h3>
            
            {upcomingAppointments.length === 0 ? (
              <p style={{ color: '#666' }}>No upcoming appointments.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {upcomingAppointments.map((appt) => (
                  <div 
                    key={appt.id}
                    style={{
                      border: '1px solid #e0e0e0',
                      padding: '12px',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{appt.time}: {appt.location}</div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        📍 {appt.distance} mi | {appt.deafUserName}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleViewRoute(appt)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#7C995B',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        View Route
                      </button>
                      <button 
                        onClick={() => handleContactClient(appt)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#5a7a42',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recurring Schedules */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '15px',
              color: '#7C995B'
            }}>
              🔄 Recurring Schedules
            </h3>
            
            {recurringSchedules.length === 0 ? (
              <p style={{ color: '#666' }}>No recurring schedules.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recurringSchedules.map((schedule) => (
                  <div 
                    key={schedule.id}
                    style={{
                      border: '1px solid #e0e0e0',
                      padding: '12px',
                      borderRadius: '6px',
                      backgroundColor: '#f9fdf7'
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{schedule.schedule}</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {schedule.location} | {schedule.deafUserName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#7C995B',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              📊 View History
            </button>
            <button style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#5a7a42',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              ⚙️ Settings
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default InterpreterDashboard;
