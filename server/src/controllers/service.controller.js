const fs = require('fs');
const path = require('path');
const Service = require('../models/Service');
const cloudinary = require('../config/cloudinary');

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
  const serviceData = {
    ...req.body,
    order: req.body.order !== undefined ? req.body.order : (req.body.sortOrder || 0),
  };
  const service = await Service.create(serviceData);
  res.status(201).json({ success: true, data: service });
};

exports.updateService = async (req, res) => {
  const updateData = {
    ...req.body,
  };
  if (req.body.sortOrder !== undefined) updateData.order = req.body.sortOrder;

  const service = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
  if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
  res.json({ success: true, data: service });
};

exports.toggleServiceStatus = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });

  service.isActive = !service.isActive;
  await service.save();

  res.json({ success: true, data: service });
};

exports.reorderServices = async (req, res) => {
  const { services } = req.body;
  if (!Array.isArray(services)) {
    return res.status(400).json({ success: false, message: 'Invalid payload. Array of services expected.' });
  }

  const bulkOps = services.map((s, index) => ({
    updateOne: {
      filter: { _id: s.id || s._id },
      update: { order: s.order !== undefined ? s.order : index },
    },
  }));

  await Service.bulkWrite(bulkOps);
  const updatedServices = await Service.find().sort({ order: 1 });
  res.json({ success: true, data: updatedServices });
};

exports.removeServiceImage = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });

  if (service.imagePublicId) {
    if (service.imagePublicId.startsWith('local:') || (service.image && service.image.includes('/uploads/'))) {
      const filename = service.imagePublicId.replace('local:', '') || path.basename(service.image);
      const filePath = path.join(__dirname, '../../uploads', filename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
    } else {
      try {
        await cloudinary.uploader.destroy(service.imagePublicId);
      } catch (e) {}
    }
  }

  service.image = '';
  service.imagePublicId = '';
  await service.save();

  res.json({ success: true, data: service });
};

exports.deleteService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });

  if (service.imagePublicId) {
    if (service.imagePublicId.startsWith('local:') || (service.image && service.image.includes('/uploads/'))) {
      const filename = service.imagePublicId.replace('local:', '') || path.basename(service.image);
      const filePath = path.join(__dirname, '../../uploads', filename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
    } else {
      try {
        await cloudinary.uploader.destroy(service.imagePublicId);
      } catch (e) {}
    }
  }

  await service.deleteOne();
  res.json({ success: true, message: 'Service deleted.' });
};
