const Project = require('../models/Project');
exports.getProjects = async (req, res) => {
  const projects = await Project.find({ isActive: true }).sort({ completedAt: -1 });
  res.json({ success: true, count: projects.length, data: projects });
};
exports.getFeaturedProjects = async (req, res) => {
  const projects = await Project.find({ isActive: true, isFeatured: true }).sort({ completedAt: -1 }).limit(6);
  res.json({ success: true, data: projects });
};
exports.getProjectBySlug = async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug, isActive: true });
  if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
  res.json({ success: true, data: project });
};
exports.createProject = async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project });
};
exports.updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
  res.json({ success: true, data: project });
};
exports.deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Project deleted.' });
};
