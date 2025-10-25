import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DeafSignupForm from './components/DeafSignupForm';
import InterpreterSignupForm from './components/InterpreterSignupForm';
import LoginForm from './components/LoginForm';
import CreateRequestForm from './components/CreateRequestForm';
import ViewRequestsPage from './components/ViewRequestsPage';
import MapView from './components/MapView';
import TrackingMapView from './components/TrackingMapView';
import DeafProfileSetup from './components/DeafProfileSetup';
import InterpreterProfileSetup from './components/InterpreterProfileSetup';
import DeafDashboard from './components/DeafDashboard';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Signup Routes */}
          <Route path="/signup/deaf" element={<DeafSignupForm />} />
          <Route path="/signup/interpreter" element={<InterpreterSignupForm />} />
          
          {/* Profile Setup Routes - PUT THEM HERE! */}
          <Route path="/profile-setup/deaf" element={<DeafProfileSetup />} />
          <Route path="/profile-setup/interpreter" element={<InterpreterProfileSetup />} />
          
          {/* Login */}
          <Route path="/login" element={<LoginForm />} />
          
          {/* Dashboards */}
          <Route path="/deaf-dashboard" element={<DeafDashboard />} />
          <Route path="/interpreter-dashboard" element={<InterpreterDashboard />} />
          
          {/* ... rest of routes */}
        </Routes>     
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>🤟 TERP on the Go</h1>
      <p>Connect with ASL Interpreters instantly</p>
      
      <div style={{ marginTop: '40px' }}>
        <h3>Sign Up As:</h3>
        <Link to="/signup/deaf">
          <button style={{
            padding: '15px 30px',
            margin: '10px',
            fontSize: '16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Deaf User
          </button>
        </Link>
        
        <Link to="/signup/interpreter">
          <button style={{
            padding: '15px 30px',
            margin: '10px',
            fontSize: '16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Interpreter
          </button>
        </Link>
      </div>

      <div style={{ marginTop: '40px' }}>
        <p>Already have an account?</p>
        <Link to="/login">
          <button style={{
            padding: '10px 30px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}


function InterpreterDashboard() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};
  
  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
      <h1>👋 Interpreter Dashboard</h1>
      <h2>Welcome, {user.name}!</h2>
      
      <div style={{ marginTop: '40px' }}>
        <Link to="/view-requests">
          <button style={{
            padding: '15px 30px',
            margin: '10px',
            fontSize: '16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'block',
            width: '100%'
          }}>
            📋 View Available Requests
          </button>
        </Link>
        
        <Link to="/">
          <button style={{
            padding: '10px 20px',
            marginTop: '20px',
            backgroundColor: '#999',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Logout
          </button>
        </Link>
      </div>
    </div>
  );
}

export default App;
