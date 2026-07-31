const Service = require('../models/Service');

exports.getAllServices = async (req, res) => {
  const services = await Service.find({ isActive: true }).sort({ order: 1 });
  res.json({ success: true, count: services.length, data: services });
};

exports.getAllServicesAdmin = async (req, res) => {
  const services = await Service.find().sort({ order: 1 });
  res.json({ success: true, count: services.length, data: services });
};

exports.getServiceBySlug = async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, isActive: true });
  if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
  res.json({ success: true, data: service });
};

exports.createService = async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, data: service });
};

exports.updateService = async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
  res.json({ success: true, data: service });
};

exports.deleteService = async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
  res.json({ success: true, message: 'Service deleted.' });
};
