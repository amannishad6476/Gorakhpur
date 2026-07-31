const cloudinary = require('../config/cloudinary');
exports.uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
  res.json({
    success: true,
    data: {
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
    },
  });
};
exports.deleteImage = async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) return res.status(400).json({ success: false, message: 'Public ID required.' });
  await cloudinary.uploader.destroy(publicId);
  res.json({ success: true, message: 'Image deleted.' });
};
