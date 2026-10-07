const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/gallery.controller');
const { protectAdmin } = require('../middleware/auth');

router.get('/', ctrl.getGallery);
router.get('/admin/all', protectAdmin, ctrl.getGalleryAdmin);
router.post('/', protectAdmin, ctrl.createGalleryItem);
router.put('/:id', protectAdmin, ctrl.updateGalleryItem);
router.delete('/:id', protectAdmin, ctrl.deleteGalleryItem);

module.exports = router;
