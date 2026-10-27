const prisma = require('../config/prisma');
const { toLegacyDoc } = require('../utils/format');

exports.getPublishedBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          coverImage: true,
          coverPublicId: true,
          category: true,
          tags: true,
          author: true,
          isPublished: true,
          publishedAt: true,
          metaTitle: true,
          metaDescription: true,
          views: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.blog.count({ where: { isPublished: true } }),
    ]);

    res.json({
      success: true,
      data: toLegacyDoc(blogs),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch blogs.' });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await prisma.blog.findFirst({
      where: { slug: req.params.slug, isPublished: true },
    });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found.' });

    const updated = await prisma.blog.update({
      where: { id: blog.id },
      data: { views: { increment: 1 } },
    });

    res.json({ success: true, data: toLegacyDoc(updated) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch blog.' });
  }
};

exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: blogs.length, data: toLegacyDoc(blogs) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch blogs.' });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      summary,
      content,
      coverImage,
      coverPublicId,
      category,
      tags,
      author,
      isPublished,
      publishedAt,
      metaTitle,
      metaDescription,
    } = req.body;

    const isPub = isPublished !== undefined ? Boolean(isPublished) : false;
    let pubAt = null;
    if (isPub) {
      pubAt = publishedAt ? new Date(publishedAt) : new Date();
    }

    const blog = await prisma.blog.create({
      data: {
        title: title || '',
        slug: slug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `${Date.now()}`),
        summary: summary || '',
        content: content || '',
        coverImage: coverImage || '',
        coverPublicId: coverPublicId || '',
        category: category || 'General',
        tags: Array.isArray(tags) ? tags : [],
        author: author || 'Munnalal Painter',
        isPublished: isPub,
        publishedAt: pubAt,
        metaTitle: metaTitle || '',
        metaDescription: metaDescription || '',
      },
    });

    res.status(201).json({ success: true, data: toLegacyDoc(blog) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create blog.' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const existing = await prisma.blog.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Blog not found.' });

    const {
      title,
      slug,
      summary,
      content,
      coverImage,
      coverPublicId,
      category,
      tags,
      author,
      isPublished,
      publishedAt,
      metaTitle,
      metaDescription,
    } = req.body;

    const data = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (summary !== undefined) data.summary = summary;
    if (content !== undefined) data.content = content;
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (coverPublicId !== undefined) data.coverPublicId = coverPublicId;
    if (category !== undefined) data.category = category;
    if (tags !== undefined) data.tags = Array.isArray(tags) ? tags : [];
    if (author !== undefined) data.author = author;

    if (isPublished !== undefined) {
      data.isPublished = Boolean(isPublished);
      if (data.isPublished && !existing.publishedAt && !publishedAt) {
        data.publishedAt = new Date();
      }
    }
    if (publishedAt !== undefined) {
      data.publishedAt = publishedAt ? new Date(publishedAt) : null;
    }

    if (metaTitle !== undefined) data.metaTitle = metaTitle;
    if (metaDescription !== undefined) data.metaDescription = metaDescription;

    const blog = await prisma.blog.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ success: true, data: toLegacyDoc(blog) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update blog.' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const existing = await prisma.blog.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Blog not found.' });

    await prisma.blog.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Blog deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete blog.' });
  }
};
