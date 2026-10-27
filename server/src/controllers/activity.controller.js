const prisma = require('../config/prisma');
const { toLegacyDoc } = require('../utils/format');

exports.getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.activityLog.count(),
    ]);

    res.json({
      success: true,
      data: toLegacyDoc(logs),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch activity logs.' });
  }
};

exports.clearLogs = async (req, res) => {
  try {
    await prisma.activityLog.deleteMany({});
    res.json({ success: true, message: 'Logs cleared.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to clear activity logs.' });
  }
};
