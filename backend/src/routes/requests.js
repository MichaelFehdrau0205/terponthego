const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const verifyToken = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Create a new request (Deaf user)
router.post('/', requestController.createRequest);

// Get my requests (Deaf user)
router.get('/my-requests', requestController.getMyRequests);

// Get all pending requests (Interpreter)
router.get('/pending', requestController.getPendingRequests);

// Accept a request (Interpreter)
router.post('/:requestId/accept', requestController.acceptRequest);

module.exports = router;
