const prisma = require('../config/prisma');
const { toLegacyDoc } = require('../utils/format');

exports.getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      orderBy: [
        { completedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    res.json({ success: true, count: projects.length, data: toLegacyDoc(projects) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch projects.' });
  }
};

exports.getProjectsAdmin = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: projects.length, data: toLegacyDoc(projects) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch projects.' });
  }
};

exports.getFeaturedProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: [
        { completedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 6,
    });
    res.json({ success: true, data: toLegacyDoc(projects) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch featured projects.' });
  }
};

exports.getProjectBySlug = async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: { slug: req.params.slug, isActive: true },
    });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.json({ success: true, data: toLegacyDoc(project) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch project.' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const {
      title,
      slug,
      client,
      category,
      location,
      area,
      duration,
      completedAt,
      description,
      scopeOfWork,
      featuredImage,
      images,
      testimonialQuote,
      isFeatured,
      isActive,
    } = req.body;

    const project = await prisma.project.create({
      data: {
        title: title || '',
        slug: slug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `${Date.now()}`),
        client: client || '',
        category: category || 'residential',
        location: location || '',
        area: area || '',
        duration: duration || '',
        completedAt: completedAt ? new Date(completedAt) : null,
        description: description || '',
        scopeOfWork: Array.isArray(scopeOfWork) ? scopeOfWork : [],
        featuredImage: featuredImage || '',
        images: Array.isArray(images) ? images : [],
        testimonialQuote: testimonialQuote || '',
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    res.status(201).json({ success: true, data: toLegacyDoc(project) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create project.' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const existing = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Project not found.' });

    const {
      title,
      slug,
      client,
      category,
      location,
      area,
      duration,
      completedAt,
      description,
      scopeOfWork,
      featuredImage,
      images,
      testimonialQuote,
      isFeatured,
      isActive,
    } = req.body;

    const data = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (client !== undefined) data.client = client;
    if (category !== undefined) data.category = category;
    if (location !== undefined) data.location = location;
    if (area !== undefined) data.area = area;
    if (duration !== undefined) data.duration = duration;
    if (completedAt !== undefined) data.completedAt = completedAt ? new Date(completedAt) : null;
    if (description !== undefined) data.description = description;
    if (scopeOfWork !== undefined) data.scopeOfWork = Array.isArray(scopeOfWork) ? scopeOfWork : [];
    if (featuredImage !== undefined) data.featuredImage = featuredImage;
    if (images !== undefined) data.images = Array.isArray(images) ? images : [];
    if (testimonialQuote !== undefined) data.testimonialQuote = testimonialQuote;
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ success: true, data: toLegacyDoc(project) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update project.' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const existing = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Project not found.' });

    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Project deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete project.' });
  }
};
