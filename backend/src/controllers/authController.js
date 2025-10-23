const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const generateToken = (userId, userType) => {
  return jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.signup = async (req, res) => {
  try {
    const { userType, name, email, password, certification } = req.body;

    if (!userType || !name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let result;
    
    if (userType === 'deaf') {
      result = await pool.query(
        'INSERT INTO deaf_users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, hashedPassword]
      );
    } else if (userType === 'interpreter') {
      result = await pool.query(
        'INSERT INTO interpreters (name, email, password, certification) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
        [name, email, hashedPassword, certification]
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
    
    if (error.code === '23505') {
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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    console.log('🔍 Checking login for:', email);

    let user = null;
    let userType = null;
    let result = await pool.query('SELECT * FROM deaf_users WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      user = result.rows[0];
      userType = 'deaf';
      console.log('✅ Found in deaf_users table');
    } else {
      result = await pool.query('SELECT * FROM interpreters WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        user = result.rows[0];
        userType = 'interpreter';
        console.log('✅ Found in interpreters table');
      }
    }

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    console.log('✅ Login successful for:', userType);

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
