const prisma = require('../config/prisma');
const { toLegacyDoc } = require('../utils/format');

exports.getActiveFAQs = async (req, res) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    res.json({ success: true, count: faqs.length, data: toLegacyDoc(faqs) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch FAQs.' });
  }
};

exports.getAllFAQsAdmin = async (req, res) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: 'asc' },
    });
    res.json({ success: true, count: faqs.length, data: toLegacyDoc(faqs) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch FAQs.' });
  }
};

exports.createFAQ = async (req, res) => {
  try {
    const { question, answer, category, order, isActive } = req.body;
    const faq = await prisma.fAQ.create({
      data: {
        question: question || '',
        answer: answer || '',
        category: category || 'General',
        order: order !== undefined ? Number(order) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });
    res.status(201).json({ success: true, data: toLegacyDoc(faq) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create FAQ.' });
  }
};

exports.updateFAQ = async (req, res) => {
  try {
    const existing = await prisma.fAQ.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'FAQ not found.' });

    const { question, answer, category, order, isActive } = req.body;
    const data = {};
    if (question !== undefined) data.question = question;
    if (answer !== undefined) data.answer = answer;
    if (category !== undefined) data.category = category;
    if (order !== undefined) data.order = Number(order);
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const faq = await prisma.fAQ.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ success: true, data: toLegacyDoc(faq) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update FAQ.' });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    const existing = await prisma.fAQ.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'FAQ not found.' });

    await prisma.fAQ.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'FAQ deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete FAQ.' });
  }
};
