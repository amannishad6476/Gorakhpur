import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import api from '../../api/axiosInstance';
import { SERVICES } from '../../utils/constants';
import SectionHeader from '../ui/SectionHeader';

const ServicesGrid = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

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
    <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
      <div className="container-custom">
        <SectionHeader
          badge="🎨 What We Offer"
          title="Professional Painting"
          titleHighlight="Services"
          subtitle="From interior beautification to exterior protection, we provide comprehensive painting solutions for homes, offices, and commercial spaces across Gorakhpur."
        />

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {servicesList.map((service, i) => (
            <motion.div
              key={service.slug || service._id || i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                to={`/services/${service.slug}`}
                className="card group flex flex-col items-start p-0 overflow-hidden h-full"
              >
                {/* Image / Icon Header */}
                <div className="w-full relative overflow-hidden bg-[var(--color-surface-2)]">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-36 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300"
                      style={{ background: service.color || 'var(--color-surface-2)' }}
                    >
                      {service.icon || '🎨'}
                    </div>
                  )}

                  {/* Icon badge overlay when image exists */}
                  {service.image && service.icon && (
                    <div
                      className="absolute bottom-2 left-3 w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md backdrop-blur-md bg-black/40 text-white border border-white/20"
                    >
                      {service.icon}
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1 w-full">
                  <h3 className="font-bold text-[var(--color-text)] group-hover:text-[#d4a017] transition-colors mb-2 text-base">
                    {service.title}
                  </h3>
                  <p className="text-[var(--color-text-muted)] text-xs leading-relaxed flex-1 line-clamp-3">
                    {service.shortDescription || `Professional ${service.title.toLowerCase()} services in Gorakhpur with premium quality paints.`}
                  </p>

                  {service.price && (
                    <p className="text-[#d4a017] text-xs font-semibold mt-3">
                      Starting {service.price} {service.priceUnit || ''}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-1 text-[#d4a017] text-xs font-bold group-hover:gap-2 transition-all">
                    Learn more <span>→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/services" className="btn-primary">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
