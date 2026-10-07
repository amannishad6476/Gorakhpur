const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/estimate.controller');
const { protectAdmin } = require('../middleware/auth');
const { submitLimiter } = require('../middleware/rateLimiter');

router.post('/', submitLimiter, ctrl.submitEstimate);
router.get('/', protectAdmin, ctrl.getAllEstimates);
router.patch('/:id/status', protectAdmin, ctrl.updateEstimateStatus);
router.delete('/:id', protectAdmin, ctrl.deleteEstimate);

module.exports = router;
