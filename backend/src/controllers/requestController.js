const pool = require('../models/database');

// Create a new request
const createRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, location, scheduledTime, duration, language } = req.body;

    const newRequest = await pool.query(
      'INSERT INTO requests (user_id, title, description, location, scheduled_time, duration, language, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [userId, title, description, location, scheduledTime, duration, language, 'pending']
    );

    res.status(201).json({
      message: 'Request created successfully',
      request: newRequest.rows[0]
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await pool.query(
      'SELECT r.*, u.first_name, u.last_name, u.email FROM requests r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC'
    );

    res.status(200).json({ requests: requests.rows });
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's own requests
const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const requests = await pool.query(
      'SELECT * FROM requests WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.status(200).json({ requests: requests.rows });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update request
const updateRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.userId;
    const { title, description, location, scheduledTime, duration, language, status } = req.body;

    // Check if request belongs to user
    const request = await pool.query(
      'SELECT * FROM requests WHERE id = $1 AND user_id = $2',
      [requestId, userId]
    );

    if (request.rows.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const updatedRequest = await pool.query(
      'UPDATE requests SET title = $1, description = $2, location = $3, scheduled_time = $4, duration = $5, language = $6, status = $7 WHERE id = $8 RETURNING *',
      [title, description, location, scheduledTime, duration, language, status, requestId]
    );

    res.status(200).json({
      message: 'Request updated successfully',
      request: updatedRequest.rows[0]
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete request
const deleteRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.userId;

    // Check if request belongs to user
    const request = await pool.query(
      'SELECT * FROM requests WHERE id = $1 AND user_id = $2',
      [requestId, userId]
    );

    if (request.rows.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await pool.query('DELETE FROM requests WHERE id = $1', [requestId]);

    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getMyRequests,
  updateRequest,
  deleteRequest
};
