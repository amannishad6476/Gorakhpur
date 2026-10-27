const prisma = require('../config/prisma');

exports.logActivity = (action, resource) => async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = async (data) => {
    if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
      try {
        await prisma.activityLog.create({
          data: {
            userId: req.user.id || req.user._id || null,
            userName: req.user.name || '',
            action,
            resource,
            resourceId: req.params.id || '',
            details: JSON.stringify(req.body || {}).substring(0, 200),
            ipAddress: req.ip || (req.connection && req.connection.remoteAddress) || '',
            userAgent: req.headers['user-agent'] || '',
          },
        });
      } catch (err) {
        console.error('Activity log error:', err.message);
      }
    }
    return originalJson(data);
  };
  next();
};
