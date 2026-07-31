const Service = require('../models/Service');
const Gallery = require('../models/Gallery');
const Blog = require('../models/Blog');
const Review = require('../models/Review');
const Enquiry = require('../models/Enquiry');
const EstimateRequest = require('../models/EstimateRequest');
const ActivityLog = require('../models/ActivityLog');

exports.getDashboardStats = async (req, res) => {
  const [services, gallery, blogs, allReviews, pendingReviews, enquiries, newEnquiries, estimates, newEstimates] =
    await Promise.all([
      Service.countDocuments(),
      Gallery.countDocuments(),
      Blog.countDocuments({ isPublished: true }),
      Review.countDocuments({ isApproved: true }),
      Review.countDocuments({ isApproved: false }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      EstimateRequest.countDocuments(),
      EstimateRequest.countDocuments({ status: 'new' }),
    ]);
  const recentEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(5);
  const recentEstimates = await EstimateRequest.find().sort({ createdAt: -1 }).limit(5);
  res.json({
    success: true,
    data: {
      services, gallery, blogs, allReviews, pendingReviews, enquiries, newEnquiries, estimates, newEstimates,
      recentEnquiries, recentEstimates,
    },
  });
};
