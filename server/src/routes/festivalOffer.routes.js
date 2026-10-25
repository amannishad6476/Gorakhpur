const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/festivalOffer.controller');
const { protectAdmin } = require('../middleware/auth');

// Public route to get currently active scheduled campaign
router.get('/active', ctrl.getActiveOffer);

// Admin authenticated routes
router.get('/admin/all', protectAdmin, ctrl.getAllOffersAdmin);
router.get('/:id', protectAdmin, ctrl.getOfferById);
router.post('/', protectAdmin, ctrl.createOffer);
router.put('/:id', protectAdmin, ctrl.updateOffer);
router.patch('/:id/toggle', protectAdmin, ctrl.toggleOfferStatus);
router.delete('/:id', protectAdmin, ctrl.deleteOffer);

module.exports = router;
