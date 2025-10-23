import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DeafSignupForm from './components/DeafSignupForm';
import InterpreterSignupForm from './components/InterpreterSignupForm';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Home/Landing Page */}
          <Route path="/" element={<HomePage />} />
          
          {/* Signup Routes */}
          <Route path="/signup/deaf" element={<DeafSignupForm />} />
          <Route path="/signup/interpreter" element={<InterpreterSignupForm />} />
          
          {/* Temporary dashboard routes - we'll build these next */}
          <Route path="/deaf-dashboard" element={<TempDashboard userType="deaf" />} />
          <Route path="/interpreter-dashboard" element={<TempDashboard userType="interpreter" />} />
        </Routes>
      </div>
    </Router>
  );
}

// Simple home page component
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
    </div>
  );
}

// Temporary dashboard (we'll build real ones later)
function TempDashboard({ userType }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>✅ Signup Successful!</h1>
      <h2>Welcome, {userType === 'deaf' ? 'Deaf User' : 'Interpreter'}!</h2>
      <p>Dashboard coming soon...</p>
      <Link to="/">
        <button style={{ padding: '10px 20px', marginTop: '20px' }}>
          Back to Home
        </button>
      </Link>
    </div>
  );
}

export default App;
