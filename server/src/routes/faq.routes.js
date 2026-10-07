const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/faq.controller');
const { protectAdmin } = require('../middleware/auth');

router.get('/', ctrl.getActiveFAQs);
router.get('/admin/all', protectAdmin, ctrl.getAllFAQsAdmin);
router.post('/', protectAdmin, ctrl.createFAQ);
router.put('/:id', protectAdmin, ctrl.updateFAQ);
router.delete('/:id', protectAdmin, ctrl.deleteFAQ);

module.exports = router;
