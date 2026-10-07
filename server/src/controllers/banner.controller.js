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
  if (req.body.isPrimary) {
    await Banner.updateMany({}, { isPrimary: false });
  }

  // Alias support for buttonText / buttonLink
  const bannerData = {
    ...req.body,
    ctaText: req.body.buttonText !== undefined ? req.body.buttonText : req.body.ctaText,
    ctaLink: req.body.buttonLink !== undefined ? req.body.buttonLink : req.body.ctaLink,
    order: req.body.order !== undefined ? req.body.order : (req.body.sortOrder || 0),
  };

  const banner = await Banner.create(bannerData);
  res.status(201).json({ success: true, data: banner });
};

exports.updateBanner = async (req, res) => {
  if (req.body.isPrimary) {
    await Banner.updateMany({ _id: { $ne: req.params.id } }, { isPrimary: false });
  }

  const updateData = {
    ...req.body,
  };
  if (req.body.buttonText !== undefined) updateData.ctaText = req.body.buttonText;
  if (req.body.buttonLink !== undefined) updateData.ctaLink = req.body.buttonLink;
  if (req.body.sortOrder !== undefined) updateData.order = req.body.sortOrder;

  const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
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
      update: { order: b.order !== undefined ? b.order : index },
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
      const filename = banner.imagePublicId.replace('local:', '') || path.basename(banner.image);
      const filePath = path.join(__dirname, '../../uploads', filename);
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
