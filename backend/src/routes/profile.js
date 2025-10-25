const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const verifyToken = require('../middleware/auth');

// All profile routes require authentication
router.use(verifyToken);

// Setup/update profile
router.post('/setup', profileController.setupProfile);

// Get current user's profile
router.get('/me', profileController.getProfile);

module.exports = router;
