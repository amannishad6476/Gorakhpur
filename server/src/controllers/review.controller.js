const Review = require('../models/Review');

exports.getApprovedReviews = async (req, res) => {
  const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
  res.json({ success: true, count: reviews.length, data: reviews });
};

exports.submitReview = async (req, res) => {
  const review = await Review.create({ ...req.body, isApproved: false });
  res.status(201).json({ success: true, message: 'Review submitted. It will appear after admin approval.', data: review });
};

exports.getAllReviewsAdmin = async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json({ success: true, count: reviews.length, data: reviews });
};

exports.approveReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
  res.json({ success: true, data: review });
};

exports.rejectReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: false }, { new: true });
  if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
  res.json({ success: true, data: review });
};

exports.toggleVerified = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
  review.isVerified = !review.isVerified;
  await review.save();
  res.json({ success: true, data: review });
};

exports.deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Review deleted.' });
};
