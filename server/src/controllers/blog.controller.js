const Blog = require('../models/Blog');

exports.getPublishedBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const blogs = await Blog.find({ isPublished: true })
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-content');
  const total = await Blog.countDocuments({ isPublished: true });
  res.json({ success: true, data: blogs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
};

exports.getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
  if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found.' });
  blog.views += 1;
  await blog.save({ validateBeforeSave: false });
  res.json({ success: true, data: blog });
};

exports.getAllBlogsAdmin = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json({ success: true, count: blogs.length, data: blogs });
};

exports.createBlog = async (req, res) => {
  if (req.body.isPublished && !req.body.publishedAt) req.body.publishedAt = new Date();
  const blog = await Blog.create(req.body);
  res.status(201).json({ success: true, data: blog });
};

exports.updateBlog = async (req, res) => {
  if (req.body.isPublished && !req.body.publishedAt) req.body.publishedAt = new Date();
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!blog) return res.status(404).json({ success: false, message: 'Blog not found.' });
  res.json({ success: true, data: blog });
};

exports.deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Blog deleted.' });
};
