const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['interior', 'exterior', 'texture', 'waterproofing', 'pop', 'wood', 'commercial', 'before-after'],
      default: 'interior',
    },
    beforeImage: { type: String, default: '' },
    beforeImagePublicId: { type: String, default: '' },
    afterImage: { type: String, required: true },
    afterImagePublicId: { type: String, default: '' },
    isBeforeAfter: { type: Boolean, default: false },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
