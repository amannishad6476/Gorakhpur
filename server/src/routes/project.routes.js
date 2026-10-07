const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/project.controller');
const { protectAdmin } = require('../middleware/auth');

router.get('/', ctrl.getProjects);
router.get('/featured', ctrl.getFeaturedProjects);
router.get('/slug/:slug', ctrl.getProjectBySlug);
router.get('/admin/all', protectAdmin, ctrl.getProjects);
router.post('/', protectAdmin, ctrl.createProject);
router.put('/:id', protectAdmin, ctrl.updateProject);
router.delete('/:id', protectAdmin, ctrl.deleteProject);

module.exports = router;
