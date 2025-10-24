import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance.toFixed(1);
}

function MapView() {
  const deafUserLocation = {
    lat: 42.8864,
    lng: -78.8784,
    name: 'Your Location'
  };

  const interpreters = [
    { id: 1, name: 'John Smith', lat: 42.9000, lng: -78.8500, available: true },
    { id: 2, name: 'Sarah Johnson', lat: 42.8700, lng: -78.9000, available: true },
    { id: 3, name: 'Mike Davis', lat: 42.9100, lng: -78.8600, available: true }
  ];

  const handleRequestInterpreter = (interpreter) => {
    alert(`Requesting ${interpreter.name}...`);
  };

  const handleTextMessage = (interpreter) => {
    alert(`Opening text message with ${interpreter.name}...`);
  };

  const handleVideoCall = (interpreter) => {
    alert(`Starting video call with ${interpreter.name}...`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🗺️ Find Nearby Interpreters</h2>
      <p style={{ marginBottom: '20px' }}>
        🔵 Blue marker = You | 🔴 Red markers = Available Interpreters
      </p>

      <MapContainer 
        center={[deafUserLocation.lat, deafUserLocation.lng]} 
        zoom={12} 
        style={{ height: '500px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={[deafUserLocation.lat, deafUserLocation.lng]} icon={blueIcon}>
          <Popup>
            <div style={{ textAlign: 'center' }}>
              <strong>📍 Your Location</strong>
              <p>{deafUserLocation.name}</p>
            </div>
          </Popup>
        </Marker>

        {interpreters.map((interpreter) => {
          const distance = calculateDistance(
            deafUserLocation.lat,
            deafUserLocation.lng,
            interpreter.lat,
            interpreter.lng
          );

          return (
            <Marker 
              key={interpreter.id} 
              position={[interpreter.lat, interpreter.lng]} 
              icon={redIcon}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>👋 {interpreter.name}</h3>
                  <p style={{ margin: '5px 0' }}>
                    <strong>📍 Distance:</strong> {distance} miles away
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Status:</strong> ✅ Available
                  </p>
                  
                  <div style={{ marginTop: '10px' }}>
                    <button
                      onClick={() => handleRequestInterpreter(interpreter)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '8px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      📱 Request This Interpreter
                    </button>

                    <button
                      onClick={() => handleTextMessage(interpreter)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '8px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      💬 Send Text Message
                    </button>

                    <button
                      onClick={() => handleVideoCall(interpreter)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#9C27B0',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      📹 Start Video Call
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a href="/deaf-dashboard">Back to Dashboard</a>
      </div>
    </div>
  );
}

export default MapView;
