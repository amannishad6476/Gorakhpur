const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/banner.controller');
const { protectAdmin } = require('../middleware/auth');

router.get('/', ctrl.getActiveBanners);
router.get('/admin/all', protectAdmin, ctrl.getAllBannersAdmin);
router.post('/', protectAdmin, ctrl.createBanner);
router.put('/:id', protectAdmin, ctrl.updateBanner);
router.patch('/reorder', protectAdmin, ctrl.reorderBanners);
router.patch('/:id/status', protectAdmin, ctrl.toggleBannerStatus);
router.delete('/:id', protectAdmin, ctrl.deleteBanner);

module.exports = router;
