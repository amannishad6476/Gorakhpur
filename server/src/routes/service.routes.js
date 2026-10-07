const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/service.controller');
const { protect } = require('../middleware/auth');

// Public
router.get('/', ctrl.getAllServices);
router.get('/slug/:slug', ctrl.getServiceBySlug);

// Admin
router.get('/admin/all', protect, ctrl.getAllServicesAdmin);
router.post('/', protect, ctrl.createService);
router.put('/:id', protect, ctrl.updateService);
router.patch('/reorder', protect, ctrl.reorderServices);
router.patch('/:id/status', protect, ctrl.toggleServiceStatus);
router.delete('/:id/image', protect, ctrl.removeServiceImage);
router.delete('/:id', protect, ctrl.deleteService);

module.exports = router;
