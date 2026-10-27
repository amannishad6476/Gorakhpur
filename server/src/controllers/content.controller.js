const prisma = require('../config/prisma');
const { toLegacyDoc } = require('../utils/format');

exports.getContent = async (req, res) => {
  try {
    const { group } = req.query;
    const where = group ? { group } : {};
    const content = await prisma.siteContent.findMany({ where });
    const contentMap = {};
    content.forEach((item) => {
      contentMap[item.key] = item.value;
    });
    res.json({ success: true, data: contentMap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch content.' });
  }
};

exports.upsertContent = async (req, res) => {
  try {
    const { key, value, type, label, group } = req.body;
    if (!key) {
      return res.status(400).json({ success: false, message: 'Key is required.' });
    }

    const content = await prisma.siteContent.upsert({
      where: { key },
      update: {
        value,
        ...(type !== undefined && { type }),
        ...(label !== undefined && { label }),
        ...(group !== undefined && { group }),
      },
      create: {
        key,
        value,
        type: type || 'text',
        label: label || '',
        group: group || 'general',
      },
    });

    res.json({ success: true, data: toLegacyDoc(content) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to upsert content.' });
  }
};

exports.bulkUpsertContent = async (req, res) => {
  try {
    const { items } = req.body;
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item && item.key) {
          await prisma.siteContent.upsert({
            where: { key: item.key },
            update: {
              value: item.value,
              ...(item.type !== undefined && { type: item.type }),
              ...(item.label !== undefined && { label: item.label }),
              ...(item.group !== undefined && { group: item.group }),
            },
            create: {
              key: item.key,
              value: item.value,
              type: item.type || 'text',
              label: item.label || '',
              group: item.group || 'general',
            },
          });
        }
      }
    }
    res.json({ success: true, message: 'Content updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to bulk upsert content.' });
  }
};
