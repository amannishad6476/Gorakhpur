const prisma = require('../config/prisma');
const { toLegacyDoc } = require('../utils/format');

exports.getApprovedReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: reviews.length, data: toLegacyDoc(reviews) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch reviews.' });
  }
};

exports.submitReview = async (req, res) => {
  try {
    const { name, phone, email, rating, service, comment, location } = req.body;
    const review = await prisma.review.create({
      data: {
        name: name || '',
        phone: phone || '',
        email: email || '',
        rating: Number(rating) || 5,
        service: service || '',
        comment: comment || '',
        location: location || '',
        isApproved: false,
        isVerified: false,
      },
    });
    res.status(201).json({
      success: true,
      message: 'Review submitted. It will appear after admin approval.',
      data: toLegacyDoc(review),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to submit review.' });
  }
};

exports.getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: reviews.length, data: toLegacyDoc(reviews) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch reviews.' });
  }
};

exports.approveReview = async (req, res) => {
  try {
    const existing = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Review not found.' });

    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { isApproved: true },
    });
    res.json({ success: true, data: toLegacyDoc(review) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to approve review.' });
  }
};

exports.rejectReview = async (req, res) => {
  try {
    const existing = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Review not found.' });

    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { isApproved: false },
    });
    res.json({ success: true, data: toLegacyDoc(review) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to reject review.' });
  }
};

exports.toggleVerified = async (req, res) => {
  try {
    const existing = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Review not found.' });

    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { isVerified: !existing.isVerified },
    });
    res.json({ success: true, data: toLegacyDoc(review) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to toggle verified status.' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const existing = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Review not found.' });

    await prisma.review.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Review deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete review.' });
  }
};
