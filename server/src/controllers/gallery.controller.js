const prisma = require('../config/prisma');
const cloudinary = require('../config/cloudinary');
const { toLegacyDoc } = require('../utils/format');

exports.getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    const where = { isActive: true };
    if (category && category !== 'all') {
      where.category = category;
    }

    const items = await prisma.gallery.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({ success: true, count: items.length, data: toLegacyDoc(items) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch gallery items.' });
  }
};

exports.getGalleryAdmin = async (req, res) => {
  try {
    const items = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: items.length, data: toLegacyDoc(items) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch gallery items.' });
  }
};

exports.createGalleryItem = async (req, res) => {
  try {
    const {
      title,
      category,
      beforeImage,
      beforeImagePublicId,
      afterImage,
      afterImagePublicId,
      description,
      location,
      isFeatured,
      order,
      isActive,
    } = req.body;

    const item = await prisma.gallery.create({
      data: {
        title: title || '',
        category: category || 'interior',
        beforeImage: beforeImage || '',
        beforeImagePublicId: beforeImagePublicId || '',
        afterImage: afterImage || '',
        afterImagePublicId: afterImagePublicId || '',
        description: description || '',
        location: location || '',
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
        order: order !== undefined ? Number(order) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    res.status(201).json({ success: true, data: toLegacyDoc(item) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create gallery item.' });
  }
};

exports.updateGalleryItem = async (req, res) => {
  try {
    const existing = await prisma.gallery.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Gallery item not found.' });

    const {
      title,
      category,
      beforeImage,
      beforeImagePublicId,
      afterImage,
      afterImagePublicId,
      description,
      location,
      isFeatured,
      order,
      isActive,
    } = req.body;

    const data = {};
    if (title !== undefined) data.title = title;
    if (category !== undefined) data.category = category;
    if (beforeImage !== undefined) data.beforeImage = beforeImage;
    if (beforeImagePublicId !== undefined) data.beforeImagePublicId = beforeImagePublicId;
    if (afterImage !== undefined) data.afterImage = afterImage;
    if (afterImagePublicId !== undefined) data.afterImagePublicId = afterImagePublicId;
    if (description !== undefined) data.description = description;
    if (location !== undefined) data.location = location;
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
    if (order !== undefined) data.order = Number(order);
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const item = await prisma.gallery.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ success: true, data: toLegacyDoc(item) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update gallery item.' });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await prisma.gallery.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found.' });

    if (item.afterImagePublicId && cloudinary.uploader) {
      try { await cloudinary.uploader.destroy(item.afterImagePublicId); } catch (_) {}
    }
    if (item.beforeImagePublicId && cloudinary.uploader) {
      try { await cloudinary.uploader.destroy(item.beforeImagePublicId); } catch (_) {}
    }

    await prisma.gallery.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Gallery item deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete gallery item.' });
  }
};
