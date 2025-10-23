import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DeafSignupForm from './components/DeafSignupForm';
import InterpreterSignupForm from './components/InterpreterSignupForm';
import LoginForm from './components/LoginForm';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup/deaf" element={<DeafSignupForm />} />
          <Route path="/signup/interpreter" element={<InterpreterSignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/deaf-dashboard" element={<TempDashboard userType="deaf" />} />
          <Route path="/interpreter-dashboard" element={<TempDashboard userType="interpreter" />} />
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

function TempDashboard({ userType }) {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};
  
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>✅ Welcome Back!</h1>
      <h2>Hello, {user.name || 'User'}!</h2>
      <p>You're logged in as: {userType === 'deaf' ? 'Deaf User' : 'Interpreter'}</p>
      <p>Dashboard coming soon...</p>
      <Link to="/">
        <button style={{ padding: '10px 20px', marginTop: '20px' }}>
          Logout / Back to Home
        </button>
      </Link>
    </div>
  );
}

export default App;
