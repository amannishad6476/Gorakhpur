const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/stats.controller');
const { protectAdmin } = require('../middleware/auth');

router.get('/dashboard', protectAdmin, ctrl.getDashboardStats);

module.exports = router;
