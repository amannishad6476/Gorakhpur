import SEOHead from '../components/layout/SEOHead';
import Breadcrumb from '../components/layout/Breadcrumb';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import { SERVICES } from '../utils/constants';

const ServicesPage = () => {
  const { data: apiServices } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await api.get('/services');
      return res.data?.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const servicesList = apiServices && apiServices.length > 0 ? apiServices : SERVICES;

  return (
    <>
      <SEOHead
        title="All Painting Services in Gorakhpur - House, Interior, Exterior & More"
        description="Gorakhpur Painter offers professional painting services in Gorakhpur: house painting, interior, exterior, texture, waterproofing, POP design, wood polish, and more."
        canonical="/services"
        breadcrumbs={[{ name: 'Services', href: '/services' }]}
      />
      <div className="pt-20" style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 100%)' }}>
        <div className="container-custom py-16">
          <Breadcrumb items={[{ name: 'Services', href: '/services' }]} />
          <h1 className="text-4xl md:text-6xl font-black text-white mt-4 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our <span className="text-gradient-gold">Painting Services</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Comprehensive painting and decorating solutions for homes, offices and commercial spaces across Gorakhpur.
          </p>
        </div>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,60 C360,20 1080,20 1440,60 L1440,60 L0,60 Z" fill="var(--color-surface)" />
        </svg>
      </div>

      <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((service, i) => (
              <motion.div
                key={service.slug || service._id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link to={`/services/${service.slug}`} className="card group flex flex-col p-0 overflow-hidden h-full">
                  {service.image ? (
                    <div className="relative w-full h-48 overflow-hidden bg-[var(--color-surface-2)]">
                      <img
                        src={service.image}
                        alt={service.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                      {service.icon && (
                        <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md bg-black/40 text-white backdrop-blur border border-white/20">
                          {service.icon}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 pb-0">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform" style={{ background: service.color || 'var(--color-surface-2)' }}>
                        {service.icon || '🎨'}
                      </div>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-xl font-bold text-[var(--color-text)] group-hover:text-[#d4a017] transition-colors mb-2">
                      {service.title}
                    </h2>
                    <p className="text-[var(--color-text-muted)] text-sm flex-1 mb-4 leading-relaxed line-clamp-3">
                      {service.shortDescription || `Professional ${service.title.toLowerCase()} services in Gorakhpur with premium quality paints and expert craftsmen.`}
                    </p>
                    <div className="flex items-center gap-2 text-[#d4a017] font-semibold text-sm group-hover:gap-3 transition-all">
                      Learn More →
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
