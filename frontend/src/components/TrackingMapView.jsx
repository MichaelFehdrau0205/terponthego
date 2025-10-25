import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
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

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function TrackingMapView() {
  const [deafRoute, setDeafRoute] = useState([]);
  const [interpreterRoute, setInterpreterRoute] = useState([]);
  const [deafDistance, setDeafDistance] = useState('...');
  const [interpreterDistance, setInterpreterDistance] = useState('...');
  const [loading, setLoading] = useState(true);

  const API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjdkNzFlYmQyNzg0NDQ5YmNiODEwMGI2MTQ3OTE1NDJkIiwiaCI6Im11cm11cjY0In0=';

  const deafUserLocation = {
    lat: 42.8864,
    lng: -78.8784,
    name: 'You'
  };

  const interpreterLocation = {
    lat: 42.9000,
    lng: -78.8500,
    name: 'Sarah Johnson'
  };

  const destination = {
    lat: 42.8950,
    lng: -78.8700,
    name: 'City Hospital',
    address: '123 Main St, Springville, NY'
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      // Fetch route for deaf user
      const deafRouteData = await fetchRoute(
        deafUserLocation.lng, deafUserLocation.lat,
        destination.lng, destination.lat
      );
      
      if (deafRouteData) {
        setDeafRoute(deafRouteData.coordinates);
        setDeafDistance((deafRouteData.distance / 1609.34).toFixed(1)); // Convert meters to miles
      }

      // Fetch route for interpreter
      const interpreterRouteData = await fetchRoute(
        interpreterLocation.lng, interpreterLocation.lat,
        destination.lng, destination.lat
      );

      if (interpreterRouteData) {
        setInterpreterRoute(interpreterRouteData.coordinates);
        setInterpreterDistance((interpreterRouteData.distance / 1609.34).toFixed(1));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setLoading(false);
    }
  };

  const fetchRoute = async (startLng, startLat, endLng, endLat) => {
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${API_KEY}&start=${startLng},${startLat}&end=${endLng},${endLat}`
      );

      const data = await response.json();
      
      if (data.features && data.features[0]) {
        const coords = data.features[0].geometry.coordinates;
        // Convert [lng, lat] to [lat, lng] for Leaflet
        const leafletCoords = coords.map(coord => [coord[1], coord[0]]);
        const distance = data.features[0].properties.segments[0].distance;
        
        return {
          coordinates: leafletCoords,
          distance: distance
        };
      }
      return null;
    } catch (error) {
      console.error('Route fetch error:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Loading routes... 🗺️</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>🗺️ Track Journey to Destination</h2>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        marginBottom: '20px',
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
            {deafDistance} mi
          </div>
          <div>🔵 You to Destination</div>
          {parseFloat(deafDistance) < 0.5 && (
            <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>Almost there! 🎉</div>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f44336' }}>
            {interpreterDistance} mi
          </div>
          <div>🔴 Interpreter to Destination</div>
          {parseFloat(interpreterDistance) < 0.5 && (
            <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>Almost there! ��</div>
          )}
        </div>
      </div>

      <MapContainer 
        center={[destination.lat, destination.lng]} 
        zoom={13} 
        style={{ height: '500px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={[deafUserLocation.lat, deafUserLocation.lng]} icon={blueIcon}>
          <Popup>
            <strong>🔵 {deafUserLocation.name}</strong>
            <p>{deafDistance} miles from destination</p>
          </Popup>
        </Marker>

        <Marker position={[interpreterLocation.lat, interpreterLocation.lng]} icon={redIcon}>
          <Popup>
            <strong>🔴 {interpreterLocation.name}</strong>
            <p>{interpreterDistance} miles from destination</p>
          </Popup>
        </Marker>

        <Marker position={[destination.lat, destination.lng]} icon={greenIcon}>
          <Popup>
            <strong>📍 {destination.name}</strong>
            <p>{destination.address}</p>
          </Popup>
        </Marker>

        {deafRoute.length > 0 && (
          <Polyline 
            positions={deafRoute} 
            color="#2196F3" 
            weight={4}
            opacity={0.7}
          />
        )}

        {interpreterRoute.length > 0 && (
          <Polyline 
            positions={interpreterRoute} 
            color="#f44336" 
            weight={4}
            opacity={0.7}
          />
        )}
      </MapContainer>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#666' }}>
          🔵 Blue route = Your walking path | 🔴 Red route = Interpreter walking path | 🟢 Green pin = Destination
        </p>
        <a href="/deaf-dashboard">Back to Dashboard</a>
      </div>
    </div>
  );
}

export default TrackingMapView;
