const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registration routes
router.post('/register/deaf', authController.registerDeaf);
router.post('/register/interpreter', authController.registerInterpreter);

// Login routes
router.post('/login/deaf', authController.loginDeaf);
router.post('/login/interpreter', authController.loginInterpreter);

module.exports = router;