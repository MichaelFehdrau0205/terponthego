const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'michaelfehdrau',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'terp_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

module.exports = pool;
