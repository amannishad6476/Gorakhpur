const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/activity.controller');
const { protect } = require('../middleware/auth');
router.get('/', protect, ctrl.getLogs);
router.delete('/clear', protect, ctrl.clearLogs);
module.exports = router;
