import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import api from '../../api/axiosInstance';
import { SEO_CONFIG } from '../../utils/seo';
import Icon from '../ui/Icon';

const stats = [
  { value: '15+', label: 'Years Experience' },
  { value: '2500+', label: 'Projects Done' },
  { value: '1800+', label: 'Happy Clients' },
  { value: '12+', label: 'Cities Served' },
];

const defaultHeroSlide = {
  _id: 'default-1',
  title: 'Transform Your Home with Colors That Last',
  subtitle: 'Professional house painting, interior & exterior painting, texture painting, waterproofing and POP design in Gorakhpur. 15+ years of excellence, 2500+ projects completed.',
  ctaText: 'Get Free Estimate',
  ctaLink: '/free-estimate',
  image: '',
};

const HeroBanner = () => {
  const [ref, inView] = useInView({ triggerOnce: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: activeBanners } = useQuery({
    queryKey: ['home-banners'],
    queryFn: async () => {
      const res = await api.get('/banners');
      return res.data?.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const banners = activeBanners && activeBanners.length > 0 ? activeBanners : [defaultHeroSlide];
  const isMultiple = banners.length > 1;
  const heroContent = banners[0] || defaultHeroSlide;

  // Auto-play for multiple banners
  useEffect(() => {
    if (!isMultiple) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isMultiple, banners.length]);

  useEffect(() => {
    if (!isMultiple) return undefined;
    const nextBanner = banners[(currentIndex + 1) % banners.length];
    if (nextBanner?.image) {
      const preload = new Image();
      preload.decoding = 'async';
      preload.src = nextBanner.image;
    }
    return undefined;
  }, [currentIndex, isMultiple, banners]);

  const currentBanner = banners[currentIndex] || banners[0];

  const primaryBtnText = heroContent.buttonText || heroContent.ctaText || 'Get Free Estimate';
  const primaryBtnLink = heroContent.buttonLink || heroContent.ctaLink || '/free-estimate';

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#071020]"
    >
      {/* Background Image Slider / Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner._id || currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          {currentBanner.image ? (
            <img
              src={currentBanner.image}
              alt={currentBanner.title || "Munnalal Painter Hero Banner"}
              className="w-full h-full object-cover object-center"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 50%, #0d2137 100%)' }}
            />
          )}

          {/* Dark gradient overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(7,16,32,0.94) 0%, rgba(7,16,32,0.85) 45%, rgba(7,16,32,0.5) 100%)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Decorative animated background elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: `${180 + i * 80}px`,
              height: `${180 + i * 80}px`,
              background: i % 2 === 0
                ? 'radial-gradient(circle, #d4a017, transparent)'
                : 'radial-gradient(circle, #2563a8, transparent)',
              left: `${[10, 75, 15, 80][i]}%`,
              top: `${[20, 55, 75, 15][i]}%`,
            }}
            animate={{
              x: [0, 25 * (i % 2 === 0 ? 1 : -1), 0],
              y: [0, -15, 0],
            }}
            transition={{ duration: 9 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10 pt-[11rem] pb-16 sm:pt-[12rem] sm:pb-28 lg:pt-[13rem] lg:pb-32">
        <div className="max-w-4xl mt-8 sm:mt-10 lg:mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
              <span className="badge-gold mb-4 sm:mb-6 inline-flex text-xs sm:text-sm px-3.5 py-1.5 shadow-md">
                <Icon name="sparkles" size={15} /> Gorakhpur's #1 Painting Service
              </span>

              <h1
                className="text-[34px] xs:text-[38px] sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.15] sm:leading-tight mb-4 sm:mb-6"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {heroContent.title}
              </h1>

              {heroContent.subtitle && (
                <p className="text-white/85 text-sm sm:text-base md:text-lg lg:text-xl max-w-lg md:max-w-2xl mb-6 sm:mb-8 leading-relaxed font-normal">
                  {heroContent.subtitle}
                </p>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-12 w-full max-w-md sm:max-w-none">
                {primaryBtnLink.startsWith('http') || primaryBtnLink.startsWith('tel:') ? (
                  <a
                    href={primaryBtnLink}
                    className="btn-primary w-full sm:w-auto text-center justify-center py-3 sm:py-3.5 px-6 text-sm sm:text-base shadow-lg"
                  >
                    {primaryBtnText}
                  </a>
                ) : (
                  <Link
                    to={primaryBtnLink || '/free-estimate'}
                    className="btn-primary w-full sm:w-auto text-center justify-center py-3 sm:py-3.5 px-6 text-sm sm:text-base shadow-lg"
                  >
                    {primaryBtnText}
                  </Link>
                )}

                <a
                  href={`tel:${SEO_CONFIG.phone}`}
                  className="btn-secondary w-full sm:w-auto text-center justify-center py-3 sm:py-3.5 px-6 text-sm sm:text-base"
                >
                  <Icon name="phone" size={16} /> Call Now
                </a>
                <Link
                  to="/gallery"
                  className="btn-secondary w-full sm:w-auto text-center justify-center py-3 sm:py-3.5 px-6 text-sm sm:text-base"
                >
                  <Icon name="gallery" size={16} /> View Gallery
                </Link>
              </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="glass rounded-xl p-3 sm:p-4 text-center h-full flex flex-col items-center justify-center min-h-[75px]"
              >
                <div className="text-xl xs:text-2xl sm:text-3xl font-black text-gradient-gold">
                  {stat.value}
                </div>
                <div className="text-white/70 text-[11px] sm:text-xs mt-1 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Carousel Controls (only rendered when multiple banners exist) */}
      {isMultiple && (
        <>
          {/* Pagination Indicators */}
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
            {banners.map((b, idx) => (
              <button
                key={b._id || idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-8 bg-[#d4a017]'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,80 C360,40 1080,40 1440,80 L1440,80 L0,80 Z" fill="var(--color-surface)" />
        </svg>
      </div>
    </section>
  );
};

export default HeroBanner;
