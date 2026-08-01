import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import SEOHead from '../components/layout/SEOHead';
import Breadcrumb from '../components/layout/Breadcrumb';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { motion } from 'framer-motion';
import { SERVICES } from '../utils/constants';
import { SEO_CONFIG } from '../utils/seo';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', slug],
    queryFn: () => api.get(`/services/slug/${slug}`).then(r => r.data.data),
    retry: 1,
  });

  const staticService = SERVICES.find(s => s.slug === slug);

  if (isLoading) return <LoadingSpinner fullPage />;
  if (error && !staticService) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><h2 className="text-2xl font-bold mb-4">Service Not Found</h2><Link to="/services" className="btn-primary">View All Services</Link></div>
    </div>
  );

  const s = service || { title: staticService?.title, slug, description: `<p>Professional ${staticService?.title} services in Gorakhpur by Munnalal Painter. Contact us for a free estimate.</p>`, features: ['Premium quality paints', 'Expert painters', 'On-time completion', '1-year warranty'] };
  const relatedServices = SERVICES.filter(rs => rs.slug !== slug).slice(0, 4);

  return (
    <>
      <SEOHead
        title={s.metaTitle || `${s.title} in Gorakhpur | Munnalal Painter`}
        description={s.metaDescription || `Professional ${s.title} in Gorakhpur. Expert painters, premium quality, affordable prices. Free estimate available. Call Munnalal Painter.`}
        canonical={`/services/${slug}`}
        breadcrumbs={[{ name: 'Services', href: '/services' }, { name: s.title, href: `/services/${slug}` }]}
      />
      <div className="pt-20" style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 100%)' }}>
        <div className="container-custom py-16">
          <Breadcrumb items={[{ name: 'Services', href: '/services' }, { name: s.title }]} />
          <div className="flex items-start gap-6 mt-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0" style={{ background: staticService?.color || 'rgba(212,160,23,0.2)' }}>
              {staticService?.icon || '🎨'}
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{s.title}</h1>
              <p className="text-white/70">Professional {s.title} in Gorakhpur, UP</p>
            </div>
          </div>
        </div>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,60 C360,20 1080,20 1440,60 L1440,60 L0,60 Z" fill="var(--color-surface)" />
        </svg>
      </div>
      <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="prose max-w-none text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: s.description }} />
              {s.features && s.features.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-[var(--color-text)] mb-5">What's Included</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {s.features.map((f, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                        <span className="text-[#d4a017] font-bold">✔</span>
                        <span className="text-[var(--color-text)] text-sm">{f}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="card p-6">
                <h3 className="font-bold text-[var(--color-text)] mb-4">Get Free Estimate</h3>
                <p className="text-[var(--color-text-muted)] text-sm mb-4">Contact us for a free on-site estimate for {s.title} in Gorakhpur.</p>
                <div className="space-y-3">
                  <a href={`tel:${SEO_CONFIG.phone}`} className="btn-primary w-full justify-center">📞 Call Now</a>
                  <a href={`https://wa.me/${SEO_CONFIG.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold text-sm" style={{ background: '#25D366', color: '#fff' }}>💬 WhatsApp Us</a>
                  <Link to="/free-estimate" className="btn-secondary w-full justify-center text-[var(--color-text)]" style={{ borderColor: 'var(--color-border)' }}>📋 Fill Estimate Form</Link>
                </div>
              </div>
              <div className="card p-6">
                <h3 className="font-bold text-[var(--color-text)] mb-4">Related Services</h3>
                <div className="space-y-2">
                  {relatedServices.map(rs => (
                    <Link key={rs.slug} to={`/services/${rs.slug}`} className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[#d4a017] transition-colors py-1">
                      <span>{rs.icon}</span>{rs.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetailPage;
