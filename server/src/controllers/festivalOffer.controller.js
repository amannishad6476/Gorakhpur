const FestivalOffer = require('../models/FestivalOffer');

/**
 * Public Endpoint: Get currently active & scheduled festival campaign
 * Filters strictly by isActive=true and startDate <= now <= endDate.
 * Only public fields are exposed.
 */
exports.getActiveOffer = async (req, res) => {
  try {
    const now = new Date();

    const offer = await FestivalOffer.findOne({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ updatedAt: -1 });

    if (!offer) {
      return res.json({ success: true, data: null });
    }

    return res.json({
      success: true,
      data: {
        _id: offer._id,
        festivalName: offer.festivalName,
        heading: offer.heading,
        subheading: offer.subheading,
        offerMessage: offer.offerMessage,
        discountText: offer.discountText,
        services: offer.services,
        bannerImage: offer.bannerImage,
        theme: offer.theme,
        customThemeConfig: offer.customThemeConfig,
        primaryButtonLabel: offer.primaryButtonLabel,
        showWhatsappButton: offer.showWhatsappButton,
        secondaryButtonLabel: offer.secondaryButtonLabel,
        secondaryButtonLink: offer.secondaryButtonLink,
        startDate: offer.startDate,
        endDate: offer.endDate,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve active festival campaign.',
    });
  }
};

/**
 * Admin Endpoint: Get all festival campaigns
 */
exports.getAllOffersAdmin = async (req, res) => {
  try {
    const offers = await FestivalOffer.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: offers });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve festival campaigns.',
    });
  }
};

/**
 * Admin Endpoint: Get single campaign by ID
 */
exports.getOfferById = async (req, res) => {
  try {
    const offer = await FestivalOffer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Festival campaign not found.' });
    }
    return res.json({ success: true, data: offer });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve festival campaign.',
    });
  }
};

/**
 * Admin Endpoint: Create new festival campaign
 */
exports.createOffer = async (req, res) => {
  try {
    const {
      festivalName,
      heading,
      subheading,
      offerMessage,
      discountText,
      services,
      bannerImage,
      bannerImagePublicId,
      theme,
      customThemeConfig,
      primaryButtonLabel,
      showWhatsappButton,
      secondaryButtonLabel,
      secondaryButtonLink,
      startDate,
      endDate,
      isActive,
    } = req.body;

    // 1. Validation
    if (!festivalName || typeof festivalName !== 'string' || !festivalName.trim()) {
      return res.status(400).json({ success: false, message: 'Festival/campaign name is required.' });
    }
    if (!heading || typeof heading !== 'string' || !heading.trim()) {
      return res.status(400).json({ success: false, message: 'Popup heading is required.' });
    }
    if (!startDate) {
      return res.status(400).json({ success: false, message: 'Start date is required.' });
    }
    if (!endDate) {
      return res.status(400).json({ success: false, message: 'End date is required.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid start date format.' });
    }
    if (isNaN(end.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid end date format.' });
    }
    if (end.getTime() < start.getTime()) {
      return res.status(400).json({ success: false, message: 'End date cannot be earlier than start date.' });
    }

    const validThemes = ['diwali', 'holi', 'navratri', 'christmas', 'eid', 'custom'];
    const chosenTheme = validThemes.includes(theme) ? theme : 'diwali';

    let sanitizedServices = [
      'Interior & Exterior Painting',
      'Premium Texture Painting',
      'Wall Putty & Waterproofing',
    ];
    if (Array.isArray(services) && services.length > 0) {
      sanitizedServices = services
        .map((s) => (typeof s === 'string' ? s.trim() : ''))
        .filter(Boolean);
    }

    const offerData = {
      festivalName: festivalName.trim(),
      heading: heading.trim(),
      subheading: typeof subheading === 'string' ? subheading.trim() : '',
      offerMessage: typeof offerMessage === 'string' ? offerMessage.trim() : '',
      discountText: typeof discountText === 'string' ? discountText.trim() : '',
      services: sanitizedServices,
      bannerImage: typeof bannerImage === 'string' ? bannerImage.trim() : '',
      bannerImagePublicId: typeof bannerImagePublicId === 'string' ? bannerImagePublicId.trim() : '',
      theme: chosenTheme,
      customThemeConfig: {
        primaryColor: customThemeConfig?.primaryColor || '#680512',
        secondaryColor: customThemeConfig?.secondaryColor || '#1f0005',
        accentColor: customThemeConfig?.accentColor || '#d4a017',
        textColor: customThemeConfig?.textColor || '#ffffff',
      },
      primaryButtonLabel: typeof primaryButtonLabel === 'string' && primaryButtonLabel.trim()
        ? primaryButtonLabel.trim()
        : 'Get Free Quotation',
      showWhatsappButton: showWhatsappButton !== undefined ? Boolean(showWhatsappButton) : true,
      secondaryButtonLabel: typeof secondaryButtonLabel === 'string' && secondaryButtonLabel.trim()
        ? secondaryButtonLabel.trim()
        : 'Explore Services',
      secondaryButtonLink: typeof secondaryButtonLink === 'string' && secondaryButtonLink.trim()
        ? secondaryButtonLink.trim()
        : '/services',
      startDate: start,
      endDate: end,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    };

    const offer = await FestivalOffer.create(offerData);
    return res.status(201).json({ success: true, data: offer });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create festival campaign.',
    });
  }
};

/**
 * Admin Endpoint: Update festival campaign
 */
exports.updateOffer = async (req, res) => {
  try {
    const offer = await FestivalOffer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Festival campaign not found.' });
    }

    const {
      festivalName,
      heading,
      subheading,
      offerMessage,
      discountText,
      services,
      bannerImage,
      bannerImagePublicId,
      theme,
      customThemeConfig,
      primaryButtonLabel,
      showWhatsappButton,
      secondaryButtonLabel,
      secondaryButtonLink,
      startDate,
      endDate,
      isActive,
    } = req.body;

    const start = startDate ? new Date(startDate) : offer.startDate;
    const end = endDate ? new Date(endDate) : offer.endDate;

    if (startDate && isNaN(start.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid start date format.' });
    }
    if (endDate && isNaN(end.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid end date format.' });
    }
    if (end.getTime() < start.getTime()) {
      return res.status(400).json({ success: false, message: 'End date cannot be earlier than start date.' });
    }

    if (festivalName !== undefined) {
      if (typeof festivalName !== 'string' || !festivalName.trim()) {
        return res.status(400).json({ success: false, message: 'Festival name cannot be empty.' });
      }
      offer.festivalName = festivalName.trim();
    }

    if (heading !== undefined) {
      if (typeof heading !== 'string' || !heading.trim()) {
        return res.status(400).json({ success: false, message: 'Popup heading cannot be empty.' });
      }
      offer.heading = heading.trim();
    }

    if (subheading !== undefined) offer.subheading = String(subheading).trim();
    if (offerMessage !== undefined) offer.offerMessage = String(offerMessage).trim();
    if (discountText !== undefined) offer.discountText = String(discountText).trim();

    if (Array.isArray(services)) {
      offer.services = services.map((s) => (typeof s === 'string' ? s.trim() : '')).filter(Boolean);
    }

    if (bannerImage !== undefined) offer.bannerImage = String(bannerImage).trim();
    if (bannerImagePublicId !== undefined) offer.bannerImagePublicId = String(bannerImagePublicId).trim();

    const validThemes = ['diwali', 'holi', 'navratri', 'christmas', 'eid', 'custom'];
    if (theme && validThemes.includes(theme)) {
      offer.theme = theme;
    }

    if (customThemeConfig && typeof customThemeConfig === 'object') {
      offer.customThemeConfig = {
        primaryColor: customThemeConfig.primaryColor || offer.customThemeConfig.primaryColor,
        secondaryColor: customThemeConfig.secondaryColor || offer.customThemeConfig.secondaryColor,
        accentColor: customThemeConfig.accentColor || offer.customThemeConfig.accentColor,
        textColor: customThemeConfig.textColor || offer.customThemeConfig.textColor,
      };
    }

    if (primaryButtonLabel !== undefined) offer.primaryButtonLabel = String(primaryButtonLabel).trim();
    if (showWhatsappButton !== undefined) offer.showWhatsappButton = Boolean(showWhatsappButton);
    if (secondaryButtonLabel !== undefined) offer.secondaryButtonLabel = String(secondaryButtonLabel).trim();
    if (secondaryButtonLink !== undefined) offer.secondaryButtonLink = String(secondaryButtonLink).trim();

    offer.startDate = start;
    offer.endDate = end;

    if (isActive !== undefined) offer.isActive = Boolean(isActive);

    await offer.save();
    return res.json({ success: true, data: offer });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update festival campaign.',
    });
  }
};

/**
 * Admin Endpoint: Toggle active status
 */
exports.toggleOfferStatus = async (req, res) => {
  try {
    const offer = await FestivalOffer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Festival campaign not found.' });
    }

    offer.isActive = !offer.isActive;
    await offer.save();

    return res.json({
      success: true,
      message: `Festival campaign ${offer.isActive ? 'enabled' : 'disabled'}.`,
      data: offer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to toggle festival campaign status.',
    });
  }
};

/**
 * Admin Endpoint: Delete campaign
 */
exports.deleteOffer = async (req, res) => {
  try {
    const offer = await FestivalOffer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Festival campaign not found.' });
    }

    return res.json({
      success: true,
      message: 'Festival campaign deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete festival campaign.',
    });
  }
};
