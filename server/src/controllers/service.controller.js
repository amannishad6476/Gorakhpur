const fs = require('fs');
const path = require('path');
const prisma = require('../config/prisma');
const cloudinary = require('../config/cloudinary');
const { isValidSlug } = require('../utils/validation');
const { toLegacyDoc } = require('../utils/format');

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

exports.getAllServices = async (req, res) => {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
  res.json({ success: true, count: services.length, data: toLegacyDoc(services) });
};

exports.getAllServicesAdmin = async (req, res) => {
  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' },
  });
  res.json({ success: true, count: services.length, data: toLegacyDoc(services) });
};

exports.getServiceBySlug = async (req, res) => {
  const cleanSlug = String(req.params.slug).trim();
  const service = await prisma.service.findFirst({
    where: { slug: cleanSlug, isActive: true },
  });
  if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
  res.json({ success: true, data: toLegacyDoc(service) });
};

exports.createService = async (req, res) => {
  const { title, shortDescription } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Service title is required.' });
  }
  if (!shortDescription || typeof shortDescription !== 'string' || !shortDescription.trim()) {
    return res.status(400).json({ success: false, message: 'Short description is required.' });
  }

  let slug = req.body.slug ? String(req.body.slug).trim() : generateSlug(title);
  if (!isValidSlug(slug)) {
    slug = generateSlug(slug || title);
  }

  const features = Array.isArray(req.body.features)
    ? req.body.features.map((f) => String(f).trim()).filter(Boolean)
    : (typeof req.body.features === 'string'
      ? req.body.features.split('\n').map((f) => f.trim()).filter(Boolean)
      : []);

  const serviceData = {
    title: title.trim(),
    slug,
    shortDescription: shortDescription.trim(),
    description: typeof req.body.description === 'string' ? req.body.description.trim() : '',
    features,
    icon: typeof req.body.icon === 'string' ? req.body.icon.trim() : '🎨',
    image: typeof req.body.image === 'string' ? req.body.image.trim() : '',
    imagePublicId: typeof req.body.imagePublicId === 'string' ? req.body.imagePublicId.trim() : '',
    price: typeof req.body.price === 'string' ? req.body.price.trim() : '',
    metaTitle: typeof req.body.metaTitle === 'string' ? req.body.metaTitle.trim() : '',
    metaDescription: typeof req.body.metaDescription === 'string' ? req.body.metaDescription.trim() : '',
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
    order: Number.isInteger(Number(req.body.order)) ? Number(req.body.order) : (Number.isInteger(Number(req.body.sortOrder)) ? Number(req.body.sortOrder) : 0),
  };

  const service = await prisma.service.create({ data: serviceData });
  res.status(201).json({ success: true, data: toLegacyDoc(service) });
};

exports.updateService = async (req, res) => {
  const id = req.params.id;
  const updateData = {};
  if (req.body.title !== undefined) updateData.title = String(req.body.title).trim();
  if (req.body.slug !== undefined) {
    const candidateSlug = String(req.body.slug).trim();
    if (isValidSlug(candidateSlug)) {
      updateData.slug = candidateSlug;
    }
  }
  if (req.body.shortDescription !== undefined) updateData.shortDescription = String(req.body.shortDescription).trim();
  if (req.body.description !== undefined) updateData.description = String(req.body.description).trim();
  if (req.body.features !== undefined) {
    updateData.features = Array.isArray(req.body.features)
      ? req.body.features.map((f) => String(f).trim()).filter(Boolean)
      : (typeof req.body.features === 'string'
        ? req.body.features.split('\n').map((f) => f.trim()).filter(Boolean)
        : []);
  }
  if (req.body.icon !== undefined) updateData.icon = String(req.body.icon).trim();
  if (req.body.image !== undefined) updateData.image = String(req.body.image).trim();
  if (req.body.imagePublicId !== undefined) updateData.imagePublicId = String(req.body.imagePublicId).trim();
  if (req.body.price !== undefined) updateData.price = String(req.body.price).trim();
  if (req.body.metaTitle !== undefined) updateData.metaTitle = String(req.body.metaTitle).trim();
  if (req.body.metaDescription !== undefined) updateData.metaDescription = String(req.body.metaDescription).trim();
  if (req.body.isActive !== undefined) updateData.isActive = Boolean(req.body.isActive);
  if (req.body.sortOrder !== undefined) updateData.order = parseInt(req.body.sortOrder, 10) || 0;
  else if (req.body.order !== undefined) updateData.order = parseInt(req.body.order, 10) || 0;

  try {
    const service = await prisma.service.update({
      where: { id },
      data: updateData,
    });
    res.json({ success: true, data: toLegacyDoc(service) });
  } catch (error) {
    return res.status(404).json({ success: false, message: 'Service not found.' });
  }
};

exports.toggleServiceStatus = async (req, res) => {
  const id = req.params.id;
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ success: false, message: 'Service not found.' });

  const service = await prisma.service.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });

  res.json({ success: true, data: toLegacyDoc(service) });
};

exports.reorderServices = async (req, res) => {
  const { services } = req.body;
  if (!Array.isArray(services)) {
    return res.status(400).json({ success: false, message: 'Invalid payload. Array of services expected.' });
  }

  for (let index = 0; index < services.length; index++) {
    const s = services[index];
    const sId = s.id || s._id;
    if (sId) {
      await prisma.service.update({
        where: { id: sId },
        data: { order: s.order !== undefined ? parseInt(s.order, 10) || index : index },
      });
    }
  }

  const updatedServices = await prisma.service.findMany({
    orderBy: { order: 'asc' },
  });
  res.json({ success: true, data: toLegacyDoc(updatedServices) });
};

exports.removeServiceImage = async (req, res) => {
  const id = req.params.id;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });

  if (service.imagePublicId) {
    if (service.imagePublicId.startsWith('local:') || (service.image && service.image.includes('/uploads/'))) {
      const rawName = service.imagePublicId.replace('local:', '') || path.basename(service.image);
      const safeFilename = path.basename(rawName);
      const filePath = path.join(__dirname, '../../uploads', safeFilename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
    } else {
      try {
        await cloudinary.uploader.destroy(service.imagePublicId);
      } catch (e) {}
    }
  }

  const updated = await prisma.service.update({
    where: { id },
    data: { image: '', imagePublicId: '' },
  });

  res.json({ success: true, data: toLegacyDoc(updated) });
};

exports.deleteService = async (req, res) => {
  const id = req.params.id;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });

  if (service.imagePublicId) {
    if (service.imagePublicId.startsWith('local:') || (service.image && service.image.includes('/uploads/'))) {
      const rawName = service.imagePublicId.replace('local:', '') || path.basename(service.image);
      const safeFilename = path.basename(rawName);
      const filePath = path.join(__dirname, '../../uploads', safeFilename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
    } else {
      try {
        await cloudinary.uploader.destroy(service.imagePublicId);
      } catch (e) {}
    }
  }

  await prisma.service.delete({ where: { id } });
  res.json({ success: true, message: 'Service deleted.' });
};
