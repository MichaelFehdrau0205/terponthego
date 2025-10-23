const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Generate JWT token
const generateToken = (userId, userType) => {
  return jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { userType, name, email, password, phone, certification } = req.body;

    // Validate required fields
    if (!userType || !name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let result;
    
    if (userType === 'deaf') {
      // Insert into deaf_users table
      result = await pool.query(
        'INSERT INTO deaf_users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
        [name, email, hashedPassword, phone]
      );
    } else if (userType === 'interpreter') {
      // Insert into interpreters table
      result = await pool.query(
        'INSERT INTO interpreters (name, email, password, phone, certification) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email',
        [name, email, hashedPassword, phone, certification]
      );
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user type' 
      });
    }

    const user = result.rows[0];
    const token = generateToken(user.id, userType);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Server error during signup' 
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { userType, email, password } = req.body;

    if (!userType || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    let result;
    const tableName = userType === 'deaf' ? 'deaf_users' : 'interpreters';

    result = await pool.query(
      `SELECT * FROM ${tableName} WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const user = result.rows[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const token = generateToken(user.id, userType);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};
