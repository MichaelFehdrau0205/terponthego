const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup route (handles both deaf and interpreter)
router.post('/signup', authController.signup);

// Login route (handles both deaf and interpreter)
router.post('/login', authController.login);

module.exports = router;
