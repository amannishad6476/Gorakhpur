import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SectionHeader = ({ badge, title, titleHighlight, subtitle, center = true }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${center ? 'text-center' : ''}`}
    >
      {badge && (
        <div className={`${center ? 'flex justify-center' : ''} mb-4`}>
          <span className="badge-gold">{badge}</span>
        </div>
      )}
      <h2 className="section-title">
        {title}{' '}
        {titleHighlight && <span className="text-gradient-gold">{titleHighlight}</span>}
      </h2>
      {subtitle && (
        <p className={`section-subtitle ${center ? 'mx-auto' : ''} mt-4`}>{subtitle}</p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
