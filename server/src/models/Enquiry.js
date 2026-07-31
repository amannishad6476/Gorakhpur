const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    service: { type: String, default: '' },
    status: { type: String, enum: ['new', 'read', 'replied', 'closed'], default: 'new' },
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
