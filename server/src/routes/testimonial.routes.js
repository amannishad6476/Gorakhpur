const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/testimonial.controller');
const { protectAdmin } = require('../middleware/auth');

router.get('/', ctrl.getFeaturedTestimonials);
router.get('/admin/all', protectAdmin, ctrl.getAllTestimonialsAdmin);
router.post('/', protectAdmin, ctrl.createTestimonial);
router.put('/:id', protectAdmin, ctrl.updateTestimonial);
router.delete('/:id', protectAdmin, ctrl.deleteTestimonial);

module.exports = router;
