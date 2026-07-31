import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SERVICES } from '../../utils/constants';
import SectionHeader from '../ui/SectionHeader';

const ServicesGrid = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

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
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link
                to={`/services/${service.slug}`}
                className="card group flex flex-col items-start p-5 h-full"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform"
                  style={{ background: service.color }}
                >
                  {service.icon}
                </div>
                <h3 className="font-bold text-[var(--color-text)] group-hover:text-[#d4a017] transition-colors mb-2 text-base">
                  {service.title}
                </h3>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed flex-1">
                  Professional {service.title.toLowerCase()} services in Gorakhpur with premium quality paints.
                </p>
                <div className="mt-3 flex items-center gap-1 text-[#d4a017] text-sm font-semibold group-hover:gap-2 transition-all">
                  Learn more <span>→</span>
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
