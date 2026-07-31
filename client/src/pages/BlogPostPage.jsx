import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import SEOHead from '../components/layout/SEOHead';
import Breadcrumb from '../components/layout/Breadcrumb';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { SEO_CONFIG } from '../utils/seo';

const BlogPostPage = () => {
  const { slug } = useParams();

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => api.get(`/blogs/slug/${slug}`).then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <LoadingSpinner fullPage />;

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-3xl font-black text-[var(--color-text)] mb-4">Article Not Found</h1>
          <p className="text-[var(--color-text-muted)] mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="btn-primary">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    image: blog.coverImage || SEO_CONFIG.defaultImage,
    author: { '@type': 'Person', name: blog.author || 'Munnalal Painter' },
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.siteName,
      logo: { '@type': 'ImageObject', url: `${SEO_CONFIG.siteUrl}/logo.png` },
    },
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SEO_CONFIG.siteUrl}/blog/${slug}` },
  };

  const safeContent = typeof window !== 'undefined' ? DOMPurify.sanitize(blog.content) : blog.content;

  return (
    <>
      <SEOHead
        title={blog.metaTitle || blog.title}
        description={blog.metaDescription || blog.excerpt}
        canonical={`/blog/${slug}`}
        ogImage={blog.coverImage}
        ogType="article"
        breadcrumbs={[
          { name: 'Blog', href: '/blog' },
          { name: blog.title, href: `/blog/${slug}` },
        ]}
        schemaMarkup={blogSchema}
      />
      <div className="pt-20" style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 100%)' }}>
        <div className="container-custom py-16 max-w-4xl">
          <Breadcrumb items={[{ name: 'Blog', href: '/blog' }, { name: blog.title }]} />
          <div className="mt-6">
            <span className="badge-gold mb-4 inline-flex">{blog.category}</span>
            <h1 className="text-3xl md:text-5xl font-black text-white mt-3 mb-4 leading-snug" style={{ fontFamily: 'Playfair Display, serif' }}>{blog.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
              <span>✍️ {blog.author}</span>
              <span>📅 {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>👁 {blog.views} views</span>
              {blog.tags?.length > 0 && <span>🏷️ {blog.tags.join(', ')}</span>}
            </div>
          </div>
        </div>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,60 C360,20 1080,20 1440,60 L1440,60 L0,60 Z" fill="var(--color-surface)" />
        </svg>
      </div>

      <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <article className="lg:col-span-2">
              {blog.coverImage && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 rounded-2xl overflow-hidden">
                  <img src={blog.coverImage} alt={blog.title} className="w-full object-cover" style={{ maxHeight: '400px' }} />
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="prose prose-lg max-w-none"
                style={{ color: 'var(--color-text-muted)' }}
                dangerouslySetInnerHTML={{ __html: safeContent }}
              />

              {blog.tags?.length > 0 && (
                <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-sm font-medium text-[var(--color-text)] mb-3">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map(tag => (
                      <span key={tag} className="badge-gold text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, #071020, #1e3a5f)' }}>
                <h3 className="text-lg font-bold text-white mb-2">Need Professional Painters in Gorakhpur?</h3>
                <p className="text-white/70 text-sm mb-4">Get a free estimate from Munnalal Painter - 15+ years of experience, 1800+ happy clients.</p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/free-estimate" className="btn-primary text-sm">Get Free Estimate</Link>
                  <a href={`tel:${SEO_CONFIG.phone}`} className="btn-secondary text-sm">Call Now</a>
                </div>
              </div>
            </article>

            <aside className="space-y-6">
              <div className="card p-6">
                <h3 className="font-bold text-[var(--color-text)] mb-4">Quick Contact</h3>
                <div className="space-y-3">
                  <a href={`tel:${SEO_CONFIG.phone}`} className="btn-primary w-full justify-center text-sm">📞 Call Now</a>
                  <a href={`https://wa.me/${SEO_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold text-sm"
                    style={{ background: '#25D366', color: '#fff' }}>
                    💬 WhatsApp
                  </a>
                  <Link to="/free-estimate" className="btn-secondary w-full justify-center text-sm" style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>📋 Free Estimate</Link>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-bold text-[var(--color-text)] mb-4">About the Author</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center text-[#1a1a2e] font-black text-lg">M</div>
                  <div>
                    <p className="font-semibold text-[var(--color-text)] text-sm">{blog.author}</p>
                    <p className="text-[var(--color-text-muted)] text-xs">Professional Painter · 15+ Years Exp.</p>
                  </div>
                </div>
                <p className="text-[var(--color-text-muted)] text-sm mt-3">Expert in house painting, interior design, waterproofing, and POP design across Gorakhpur, UP.</p>
              </div>

              <div className="card p-6">
                <h3 className="font-bold text-[var(--color-text)] mb-4">Explore More</h3>
                <div className="space-y-2">
                  <Link to="/blog" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[#d4a017] transition-colors">📝 All Blog Posts</Link>
                  <Link to="/services" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[#d4a017] transition-colors">🎨 Our Services</Link>
                  <Link to="/gallery" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[#d4a017] transition-colors">🖼️ Gallery</Link>
                  <Link to="/reviews" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[#d4a017] transition-colors">⭐ Reviews</Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPostPage;
