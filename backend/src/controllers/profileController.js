const pool = require('../db');

// Setup/Update user profile
exports.setupProfile = async (req, res) => {
  try {
    const { userId, userType } = req.user;
    const { phone, address, city, state, zip_code, profile_photo, years_experience, specializations } = req.body;

    if (userType === 'deaf') {
      // Update deaf user profile
      const result = await pool.query(
        `UPDATE deaf_users 
         SET phone = $1, address = $2, city = $3, state = $4, zip_code = $5, 
             profile_photo = $6, profile_completed = true 
         WHERE id = $7 
         RETURNING id, name, email, phone, profile_photo, profile_completed`,
        [phone, address, city, state, zip_code, profile_photo || null, userId]
      );

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: result.rows[0]
      });

    } else if (userType === 'interpreter') {
      // Update interpreter profile
      const result = await pool.query(
        `UPDATE interpreters 
         SET phone = $1, address = $2, city = $3, state = $4, zip_code = $5, 
             profile_photo = $6, years_experience = $7, specializations = $8, 
             profile_completed = true, verification_status = 'pending'
         WHERE id = $9 
         RETURNING id, name, email, phone, profile_photo, profile_completed, verification_status`,
        [phone, address, city, state, zip_code, profile_photo || null, years_experience, specializations, userId]
      );

      res.json({
        success: true,
        message: 'Profile submitted for review',
        user: result.rows[0]
      });

    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

  } catch (error) {
    console.error('Profile setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const { userId, userType } = req.user;

    if (userType === 'deaf') {
      const result = await pool.query(
        'SELECT id, name, email, phone, address, city, state, zip_code, profile_photo, profile_completed FROM deaf_users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user: result.rows[0]
      });

    } else if (userType === 'interpreter') {
      const result = await pool.query(
        'SELECT id, name, email, phone, address, city, state, zip_code, profile_photo, years_experience, specializations, verification_status, profile_completed FROM interpreters WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user: result.rows[0]
      });

    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
};
