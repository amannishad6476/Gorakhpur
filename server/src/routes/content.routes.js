const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/content.controller');
const { protectAdmin } = require('../middleware/auth');

router.get('/', ctrl.getContent);
router.post('/', protectAdmin, ctrl.upsertContent);
router.post('/bulk', protectAdmin, ctrl.bulkUpsertContent);

module.exports = router;
