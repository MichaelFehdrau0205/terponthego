export default function DeafLogin() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-terp-blue to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
          <div className="text-center mb-6">
            <span className="text-6xl">🤟</span>
          </div>
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Deaf User Login</h1>
          <p className="text-center text-gray-600 mb-4">Login form coming soon!</p>
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-terp-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }