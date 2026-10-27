const prisma = require('../config/prisma');
const { toLegacyDoc } = require('../utils/format');

exports.submitEstimate = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      serviceType,
      propertyType,
      carpetArea,
      rooms,
      address,
      pincode,
      preferredDate,
      estimatedCost,
      notes,
    } = req.body;

    const estimate = await prisma.estimateRequest.create({
      data: {
        name: name || '',
        phone: phone || '',
        email: email || '',
        serviceType: serviceType || '',
        propertyType: propertyType || 'residential',
        carpetArea: carpetArea || '',
        rooms: rooms || '',
        address: address || '',
        pincode: pincode || '',
        preferredDate: preferredDate || '',
        estimatedCost: estimatedCost || '',
        notes: notes || '',
        status: 'new',
        ipAddress: req.ip || '',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Your estimate request has been submitted. Our team will contact you within 24 hours.',
      data: toLegacyDoc(estimate),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to submit estimate request.' });
  }
};

exports.getAllEstimates = async (req, res) => {
  try {
    const estimates = await prisma.estimateRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: estimates.length, data: toLegacyDoc(estimates) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch estimate requests.' });
  }
};

exports.updateEstimateStatus = async (req, res) => {
  try {
    const existing = await prisma.estimateRequest.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Estimate request not found.' });

    const estimate = await prisma.estimateRequest.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    res.json({ success: true, data: toLegacyDoc(estimate) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update estimate request.' });
  }
};

exports.deleteEstimate = async (req, res) => {
  try {
    const existing = await prisma.estimateRequest.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Estimate request not found.' });

    await prisma.estimateRequest.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Estimate request deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete estimate request.' });
  }
};
