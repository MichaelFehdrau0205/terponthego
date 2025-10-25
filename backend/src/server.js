const express = require('express');
const cors = require('cors');
require('dotenv').config();

console.log('✅ Starting TERP backend...');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Add logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Import routes
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const profileRoutes = require('./routes/profile');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/profile', profileRoutes);

// Test route
app.get('/', (req, res) => {
  console.log('🎯 Root route handler executing!');
  res.json({ 
    message: '🚀 TERP / on the go API is running!',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 TERP / on the go server running on port ${PORT}`);
  console.log(`📍 http://localhost:5000`);
  console.log('✅ Server is ready to accept requests!');
});
