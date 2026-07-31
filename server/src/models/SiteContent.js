const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    type: { type: String, enum: ['text', 'html', 'json', 'image'], default: 'text' },
    label: { type: String, default: '' },
    group: { type: String, default: 'general' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteContent', siteContentSchema);
