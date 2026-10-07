const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/service.controller');
const { protectAdmin } = require('../middleware/auth');

// Public
router.get('/', ctrl.getAllServices);
router.get('/slug/:slug', ctrl.getServiceBySlug);

// Admin
router.get('/admin/all', protectAdmin, ctrl.getAllServicesAdmin);
router.post('/', protectAdmin, ctrl.createService);
router.put('/:id', protectAdmin, ctrl.updateService);
router.patch('/reorder', protectAdmin, ctrl.reorderServices);
router.patch('/:id/status', protectAdmin, ctrl.toggleServiceStatus);
router.delete('/:id/image', protectAdmin, ctrl.removeServiceImage);
router.delete('/:id', protectAdmin, ctrl.deleteService);

module.exports = router;
