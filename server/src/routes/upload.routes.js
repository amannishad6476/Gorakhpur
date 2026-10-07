const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/upload.controller');
const { protectAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.post('/', protectAdmin, upload.single('image'), ctrl.uploadImage);
router.delete('/', protectAdmin, ctrl.deleteImage);

module.exports = router;
