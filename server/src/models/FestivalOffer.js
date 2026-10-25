const mongoose = require('mongoose');

const festivalOfferSchema = new mongoose.Schema(
  {
    festivalName: {
      type: String,
      required: [true, 'Festival name is required'],
      trim: true,
      maxlength: [100, 'Festival name cannot exceed 100 characters'],
    },
    heading: {
      type: String,
      required: [true, 'Popup heading is required'],
      trim: true,
      maxlength: [150, 'Popup heading cannot exceed 150 characters'],
    },
    subheading: {
      type: String,
      default: '',
      trim: true,
      maxlength: [250, 'Subheading cannot exceed 250 characters'],
    },
    offerMessage: {
      type: String,
      default: '',
      trim: true,
      maxlength: [300, 'Offer message cannot exceed 300 characters'],
    },
    discountText: {
      type: String,
      default: '',
      trim: true,
      maxlength: [80, 'Discount text cannot exceed 80 characters'],
    },
    services: {
      type: [String],
      default: [
        'Interior & Exterior Painting',
        'Premium Texture Painting',
        'Wall Putty & Waterproofing',
      ],
    },
    bannerImage: {
      type: String,
      default: '',
      trim: true,
    },
    bannerImagePublicId: {
      type: String,
      default: '',
      trim: true,
    },
    theme: {
      type: String,
      enum: ['diwali', 'holi', 'navratri', 'christmas', 'eid', 'custom'],
      default: 'diwali',
    },
    customThemeConfig: {
      primaryColor: { type: String, default: '#680512' },
      secondaryColor: { type: String, default: '#1f0005' },
      accentColor: { type: String, default: '#d4a017' },
      textColor: { type: String, default: '#ffffff' },
    },
    primaryButtonLabel: {
      type: String,
      default: 'Get Free Quotation',
      trim: true,
      maxlength: [50, 'Primary button label cannot exceed 50 characters'],
    },
    showWhatsappButton: {
      type: Boolean,
      default: true,
    },
    secondaryButtonLabel: {
      type: String,
      default: 'Explore Services',
      trim: true,
      maxlength: [50, 'Secondary button label cannot exceed 50 characters'],
    },
    secondaryButtonLink: {
      type: String,
      default: '/services',
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index to quickly query active campaigns within current date range
festivalOfferSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('FestivalOffer', festivalOfferSchema);
