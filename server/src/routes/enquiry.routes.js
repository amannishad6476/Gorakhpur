const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/enquiry.controller');
const { protectAdmin } = require('../middleware/auth');
const { submitLimiter } = require('../middleware/rateLimiter');

router.post('/', submitLimiter, ctrl.submitEnquiry);
router.get('/', protectAdmin, ctrl.getAllEnquiries);
router.patch('/:id/status', protectAdmin, ctrl.updateEnquiryStatus);
router.delete('/:id', protectAdmin, ctrl.deleteEnquiry);

module.exports = router;
