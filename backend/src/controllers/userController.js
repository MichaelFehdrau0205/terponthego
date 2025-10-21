const pool = require('../models/database');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await pool.query(
      'SELECT id, email, user_type, first_name, last_name, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: user.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, email } = req.body;

    const updatedUser = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING id, email, user_type, first_name, last_name',
      [firstName, lastName, email, userId]
    );

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all users (for admin purposes)
const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT id, email, user_type, first_name, last_name, created_at FROM users ORDER BY created_at DESC'
    );

    res.status(200).json({ users: users.rows });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers
};
