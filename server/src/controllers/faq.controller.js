const FAQ = require('../models/FAQ');
exports.getActiveFAQs = async (req, res) => {
  const faqs = await FAQ.find({ isActive: true }).sort({ order: 1 });
  res.json({ success: true, count: faqs.length, data: faqs });
};
exports.getAllFAQsAdmin = async (req, res) => {
  const faqs = await FAQ.find().sort({ order: 1 });
  res.json({ success: true, count: faqs.length, data: faqs });
};
exports.createFAQ = async (req, res) => {
  const faq = await FAQ.create(req.body);
  res.status(201).json({ success: true, data: faq });
};
exports.updateFAQ = async (req, res) => {
  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found.' });
  res.json({ success: true, data: faq });
};
exports.deleteFAQ = async (req, res) => {
  await FAQ.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'FAQ deleted.' });
};
