const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/gallery.controller');
const { protect } = require('../middleware/auth');

router.get('/', ctrl.getGallery);
router.get('/admin/all', protect, ctrl.getGalleryAdmin);
router.post('/', protect, ctrl.createGalleryItem);
router.put('/:id', protect, ctrl.updateGalleryItem);
router.delete('/:id', protect, ctrl.deleteGalleryItem);

module.exports = router;
