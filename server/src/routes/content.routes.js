const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/content.controller');
const { protect } = require('../middleware/auth');
router.get('/', ctrl.getContent);
router.post('/', protect, ctrl.upsertContent);
router.post('/bulk', protect, ctrl.bulkUpsertContent);
module.exports = router;
