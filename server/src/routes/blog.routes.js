const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/blog.controller');
const { protectAdmin } = require('../middleware/auth');

router.get('/', ctrl.getPublishedBlogs);
router.get('/slug/:slug', ctrl.getBlogBySlug);
router.get('/admin/all', protectAdmin, ctrl.getAllBlogsAdmin);
router.post('/', protectAdmin, ctrl.createBlog);
router.put('/:id', protectAdmin, ctrl.updateBlog);
router.delete('/:id', protectAdmin, ctrl.deleteBlog);

module.exports = router;
