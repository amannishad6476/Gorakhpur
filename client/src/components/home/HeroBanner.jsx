import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { SEO_CONFIG } from '../../utils/seo';

const stats = [
  { value: '15+', label: 'Years Experience' },
  { value: '2500+', label: 'Projects Done' },
  { value: '1800+', label: 'Happy Clients' },
  { value: '12+', label: 'Cities Served' },
];

const HeroBanner = () => {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 50%, #0d2137 100%)' }}
    >
      {/* Animated background shapes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-10"
          style={{
            width: `${150 + i * 80}px`,
            height: `${150 + i * 80}px`,
            background: i % 2 === 0
              ? 'radial-gradient(circle, #d4a017, transparent)'
              : 'radial-gradient(circle, #2563a8, transparent)',
            left: `${[10, 70, 20, 80, 5, 60][i]}%`,
            top: `${[20, 60, 80, 10, 50, 30][i]}%`,
          }}
          animate={{
            x: [0, 30 * (i % 2 === 0 ? 1 : -1), 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Floating paint strokes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: `${200 + i * 100}px`,
              height: '4px',
              background: `linear-gradient(90deg, transparent, rgba(212,160,23,${0.3 - i * 0.1}), transparent)`,
              top: `${30 + i * 25}%`,
              left: '-10%',
              borderRadius: '2px',
            }}
            animate={{ x: ['0%', '120%'] }}
            transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'linear', delay: i * 2 }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10 pt-24 pb-12 sm:pt-32 sm:pb-28 lg:pt-36 lg:pb-32">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-gold mb-4 sm:mb-6 inline-flex text-xs sm:text-sm px-3.5 py-1.5">
              ✨ Gorakhpur's #1 Painting Service
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[34px] xs:text-[38px] sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.15] sm:leading-tight mb-4 sm:mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Transform Your
            <span className="block text-gradient-gold">Home with Colors</span>
            That Last
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 text-sm sm:text-base md:text-lg lg:text-xl max-w-lg md:max-w-2xl mb-6 sm:mb-8 leading-relaxed"
          >
            Professional house painting, interior & exterior painting, texture painting, waterproofing and POP design in Gorakhpur. 15+ years of excellence, 2500+ projects completed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-12 w-full max-w-md sm:max-w-none"
          >
            <Link to="/free-estimate" className="btn-primary w-full sm:w-auto text-center justify-center py-3 sm:py-3.5 px-6 text-sm sm:text-base">
              🎨 Get Free Estimate
            </Link>
            <a href={`tel:${SEO_CONFIG.phone}`} className="btn-secondary w-full sm:w-auto text-center justify-center py-3 sm:py-3.5 px-6 text-sm sm:text-base">
              📞 Call Now
            </a>
            <Link to="/gallery" className="btn-secondary w-full sm:w-auto text-center justify-center py-3 sm:py-3.5 px-6 text-sm sm:text-base">
              🖼️ View Gallery
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                className="glass rounded-xl p-3 sm:p-4 text-center h-full flex flex-col items-center justify-center min-h-[75px]"
              >
                <div className="text-xl xs:text-2xl sm:text-3xl font-black text-gradient-gold">{stat.value}</div>
                <div className="text-white/70 text-[11px] sm:text-xs mt-1 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,80 C360,40 1080,40 1440,80 L1440,80 L0,80 Z" fill="var(--color-surface)" />
        </svg>
      </div>
    </section>
  );
};

export default HeroBanner;
