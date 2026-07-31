import { lazy, Suspense } from 'react';
import SEOHead from '../components/layout/SEOHead';
import HeroBanner from '../components/home/HeroBanner';
import ServicesGrid from '../components/home/ServicesGrid';
import WhyChooseUs from '../components/home/WhyChooseUs';
import TestimonialsSection from '../components/home/TestimonialsSection';
import MapSection from '../components/home/MapSection';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/ui/SectionHeader';
import FAQAccordion from '../components/faq/FAQAccordion';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SEO_CONFIG } from '../utils/seo';

const defaultFAQs = [
  { _id: '1', question: 'How much does house painting cost in Gorakhpur?', answer: 'The cost ranges from ₹8-25 per square foot depending on size, paint type, and finish. Contact us for a free detailed estimate.' },
  { _id: '2', question: 'How long does painting a 2BHK apartment take?', answer: 'A standard 2BHK (800-1000 sq ft) typically takes 3-5 days including surface preparation, putty, primer, and 2 coats of paint.' },
  { _id: '3', question: 'Do you provide warranty on your work?', answer: 'Yes! We provide a 1-year workmanship warranty on all painting services and a 5-year guarantee on waterproofing.' },
  { _id: '4', question: 'Which areas in Gorakhpur do you serve?', answer: 'We serve all of Gorakhpur city and district, plus Deoria, Kushinagar, Maharajganj, Basti, and surrounding areas within 50 km.' },
];

const BlogPreviewSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data } = useQuery({
    queryKey: ['blogs-preview'],
    queryFn: () => api.get('/blogs?limit=3').then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const blogs = data || [
    { _id: '1', slug: 'best-interior-paint-colors-gorakhpur', title: '10 Best Interior Paint Colors for Gorakhpur Homes', excerpt: 'Discover the most popular and beautiful interior paint colors that work perfectly in Gorakhpur\'s climate and lighting conditions.', category: 'Interior Design', publishedAt: '2024-01-15' },
    { _id: '2', slug: 'waterproofing-tips-monsoon', title: 'Essential Waterproofing Tips Before Monsoon Season', excerpt: 'Protect your home from water damage this monsoon season with these professional waterproofing tips from our expert painters.', category: 'Tips & Tricks', publishedAt: '2024-02-10' },
    { _id: '3', slug: 'texture-painting-guide', title: 'Complete Guide to Texture Painting for Your Home', excerpt: 'Learn everything about texture painting - types, costs, process and how to choose the right texture for each room.', category: 'Painting Guide', publishedAt: '2024-03-05' },
  ];

  return (
    <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
      <div className="container-custom">
        <SectionHeader badge="📝 Our Blog" title="Latest Painting" titleHighlight="Tips & Guides" subtitle="Expert tips, guides and insights on house painting, interior design and maintenance from our professional painters." />
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog, i) => (
            <motion.div key={blog._id} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <Link to={`/blog/${blog.slug}`} className="card block overflow-hidden h-full">
                <div className="p-6">
                  <span className="badge-gold text-xs mb-3 inline-block">{blog.category}</span>
                  <h3 className="font-bold text-[var(--color-text)] mb-2 text-base leading-snug line-clamp-2">{blog.title}</h3>
                  <p className="text-[var(--color-text-muted)] text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
                  <p className="text-[#d4a017] text-sm font-semibold">Read More →</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/blog" className="btn-primary">View All Articles</Link>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section className="section-padding" style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 100%)' }}>
    <div className="container-custom text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <span className="badge-gold mb-6 inline-flex">📞 Ready to Transform Your Space?</span>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          Get Your <span className="text-gradient-gold">Free Estimate</span> Today
        </h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">Professional painters at your doorstep. Free on-site estimate within 24 hours. No obligation, no hidden charges.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/free-estimate" className="btn-primary text-base">🎨 Get Free Estimate</Link>
          <a href={`tel:${SEO_CONFIG.phone}`} className="btn-secondary">📞 Call {SEO_CONFIG.phone}</a>
        </div>
      </motion.div>
    </div>
  </section>
);

const FAQSection = () => {
  const { data } = useQuery({ queryKey: ['faqs-home'], queryFn: () => api.get('/faqs').then(r => r.data.data.slice(0, 4)), staleTime: 10 * 60 * 1000 });
  return (
    <section className="section-padding" style={{ background: 'var(--color-surface-2)' }}>
      <div className="container-custom max-w-4xl">
        <SectionHeader badge="❓ FAQ" title="Frequently Asked" titleHighlight="Questions" subtitle="Got questions? We have answers to the most common painting queries from our Gorakhpur clients." />
        <FAQAccordion faqs={data || defaultFAQs} />
        <div className="text-center mt-8">
          <Link to="/faq" className="btn-primary">View All FAQs</Link>
        </div>
      </div>
    </section>
  );
};

const HomePage = () => (
  <>
    <SEOHead
      title={null}
      description="Munnalal Painter - Best painter in Gorakhpur, UP. Professional house painting, interior, exterior, texture painting, waterproofing, POP design. 15+ years experience. Free estimate."
      canonical="/"
      breadcrumbs={[{ name: 'Home', href: '/' }]}
    />
    <HeroBanner />
    <ServicesGrid />
    <WhyChooseUs />
    <TestimonialsSection />
    <BlogPreviewSection />
    <FAQSection />
    <CTASection />
    <MapSection />
  </>
);

export default HomePage;
