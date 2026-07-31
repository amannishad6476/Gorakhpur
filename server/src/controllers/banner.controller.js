const Banner = require('../models/Banner');
const cloudinary = require('../config/cloudinary');
exports.getActiveBanners = async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
  res.json({ success: true, data: banners });
};
exports.getAllBannersAdmin = async (req, res) => {
  const banners = await Banner.find().sort({ order: 1 });
  res.json({ success: true, data: banners });
};
exports.createBanner = async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json({ success: true, data: banner });
};
exports.updateBanner = async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!banner) return res.status(404).json({ success: false, message: 'Banner not found.' });
  res.json({ success: true, data: banner });
};
exports.deleteBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) return res.status(404).json({ success: false, message: 'Banner not found.' });
  if (banner.imagePublicId) await cloudinary.uploader.destroy(banner.imagePublicId);
  await banner.deleteOne();
  res.json({ success: true, message: 'Banner deleted.' });
};
