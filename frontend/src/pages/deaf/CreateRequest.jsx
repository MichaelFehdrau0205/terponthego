import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateRequest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service_type: 'general',
    urgent: false,
    date_time: '',
    duration_hours: 2,
    location_address: '',
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call for now
    setTimeout(() => {
      alert('Request created successfully! 🎉');
      setLoading(false);
      navigate('/deaf/dashboard');
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/deaf/dashboard')}
            className="text-terp-blue hover:underline mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Request an Interpreter</h1>
          <p className="text-gray-600">Fill out the details below to find an ASL interpreter</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          
          {/* Service Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Type *
            </label>
            <select
              name="service_type"
              value={formData.service_type}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="general">General</option>
              <option value="medical">Medical</option>
              <option value="legal">Legal</option>
              <option value="educational">Educational</option>
              <option value="business">Business</option>
            </select>
          </div>

          {/* Urgent Toggle */}
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border-2 border-red-200">
            <input
              type="checkbox"
              id="urgent"
              name="urgent"
              checked={formData.urgent}
              onChange={handleChange}
              className="w-5 h-5 text-terp-red"
            />
            <label htmlFor="urgent" className="font-semibold text-red-700 cursor-pointer">
              🚨 This is an urgent request
            </label>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                name="date_time"
                value={formData.date_time}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration (hours) *
              </label>
              <input
                type="number"
                name="duration_hours"
                value={formData.duration_hours}
                onChange={handleChange}
                min="0.5"
                step="0.5"
                required
                className="input-field"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location Address *
            </label>
            <input
              type="text"
              name="location_address"
              value={formData.location_address}
              onChange={handleChange}
              placeholder="123 Main St, New York, NY 10001"
              required
              className="input-field"
            />
            <p className="text-sm text-gray-500 mt-1">
              📍 We'll find interpreters near this location
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any specific requirements or details..."
              rows="4"
              className="input-field resize-none"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">What happens next?</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>We'll notify nearby interpreters</li>
                  <li>You'll receive confirmation when someone accepts</li>
                  <li>You can message your interpreter directly</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/deaf/dashboard')}
              className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : '🚀 Request Interpreter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}