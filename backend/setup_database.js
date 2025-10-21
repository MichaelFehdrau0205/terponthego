const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// First, connect to default postgres database to create our database
const adminPool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Connect to default postgres database first
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'terp_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // First, create the database if it doesn't exist
    try {
      await adminPool.query('CREATE DATABASE terp_db');
      console.log('✅ Database terp_db created successfully');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ Database terp_db already exists');
      } else {
        throw error;
      }
    }
    
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'database_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('✅ Database setup completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - users');
    console.log('   - requests');
    console.log('   - reviews');
    console.log('   - Indexes and triggers');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
    await adminPool.end();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
