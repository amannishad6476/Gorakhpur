const Testimonial = require('../models/Testimonial');

exports.getFeaturedTestimonials = async (req, res) => {
  const items = await Testimonial.find({ isFeatured: true }).sort({ order: 1 });
  res.json({ success: true, count: items.length, data: items });
};
exports.getAllTestimonialsAdmin = async (req, res) => {
  const items = await Testimonial.find().sort({ order: 1 });
  res.json({ success: true, count: items.length, data: items });
};
exports.createTestimonial = async (req, res) => {
  const item = await Testimonial.create(req.body);
  res.status(201).json({ success: true, data: item });
};
exports.updateTestimonial = async (req, res) => {
  const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ success: false, message: 'Testimonial not found.' });
  res.json({ success: true, data: item });
};
exports.deleteTestimonial = async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Testimonial deleted.' });
};
