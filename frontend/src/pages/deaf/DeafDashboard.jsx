import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/auth';

export default function DeafDashboard() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🤟</span>
            <h1 className="text-2xl font-bold">TERP / on the go</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Welcome Back! 👋</h2>
          <p className="text-xl text-gray-600">Ready to request an interpreter?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Request Interpreter Card */}
          <div className="card bg-gradient-to-br from-terp-blue to-blue-600 text-white col-span-full md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Need an Interpreter?</h3>
                <p className="text-white/90 mb-4">Request one now - available 24/7</p>
                <button
                  onClick={() => navigate('/deaf/request')}
                  className="bg-white text-terp-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                >
                  🚀 Request Now
                </button>
              </div>
              <div className="hidden md:block text-8xl opacity-20">
                🤟
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="card">
            <div className="text-center">
              <div className="text-5xl mb-2">📊</div>
              <h3 className="text-3xl font-bold text-terp-blue mb-1">0</h3>
              <p className="text-gray-600">Total Requests</p>
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="card">
          <h3 className="text-2xl font-bold mb-4">Recent Requests</h3>
          <div className="text-center py-12 text-gray-400">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-lg">No requests yet</p>
            <p className="text-sm">Your interpreter requests will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}