const prisma = require('../config/prisma');
const { toLegacyDoc } = require('../utils/format');

exports.getFeaturedTestimonials = async (req, res) => {
  try {
    const items = await prisma.testimonial.findMany({
      where: { isFeatured: true },
      orderBy: { order: 'asc' },
    });
    res.json({ success: true, count: items.length, data: toLegacyDoc(items) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch testimonials.' });
  }
};

exports.getAllTestimonialsAdmin = async (req, res) => {
  try {
    const items = await prisma.testimonial.findMany({
      orderBy: { order: 'asc' },
    });
    res.json({ success: true, count: items.length, data: toLegacyDoc(items) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch testimonials.' });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const { name, location, rating, review, service, avatar, isFeatured, order } = req.body;
    const item = await prisma.testimonial.create({
      data: {
        name: name || '',
        location: location || '',
        rating: rating !== undefined ? Number(rating) : 5,
        review: review || '',
        service: service || '',
        avatar: avatar || '',
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
        order: order !== undefined ? Number(order) : 0,
      },
    });
    res.status(201).json({ success: true, data: toLegacyDoc(item) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create testimonial.' });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const existing = await prisma.testimonial.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Testimonial not found.' });

    const { name, location, rating, review, service, avatar, isFeatured, order } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (location !== undefined) data.location = location;
    if (rating !== undefined) data.rating = Number(rating);
    if (review !== undefined) data.review = review;
    if (service !== undefined) data.service = service;
    if (avatar !== undefined) data.avatar = avatar;
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
    if (order !== undefined) data.order = Number(order);

    const item = await prisma.testimonial.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ success: true, data: toLegacyDoc(item) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update testimonial.' });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const existing = await prisma.testimonial.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Testimonial not found.' });

    await prisma.testimonial.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Testimonial deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete testimonial.' });
  }
};
