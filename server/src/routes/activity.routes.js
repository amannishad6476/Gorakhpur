const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/activity.controller');
const { protectAdmin } = require('../middleware/auth');

router.get('/', protectAdmin, ctrl.getLogs);
router.delete('/clear', protectAdmin, ctrl.clearLogs);

module.exports = router;
