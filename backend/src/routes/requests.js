const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');

// Request routes (protected)
router.post('/create', auth, requestController.createRequest);
router.get('/all', auth, requestController.getAllRequests);
router.get('/my-requests', auth, requestController.getMyRequests);
router.put('/:id', auth, requestController.updateRequest);
router.delete('/:id', auth, requestController.deleteRequest);

module.exports = router;
