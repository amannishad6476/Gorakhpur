const fs = require('fs');
const path = require('path');
const Banner = require('../models/Banner');
const cloudinary = require('../config/cloudinary');

exports.getActiveBanners = async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({ isPrimary: -1, order: 1, createdAt: -1 });
  res.json({ success: true, data: banners });
};

exports.getAllBannersAdmin = async (req, res) => {
  const banners = await Banner.find().sort({ isPrimary: -1, order: 1, createdAt: -1 });
  res.json({ success: true, data: banners });
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
    await Banner.updateMany({}, { isPrimary: false });
  }

  const bannerData = {
    title: title.trim(),
    subtitle: typeof req.body.subtitle === 'string' ? req.body.subtitle.trim() : '',
    image: image.trim(),
    imagePublicId: typeof req.body.imagePublicId === 'string' ? req.body.imagePublicId.trim() : '',
    ctaText: typeof req.body.buttonText === 'string' ? req.body.buttonText.trim() : (typeof req.body.ctaText === 'string' ? req.body.ctaText.trim() : ''),
    ctaLink: typeof req.body.buttonLink === 'string' ? req.body.buttonLink.trim() : (typeof req.body.ctaLink === 'string' ? req.body.ctaLink.trim() : ''),
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
    isPrimary: Boolean(req.body.isPrimary),
    order: Number.isInteger(Number(req.body.order)) ? Number(req.body.order) : (Number.isInteger(Number(req.body.sortOrder)) ? Number(req.body.sortOrder) : 0),
  };

  const banner = await Banner.create(bannerData);
  res.status(201).json({ success: true, data: banner });
};

exports.updateBanner = async (req, res) => {
  if (req.body.isPrimary) {
    await Banner.updateMany({ _id: { $ne: req.params.id } }, { isPrimary: false });
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

  const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
  if (!banner) return res.status(404).json({ success: false, message: 'Banner not found.' });

  res.json({ success: true, data: banner });
};

exports.toggleBannerStatus = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) return res.status(404).json({ success: false, message: 'Banner not found.' });

  banner.isActive = !banner.isActive;
  await banner.save();

  res.json({ success: true, data: banner });
};

exports.reorderBanners = async (req, res) => {
  const { banners } = req.body;
  if (!Array.isArray(banners)) {
    return res.status(400).json({ success: false, message: 'Invalid payload. Array of banners expected.' });
  }

  const bulkOps = banners.map((b, index) => ({
    updateOne: {
      filter: { _id: b.id || b._id },
      update: { order: b.order !== undefined ? parseInt(b.order, 10) || index : index },
    },
  }));

  await Banner.bulkWrite(bulkOps);
  const updatedBanners = await Banner.find().sort({ isPrimary: -1, order: 1 });
  res.json({ success: true, data: updatedBanners });
};

exports.deleteBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
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

  await banner.deleteOne();
  res.json({ success: true, message: 'Banner deleted.' });
};
