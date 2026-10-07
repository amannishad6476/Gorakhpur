const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/review.controller');
const { protectAdmin } = require('../middleware/auth');
const { submitLimiter } = require('../middleware/rateLimiter');

router.get('/', ctrl.getApprovedReviews);
router.post('/', submitLimiter, ctrl.submitReview);
router.get('/admin/all', protectAdmin, ctrl.getAllReviewsAdmin);
router.patch('/:id/approve', protectAdmin, ctrl.approveReview);
router.patch('/:id/reject', protectAdmin, ctrl.rejectReview);
router.patch('/:id/verify', protectAdmin, ctrl.toggleVerified);
router.delete('/:id', protectAdmin, ctrl.deleteReview);

module.exports = router;
