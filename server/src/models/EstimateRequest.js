const mongoose = require('mongoose');

const estimateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: 'Gorakhpur' },
    serviceType: { type: String, required: true },
    propertyType: { type: String, enum: ['apartment', 'house', 'office', 'commercial', 'other'], default: 'house' },
    area: { type: String, default: '' },
    budget: { type: String, default: '' },
    preferredDate: { type: Date },
    additionalInfo: { type: String, default: '' },
    status: { type: String, enum: ['new', 'contacted', 'quoted', 'converted', 'rejected'], default: 'new' },
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EstimateRequest', estimateSchema);
