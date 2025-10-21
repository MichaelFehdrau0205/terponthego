import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-terp-blue via-blue-500 to-terp-navy">
      <div className="text-center">
        <div className="mb-8 animate-bounce">
          <span className="text-9xl">🤟</span>
        </div>
        
        <h1 className="text-6xl font-bold text-white mb-2">
          TERP <span className="text-yellow-300">/</span> on the go
        </h1>
        
        <p className="text-2xl text-white/90 mb-8">
          ASL Interpreters 24/7
        </p>
        
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  );
}