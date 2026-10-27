const prisma = require('../config/prisma');
const { toLegacyDoc } = require('../utils/format');

exports.submitEnquiry = async (req, res) => {
  try {
    const { name, phone, email, service, message, notes } = req.body;
    const enquiry = await prisma.enquiry.create({
      data: {
        name: name || '',
        phone: phone || '',
        email: email || '',
        service: service || '',
        message: message || '',
        notes: notes || '',
        status: 'new',
        ipAddress: req.ip || '',
      },
    });
    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. We will contact you soon.',
      data: toLegacyDoc(enquiry),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to submit enquiry.' });
  }
};

exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: enquiries.length, data: toLegacyDoc(enquiries) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch enquiries.' });
  }
};

exports.updateEnquiryStatus = async (req, res) => {
  try {
    const existing = await prisma.enquiry.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Enquiry not found.' });

    const enquiry = await prisma.enquiry.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    res.json({ success: true, data: toLegacyDoc(enquiry) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update enquiry.' });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    const existing = await prisma.enquiry.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Enquiry not found.' });

    await prisma.enquiry.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Enquiry deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete enquiry.' });
  }
};
