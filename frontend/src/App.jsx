import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import CreateRequestForm from './components/CreateRequestForm';
import ViewRequestsPage from './components/ViewRequestsPage';
import MapView from './components/MapView';
import TrackingMapView from './components/TrackingMapView';
import DeafProfileSetup from './components/DeafProfileSetup';
import InterpreterProfileSetup from './components/InterpreterProfileSetup';
import DeafDashboard from './components/DeafDashboard';
import InterpreterDashboard from './components/InterpreterDashboard';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

function App() {
  return (
    <Router>
      <div>
        <Routes>
           {/* Homepage is Login */}
          <Route path="/" element={<Login />} />
          
          {/* Signup Route */}
          <Route path="/" element={<Signup />} />

          
          {/* Profile Setup Routes - PUT THEM HERE! */}
          <Route path="/profile-setup/deaf" element={<DeafProfileSetup />} />
          <Route path="/profile-setup/interpreter" element={<InterpreterProfileSetup />} />
          
          {/* Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboards */}
          <Route path="/deaf-dashboard" element={<DeafDashboard />} />
          <Route path="/interpreter-dashboard" element={<InterpreterDashboard />} />
          
          {/* Map */}
          <Route path="/map" element={<MapView />} />
          {/* ... rest of routes */}
        </Routes>  
      </div>
    </Router>
  );
}
export default App;

