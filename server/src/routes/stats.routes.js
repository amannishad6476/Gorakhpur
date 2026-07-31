const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/stats.controller');
const { protect } = require('../middleware/auth');
router.get('/dashboard', protect, ctrl.getDashboardStats);
module.exports = router;
