import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import SEOHead from '../components/layout/SEOHead';
import Breadcrumb from '../components/layout/Breadcrumb';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

const placeholderBlogs = [
  { _id: '1', slug: 'best-interior-paint-colors-gorakhpur', title: '10 Best Interior Paint Colors for Gorakhpur Homes in 2024', excerpt: 'Discover the most popular and beautiful interior paint colors that work perfectly in Gorakhpur\'s climate and lighting conditions. Expert recommendations from our painters.', category: 'Interior Design', publishedAt: '2024-01-15', author: 'Munnalal Painter', views: 245 },
  { _id: '2', slug: 'waterproofing-tips-before-monsoon', title: 'Essential Waterproofing Tips Before Monsoon Season in Gorakhpur', excerpt: 'Protect your home from water damage this monsoon season with these professional waterproofing tips and techniques from our expert painters in Gorakhpur.', category: 'Tips & Tricks', publishedAt: '2024-02-10', author: 'Munnalal Painter', views: 312 },
  { _id: '3', slug: 'texture-painting-complete-guide', title: 'Complete Guide to Texture Painting for Your Home in Gorakhpur', excerpt: 'Learn everything about texture painting - types, costs, process, before & after photos, and how to choose the right texture for each room of your home.', category: 'Painting Guide', publishedAt: '2024-03-05', author: 'Munnalal Painter', views: 189 },
  { _id: '4', slug: 'asian-paints-vs-berger-comparison', title: 'Asian Paints vs Berger Paints: Which is Better for Gorakhpur Homes?', excerpt: 'A detailed comparison of Asian Paints and Berger Paints considering Gorakhpur\'s climate, humidity, and local conditions. Which paint is best for your home?', category: 'Paint Brands', publishedAt: '2024-03-20', author: 'Munnalal Painter', views: 456 },
  { _id: '5', slug: 'wall-putty-vs-wall-primer', title: 'Wall Putty vs Wall Primer: What\'s the Difference?', excerpt: 'Confused about wall putty and wall primer? Our expert explains the difference, when to use each, and why both are important for a perfect paint job.', category: 'Tips & Tricks', publishedAt: '2024-04-01', author: 'Munnalal Painter', views: 278 },
  { _id: '6', slug: 'pop-design-ideas-false-ceiling', title: '15 Stunning POP Design Ideas for False Ceilings in 2024', excerpt: 'Transform your ceiling with these beautiful POP design ideas. From simple geometric patterns to elaborate chandelier setups, find the perfect design for your home.', category: 'Interior Design', publishedAt: '2024-04-15', author: 'Munnalal Painter', views: 534 },
];

const BlogListPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['blogs'], queryFn: () => api.get('/blogs?limit=12').then(r => r.data.data), staleTime: 5 * 60 * 1000 });
  const blogs = (data && data.length > 0) ? data : placeholderBlogs;

  return (
    <>
      <SEOHead title="Painting Tips, Guides & Articles - Gorakhpur Painter Blog" description="Expert painting tips, guides, color ideas, and home improvement articles from Munnalal Painter Gorakhpur. Learn about interior, exterior, texture painting and more." canonical="/blog" breadcrumbs={[{ name: 'Blog', href: '/blog' }]} />
      <div className="pt-20" style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 100%)' }}>
        <div className="container-custom py-16">
          <Breadcrumb items={[{ name: 'Blog', href: '/blog' }]} />
          <h1 className="text-4xl md:text-5xl font-black text-white mt-4 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Painting <span className="text-gradient-gold">Tips & Guides</span></h1>
          <p className="text-white/70 text-lg max-w-2xl">Expert articles on house painting, interior design, maintenance tips, and home improvement from our professional painters.</p>
        </div>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0,60 C360,20 1080,20 1440,60 L1440,60 L0,60 Z" fill="var(--color-surface)" /></svg>
      </div>
      <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
        <div className="container-custom">
          {isLoading ? <LoadingSpinner /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, i) => (
                <motion.article key={blog._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                  <Link to={`/blog/${blog.slug}`} className="card block overflow-hidden h-full group">
                    {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="badge-gold text-xs">{blog.category}</span>
                        <span className="text-[var(--color-text-muted)] text-xs">👁 {blog.views || 0} views</span>
                      </div>
                      <h2 className="font-bold text-[var(--color-text)] mb-2 text-base leading-snug line-clamp-2 group-hover:text-[#d4a017] transition-colors">{blog.title}</h2>
                      <p className="text-[var(--color-text-muted)] text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                        <span>✍️ {blog.author}</span>
                        <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogListPage;
