const prisma = require('../config/prisma');
const { toLegacyDoc } = require('../utils/format');

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      services,
      gallery,
      blogs,
      allReviews,
      pendingReviews,
      enquiries,
      newEnquiries,
      estimates,
      newEstimates,
      recentEnquiries,
      recentEstimates,
    ] = await Promise.all([
      prisma.service.count(),
      prisma.gallery.count(),
      prisma.blog.count({ where: { isPublished: true } }),
      prisma.review.count({ where: { isApproved: true } }),
      prisma.review.count({ where: { isApproved: false } }),
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: 'new' } }),
      prisma.estimateRequest.count(),
      prisma.estimateRequest.count({ where: { status: 'new' } }),
      prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.estimateRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);

    res.json({
      success: true,
      data: {
        services,
        gallery,
        blogs,
        allReviews,
        pendingReviews,
        enquiries,
        newEnquiries,
        estimates,
        newEstimates,
        recentEnquiries: toLegacyDoc(recentEnquiries),
        recentEstimates: toLegacyDoc(recentEstimates),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch dashboard stats.' });
  }
};
