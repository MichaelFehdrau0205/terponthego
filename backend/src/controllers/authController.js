const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../models/database');

// Generate JWT token
const generateToken = (userId, userType) => {
  return jwt.sign(
    { id: userId, user_type: userType },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register Deaf User
exports.registerDeaf = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (user_type, email, password_hash, name, phone) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, user_type, email, name, phone, created_at`,
      ['deaf', email, password_hash, name, phone]
    );

    const user = result.rows[0];
    const token = generateToken(user.id, user.user_type);

    res.status(201).json({
      success: true,
      message: 'Deaf user registered successfully',
      token,
      user: {
        id: user.id,
        user_type: user.user_type,
        email: user.email,
        name: user.name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Register deaf error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
};

// Register Interpreter
exports.registerInterpreter = async (req, res) => {
  try {
    const { email, password, name, phone, hourly_rate } = req.body;

    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (user_type, email, password_hash, name, phone, hourly_rate) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, user_type, email, name, phone, hourly_rate, created_at`,
      ['interpreter', email, password_hash, name, phone, hourly_rate || 75]
    );

    const user = result.rows[0];
    const token = generateToken(user.id, user.user_type);

    res.status(201).json({
      success: true,
      message: 'Interpreter registered successfully',
      token,
      user: {
        id: user.id,
        user_type: user.user_type,
        email: user.email,
        name: user.name,
        phone: user.phone,
        hourly_rate: user.hourly_rate
      }
    });
  } catch (error) {
    console.error('Register interpreter error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
};

// Login Deaf User
exports.loginDeaf = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND user_type = $2',
      [email, 'deaf']
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const token = generateToken(user.id, user.user_type);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        user_type: user.user_type,
        email: user.email,
        name: user.name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login deaf error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

// Login Interpreter
exports.loginInterpreter = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND user_type = $2',
      [email, 'interpreter']
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const token = generateToken(user.id, user.user_type);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        user_type: user.user_type,
        email: user.email,
        name: user.name,
        phone: user.phone,
        hourly_rate: user.hourly_rate
      }
    });
  } catch (error) {
    console.error('Login interpreter error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};