const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/review.controller');
const { protect } = require('../middleware/auth');
const { submitLimiter } = require('../middleware/rateLimiter');

router.get('/', ctrl.getApprovedReviews);
router.post('/', submitLimiter, ctrl.submitReview);
router.get('/admin/all', protect, ctrl.getAllReviewsAdmin);
router.patch('/:id/approve', protect, ctrl.approveReview);
router.patch('/:id/reject', protect, ctrl.rejectReview);
router.patch('/:id/verify', protect, ctrl.toggleVerified);
router.delete('/:id', protect, ctrl.deleteReview);

module.exports = router;
