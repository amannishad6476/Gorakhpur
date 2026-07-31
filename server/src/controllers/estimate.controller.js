const EstimateRequest = require('../models/EstimateRequest');
exports.submitEstimate = async (req, res) => {
  const estimate = await EstimateRequest.create({ ...req.body, ipAddress: req.ip });
  res.status(201).json({ success: true, message: 'Your estimate request has been submitted. Our team will contact you within 24 hours.', data: estimate });
};
exports.getAllEstimates = async (req, res) => {
  const estimates = await EstimateRequest.find().sort({ createdAt: -1 });
  res.json({ success: true, count: estimates.length, data: estimates });
};
exports.updateEstimateStatus = async (req, res) => {
  const estimate = await EstimateRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!estimate) return res.status(404).json({ success: false, message: 'Estimate request not found.' });
  res.json({ success: true, data: estimate });
};
exports.deleteEstimate = async (req, res) => {
  await EstimateRequest.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Estimate request deleted.' });
};
