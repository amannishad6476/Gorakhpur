const SiteContent = require('../models/SiteContent');
exports.getContent = async (req, res) => {
  const { group } = req.query;
  const filter = group ? { group } : {};
  const content = await SiteContent.find(filter);
  const contentMap = {};
  content.forEach((item) => { contentMap[item.key] = item.value; });
  res.json({ success: true, data: contentMap });
};
exports.upsertContent = async (req, res) => {
  const { key, value, type, label, group } = req.body;
  const content = await SiteContent.findOneAndUpdate(
    { key },
    { key, value, type, label, group },
    { upsert: true, new: true, runValidators: true }
  );
  res.json({ success: true, data: content });
};
exports.bulkUpsertContent = async (req, res) => {
  const { items } = req.body;
  const ops = items.map((item) => ({
    updateOne: {
      filter: { key: item.key },
      update: { $set: item },
      upsert: true,
    },
  }));
  await SiteContent.bulkWrite(ops);
  res.json({ success: true, message: 'Content updated successfully.' });
};
