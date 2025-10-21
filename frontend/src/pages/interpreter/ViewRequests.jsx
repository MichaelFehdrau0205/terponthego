import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ViewRequests() {
  const navigate = useNavigate();
  const [requests] = useState([
    // Mock data for demo
    {
      id: 1,
      deaf_user_name: 'John Doe',
      service_type: 'Medical',
      urgent: true,
      date_time: '2025-10-22T14:30',
      duration_hours: 2,
      location_address: '123 Hospital Drive, New York, NY',
      distance: '3.2 miles',
      rate: '$80/hr',
      notes: 'OB/GYN appointment - need immediate assistance'
    },
    {
      id: 2,
      deaf_user_name: 'Jane Smith',
      service_type: 'Legal',
      urgent: false,
      date_time: '2025-10-23T10:00',
      duration_hours: 3,
      location_address: '456 Court St, New York, NY',
      distance: '5.7 miles',
      rate: '$85/hr',
      notes: 'Court hearing consultation'
    },
    {
      id: 3,
      deaf_user_name: 'Mike Johnson',
      service_type: 'Educational',
      urgent: false,
      date_time: '2025-10-24T09:00',
      duration_hours: 4,
      location_address: '789 School Ave, New York, NY',
      distance: '8.1 miles',
      rate: '$75/hr',
      notes: 'Parent-teacher conference'
    }
  ]);

  const handleAccept = (requestId) => {
    alert(`✅ Request #${requestId} accepted! The deaf user will be notified.`);
  };

  const handleDecline = (requestId) => {
    alert(`❌ Request #${requestId} declined.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/interpreter/dashboard')}
            className="text-terp-red hover:underline"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">👨‍💼</span>
            <h1 className="text-2xl font-bold">TERP / on the go</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Available Requests</h2>
          <p className="text-xl text-gray-600">
            {requests.length} requests near you
          </p>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className={`card ${request.urgent ? 'border-2 border-red-500' : ''}`}
            >
              {/* Urgent Badge */}
              {request.urgent && (
                <div className="mb-3">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                    🚨 URGENT REQUEST
                  </span>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Left Side - Details */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-4xl">🤟</span>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {request.deaf_user_name}
                      </h3>
                      <p className="text-gray-600">
                        {request.service_type} Interpretation
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{new Date(request.date_time).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⏱️</span>
                      <span>{request.duration_hours} hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{request.location_address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🗺️</span>
                      <span className="text-terp-blue font-semibold">
                        {request.distance} away
                      </span>
                    </div>
                  </div>

                  {request.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Notes:</strong> {request.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Side - Rate & Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <div className="text-3xl font-bold text-terp-red">
                      {request.rate}
                    </div>
                    <div className="text-sm text-gray-600">
                      Total: ${parseInt(request.rate.replace(/\D/g, '')) * request.duration_hours}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDecline(request.id)}
                      className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="bg-terp-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition shadow-lg"
                    >
                      ✅ Accept
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}