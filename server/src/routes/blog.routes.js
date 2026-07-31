const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/blog.controller');
const { protect } = require('../middleware/auth');

router.get('/', ctrl.getPublishedBlogs);
router.get('/slug/:slug', ctrl.getBlogBySlug);
router.get('/admin/all', protect, ctrl.getAllBlogsAdmin);
router.post('/', protect, ctrl.createBlog);
router.put('/:id', protect, ctrl.updateBlog);
router.delete('/:id', protect, ctrl.deleteBlog);

module.exports = router;
