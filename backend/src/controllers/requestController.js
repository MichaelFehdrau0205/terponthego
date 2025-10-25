const pool = require('../db');

// Create a new request (Deaf user)
exports.createRequest = async (req, res) => {
  try {
    const { location, date_time, message, destination_latitude, destination_longitude } = req.body;
    const { userId, userType } = req.user;

    if (userType !== 'deaf') {
      return res.status(403).json({
        success: false,
        message: 'Only deaf users can create requests'
      });
    }

    if (!location || !date_time) {
      return res.status(400).json({
        success: false,
        message: 'Location and date/time are required'
      });
    }

    const result = await pool.query(
      'INSERT INTO requests (deaf_user_id, location, date_time, message, status, destination_latitude, destination_longitude) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, location, date_time, message || '', 'pending', destination_latitude, destination_longitude]
    );

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      request: result.rows[0]
    });

  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating request'
    });
  }
};

// Get all pending requests (Interpreter)
exports.getPendingRequests = async (req, res) => {
  try {
    const { userType } = req.user;

    if (userType !== 'interpreter') {
      return res.status(403).json({
        success: false,
        message: 'Only interpreters can view requests'
      });
    }

    const result = await pool.query(
      `SELECT r.*, d.name as deaf_user_name, d.email as deaf_user_email 
       FROM requests r 
       JOIN deaf_users d ON r.deaf_user_id = d.id 
       WHERE r.status = 'pending' 
       ORDER BY r.created_at DESC`
    );

    res.json({
      success: true,
      requests: result.rows
    });

  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching requests'
    });
  }
};

// Accept a request (Interpreter)
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { userId, userType } = req.user;

    if (userType !== 'interpreter') {
      return res.status(403).json({
        success: false,
        message: 'Only interpreters can accept requests'
      });
    }

    const checkResult = await pool.query(
      'SELECT * FROM requests WHERE id = $1 AND status = $2',
      [requestId, 'pending']
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Request not found or already accepted'
      });
    }

    const result = await pool.query(
      'UPDATE requests SET interpreter_id = $1, status = $2 WHERE id = $3 RETURNING *',
      [userId, 'accepted', requestId]
    );

    res.json({
      success: true,
      message: 'Request accepted successfully',
      request: result.rows[0]
    });

  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error accepting request'
    });
  }
};

// Get user's own requests (Deaf user)
exports.getMyRequests = async (req, res) => {
  try {
    const { userId, userType } = req.user;

    if (userType !== 'deaf') {
      return res.status(403).json({
        success: false,
        message: 'Only deaf users can view their requests'
      });
    }

    const result = await pool.query(
      `SELECT r.*, i.name as interpreter_name, i.email as interpreter_email 
       FROM requests r 
       LEFT JOIN interpreters i ON r.interpreter_id = i.id 
       WHERE r.deaf_user_id = $1 
       ORDER BY r.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      requests: result.rows
    });

  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching requests'
    });
  }
};

// Get nearby interpreters with locations
exports.getNearbyInterpreters = async (req, res) => {
  try {
    const { latitude, longitude, limit = 5 } = req.query;

    const result = await pool.query(
      `SELECT id, name, email, certification, latitude, longitude, available 
       FROM interpreters 
       WHERE available = true 
       AND latitude IS NOT NULL 
       AND longitude IS NOT NULL 
       ORDER BY RANDOM() 
       LIMIT $1`,
      [limit]
    );

    res.json({
      success: true,
      interpreters: result.rows
    });

  } catch (error) {
    console.error('Get nearby interpreters error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching interpreters'
    });
  }
};
