const prisma = require('../config/prisma');
const { toLegacyDoc } = require('../utils/format');

/**
 * Public Endpoint: Get currently active & scheduled festival campaign
 * Filters strictly by isActive=true and startDate <= now <= endDate.
 * Only public fields are exposed.
 */
exports.getActiveOffer = async (req, res) => {
  try {
    const now = new Date();

    const offer = await prisma.festivalOffer.findFirst({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { updatedAt: 'desc' },
    });

    if (!offer) {
      return res.json({ success: true, data: null });
    }

    return res.json({
      success: true,
      data: {
        _id: offer.id,
        id: offer.id,
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
    const offers = await prisma.festivalOffer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: toLegacyDoc(offers) });
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
    const offer = await prisma.festivalOffer.findUnique({
      where: { id: req.params.id },
    });
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Festival campaign not found.' });
    }
    return res.json({ success: true, data: toLegacyDoc(offer) });
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

    const offer = await prisma.festivalOffer.create({ data: offerData });
    return res.status(201).json({ success: true, data: toLegacyDoc(offer) });
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
    const offer = await prisma.festivalOffer.findUnique({
      where: { id: req.params.id },
    });
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

    const data = {};

    if (festivalName !== undefined) {
      if (typeof festivalName !== 'string' || !festivalName.trim()) {
        return res.status(400).json({ success: false, message: 'Festival name cannot be empty.' });
      }
      data.festivalName = festivalName.trim();
    }

    if (heading !== undefined) {
      if (typeof heading !== 'string' || !heading.trim()) {
        return res.status(400).json({ success: false, message: 'Popup heading cannot be empty.' });
      }
      data.heading = heading.trim();
    }

    if (subheading !== undefined) data.subheading = String(subheading).trim();
    if (offerMessage !== undefined) data.offerMessage = String(offerMessage).trim();
    if (discountText !== undefined) data.discountText = String(discountText).trim();

    if (Array.isArray(services)) {
      data.services = services.map((s) => (typeof s === 'string' ? s.trim() : '')).filter(Boolean);
    }

    if (bannerImage !== undefined) data.bannerImage = String(bannerImage).trim();
    if (bannerImagePublicId !== undefined) data.bannerImagePublicId = String(bannerImagePublicId).trim();

    const validThemes = ['diwali', 'holi', 'navratri', 'christmas', 'eid', 'custom'];
    if (theme && validThemes.includes(theme)) {
      data.theme = theme;
    }

    if (customThemeConfig && typeof customThemeConfig === 'object') {
      const existingConfig = (typeof offer.customThemeConfig === 'object' && offer.customThemeConfig) || {};
      data.customThemeConfig = {
        primaryColor: customThemeConfig.primaryColor || existingConfig.primaryColor || '#680512',
        secondaryColor: customThemeConfig.secondaryColor || existingConfig.secondaryColor || '#1f0005',
        accentColor: customThemeConfig.accentColor || existingConfig.accentColor || '#d4a017',
        textColor: customThemeConfig.textColor || existingConfig.textColor || '#ffffff',
      };
    }

    if (primaryButtonLabel !== undefined) data.primaryButtonLabel = String(primaryButtonLabel).trim();
    if (showWhatsappButton !== undefined) data.showWhatsappButton = Boolean(showWhatsappButton);
    if (secondaryButtonLabel !== undefined) data.secondaryButtonLabel = String(secondaryButtonLabel).trim();
    if (secondaryButtonLink !== undefined) data.secondaryButtonLink = String(secondaryButtonLink).trim();

    data.startDate = start;
    data.endDate = end;

    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const updated = await prisma.festivalOffer.update({
      where: { id: req.params.id },
      data,
    });
    return res.json({ success: true, data: toLegacyDoc(updated) });
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
    const offer = await prisma.festivalOffer.findUnique({
      where: { id: req.params.id },
    });
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Festival campaign not found.' });
    }

    const updated = await prisma.festivalOffer.update({
      where: { id: req.params.id },
      data: { isActive: !offer.isActive },
    });

    return res.json({
      success: true,
      message: `Festival campaign ${updated.isActive ? 'enabled' : 'disabled'}.`,
      data: toLegacyDoc(updated),
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
    const offer = await prisma.festivalOffer.findUnique({
      where: { id: req.params.id },
    });
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Festival campaign not found.' });
    }

    await prisma.festivalOffer.delete({
      where: { id: req.params.id },
    });

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
