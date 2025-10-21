import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import LoginPage from './components/LoginPage';
import DeafLogin from './pages/auth/DeafLogin';
import DeafSignup from './pages/auth/DeafSignup';
import InterpreterLogin from './pages/auth/InterpreterLogin';
import InterpreterSignup from './pages/auth/InterpreterSignup';
import DeafDashboard from './pages/deaf/DeafDashboard';
import InterpreterDashboard from './pages/interpreter/InterpreterDashboard';
import { isAuthenticated, isDeafUser, isInterpreter } from './utils/auth';
import CreateRequest from './pages/deaf/CreateRequest';

function ProtectedRoute({ children, userType }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  if (userType === 'deaf' && !isDeafUser()) {
    return <Navigate to="/interpreter/dashboard" />;
  }
  
  if (userType === 'interpreter' && !isInterpreter()) {
    return <Navigate to="/deaf/dashboard" />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/deaf/login" element={<DeafLogin />} />
        <Route path="/auth/deaf/signup" element={<DeafSignup />} />
        <Route path="/auth/interpreter/login" element={<InterpreterLogin />} />
        <Route path="/auth/interpreter/signup" element={<InterpreterSignup />} />
        
        // Find this route:
        <Route 
          path="/deaf/dashboard" 
          element={
            <ProtectedRoute userType="deaf">
              <DeafDashboard />
            </ProtectedRoute>
          } 
        />

        // TEMPORARILY change to this (remove protection):
        <Route 
          path="/deaf/dashboard" 
          element={<DeafDashboard />} 
        />
        ```
        
        <Route 
          path="/interpreter/dashboard" 
          element={
            <ProtectedRoute userType="interpreter">
              <InterpreterDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;