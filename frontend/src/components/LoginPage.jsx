import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Deaf Users */}
      <div className="w-full md:w-1/2 bg-terp-blue flex flex-col items-center justify-center p-8 md:p-12 text-white relative overflow-hidden min-h-screen md:min-h-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 md:top-20 md:left-20 text-6xl md:text-9xl">🤟</div>
          <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 text-6xl md:text-9xl">👋</div>
        </div>
        
        <div className="relative z-10 text-center max-w-md w-full">
          <div className="mb-6 md:mb-8">
            <span className="text-6xl md:text-9xl animate-pulse">🤟</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">Deaf Users</h2>
          
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 leading-relaxed px-4">
            Request ASL interpreters on-demand. Anytime. Anywhere.
          </p>
          
          <div className="text-left mb-6 md:mb-8 space-y-2 md:space-y-3 px-4">
            <div className="flex items-center gap-3">
              <span className="text-xl md:text-2xl">⚡</span>
              <span className="text-base md:text-lg">Instant requests</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl md:text-2xl">🗺️</span>
              <span className="text-base md:text-lg">Find nearby interpreters</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl md:text-2xl">24/7</span>
              <span className="text-base md:text-lg">Available 24/7</span>
            </div>
          </div>
          
          <div className="px-4">
            <button
              onClick={() => navigate('/auth/deaf/login')}
              className="w-full bg-white text-terp-blue px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-lg md:text-xl mb-3 md:mb-4 hover:bg-gray-100 transition shadow-lg transform hover:scale-105"
            >
              LOGIN
            </button>
            
            <button
              onClick={() => navigate('/auth/deaf/signup')}
              className="w-full bg-transparent border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-lg md:text-xl hover:bg-white/10 transition"
            >
              SIGN UP
            </button>
          </div>
        </div>
      </div>
      
      {/* Right Side - Interpreters */}
      <div className="w-full md:w-1/2 bg-terp-red flex flex-col items-center justify-center p-8 md:p-12 text-white relative overflow-hidden min-h-screen md:min-h-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 md:top-20 md:right-20 text-6xl md:text-9xl">👨‍💼</div>
          <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 text-6xl md:text-9xl">💼</div>
        </div>
        
        <div className="relative z-10 text-center max-w-md w-full">
          <div className="mb-6 md:mb-8">
            <span className="text-6xl md:text-9xl animate-pulse">👨‍💼</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">Interpreters</h2>
          
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 leading-relaxed px-4">
            Provide ASL services on your schedule. Earn on your terms.
          </p>
          
          <div className="text-left mb-6 md:mb-8 space-y-2 md:space-y-3 px-4">
            <div className="flex items-center gap-3">
              <span className="text-xl md:text-2xl">💰</span>
              <span className="text-base md:text-lg">Set your own rates</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl md:text-2xl">📅</span>
              <span className="text-base md:text-lg">Flexible scheduling</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl md:text-2xl">⭐</span>
              <span className="text-base md:text-lg">Build your reputation</span>
            </div>
          </div>
          
          <div className="px-4">
            <button
              onClick={() => navigate('/auth/interpreter/login')}
              className="w-full bg-white text-terp-red px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-lg md:text-xl mb-3 md:mb-4 hover:bg-gray-100 transition shadow-lg transform hover:scale-105"
            >
              LOGIN
            </button>
            
            <button
              onClick={() => navigate('/auth/interpreter/signup')}
              className="w-full bg-transparent border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-lg md:text-xl hover:bg-white/10 transition"
            >
              SIGN UP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
