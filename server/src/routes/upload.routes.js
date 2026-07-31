const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/upload.controller');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
router.post('/', protect, upload.single('image'), ctrl.uploadImage);
router.delete('/', protect, ctrl.deleteImage);
module.exports = router;
