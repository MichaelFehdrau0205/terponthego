import { useNavigate } from 'react-router-dom';

export default function InterpreterDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl">👨‍💼</span>
            <h1 className="text-2xl font-bold">TERP / on the go</h1>
          </div>
          <button
            onClick={() => navigate('/login')}
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
          <p className="text-xl text-gray-600">Ready to accept requests?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* View Requests Card */}
          <div className="card bg-gradient-to-br from-terp-red to-red-600 text-white col-span-full md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">New Requests Available</h3>
                <p className="text-white/90 mb-4">3 requests near you</p>
                <button
                  onClick={() => navigate('/interpreter/requests')}
                  className="bg-white text-terp-red px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                >
                  📋 View Requests
                </button>
              </div>
              <div className="hidden md:block text-8xl opacity-20">
                👨‍💼
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="card">
            <div className="text-center">
              <div className="text-5xl mb-2">💰</div>
              <h3 className="text-3xl font-bold text-terp-red mb-1">$0</h3>
              <p className="text-gray-600">This Month</p>
            </div>
          </div>
        </div>

        {/* Upcoming Jobs */}
        <div className="card">
          <h3 className="text-2xl font-bold mb-4">Upcoming Jobs</h3>
          <div className="text-center py-12 text-gray-400">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-lg">No upcoming jobs</p>
            <p className="text-sm">Accepted requests will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}