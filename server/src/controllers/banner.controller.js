const fs = require('fs');
const path = require('path');
const prisma = require('../config/prisma');
const cloudinary = require('../config/cloudinary');
const { toLegacyDoc } = require('../utils/format');

exports.getActiveBanners = async (req, res) => {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: [
      { isPrimary: 'desc' },
      { order: 'asc' },
      { createdAt: 'desc' },
    ],
  });
  res.json({ success: true, data: toLegacyDoc(banners) });
};

exports.getAllBannersAdmin = async (req, res) => {
  const banners = await prisma.banner.findMany({
    orderBy: [
      { isPrimary: 'desc' },
      { order: 'asc' },
      { createdAt: 'desc' },
    ],
  });
  res.json({ success: true, data: toLegacyDoc(banners) });
};

exports.createBanner = async (req, res) => {
  const { title, image } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Banner title is required.' });
  }
  if (!image || typeof image !== 'string' || !image.trim()) {
    return res.status(400).json({ success: false, message: 'Banner image is required.' });
  }

  if (req.body.isPrimary) {
    await prisma.banner.updateMany({
      data: { isPrimary: false },
    });
  }

  const bannerData = {
    title: title.trim(),
    subtitle: typeof req.body.subtitle === 'string' ? req.body.subtitle.trim() : '',
    image: image.trim(),
    imagePublicId: typeof req.body.imagePublicId === 'string' ? req.body.imagePublicId.trim() : '',
    ctaText: typeof req.body.buttonText === 'string' ? req.body.buttonText.trim() : (typeof req.body.ctaText === 'string' ? req.body.ctaText.trim() : 'Get Free Estimate'),
    ctaLink: typeof req.body.buttonLink === 'string' ? req.body.buttonLink.trim() : (typeof req.body.ctaLink === 'string' ? req.body.ctaLink.trim() : '/free-estimate'),
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
    isPrimary: Boolean(req.body.isPrimary),
    order: Number.isInteger(Number(req.body.order)) ? Number(req.body.order) : (Number.isInteger(Number(req.body.sortOrder)) ? Number(req.body.sortOrder) : 0),
  };

  const banner = await prisma.banner.create({ data: bannerData });
  res.status(201).json({ success: true, data: toLegacyDoc(banner) });
};

exports.updateBanner = async (req, res) => {
  const id = req.params.id;

  if (req.body.isPrimary) {
    await prisma.banner.updateMany({
      where: { id: { not: id } },
      data: { isPrimary: false },
    });
  }

  const updateData = {};
  if (req.body.title !== undefined) updateData.title = String(req.body.title).trim();
  if (req.body.subtitle !== undefined) updateData.subtitle = String(req.body.subtitle).trim();
  if (req.body.image !== undefined) updateData.image = String(req.body.image).trim();
  if (req.body.imagePublicId !== undefined) updateData.imagePublicId = String(req.body.imagePublicId).trim();
  if (req.body.buttonText !== undefined) updateData.ctaText = String(req.body.buttonText).trim();
  else if (req.body.ctaText !== undefined) updateData.ctaText = String(req.body.ctaText).trim();
  if (req.body.buttonLink !== undefined) updateData.ctaLink = String(req.body.buttonLink).trim();
  else if (req.body.ctaLink !== undefined) updateData.ctaLink = String(req.body.ctaLink).trim();
  if (req.body.isActive !== undefined) updateData.isActive = Boolean(req.body.isActive);
  if (req.body.isPrimary !== undefined) updateData.isPrimary = Boolean(req.body.isPrimary);
  if (req.body.sortOrder !== undefined) updateData.order = parseInt(req.body.sortOrder, 10) || 0;
  else if (req.body.order !== undefined) updateData.order = parseInt(req.body.order, 10) || 0;

  try {
    const banner = await prisma.banner.update({
      where: { id },
      data: updateData,
    });
    res.json({ success: true, data: toLegacyDoc(banner) });
  } catch (error) {
    return res.status(404).json({ success: false, message: 'Banner not found.' });
  }
};

exports.toggleBannerStatus = async (req, res) => {
  const id = req.params.id;
  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ success: false, message: 'Banner not found.' });

  const banner = await prisma.banner.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });

  res.json({ success: true, data: toLegacyDoc(banner) });
};

exports.reorderBanners = async (req, res) => {
  const { banners } = req.body;
  if (!Array.isArray(banners)) {
    return res.status(400).json({ success: false, message: 'Invalid payload. Array of banners expected.' });
  }

  for (let index = 0; index < banners.length; index++) {
    const b = banners[index];
    const bId = b.id || b._id;
    if (bId) {
      await prisma.banner.update({
        where: { id: bId },
        data: { order: b.order !== undefined ? parseInt(b.order, 10) || index : index },
      });
    }
  }

  const updatedBanners = await prisma.banner.findMany({
    orderBy: [
      { isPrimary: 'desc' },
      { order: 'asc' },
    ],
  });
  res.json({ success: true, data: toLegacyDoc(updatedBanners) });
};

exports.deleteBanner = async (req, res) => {
  const id = req.params.id;
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) return res.status(404).json({ success: false, message: 'Banner not found.' });

  if (banner.imagePublicId) {
    if (banner.imagePublicId.startsWith('local:') || (banner.image && banner.image.includes('/uploads/'))) {
      const rawName = banner.imagePublicId.replace('local:', '') || path.basename(banner.image);
      const safeFilename = path.basename(rawName);
      const filePath = path.join(__dirname, '../../uploads', safeFilename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
    } else {
      try {
        await cloudinary.uploader.destroy(banner.imagePublicId);
      } catch (e) {}
    }
  }

  await prisma.banner.delete({ where: { id } });
  res.json({ success: true, message: 'Banner deleted.' });
};
