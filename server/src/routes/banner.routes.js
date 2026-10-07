const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/banner.controller');
const { protect } = require('../middleware/auth');

router.get('/', ctrl.getActiveBanners);
router.get('/admin/all', protect, ctrl.getAllBannersAdmin);
router.post('/', protect, ctrl.createBanner);
router.put('/:id', protect, ctrl.updateBanner);
router.patch('/reorder', protect, ctrl.reorderBanners);
router.patch('/:id/status', protect, ctrl.toggleBannerStatus);
router.delete('/:id', protect, ctrl.deleteBanner);

module.exports = router;
