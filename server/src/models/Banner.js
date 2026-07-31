const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    ctaText: { type: String, default: 'Get Free Estimate' },
    ctaLink: { type: String, default: '/free-estimate' },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
