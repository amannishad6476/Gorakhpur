const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  let imageUrl = req.file.path;
  let imagePublicId = req.file.filename || req.file.public_id || '';

  // If local disk upload
  if (req.file.filename && !req.file.path.startsWith('http://') && !req.file.path.startsWith('https://')) {
    imageUrl = `/uploads/${req.file.filename}`;
    imagePublicId = `local:${req.file.filename}`;
  }

  res.json({
    success: true,
    data: {
      url: imageUrl,
      publicId: imagePublicId,
      originalName: req.file.originalname,
    },
  });
};

exports.deleteImage = async (req, res) => {
  const { publicId, url } = req.body;
  if (!publicId && !url) {
    return res.status(400).json({ success: false, message: 'Public ID or image URL is required.' });
  }

  const targetPublicId = typeof publicId === 'string' ? publicId.trim() : '';
  const targetUrl = typeof url === 'string' ? url.trim() : '';

  if (targetPublicId.startsWith('local:') || targetUrl.includes('/uploads/')) {
    const rawName = targetPublicId.startsWith('local:')
      ? targetPublicId.replace('local:', '')
      : path.basename(targetUrl);
    const safeFilename = path.basename(rawName);
    const filePath = path.join(__dirname, '../../uploads', safeFilename);

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn('Failed to delete local file:', err.message);
      }
    }
  } else if (targetPublicId) {
    try {
      await cloudinary.uploader.destroy(targetPublicId);
    } catch (err) {
      console.warn('Cloudinary delete failed:', err.message);
    }
  }

  res.json({ success: true, message: 'Image deleted.' });
};
