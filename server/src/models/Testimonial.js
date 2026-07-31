const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, default: '' },
    location: { type: String, default: '' },
    message: { type: String, required: true },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    isFeatured: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
