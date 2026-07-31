const Enquiry = require('../models/Enquiry');
exports.submitEnquiry = async (req, res) => {
  const enquiry = await Enquiry.create({ ...req.body, ipAddress: req.ip });
  res.status(201).json({ success: true, message: 'Enquiry submitted successfully. We will contact you soon.', data: enquiry });
};
exports.getAllEnquiries = async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.json({ success: true, count: enquiries.length, data: enquiries });
};
exports.updateEnquiryStatus = async (req, res) => {
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found.' });
  res.json({ success: true, data: enquiry });
};
exports.deleteEnquiry = async (req, res) => {
  await Enquiry.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Enquiry deleted.' });
};
