const ActivityLog = require('../models/ActivityLog');
exports.getLogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;
  const logs = await ActivityLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await ActivityLog.countDocuments();
  res.json({ success: true, data: logs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
};
exports.clearLogs = async (req, res) => {
  await ActivityLog.deleteMany({});
  res.json({ success: true, message: 'Logs cleared.' });
};
