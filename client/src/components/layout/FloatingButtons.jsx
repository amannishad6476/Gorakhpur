import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO_CONFIG } from '../../utils/seo';

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* WhatsApp */}
      <motion.a
        href={`https://wa.me/${SEO_CONFIG.whatsapp}?text=Hello, I need painting services in Gorakhpur.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-2xl"
        style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: 'spring' }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat on WhatsApp"
      >
        <span>💬</span>
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ border: '2px solid #25D366' }}
          animate={{ scale: [1, 1.5, 1.5], opacity: [1, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.a>

      {/* Call Now */}
      <motion.a
        href={`tel:${SEO_CONFIG.phone}`}
        className="fixed bottom-8 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-2xl"
        style={{ background: 'linear-gradient(135deg, #d4a017, #f0c040)' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.7, type: 'spring' }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Call Now"
      >
        <span>📞</span>
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ border: '2px solid #d4a017' }}
          animate={{ scale: [1, 1.5, 1.5], opacity: [1, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </motion.a>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-8 left-5 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white"
            style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563a8)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            aria-label="Scroll to top"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingButtons;
