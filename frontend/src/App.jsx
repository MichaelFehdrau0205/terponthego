import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import LoginPage from './components/LoginPage';
import DeafLogin from './pages/auth/DeafLogin';
import DeafSignup from './pages/auth/DeafSignup';
import InterpreterLogin from './pages/auth/InterpreterLogin';
import InterpreterSignup from './pages/auth/InterpreterSignup';
import DeafDashboard from './pages/deaf/DeafDashboard';
import CreateRequest from './pages/deaf/CreateRequest';
import InterpreterDashboard from './pages/interpreter/InterpreterDashboard';
import ViewRequests from './pages/interpreter/ViewRequests';

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
        
        {/* Temporarily without auth - we'll add it back later */}
        <Route path="/deaf/dashboard" element={<DeafDashboard />} />
        <Route path="/deaf/request" element={<CreateRequest />} />
        <Route path="/interpreter/dashboard" element={<InterpreterDashboard />} />
        <Route path="/interpreter/requests" element={<ViewRequests />} />
      </Routes>
    </Router>
  );
}

export default App;