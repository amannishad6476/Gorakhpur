const ActivityLog = require('../models/ActivityLog');

exports.logActivity = (action, resource) => async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = async (data) => {
    if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
      try {
        await ActivityLog.create({
          user: req.user._id,
          userName: req.user.name,
          action,
          resource,
          resourceId: req.params.id || '',
          details: JSON.stringify(req.body).substring(0, 200),
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.headers['user-agent'] || '',
        });
      } catch (err) {
        console.error('Activity log error:', err.message);
      }
    }
    return originalJson(data);
  };
  next();
};
