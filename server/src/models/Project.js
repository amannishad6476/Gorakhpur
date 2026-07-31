const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    client: { type: String, default: '' },
    location: { type: String, default: 'Gorakhpur' },
    serviceType: { type: String, required: true },
    duration: { type: String, default: '' },
    area: { type: String, default: '' },
    images: [{ url: String, publicId: String }],
    beforeImage: { type: String, default: '' },
    afterImage: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
