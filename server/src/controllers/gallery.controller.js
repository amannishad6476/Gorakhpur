const Gallery = require('../models/Gallery');
const cloudinary = require('../config/cloudinary');

exports.getGallery = async (req, res) => {
  const { category } = req.query;
  const filter = { isActive: true };
  if (category && category !== 'all') filter.category = category;
  const items = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: items.length, data: items });
};

exports.getGalleryAdmin = async (req, res) => {
  const items = await Gallery.find().sort({ createdAt: -1 });
  res.json({ success: true, count: items.length, data: items });
};

exports.createGalleryItem = async (req, res) => {
  const item = await Gallery.create(req.body);
  res.status(201).json({ success: true, data: item });
};

exports.updateGalleryItem = async (req, res) => {
  const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found.' });
  res.json({ success: true, data: item });
};

exports.deleteGalleryItem = async (req, res) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found.' });
  if (item.afterImagePublicId) await cloudinary.uploader.destroy(item.afterImagePublicId);
  if (item.beforeImagePublicId) await cloudinary.uploader.destroy(item.beforeImagePublicId);
  await item.deleteOne();
  res.json({ success: true, message: 'Gallery item deleted.' });
};
